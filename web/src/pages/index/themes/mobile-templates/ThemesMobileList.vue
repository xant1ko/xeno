<template>
  <v-col>
    <template v-if="items.length > 0">
      <template v-for="(item, i) in items" :key="i">
        <theme-card
          @edit="$emit('edit', item.uid)"
          :item="item"
        />
        <v-divider v-if="i != items.length - 1" class="mx-4" />
      </template>
    </template>
    <template v-else>
      <empty-list-card />
    </template>

    <v-pagination
      v-if="totalItems > itemsPerPage"
      @update:model-value="$emit('update:page', $event); $emit('options')"
      :model-value="page"
      :length="Math.ceil(totalItems / itemsPerPage)"
      class="mt-4"
    />
  </v-col>
</template>

<script setup lang="ts">
import type { ThemeItem } from '../ThemesTable.vue'
import EmptyListCard from '@/components/EmptyListCard.vue'
import ThemeCard from './components/ThemeCard.vue'

defineProps<{
  items: ThemeItem[]
  loading: boolean

  page: number
  totalItems: number
  itemsPerPage: number

  sortBy: any[]
}>()

defineEmits<{
  (e: 'update:page' | 'update:items-per-page', value: number): void
  (e: 'update:sort-by', value: any[]): void

  (e: 'options'): void

  (e: 'edit', uid: string): void
}>()
</script>

<style scoped>

</style>
