<template>
  <div class="d-flex align-center flex-wrap ga-1">
    <v-tooltip
      v-for="l in comment.likes"
      :key="l.like_type_uid"
      location="bottom"
      content-class="reaction-tooltip rounded-lg pa-2 text-body-2 border bg-surface"
      open-delay="300"
    >
      <template #activator="{ props: tooltipProps }">
        <v-chip
          @click="handleLike({ uid: l.like_type_uid, title: l.title, emoji: l.emoji, is_archived: false, created_date: '', updated_date: '' })"
          v-bind="tooltipProps"
          size="small"
          variant="tonal"
          class="reaction-chip"
        >
          <span class="mr-1">{{ l.emoji }}</span>
          {{ l.count }}

          <v-avatar-group
            v-if="l.users?.length" :limit="3"
            :gap="-4" :border="true"
            class="ml-1"
          >
            <v-avatar
              v-for="user in l.users"
              :key="user.uid"
              size="16"
              :image="user.avatar_url ?? undefined"
            >
              <span v-if="!user.avatar_url" class="text-caption">
                {{ user.fullname.charAt(0).toUpperCase() }}
              </span>
            </v-avatar>
          </v-avatar-group>
        </v-chip>
      </template>

      <div class="d-flex flex-column ga-1">
        <div class="font-weight-medium">
          {{ l.title }}
        </div>
        <v-divider />
        <div
          v-for="user in l.users" :key="user.uid"
          class="d-flex align-center ga-2"
        >
          <v-avatar size="20" :image="user.avatar_url ?? undefined">
            <span v-if="!user.avatar_url" class="text-caption">
              {{ user.fullname.charAt(0).toUpperCase() }}
            </span>
          </v-avatar>
          <span class="text-caption">{{ user.fullname }}</span>
        </div>
      </div>
    </v-tooltip>
    <LikesMenuCard :comment-uid="comment.uid" :student-uid="studentUid" />
  </div>
</template>

<script setup lang="ts">
import type { CommentLikeType } from '@/stores/entity/commentLikeTypeStore'
import type { StudentCommentOutput } from '@/types/generated'
import { VAvatarGroup } from 'vuetify/labs/VAvatarGroup'
import { useStudentCommentsStore } from '@/stores'
import LikesMenuCard from './LikesMenuCard.vue'

const props = defineProps<{
  comment: StudentCommentOutput
  studentUid: string
}>()

const studentCommentsStore = useStudentCommentsStore()

async function handleLike (type: CommentLikeType): Promise<void> {
  await studentCommentsStore.likeComment(props.comment.uid, type.uid)
}
</script>

<style scoped>
.reaction-chip {
  cursor: pointer;
  transition: transform 0.1s ease;
}

.reaction-chip:hover {
  transform: scale(1.05);
}
</style>
