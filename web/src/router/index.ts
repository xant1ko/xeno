import { useTitle } from '@vueuse/core'
import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import IndexLayout from '@/layouts/IndexLayout.vue'
import AuthPage from '@/pages/auth/authPage/AuthPage.vue'
import ConfirmPage from '@/pages/auth/recoveryPasswordPage/ConfirmPage.vue'
import RecoveryPassword from '@/pages/auth/recoveryPasswordPage/RecoveryPassword.vue'
import RegEmailPage from '@/pages/auth/registerPage/RegEmailPage.vue'
import RegisterPage from '@/pages/auth/registerPage/RegisterPage.vue'

import MainPage from '@/pages/index/MainPage.vue'
import NotFound from '@/pages/NotFound.vue'
import { useNavigateStore, useUserStore } from '@/stores'

// RouteMeta augmentation
declare module 'vue-router' {
  interface RouteMeta {
    /** Маршрут требует авторизации */
    requiresAuth?: boolean
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: IndexLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Домашняя страница',
          component: MainPage,
        },
      ],
    },

    {
      path: '/auth',
      component: AuthLayout,
      children: [
        {
          path: '',
          name: 'Логин',
          component: AuthPage,
        },
        {
          path: '/auth/register-email',
          name: 'Регистрация',
          component: RegEmailPage,
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'Не найдено',
      component: NotFound,
    },

  ],
})

router.beforeEach(async to => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.path.startsWith('/auth')) {
    await userStore.ensureSession()
  }

  // 1. Авторизованный пользователь не должен попадать на /auth
  if (to.path.startsWith('/auth') && userStore.isAuth) {
    return { path: '/' }
  }

  // 2. Маршрут требует авторизации — редирект на логин
  if (to.meta.requiresAuth && !userStore.isAuth) {
    return { path: '/auth' }
  }
})

const title = useTitle()

router.afterEach(to => {
  title.value = `${to.name ? `${String(to.name)} | ` : ''}xeno`

  useNavigateStore().currentRoute = to
})

export default router
