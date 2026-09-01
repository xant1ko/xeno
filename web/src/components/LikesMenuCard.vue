<template>
  <v-menu v-model="isMenuOpen" :close-on-content-click="false">
    <template #activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        icon="mdi-emoticon-plus-outline"
        size="small"
        variant="tonal"
        density="comfortable"
      />
    </template>

    <v-text-field
      v-model="searchStr"
      placeholder="Поиск..."
      variant="solo-filled"
      density="compact"
      hide-details
      prepend-inner-icon="mdi-magnify"
      class="mb-2"
    />
    <v-card
      min-width="220"
      max-width="90vw"
      width="max-content"
      class="pa-2"
    >
      <template v-if="visibleRecent.length > 0">
        <v-card-subtitle class="px-1 pt-1 pb-1">
          Недавние
        </v-card-subtitle>
        <div class="emoji-grid mb-2">
          <v-btn
            v-for="item in visibleRecent"
            :key="item.like_type_uid"
            @click="handleLike({ uid: item.like_type_uid, title: item.title, emoji: item.emoji, is_archived: false, created_date: '', updated_date: '' })"
            :title="item.title"
            variant="text"
            size="small"
            min-width="32"
            class="emoji-cell pa-1"
          >
            <span class="text-h6">{{ item.emoji }}</span>
          </v-btn>
        </div>
        <v-divider class="mb-2" />
      </template>

      <div class="emoji-grid">
        <v-btn
          v-for="type in filteredActiveList"
          :key="type.uid"
          @click="handleLike(type)"
          :title="type.title"
          variant="text"
          size="small"
          min-width="32"
          class="emoji-cell pa-1"
        >
          <span class="text-h6">{{ type.emoji }}</span>
        </v-btn>
      </div>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useStudentCommentsStore } from '@/stores'
import { type CommentLikeType, useCommentLikeTypeStore } from '@/stores/entity/commentLikeTypeStore'
import { useRecentLikesStore } from '@/stores/entity/recentLikesStore'

const props = defineProps<{
  commentUid: string
  studentUid: string
}>()

const searchStr = ref('')
const isMenuOpen = ref(false)

const studentCommentsStore = useStudentCommentsStore()
const commentLikeTypeStore = useCommentLikeTypeStore()
const recentLikesStore = useRecentLikesStore()

const visibleRecent = computed(() =>
  recentLikesStore.recent.filter(r =>
    commentLikeTypeStore.activeList.some(t => t.uid === r.like_type_uid),
  ),
)

const filteredActiveList = computed(() => {
  const query = searchStr.value.trim().toLowerCase()
  if (!query) return commentLikeTypeStore.activeList
  return commentLikeTypeStore.activeList.filter(t => t.title.toLowerCase().includes(query))
})

async function handleLike (type: CommentLikeType): Promise<void> {
  await studentCommentsStore.likeComment(props.commentUid, type.uid)
  recentLikesStore.pushRecent({ like_type_uid: type.uid, title: type.title, emoji: type.emoji })
  isMenuOpen.value = false
}
</script>

<style scoped>
.emoji-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: min(90vw, 320px);
}

.emoji-cell {
  flex: 0 0 auto;
}
</style>
