import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import router from '@/router'
import { loginMockUser } from '@/services/mockUserService'
import { useUserStore } from '@/stores/userStore'
import {
  confirmRegistration as confirmRegistrationApi,
  passwordRecovery as passwordRecoveryApi,
  passwordRecoveryConfirm as passwordRecoveryConfirmApi,
  registration as registrationApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export const useAuthStore = defineStore('auth', () => {
  const loading = ref(false)
  const error = ref<unknown | null>(null)

  const notify = useNotify()

  async function login (email: string, _password: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      // Принимаем форму и создаём локальную mock-сессию без backend.
      useUserStore().setUser(loginMockUser(email))
      notify.success('Авторизация прошла успешно')
    } catch (error_: unknown) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loading.value = false
    }
  }

  async function sendRegistrationEmail (email: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await registrationApi<true>({ query: { email }, throwOnError: true })
      isEmailSent.value = true
    } catch (error_: unknown) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loading.value = false
    }
  }

  async function confirmRegistration (params: {
    fullname: string
    email: string
    password: string
  }, token: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await confirmRegistrationApi<true>({
        body: params,
        query: { token },
        throwOnError: true,
      })
      isRegistrationComplete.value = true
    } catch (error_: unknown) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loading.value = false
    }
  }

  async function recoverPassword (email: string, password: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await passwordRecoveryApi<true>({
        body: { email, password },
        throwOnError: true,
      })
      isRecoverySuccess.value = true
      notify.info('Вы отправили запрос на смену пароля. Проверьте вашу почту')
      router.push('/')
    } catch (error_: unknown) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loading.value = false
    }
  }

  async function confirmPasswordRecovery (token: string): Promise<void> {
    loading.value = true
    error.value = null
    try {
      await passwordRecoveryConfirmApi<true>({
        query: { token },
        throwOnError: true,
      })
      isRecoveryConfirmed.value = true
    } catch (error_: unknown) {
      error.value = error_
      isRecoveryConfirmed.value = false
      showVariableAlert(error_)
    } finally {
      loading.value = false
    }
  }

  const isEmailSent = ref(false)
  const isRegistrationComplete = ref(false)
  const isRecoverySuccess = ref(false)
  const isRecoveryConfirmed = ref<boolean | null>(null)

  function $reset (): void {
    loading.value = false
    error.value = null
    isEmailSent.value = false
    isRegistrationComplete.value = false
    isRecoverySuccess.value = false
    isRecoveryConfirmed.value = null
  }

  return {
    loading,
    error,
    isEmailSent,
    isRegistrationComplete,
    isRecoverySuccess,
    isRecoveryConfirmed,
    login,
    sendRegistrationEmail,
    confirmRegistration,
    recoverPassword,
    confirmPasswordRecovery,
    $reset,
  }
})
