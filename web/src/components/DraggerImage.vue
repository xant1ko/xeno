<template>
  <div
    @dragleave.prevent="isDragging = false"
    @dragover.prevent="isDragging = true"
    @drop.prevent="handleDrop"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isDragging = ref<boolean>(false)
const image = defineModel<File>()

function handleDrop (e: DragEvent): void {
  isDragging.value = false
  if (!e.dataTransfer?.files) return

  const droppedFiles: File[] = Array.from(e.dataTransfer.files)

  if (Array.isArray(droppedFiles)) {
    const droppedFile = droppedFiles[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      image.value = droppedFile
    } else {
      alert('Только картинки!')
    }
  }
}
</script>

<style lang="css" scoped>
.dash {
  border: 3px rgb(var(--v-theme-customBorder)) dashed !important;
  border-radius: 8px;
}
</style>
