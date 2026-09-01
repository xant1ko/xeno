import type { ThemeInput, ThemeUpdate, ThemeWithCountOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  createTheme as createThemeApi,
  getTheme as getThemeApi,
  getThemeListWithCounts,
  updateTheme as updateThemeApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type ThemeItem = ThemeWithCountOutput

export const useThemeStore = defineStore('theme', () => {
  const notify = useNotify()

  const themeList = ref<ThemeItem[]>([])
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const error = ref<unknown | null>(null)
  // Общее количество записей. Заполняется из data.count при fetchList. Только для UI пагинации.
  const totalItems = ref(0)

  const schema = {
    title: '',
    description: null,
    course_uid: '',
    order: 0,
    is_archived: false,
  } satisfies ThemeInput

  const editForm = reactive({ ...schema })

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
      const { data } = await getThemeApi<true>({
        path: { uid },
        throwOnError: true,
      })

      Object.assign(editForm, {
        title: data.title,
        description: data.description ?? null,
        course_uid: data.course_uid,
        order: data.order,
        is_archived: data.is_archived,
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
      const { data } = await getThemeListWithCounts<true>({
        body: params,
        throwOnError: true,
      })

      themeList.value = data.items
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createTheme (data: ThemeInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await createThemeApi<true>({
        body: data,
        throwOnError: true,
      })

      notify.success('Тема создана')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function updateTheme (uid: string, data: ThemeUpdate): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await updateThemeApi<true>({
        path: { uid },
        body: data,
        throwOnError: true,
      })

      notify.success('Тема обновлена')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function toggleArchive (item: ThemeItem): Promise<void> {
    try {
      await updateThemeApi<true>({
        path: { uid: item.uid },
        body: { is_archived: !item.is_archived },
        throwOnError: true,
      })
    } catch (error_) {
      showVariableAlert(error_)
    }
  }

  async function saveTheme (uid: string | undefined, data: ThemeInput): Promise<void> {
    if (uid) {
      await updateTheme(uid, data)
    } else {
      await createTheme(data)
    }
  }

  return {
    themeList,
    loadingList,
    loadingForm,
    error,
    totalItems,
    editForm,

    fetchList,
    createTheme,
    updateTheme,
    toggleArchive,
    saveTheme,
    resetForm,
    initForm,
  }
})
