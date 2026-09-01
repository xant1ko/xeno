import type { RoleOutput, UserOutput, UserUpdateByUid } from '@/types/generated'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  getRoleList as getRoleListApi,
  getUserByUid as getUserByUidApi,
  getUserList as getUserListApi,
  updateUserByUid as updateUserByUidApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type UserItem = UserOutput

export const useUsersStore = defineStore('users', () => {
  const notify = useNotify()

  const userList = ref<UserItem[]>([])
  const roleList = ref<RoleOutput[]>([])
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const error = ref<unknown | null>(null)
  // Общее количество записей. Заполняется из data.count при fetchList. Только для UI пагинации.
  const totalItems = ref(0)

  const schema = {
    fullname: '',
    email: '',
    role_uids: null,
    is_archived: false,
  } satisfies UserUpdateByUid

  const editForm = reactive({ ...schema })

  const studentRoleUid = ref<string>('')

  function resetForm (): void {
    Object.assign(editForm, { ...schema })
  }

  async function initForm (uid?: string): Promise<void> {
    if (!uid) {
      resetForm()
      return
    }

    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getUserByUidApi<true>({
        path: { uid },
        throwOnError: true,
      })

      const response = data as any
      Object.assign(editForm, {
        fullname: response.fullname,
        email: response.email ?? '',
        role_uids: response.roles?.map((role: RoleOutput) => role.uid) ?? [],
        is_archived: response.is_archived,
      })
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function fetchList (params: Record<string, any>): Promise<void> {
    if (loadingList.value) {
      return
    }

    loadingList.value = true
    error.value = null

    try {
      const { data } = await getUserListApi<true>({
        body: params,
        throwOnError: true,
      })

      userList.value = data.items as unknown as UserItem[]
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function fetchStudentRole (): Promise<void> {
    try {
      await fetchRoles({ search_str: 'student' })
      if (roleList.value[0]) {
        studentRoleUid.value = roleList.value[0].uid
      }
    } catch {
      notify.error('Не удалось получить роль ползователя')
    }
  }

  async function fetchRoles (overrides?: Record<string, any>): Promise<void> {
    if (roleList.value.length > 0) {
      return
    }

    error.value = null

    try {
      const { data } = await getRoleListApi<true>({
        body: overrides || { limit: -1, offset: 0 },
        throwOnError: true,
      })

      roleList.value = data.items as unknown as RoleOutput[]
    } catch (error_) {
      error.value = error_
    }
  }

  async function updateUser (uid: string, data: UserUpdateByUid): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await updateUserByUidApi<true>({
        path: { uid },
        body: data,
        throwOnError: true,
      })

      notify.success('Пользователь обновлён')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function saveUser (uid: string | undefined, data: UserUpdateByUid): Promise<void> {
    if (uid) {
      await updateUser(uid, data)
    }
  }

  return {
    userList,
    roleList,
    loadingList,
    loadingForm,
    error,
    totalItems,
    editForm,
    studentRoleUid,

    fetchList,
    fetchRoles,
    fetchStudentRole,
    updateUser,
    saveUser,
    resetForm,
    initForm,
  }
})
