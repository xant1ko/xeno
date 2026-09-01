<template>
  <div :class="{ 'cursor-pointer': props.isCanOpen && avatarLink }">
    <v-avatar
      v-if="avatarLink"
      @click="openModalImage()"
      :size="size"
    >
      <img
        :width="size"
        :alt="title[0]?.toUpperCase()"
        :src="avatarLink"
      >
    </v-avatar>

    <v-avatar
      v-else
      :color="avatarColor"
      :size="size"
    >
      {{ title[0]?.toUpperCase() }}
    </v-avatar>
  </div>
  <v-overlay
    v-model="isOpenModalImage"
    class="align-center justify-center"
  >
    <img
      class="avatar-preview"
      :alt="title"
      :src="avatarLink"
    >
  </v-overlay>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  avatarLink?: string
  title: string
  size?: string | number
  isArchived?: boolean
  color?: string
  isCanOpen?: boolean
}>(), {
  avatarLink: '',
  size: 44,
  isArchived: false,
  color: 'primary',
  isCanOpen: false,
})

const isOpenModalImage = ref(false)

const avatarColor = computed(() => props.isArchived ? 'error' : props.color)

function openModalImage (): void {
  if (props.isCanOpen && props.avatarLink) {
    isOpenModalImage.value = true
  }
}
</script>

<style scoped>
.avatar-preview {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
}
</style>
