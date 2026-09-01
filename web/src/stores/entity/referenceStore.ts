import type { CourseOutput, DirectionOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getCourseList as getCourseListApi,
  getDirectionList as getDirectionListApi,
} from '@/types/generated'

export const useReferenceStore = defineStore('reference', () => {
  const courseList = ref<CourseOutput[]>([])
  const directionList = ref<DirectionOutput[]>([])
  const loading = ref(false)

  async function fetchCourses (): Promise<void> {
    if (directionList.value.length > 0) {
      return
    }
    try {
      const { data } = await getCourseListApi<true>({
        body: { limit: -1, offset: 0 },
        throwOnError: true,
      })
      courseList.value = data.items.map(course => ({
        ...course,
        title: course.is_archived ? `${course.title} (Архивный)` : course.title,
      })) as CourseOutput[]
    } catch {
      courseList.value = []
    }
  }

  async function fetchDirections (): Promise<void> {
    if (courseList.value.length > 0) {
      return
    }
    try {
      const { data } = await getDirectionListApi<true>({
        body: { limit: -1, offset: 0 },
        throwOnError: true,
      })
      directionList.value = data.items.map(direction => ({
        ...direction,
        title: direction.is_archived ? `${direction.title} (Архивный)` : direction.title,
      })) as DirectionOutput[]
    } catch {
      directionList.value = []
    }
  }

  async function init (): Promise<void> {
    if (loading.value) {
      return
    }
    loading.value = true
    await Promise.all([fetchCourses(), fetchDirections()])
    loading.value = false
  }

  return {
    courseList,
    directionList,
    loading,
    init,
    fetchCourses,
    fetchDirections,
  }
})
