import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  archiveCommentLikeType as archiveCommentLikeTypeApi,
  createCommentLikeType as createCommentLikeTypeApi,
  getCommentLikeTypeList as getCommentLikeTypeListApi,
  updateCommentLikeType as updateCommentLikeTypeApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type CommentLikeType = {
  uid: string
  title: string
  emoji: string
  is_archived: boolean
  created_date: string
  updated_date: string
}

export const useCommentLikeTypeStore = defineStore('commentLikeType', () => {
  const list = ref<CommentLikeType[]>([])
  const loadingList = ref(false)
  const searchStr = ref('')

  const activeList = computed(() => list.value.filter(item => !item.is_archived))

  const statusFilter = ref<'active' | 'all' | 'archived'>('active')

  const filteredList = computed(() => {
    let result = list.value

    if (statusFilter.value === 'active') {
      result = result.filter(item => !item.is_archived)
    } else if (statusFilter.value === 'archived') {
      result = result.filter(item => item.is_archived)
    }

    if (searchStr.value.trim()) {
      const query = searchStr.value.trim().toLowerCase()
      result = result.filter(item => item.title.toLowerCase().includes(query))
    }

    return result
  })

  async function fetchList (includeArchived = true): Promise<void> {
    if (loadingList.value) {
      return
    }
    loadingList.value = true

    try {
      const { data } = await getCommentLikeTypeListApi<true>({
        body: {
          limit: -1,
          offset: 0,
          sort_by: 'title',
          sort_desc: false,
          is_archived: includeArchived ? null : false,
        },
        throwOnError: true,
      })

      list.value = data.items
    } catch (error_) {
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createOne (title: string, emoji: string): Promise<void> {
    try {
      await createCommentLikeTypeApi<true>({
        body: { title, emoji },
        throwOnError: true,
      })
    } catch (error_) {
      showVariableAlert(error_)
      throw error_
    }
  }

  async function createMany (items: { title: string, emoji: string }[]): Promise<{ created: number, skipped: number }> {
    let created = 0
    let skipped = 0

    for (const item of items) {
      if (!item.title.trim() || !item.emoji.trim()) {
        skipped += 1
        continue
      }

      try {
        await createOne(item.title.trim(), item.emoji.trim())
        created += 1
      } catch {
        skipped += 1
      }
    }

    await fetchList()
    return { created, skipped }
  }

  async function updateOne (uid: string, title?: string, emoji?: string): Promise<void> {
    try {
      await updateCommentLikeTypeApi<true>({
        path: { uid },
        body: { title, emoji },
        throwOnError: true,
      })
      await fetchList()
    } catch (error_) {
      showVariableAlert(error_)
      throw error_
    }
  }

  async function archiveOne (uid: string): Promise<void> {
    try {
      await archiveCommentLikeTypeApi<true>({
        path: { uid },
        throwOnError: true,
      })
      await fetchList()
    } catch (error_) {
      showVariableAlert(error_)
      throw error_
    }
  }

  return {
    list,
    filteredList,
    activeList,
    loadingList,
    searchStr,
    fetchList,
    createOne,
    createMany,
    updateOne,
    archiveOne,
    statusFilter,
  }
})
