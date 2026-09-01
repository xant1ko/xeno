import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStudentProgress as getStudentProgressApi, type ProgressTypeEnum,
  type StudentOutput,
  type StudentProgressPoint } from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'
import { useStudentsStore } from './studentsStore'

export type StudentProgressItem = { student: StudentOutput, data: StudentProgressPoint[] }

export const useStudentProgressStore = defineStore('studentProgress', () => {
  const studentsData = ref<StudentProgressItem[]>([])
  const loading = ref(false)
  const period = ref<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const chartType = ref<'cumulative' | 'discrete'>('cumulative')
  const discreteStudentData = ref<StudentProgressPoint[]>([])
  const cumulativeStudentData = ref<StudentProgressPoint[]>([])

  async function fetchList (studentsParams?: Record<string, any>): Promise<void> {
    if (loading.value) {
      return
    }
    loading.value = true
    studentsData.value = []

    try {
      const studentsStore = useStudentsStore()
      studentsStore.studentList = []
      await studentsStore.fetchList(studentsParams ?? {})

      const students = studentsStore.studentList

      if (students.length === 0) {
        return
      }

      const progressPromises = students.map(async student => {
        try {
          const response = await getStudentProgressApi({
            path: { student_uid: student.uid },
            query: { type: chartType.value as ProgressTypeEnum },
          })
          return {
            student,
            data: response.data?.items || [],
          }
        } catch {
          return {
            student,
            data: [],
          }
        }
      })

      studentsData.value = await Promise.all(progressPromises)
    } catch (error) {
      showVariableAlert(error)
      studentsData.value = []
    } finally {
      loading.value = false
    }
  }

  function reset (): void {
    studentsData.value = []
    discreteStudentData.value = []
    cumulativeStudentData.value = []
    period.value = 'monthly'
    chartType.value = 'cumulative'
    loading.value = false
  }

  async function fetchStudentProgress (uid: string): Promise<void> {
    const [discrete, cumulative] = await Promise.all([
      getStudentProgressApi({
        path: { student_uid: uid },
        query: { type: 'discrete' as ProgressTypeEnum },
      }),
      getStudentProgressApi({
        path: { student_uid: uid },
        query: { type: 'cumulative' as ProgressTypeEnum },
      }),
    ])

    discreteStudentData.value = discrete.data?.items || []
    cumulativeStudentData.value = cumulative.data?.items || []
  }

  return {
    studentsData,
    loading,
    period,
    chartType,
    discreteStudentData,
    cumulativeStudentData,
    fetchList,
    fetchStudentProgress,
    reset,
  }
})
