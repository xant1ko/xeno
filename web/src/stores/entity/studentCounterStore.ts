import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getCumulativeRegistrations as getCumulativeRegistrationsApi,
  getDailyRegistrations as getDailyRegistrationsApi,
  type StudentProgressPoint,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export const useStudentCounterStore = defineStore('registrations', () => {
  const dailyData = ref<StudentProgressPoint[]>([])
  const cumulativeData = ref<StudentProgressPoint[]>([])
  const loading = ref(false)
  const period = ref<'monthly' | 'quarterly' | 'yearly'>('monthly')
  const chartType = ref<'cumulative' | 'discrete'>('cumulative')

  async function fetchRegistrations (): Promise<void> {
    if (loading.value) {
      return
    }
    loading.value = true

    try {
      const [dailyResponse, cumulativeResponse] = await Promise.all([
        getDailyRegistrationsApi({ query: {} }),
        getCumulativeRegistrationsApi({ query: {} }),
      ])

      const dailyItems = dailyResponse.data?.items || []
      dailyData.value = dailyItems.map((item: any) => ({
        day: item.day || '',
        themes: item.count || 0,
      }))

      const cumulativeItems = cumulativeResponse.data?.items || []
      cumulativeData.value = cumulativeItems.map((item: any) => ({
        day: item.day || '',
        themes: item.total || 0,
      }))
    } catch (error) {
      showVariableAlert(error)
      dailyData.value = []
      cumulativeData.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    dailyData,
    cumulativeData,
    loading,
    period,
    chartType,
    fetchRegistrations,
  }
})
