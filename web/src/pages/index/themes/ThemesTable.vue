<template>
  <v-card border class="h-100 w-100 d-flex flex-column">
    <v-data-table-server
      @update:page="$emit('update:page', $event)"
      @update:items-per-page="$emit('update:items-per-page', $event)"
      @update:sort-by="$emit('update:sort-by', $event)"
      @update:options="$emit('options')"
      fixed-header
      fixed-footer
      v-bind="$attrs"
      class="flex-fill"
      :headers="headers"
      :items="items"
      :loading="loading"
      :page="page"
      :items-per-page="itemsPerPage"
      :items-length="totalItems"
      :sort-by="sortBy"
      density="comfortable"
      hover
      items-per-page-text="На странице"
      loading-text="Загрузка..."
    >
      <template #item.title="{ item }">
        <TableTitleCell
          @edit="(uid: string) => $emit('edit', uid)"
          :editable="permissions.update"
          :title="item.title"
          :subtitle="item.description ?? ''"
          :uid="item.uid"
          :is-archived="item.is_archived"
          max-width="300"
          :truncate-subtitle="false"
        />
      </template>

      <template #item.course="{ item }">
        <span v-if="getCourseTitle(item.course_uid)" class="text-body-2">
          {{ getCourseTitle(item.course_uid) }}
        </span>
        <span v-else class="text-medium-emphasis text-body-2">
          —
        </span>
      </template>

      <template #item.completed_count="{ item }">
        <v-chip
          :color="(item.completed_count ?? 0) > 0 ? 'success' : 'grey'"
          size="small"
          variant="tonal"
        >
          {{ item.completed_count ?? 0 }}
        </v-chip>
      </template>

      <template #item.order="{ item }">
        <span class="text-body-2">{{ item.order }}</span>
      </template>

      <template #item.is_archived="{ item }">
        <v-chip
          v-if="!item.is_archived"
          color="success"
          size="small"
          variant="tonal"
        >
          Активна
        </v-chip>
        <v-chip
          v-else
          color="grey"
          size="small"
          variant="tonal"
        >
          Архивирована
        </v-chip>
      </template>

      <template #item.created_date="{ item }">
        <div class="text-medium-emphasis">
          {{ getLocaleString(item.created_date) }}
        </div>
      </template>

      <template #item.actions="{ item }">
        <v-btn
          v-if="permissions.update"
          @click="$emit('edit', item.uid)"
          icon="mdi-pencil-outline"
          variant="text"
          size="small"
        />
      </template>

      <template #no-data>
        <v-container class="py-8">
          <v-row justify="center">
            <v-col cols="auto" class="text-center">
              <v-icon
                icon="mdi-book-open-blank-variant-outline"
                size="48"
                color="grey-lighten-1"
              />
              <div class="text-h6 mt-4">
                Нет тем
              </div>
              <div class="text-body-2 text-medium-emphasis">
                Нажмите «Новая тема», чтобы создать первую
              </div>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<script setup lang="ts">
import type { CourseOutput, ThemeWithCountOutput } from '@/types/generated'
import { computed } from 'vue'
import TableTitleCell from '@/components/TableTitleCell.vue'
import { useEntityPermissions } from '@/composables/useEntityPermissions'
import { getLocaleString } from '@/utils/dateUtils'

export type ThemeItem = ThemeWithCountOutput

const permissions = useEntityPermissions('themes', ['update'])

const headers = [
  { title: '', key: 'actions', sortable: false, width: 10 },
  { title: 'Тема', key: 'title', sortable: true },
  { title: 'Курс', key: 'course', sortable: false },
  { title: 'Прошло', key: 'completed_count', sortable: false, width: 100 },
  { title: 'Порядок', key: 'order', width: 100, sortable: true },
  { title: 'Статус', key: 'is_archived', width: 170, sortable: true },
  { title: 'Создан', key: 'created_date', width: 180 },
]

const props = defineProps<{
  items: ThemeItem[]
  loading: boolean
  page: number
  itemsPerPage: number
  totalItems: number
  sortBy: { key: string, order: 'asc' | 'desc' | undefined }[]
  courses?: CourseOutput[]
}>()

defineEmits<{
  (e: 'update:page' | 'update:items-per-page', value: number): void
  (e: 'update:sort-by', sortBy: { key: string, order: 'asc' | 'desc' | undefined }[]): void
  (e: 'options'): void
  (e: 'edit', uid: string): void
}>()

const courseMap = computed(() => {
  const map = new Map<string, string>()
  if (props.courses) {
    for (const course of props.courses) {
      map.set(course.uid, course.title)
    }
  }
  return map
})

function getCourseTitle (courseUid: string): string | undefined {
  return courseMap.value.get(courseUid)
}
</script>

<style scoped>
.flex-fill {
  flex: 1 1 0;
  min-height: 0;
  height: 100%;
}
</style>
