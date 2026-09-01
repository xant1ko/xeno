import type { PotentialStudentFilter, PotentialStudentInput, PotentialStudentOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  archivePotentialStudentApiV1PotentialStudentArchiveUidDelete as archivePotentialStudentApi,
  createPotentialStudentApiV1PotentialStudentCreatePost as createPotentialStudentApi,
  getPotentialStudentApiV1PotentialStudentGetUidGet as getPotentialStudentApi,
  getPotentialStudentListApiV1PotentialStudentGetListPost as getPotentialStudentListApi,
  updatePotentialStudentApiV1PotentialStudentUpdateUidPut as updatePotentialStudentApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type PotentialStudentItem = PotentialStudentOutput

export const usePotentialStudentsStore = defineStore('potentialStudents', () => {
  const notify = useNotify()

  const potentialStudentList = ref<PotentialStudentItem[]>([])
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const error = ref<unknown | null>(null)
  const totalItems = ref(0)

  const schema = {
    fullname: '',
    phone_number: null,
    telegram: null,
    interests: null,
  } satisfies PotentialStudentInput

  const editForm = reactive({ ...schema })

  const detailPotentialStudent = ref<PotentialStudentOutput | null>(null)

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
      const { data } = await getPotentialStudentApi<true>({
        path: { uid },
        throwOnError: true,
      })

      const response = data as any
      Object.assign(editForm, {
        fullname: response.fullname,
        phone_number: response.phone_number ?? null,
        telegram: response.telegram ?? null,
        interests: response.interests ?? null,
      })
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function fetchDetailPotentialStudent (uid: string): Promise<void> {
    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getPotentialStudentApi<true>({
        path: { uid },
        throwOnError: true,
      })

      detailPotentialStudent.value = data as PotentialStudentOutput
      Object.assign(editForm, {
        fullname: data.fullname,
        phone_number: data.phone_number ?? null,
        telegram: data.telegram ?? null,
        interests: data.interests ?? null,
      })
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function fetchList (request: PotentialStudentFilter): Promise<void> {
    if (loadingList.value) {
      return
    }

    loadingList.value = true
    error.value = null

    try {
      const { data } = await getPotentialStudentListApi<true>({
        body: request,
        throwOnError: true,
      })

      potentialStudentList.value = data.items as PotentialStudentItem[]
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createPotentialStudent (data: PotentialStudentInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await createPotentialStudentApi<true>({
        body: data,
        throwOnError: true,
      })

      notify.success('Потенциальный студент создан')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function updatePotentialStudent (uid: string, data: PotentialStudentInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await updatePotentialStudentApi<true>({
        path: { uid },
        body: data as any,
        throwOnError: true,
      })

      notify.success('Потенциальный студент обновлён')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function toggleArchive (uid: string): Promise<void> {
    error.value = null

    try {
      await archivePotentialStudentApi<true>({
        path: { uid },
        throwOnError: true,
      })

      notify.success('Статус потенциального студента обновлён')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    }
  }

  async function savePotentialStudent (uid: string | undefined, data: PotentialStudentInput): Promise<void> {
    if (uid) {
      await updatePotentialStudent(uid, data)
    } else {
      await createPotentialStudent(data)
    }
  }

  return {
    potentialStudentList,
    loadingList,
    loadingForm,
    error,
    totalItems,
    editForm,
    detailPotentialStudent,

    fetchList,
    createPotentialStudent,
    updatePotentialStudent,
    toggleArchive,
    resetForm,
    initForm,
    fetchDetailPotentialStudent,
    savePotentialStudent,
  }
})
