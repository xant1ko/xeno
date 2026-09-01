import type { AgentScheduleCreate, AgentScheduleFilter, AgentScheduleOutput, AgentScheduleUpdate } from '@/types/generated'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  createAgentScheduleApiV1AgentScheduleCreatePost as createAgentScheduleApi,
  deleteAgentScheduleApiV1AgentScheduleDeleteUidDelete as deleteAgentScheduleApi,
  getAgentScheduleApiV1AgentScheduleGetUidGet as getAgentScheduleApi,
  getAgentScheduleListApiV1AgentScheduleGetListPost as getAgentScheduleListApi,
  updateAgentScheduleApiV1AgentScheduleUpdateUidPut as updateAgentScheduleApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type AgentScheduleItem = AgentScheduleOutput

export const useAgentSchedulesStore = defineStore('agentSchedules', () => {
  const notify = useNotify()

  const scheduleList = ref<AgentScheduleItem[]>([])
  const detailSchedule = ref<AgentScheduleItem>()
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const error = ref<unknown | null>(null)

  const totalItems = ref(0)

  const schema = {
    student_uid: '',
    title: '',
    prompt: '',
    cron: '',
    is_enabled: true,
  } satisfies AgentScheduleCreate

  const editForm = reactive({ ...schema })

  function resetForm (): void {
    Object.assign(editForm, { ...schema })
  }

  function clearList (): void {
    scheduleList.value = []
    totalItems.value = 0
  }

  async function initForm (uid?: string): Promise<void> {
    if (!uid) {
      resetForm()
      return
    }

    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getAgentScheduleApi<true>({
        path: { uid },
        throwOnError: true,
      })

      Object.assign(editForm, {
        student_uid: data.student_uid,
        title: data.title,
        prompt: data.prompt,
        cron: data.cron,
        is_enabled: data.is_enabled,
      })
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function fetchDetailSchedule (uid: string): Promise<void> {
    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getAgentScheduleApi<true>({
        path: { uid },
        throwOnError: true,
      })

      detailSchedule.value = data
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function fetchList (request: AgentScheduleFilter): Promise<void> {
    if (loadingList.value) {
      return
    }

    loadingList.value = true
    error.value = null

    try {
      const { data } = await getAgentScheduleListApi<true>({
        body: request,
        throwOnError: true,
      })

      scheduleList.value = data.items
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createSchedule (data: AgentScheduleCreate): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await createAgentScheduleApi<true>({ body: data, throwOnError: true })
      notify.success('Расписание агента создано')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function updateSchedule (uid: string, data: AgentScheduleUpdate): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await updateAgentScheduleApi<true>({
        path: { uid },
        body: data,
        throwOnError: true,
      })
      notify.success('Расписание агента обновлено')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function deleteSchedule (uid: string): Promise<void> {
    error.value = null

    try {
      await deleteAgentScheduleApi<true>({ path: { uid }, throwOnError: true })
      notify.success('Расписание агента удалено')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    }
  }

  async function saveSchedule (uid: string | undefined, data: AgentScheduleCreate): Promise<void> {
    if (uid) {
      await updateSchedule(uid, data)
      return
    }

    await createSchedule(data)
  }

  return {
    scheduleList,
    detailSchedule,
    loadingList,
    loadingForm,
    error,
    totalItems,
    editForm,

    fetchList,
    fetchDetailSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    saveSchedule,
    resetForm,
    clearList,
    initForm,
  }
})
