<template>
  <div
    @click="editable && $emit('edit', uid)"
    class="d-flex align-center ga-4 py-2"
    :class="[{ 'cursor-pointer': editable }, { 'text-red': isArchived }]"
  >
    <AppAvatar
      v-if="showAvatar"
      @click="goToStudent"
      :avatar-link="avatarLink"
      :title="title"
      :is-archived="isArchived"
      size="44"
    />

    <div class="d-flex flex-column ga-1">
      <div class="font-weight-medium " :class="{ 'text-red': isArchived }">
        {{ title }}
      </div>
      <div
        v-if="subtitle"
        class="text-medium-emphasis"
        :style="subtitleStyle"
        :class="{ 'text-red': isArchived, 'text-truncate': truncateSubtitle }"
      >
        {{ subtitle }}
      </div>
      <div class="d-flex flex-wrap ga-2">
        <template v-if="github">
          <GitChip :github="github!" />
        </template>
        <template v-if="telegram">
          <TgChip :telegram="telegram" />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppAvatar from '@/components/AppAvatar.vue'
import router from '@/router/index.ts'
import GitChip from './GitChip.vue'
import TgChip from './TgChip.vue'

const props = withDefaults(defineProps<{
  title: string
  studentUid?: string
  subtitle?: string
  uid: string
  avatarLink?: string
  maxWidth?: string
  github?: string | null
  telegram?: string | null
  isArchived?: boolean
  showAvatar?: boolean
  truncateSubtitle?: boolean
  editable?: boolean
}>(), {
  avatarLink: '',
  studentUid: '',
  subtitle: undefined,
  github: undefined,
  telegram: undefined,
  showAvatar: true,
  maxWidth: '',
  truncateSubtitle: true,
  editable: false,
})

defineEmits<{
  (e: 'edit', uid: string): void
}>()

const subtitleStyle = computed(() => {
  const style: Record<string, string> = {}
  if (props.maxWidth) {
    style.maxWidth = props.maxWidth
  }
  // Если не обрезаем, разрешаем перенос
  if (!props.truncateSubtitle) {
    style.wordBreak = 'break-word'
    style.whiteSpace = 'normal'
  }
  return style
})

function goToStudent (): void {
  if (!props.studentUid) return
  router.push(`/students/${props.studentUid}`)
}
</script>
