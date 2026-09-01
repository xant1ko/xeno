import type { UserOutput, UserUpdate } from '@/types/generated'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import router from '@/router'
import { getMockUser, logoutMockUser, updateMockUser } from '@/services/mockUserService'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type Role = {
  uid: string
  title: 'teacher' | 'admin' | 'manager' | 'student' | 'promoter' | 'salesman'
}

export const useUserStore = defineStore(
  'user',
  () => {
    // Загружаем локального пользователя вместо обращения к backend.
    const userData = ref<UserOutput>(getMockUser() ?? {
      uid: '',
      fullname: '',
      registration_date: '',
      roles: [],
      is_archived: false,
      student_uid: null,
      last_update_date: '',
    })
    const loadingForm = ref(false)
    const notify = useNotify()

    const schema = {
      fullname: '',
      email: '',
      password: '',
    } satisfies UserUpdate

    const editForm = reactive({ ...schema })

    function resetForm (): void {
      Object.assign(editForm, { ...schema })
    }

    function initForm (): void {
      resetForm()
      editForm.fullname = userData.value.fullname
      editForm.email = userData.value.email ?? ''
    }

    const sessionChecked = ref(false)

    // Синхронизируем store с локальным моковым сервисом.
    async function updateUser (): Promise<void> {
      const mockUser = getMockUser()
      sessionChecked.value = true
      if (mockUser) {
        userData.value = mockUser
      } else {
        clearUserInfo(false)
        await router.push('/auth')
      }
    }

    async function updateUserInfo (data: UserUpdate): Promise<void> {
      loadingForm.value = true
      if (data.password === '') {
        data.password = undefined
      }
      try {
        // Сохраняем изменения только в памяти текущей mock-сессии.
        userData.value = updateMockUser(data)
        notify.success('Пользователь обновлен')
      } catch (error_) {
        showVariableAlert(error_)
        notify.error('Ошибка обновления пользователя')
        throw error_
      } finally {
        loadingForm.value = false
      }
    }

    async function ensureSession (): Promise<void> {
      if (sessionChecked.value || userData.value.uid) {
        sessionChecked.value = true
        return
      }
      try {
        await updateUser()
      } catch {
        // guest session
      }
    }

    function setUser (response: UserOutput): void {
      userData.value = response
    }

    function getUser (): UserOutput {
      return userData.value
    }

    // Завершаем mock-сессию без сетевого запроса.
    async function logout (): Promise<void> {
      logoutMockUser()
      clearUserInfo()
      notify.success('Вы успешно вышли из системы')
      await router.push('/auth')
    }
    function clearUserInfo (resetSessionChecked = true): void {
      userData.value = {
        uid: '',
        fullname: '',
        registration_date: '',
        roles: [],
        is_archived: false,
        student_uid: null,
        last_update_date: '',
      }
      // resetSessionChecked=true (по умолчанию) — сбросить флаг в false,
      // чтобы сессия перепроверялась при следующей загрузке.
      // resetSessionChecked=false — оставить флаг true: сессия уже проверена,
      // повторные навигации не должны спамить getUser -> logout.
      sessionChecked.value = !resetSessionChecked
    }

    const isAuth = computed(() => !!userData.value.uid)

    const isHasRole = (roleInput?: string): boolean => {
      if (!roleInput && userData.value.roles.length > 0) {
        return userData.value.roles.length > 0
      }
      return userData.value.roles.some(role => role.title === roleInput)
    }

    return {
      userData,
      loadingForm,
      editForm,
      setUser,
      getUser,
      updateUser,
      updateUserInfo,
      ensureSession,
      logout,
      clearUserInfo,
      resetForm,
      initForm,
      isAuth,
      isHasRole,
      sessionChecked,
    }
  },
  {
    persist: true,
  },
)
