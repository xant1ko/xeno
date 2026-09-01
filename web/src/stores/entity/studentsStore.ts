import type { StudentInput, StudentOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  archiveStudent as archiveStudentApi,
  createStudent as createStudentApi,
  getStudent as getStudentApi,
  getStudentList as getStudentListApi,
  updateStudent as updateStudentApi,
  uploadFile as uploadFileApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type StudentItem = StudentOutput

export const useStudentsStore = defineStore('students', () => {
  const notify = useNotify()

  const studentList = ref<StudentItem[]>([])
  const studentNames = computed(() =>
    Object.fromEntries(studentList.value.map(student => [student.uid, student.fullname])),
  )
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const error = ref<unknown | null>(null)
  // Общее количество записей. Заполняется из data.count при fetchList. Только для UI пагинации.
  const totalItems = ref(0)

  const schema = {
    fullname: '',
    github: null,
    telegram: null,
    phone_number: null,
    primary_course_uid: '',
    primary_direction_uid: '',
    education_start_date: '',
    education_finish_date: '',
    birthday_date: '',
    is_finished: false,
    is_archived: false,
    user_uid: null,
  } satisfies StudentInput

  const editForm = reactive({ ...schema })

  const detailStudent = ref<StudentOutput>()

  function resetForm (): void {
    Object.assign(editForm, { ...schema })
  }

  function clearDetailStudent (): void {
    detailStudent.value = undefined
    error.value = null
    loadingForm.value = false
    resetForm()
  }

  async function initForm (uid?: string): Promise<void> {
    if (!uid) {
      resetForm()
      return
    }

    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getStudentApi<true>({
        path: { uid },
        throwOnError: true,
      })

      const response = data as any
      Object.assign(editForm, {
        fullname: response.fullname,
        github: response.github ?? null,
        telegram: response.telegram ?? null,
        phone_number: response.phone_number ?? null,
        primary_course_uid: response.primary_course_uid,
        primary_direction_uid: response.primary_direction_uid,
        education_start_date: response.education_start_date ?? '',
        education_finish_date: response.education_finish_date ?? '',
        birthday_date: response.birthday_date ?? '',
        is_finished: response.is_finished ?? false,
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

  async function fetchDetailStudent (uid: string): Promise<void> {
    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getStudentApi<true>({
        path: { uid },
        throwOnError: true,
      })

      detailStudent.value = data as StudentOutput
      Object.assign(editForm, {
        fullname: data.fullname,
        github: data.github ?? null,
        telegram: data.telegram ?? null,
        phone_number: data.phone_number ?? null,
        primary_course_uid: data.primary_course_uid,
        primary_direction_uid: data.primary_direction_uid,
        education_start_date: data.education_start_date ?? '',
        education_finish_date: data.education_finish_date ?? '',
        birthday_date: data.birthday_date ?? '',
        is_finished: data.is_finished ?? false,
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
      const { data } = await getStudentListApi<true>({
        body: params,
        throwOnError: true,
      })

      studentList.value = data.items as unknown as StudentItem[]
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createStudent (data: StudentInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await createStudentApi<true>({
        body: data,
        throwOnError: true,
      })

      notify.success('Студент создан')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function updateStudent (uid: string, data: StudentInput): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      await updateStudentApi<true>({
        path: { uid },
        body: data as any,
        throwOnError: true,
      })

      notify.success('Студент обновлён')
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
      await archiveStudentApi<true>({
        path: { uid },
        throwOnError: true,
      })

      notify.success('Статус студента обновлён')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    }
  }

  async function updateStudentAvatar (uid: string, file: File): Promise<void> {
    error.value = null
    loadingForm.value = true

    try {
      const { data } = await uploadFileApi<true>({
        body: {
          title: file.name,
          content_type: file.type,
          upload_file: file,
        },
        throwOnError: true,
      })

      await updateStudentApi<true>({
        path: { uid },
        body: { avatar_uid: data.uid } as any,
        throwOnError: true,
      })

      notify.success('Аватар обновлён')
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function saveStudent (uid: string | undefined, data: StudentInput): Promise<void> {
    if (uid) {
      await updateStudent(uid, data)
    } else {
      await createStudent(data)
    }
  }

  return {
    studentList,
    studentNames,
    loadingList,
    loadingForm,
    error,
    totalItems,
    editForm,
    detailStudent,

    fetchList,
    createStudent,
    updateStudent,
    updateStudentAvatar,
    toggleArchive,
    resetForm,
    clearDetailStudent,
    initForm,
    fetchDetailStudent,
    saveStudent,
  }
})
