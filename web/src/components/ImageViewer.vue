<template>
  <div
    v-if="imageSrc"
    v-viewer
    class="image_viewer_wrap"
    :style="styles"
  >
    <img
      :alt="alt"
      class="v-card"
      :src="imageSrc"
    >
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps<{
  src: string
  alt?: string | ''
  width?: string | ''
  height?: string | ''
}>()

const imageSrc = ref()

const styles = reactive({
  width: props.width ? props.width + 'px' : 'auto',
  height: props.height ? props.height + 'px' : 'auto',
})
</script>

<style scoped>
.image_viewer_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image_viewer_wrap>img {
  width: 100%;
}
</style>
