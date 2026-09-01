<script setup lang="ts">
// Рендерит доверенный Markdown-текст в HTML для отображения в интерфейсе.
import { computed } from 'vue'
import { markdown } from '@/utils/markdown'

const props = defineProps<{
  text: string
}>()

const html = computed(() => {
  return markdown.render(props.text)
})
</script>

<template>
  <div
    class="markdown-body"
    v-html="html"
  />
</template>
