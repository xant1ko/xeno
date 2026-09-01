import type { StudentCommentOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  createStudentComment as createStudentCommentApi,
  deleteStudentComment as deleteStudentCommentApi,
  getStudentCommentList as getStudentCommentListApi,
  likeStudentComment as likeStudentCommentApi,
  updateStudentComment as updateStudentCommentApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export const useStudentCommentsStore = defineStore('studentComments', () => {
  const commentList = ref<StudentCommentOutput[]>([])
  const loadingList = ref(false)
  const replyTargetUid = ref<string | null>(null)

  async function fetchList (studentUid: string): Promise<void> {
    if (loadingList.value) {
      return
    }

    loadingList.value = true

    try {
      const { data } = await getStudentCommentListApi<true>({
        body: { student_uid: studentUid, limit: -1, offset: 0, sort_by: 'created_date', sort_desc: false },
        throwOnError: true,
      })

      commentList.value = data.items
    } catch (error_) {
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createComment (
    studentUid: string,
    comment: string,
    isForEveryone = false,
    replyCommentUid: string | null = null,
  ): Promise<void> {
    try {
      await createStudentCommentApi<true>({
        body: {
          student_uid: studentUid,
          comment,
          is_for_everyone: isForEveryone,
          reply_comment_uid: replyCommentUid,
        },
        throwOnError: true,
      })

      replyTargetUid.value = null
      await fetchList(studentUid)
    } catch (error_) {
      showVariableAlert(error_)
      throw error_
    }
  }

  async function updateComment (
    uid: string,
    comment: string,
    studentUid: string,
    isForEveryone?: boolean,
  ): Promise<void> {
    try {
      await updateStudentCommentApi<true>({
        path: { uid },
        body: { comment, is_for_everyone: isForEveryone },
        throwOnError: true,
      })

      await fetchList(studentUid)
    } catch (error_) {
      showVariableAlert(error_)
      throw error_
    }
  }

  async function deleteComment (uid: string, studentUid: string): Promise<void> {
    try {
      await deleteStudentCommentApi<true>({
        path: { uid },
        throwOnError: true,
      })

      await fetchList(studentUid)
    } catch (error_) {
      showVariableAlert(error_)
      throw error_
    }
  }

  async function likeComment (commentUid: string, likeTypeUid: string): Promise<void> {
    try {
      const { data } = await likeStudentCommentApi<true>({
        path: { uid: commentUid },
        body: { like_type_uid: likeTypeUid },
        throwOnError: true,
      })
      const index = commentList.value.findIndex(c => c.uid === commentUid)
      if (index !== -1) {
        commentList.value[index] = data
      }
    } catch (error_) {
      showVariableAlert(error_)
    }
  }

  function setReplyTarget (uid: string | null): void {
    replyTargetUid.value = uid
  }

  function reset (): void {
    commentList.value = []
    replyTargetUid.value = null
    loadingList.value = false
  }

  return {
    commentList,
    loadingList,
    replyTargetUid,

    fetchList,
    createComment,
    updateComment,
    deleteComment,
    likeComment,
    setReplyTarget,
    reset,
  }
})
