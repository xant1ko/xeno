import type { AgentTaskFilter, AgentTaskOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAgentTaskListApiV1AgentTaskGetListPost as getAgentTaskListApi } from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type AgentTaskItem = AgentTaskOutput

export const useAgentTasksStore = defineStore('agentTasks', () => {
  const taskList = ref<AgentTaskItem[]>([])
  const loadingList = ref(false)
  const error = ref<unknown | null>(null)
  const totalItems = ref(0)

  async function fetchList (request: AgentTaskFilter): Promise<void> {
    if (loadingList.value) {
      return
    }

    loadingList.value = true
    error.value = null

    try {
      const { data } = await getAgentTaskListApi<true>({
        body: request,
        throwOnError: true,
      })

      taskList.value = data.items
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  return {
    taskList,
    loadingList,
    error,
    totalItems,

    fetchList,
  }
})
