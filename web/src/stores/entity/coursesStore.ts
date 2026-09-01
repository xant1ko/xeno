import type { CourseInput, CourseOutput, DirectionOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  createCourse as createCourseApi,
  getCourse as getCourseApi,
  getCourseList as getCourseListApi,
  updateCourse as updateCourseApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type CourseItem = CourseOutput

export type DirectionItem = DirectionOutput

export const useCourseStore = defineStore('course', () => {
  const notify = useNotify()

  const courseList = ref<CourseItem[]>([])
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const error = ref<unknown | null>(null)
  // Общее количество записей. Заполняется из data.count при fetchList. Только для UI пагинации.
  const totalItems = ref(0)

  const schema = {
    title: '',
    description: null,
    order: 0,
    is_archived: false,
    direction_uids: null,
  } satisfies CourseInput

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
      const { data } = await getCourseApi<true>({
        path: { uid },
        throwOnError: true,
      })

      Object.assign(editForm, {
        title: data.title,
        description: data.description ?? null,
        order: data.order,
        is_archived: data.is_archived,
        direction_uids: data.directions?.map(d => d.uid) ?? [],
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
      const { data } = await getCourseListApi<true>({
        body: params,
        throwOnError: true,
      })

      courseList.value = data.items as CourseItem[]
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createCourse (data: CourseInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await createCourseApi<true>({
        body: data,
        throwOnError: true,
      })
      notify.success('Курс создан')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function updateCourse (uid: string, data: CourseInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await updateCourseApi<true>({
        path: { uid },
        body: data,
        throwOnError: true,
      })

      notify.success('Курс обновлён')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function fetchCourseByUid (uid: string): Promise<CourseInput> {
    error.value = null
    loadingForm.value = true

    try {
      const { data } = await getCourseApi<true>({
        path: { uid },
        throwOnError: true,
      })

      return {
        title: data.title,
        description: data.description ?? null,
        order: data.order,
        is_archived: data.is_archived,
        direction_uids: data.directions?.map(d => d.uid) ?? [],
      }
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function saveCourse (uid: string | undefined, data: CourseInput): Promise<void> {
    if (uid) {
      await updateCourse(uid, data)
    } else {
      await createCourse(data)
    }
  }

  return {
    courseList,
    loadingList,
    loadingForm,
    error,
    totalItems,
    editForm,

    fetchList,
    createCourse,
    updateCourse,
    fetchCourseByUid,
    saveCourse,
    resetForm,
    initForm,
  }
})
