<template>
  <v-breadcrumbs
    class="font-weight-bold"
    :items="navigateStore.absolutePathMap"
  >
    <template #item="{ item, index }">
      <v-breadcrumbs-item
        :to="item.to"
        :disabled="item.disabled"
        :max-width="isLastItem(index) ? '80' : ''"
      >
        <span :class="isLastItem(index) ? 'text-truncate' : ''">{{ item.title }}</span>
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAdaptive } from '@/composables/useAdaptive'
import { useNavigateStore } from '@/stores'

const navigateStore = useNavigateStore()
const { isMobile } = useAdaptive()

const isLastItem = computed<(index: number) => boolean>(() => (index: number): boolean => {
  return isMobile.value && index === navigateStore.absolutePathMap.length - 1
})
</script>
