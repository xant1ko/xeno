import type { CourseOutput, StudentThemeInput, StudentThemeOutput, ThemeOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  createStudentTheme as createStudentThemeApi,
  getCourse as getCourseApi,
  getCourseList as getCourseListApi,
  getStudentThemeList as getStudentThemeListApi,
  getThemeList as getThemeListApi,
  updateStudentTheme as updateStudentThemeApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type ThemeWithStudent = {
  theme: ThemeOutput
  studentTheme: StudentThemeOutput | null
}

export type CourseWithThemes = {
  course: CourseOutput
  themes: ThemeWithStudent[]
}

export const useStudentThemeStore = defineStore('studentTheme', () => {
  const notify = useNotify()

  const courseThemes = ref<CourseWithThemes[]>([])
  const loading = ref(false)
  const error = ref<unknown | null>(null)
  const allThemes = ref<ThemeOutput[]>([])

  const directionUid = ref('')
  const studentUid = ref('')

  function buildCourseThemes (
    courses: CourseOutput[],
    allThemes: ThemeOutput[],
    studentThemes: StudentThemeOutput[],
  ): CourseWithThemes[] {
    return courses.map(course => ({
      course,
      themes: allThemes
        .filter(t => t.course_uid === course.uid)
        .toSorted((a, b) => a.order - b.order)
        .map(theme => ({
          theme,
          studentTheme: studentThemes.find(st => st.theme_uid === theme.uid) ?? null,
        })),
    }))
  }

  async function fetchCourseThemesData (uid: string, dirUid: string): Promise<void> {
    studentUid.value = uid
    directionUid.value = dirUid

    if (loading.value) {
      return
    }
    loading.value = true

    try {
      const [coursesRes, studentThemesRes] = await Promise.all([
        getCourseListApi<true>({
          body: { direction_uids: [dirUid], is_archived: false, limit: -1 },
          throwOnError: true,
        }),
        getStudentThemeListApi<true>({
          body: { student_uid: uid, limit: -1, sort_by: 'created_date', sort_desc: false },
          throwOnError: true,
        }),
      ])

      const courses = coursesRes.data.items.toSorted((i1, i2) => i1.order - i2.order)
      const studentThemes = studentThemesRes.data.items as unknown as StudentThemeOutput[]

      const themesRes = await Promise.all(
        courses.map(c => getThemeListApi<true>({
          body: { course_uid: c.uid, limit: -1, is_archived: false, sort_by: 'order', sort_desc: false },
          throwOnError: true,
        })),
      )

      const currentThemes = themesRes.flatMap(r => r.data.items)

      const { courses: externalCourses, themes: externalThemes }
        = await fetchExternalCourses(courses, currentThemes, studentThemes)

      const combinedCourses = [...courses, ...externalCourses]
      const combinedThemes = [...currentThemes, ...externalThemes]

      allThemes.value = combinedThemes
      courseThemes.value = buildCourseThemes(combinedCourses, combinedThemes, studentThemes)
    } catch (error_) {
      showVariableAlert(error_)
    } finally {
      loading.value = false
    }
  }

  async function fetchExternalCourses (
    courses: CourseOutput[],
    allThemes: ThemeOutput[],
    studentThemes: StudentThemeOutput[],
  ): Promise<{ courses: CourseOutput[], themes: ThemeOutput[] }> {
    const coveredUids = new Set(allThemes.map(t => t.uid))
    const knownCourseUids = new Set(courses.map(c => c.uid))

    const externalCourseUids = Array.from(new Set(
      studentThemes
        .filter(st => !coveredUids.has(st.theme_uid))
        .map(st => st.theme.course_uid)
        .filter(uid => !!uid && !knownCourseUids.has(uid)),
    ))

    if (externalCourseUids.length === 0) {
      return { courses: [], themes: [] }
    }

    const coursesRes = await Promise.all(
      externalCourseUids.map(uid => getCourseApi<true>({ path: { uid }, throwOnError: true })),
    )
    const externalCourses = coursesRes.map(r => r.data)

    const themesResByCourse = await Promise.all(
      externalCourses.map(c => getThemeListApi<true>({
        body: { course_uid: c.uid, limit: -1, is_archived: false, sort_by: 'order', sort_desc: false },
        throwOnError: true,
      })),
    )

    const externalThemes = themesResByCourse.flatMap(r => r.data.items)

    return { courses: externalCourses, themes: externalThemes }
  }

  async function refreshCourse (courseUid: string): Promise<void> {
    if (!studentUid.value) {
      return
    }

    const [themesRes, studentThemesRes] = await Promise.all([
      getThemeListApi<true>({
        body: { course_uid: courseUid, limit: -1, is_archived: false, sort_by: 'order', sort_desc: false },
        throwOnError: true,
      }),
      getStudentThemeListApi<true>({
        body: { student_uid: studentUid.value, limit: -1, sort_by: 'created_date', sort_desc: false },
        throwOnError: true,
      }),
    ])

    const course = courseThemes.value.find(c => c.course.uid === courseUid)
    if (!course) {
      return
    }

    const studentThemes = studentThemesRes.data.items as unknown as StudentThemeOutput[]
    const themesData = themesRes.data.items

    const index = courseThemes.value.indexOf(course)
    courseThemes.value[index] = {
      course: course.course,
      themes: themesData
        .toSorted((a, b) => a.order - b.order)
        .map(theme => ({
          theme,
          studentTheme: studentThemes.find(st => st.theme_uid === theme.uid) ?? null,
        })),
    }

    allThemes.value = courseThemes.value.flatMap(c => c.themes.map(t => t.theme))
  }

  async function refresh (): Promise<void> {
    if (!studentUid.value || !directionUid.value) {
      return
    }
    await fetchCourseThemesData(studentUid.value, directionUid.value)
  }

  async function toggleTheme (target: ThemeWithStudent): Promise<void> {
    const hadStudentTheme = !!target.studentTheme
    const previous = target.studentTheme

    if (target.studentTheme) {
      target.studentTheme.is_finished = !target.studentTheme.is_finished
    } else {
      target.studentTheme = {
        uid: '',
        student_uid: studentUid.value,
        theme_uid: target.theme.uid,
        is_finished: true,
        comment: null,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      } as StudentThemeOutput
    }

    try {
      if (hadStudentTheme) {
        await updateStudentThemeApi<true>({
          path: { uid: previous!.uid },
          body: { is_finished: target.studentTheme.is_finished },
          throwOnError: true,
        })
      } else {
        const res = await createStudentThemeApi<true>({
          body: { student_uid: studentUid.value, theme_uid: target.theme.uid, is_finished: true },
          throwOnError: true,
        })
        target.studentTheme.uid = res.data.uid
      }
    } catch (error_) {
      if (hadStudentTheme) {
        target.studentTheme = previous
      } else {
        target.studentTheme = null
      }
      showVariableAlert(error_)
    }
  }

  async function updateComment (uid: string, comment: string | null, courseUid: string): Promise<void> {
    try {
      await updateStudentThemeApi<true>({
        path: { uid },
        body: { comment },
        throwOnError: true,
      })

      await refreshCourse(courseUid)
    } catch (error_) {
      showVariableAlert(error_)
    }
  }

  function reset (): void {
    courseThemes.value = []
    allThemes.value = []
    directionUid.value = ''
    studentUid.value = ''
    error.value = null
    loading.value = false
  }

  async function addTheme (data: StudentThemeInput): Promise<void> {
    error.value = null
    loading.value = true
    try {
      await createStudentThemeApi<true>({
        body: data,
        throwOnError: true,
      })

      notify.success('Тема добавлена студенту')
      await refresh()
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loading.value = false
    }
  }

  return {
    courseThemes,
    loading,
    error,
    allThemes,
    fetchCourseThemesData,
    refresh,
    refreshCourse,
    toggleTheme,
    updateComment,
    addTheme,
    reset,
  }
})
