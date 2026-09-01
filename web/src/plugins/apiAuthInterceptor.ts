import { useNotify } from '@/composables/useNotify'
import router from '@/router'
import { useUserStore } from '@/stores/userStore'
import { client } from '@/types/generated/client.gen'

// A 401 from these endpoints means "wrong credentials", not "your session
// expired" — must not trigger a forced redirect/toast (e.g. a bad-password
// login attempt still needs to show its own inline error, not bounce the
// user back to the login page they're already on).
const SESSION_CHECK_EXEMPT_PATHS = ['/user/login']

let handlingExpiry = false

// Global fallback for expired/invalid sessions: userStore.updateUser() only
// catches this on login / profile update / the first session check after
// load (see its own comments) — everything else in the app only shows a
// toast and leaves the (stale) auth state untouched. This interceptor
// catches a 401 from *any* request and forces the redirect + tells the user
// why, regardless of which store/component made the call.
export function registerApiAuthInterceptor (): void {
  client.instance.interceptors.response.use(
    response => response,
    error => {
      const status = error?.response?.status
      const url: string = error?.config?.url ?? ''
      const isExempt = SESSION_CHECK_EXEMPT_PATHS.some(path => url.includes(path))

      if (status === 401 && !isExempt && !handlingExpiry && router.currentRoute.value.path !== '/auth') {
        handlingExpiry = true
        useUserStore().clearUserInfo(false)
        useNotify().error('Сессия истекла, войдите заново')
        router.push('/auth').finally(() => {
          handlingExpiry = false
        })
      }

      return Promise.reject(error)
    },
  )
}
