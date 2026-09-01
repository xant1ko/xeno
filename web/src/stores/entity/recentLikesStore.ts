import { defineStore } from 'pinia'
import { ref } from 'vue'

export type RecentLike = {
  like_type_uid: string
  title: string
  emoji: string
}

const MAX_ITEMS = 10

export const useRecentLikesStore = defineStore(
  'recentLikes',
  () => {
    const recent = ref<RecentLike[]>([])

    function pushRecent (like: RecentLike): void {
      recent.value = [
        like,
        ...recent.value.filter(r => r.like_type_uid !== like.like_type_uid),
      ].slice(0, MAX_ITEMS)
    }

    function clearRecent (): void {
      recent.value = []
    }

    return {
      recent,
      pushRecent,
      clearRecent,
    }
  },
  {
    persist: true,
  },
)
