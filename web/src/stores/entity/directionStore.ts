import type { DirectionInput, DirectionOutput, DirectionUpdate } from '@/types/generated'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  createDirection as createDirectionApi,
  getDirection as getDirectionApi,
  getDirectionList as getDirectionListApi,
  updateDirection as updateDirectionApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type DirectionItem = DirectionOutput

export const useDirectionStore = defineStore('direction', () => {
  const notify = useNotify()

  const directionList = ref<DirectionItem[]>([])
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const error = ref<unknown | null>(null)
  // Общее количество записей. Заполняется из data.count при fetchList. Только для UI пагинации.
  const totalItems = ref(0)

  const schema = {
    title: '',
    description: null,
    course_uids: null,
    is_archived: false,
  } satisfies DirectionInput

  const editForm = reactive({ ...schema })

  function resetForm (): void {
    Object.assign(editForm, { ...schema })
  }

  function getDirectionTitle (uid: string): string | undefined {
    return directionList.value.find(d => d.uid === uid)?.title
  }

  async function initForm (uid?: string): Promise<void> {
    if (!uid) {
      resetForm()
      return
    }

    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getDirectionApi<true>({
        path: { uid },
        throwOnError: true,
      })

      Object.assign(editForm, {
        title: data.title,
        description: data.description ?? null,
        course_uids: data.courses?.map(c => c.uid) ?? [],
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
      const { data } = await getDirectionListApi<true>({
        body: params,
        throwOnError: true,
      })

      directionList.value = data.items as unknown as DirectionItem[]
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function toggleArchive (item: DirectionItem): Promise<void> {
    error.value = null

    try {
      await updateDirectionApi<true>({
        path: { uid: item.uid },
        body: { is_archived: !item.is_archived },
        throwOnError: true,
      })

      notify.success(item.is_archived ? 'Направление разархивировано' : 'Направление архивировано')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    }
  }

  async function createDirection (data: DirectionInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await createDirectionApi<true>({
        body: data,
        throwOnError: true,
      })

      notify.success('Направление создано')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function updateDirection (uid: string, data: DirectionUpdate): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await updateDirectionApi<true>({
        path: { uid },
        body: data,
        throwOnError: true,
      })

      notify.success('Направление обновлено')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function fetchDirectionByUid (uid: string): Promise<DirectionInput> {
    error.value = null
    loadingForm.value = true

    try {
      const { data } = await getDirectionApi<true>({
        path: { uid },
        throwOnError: true,
      })

      return {
        title: data.title,
        description: data.description ?? null,
        course_uids: data.courses?.map(c => c.uid) ?? [],
        is_archived: data.is_archived,
      }
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function saveDirection (uid: string | undefined, data: DirectionInput): Promise<void> {
    if (uid) {
      await updateDirection(uid, data as DirectionUpdate)
    } else {
      await createDirection(data)
    }
  }

  return {
    directionList,
    loadingList,
    loadingForm,
    error,
    totalItems,
    editForm,

    fetchList,
    toggleArchive,
    createDirection,
    updateDirection,
    fetchDirectionByUid,
    saveDirection,
    resetForm,
    initForm,
    getDirectionTitle,
  }
})
