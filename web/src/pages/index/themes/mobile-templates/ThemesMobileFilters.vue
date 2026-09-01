<template>
  <v-row
    align="center" justify="end"
    class="ga-3"
  >
    <v-text-field
      v-model="search"
      label="Поиск темы"
      placeholder="Название или описание"
      variant="outlined"
      density="compact"
      clearable
      hide-details
    />

    <v-menu :offset="[filterMenuCoordinates.y, filterMenuCoordinates.x]" :close-on-content-click="false">
      <template #activator="{ props: slotProps }">
        <v-btn
          v-bind="slotProps"
          color="primary"
          icon="mdi-filter-outline"
          size="small"
        >
          <v-badge
            v-if="internalFilterCount > 0"
            location="bottom right"
            color="error"
            :content="internalFilterCount"
            :offset-x="filterBadgeCoordinates.x"
            :offset-y="filterBadgeCoordinates.y"
          >
            <v-icon>mdi-filter-outline</v-icon>
          </v-badge>
          <v-icon v-else>
            mdi-filter-outline
          </v-icon>
        </v-btn>
      </template>

      <v-card
        elevation="4" class="pa-4"
        border
      >
        <!-- Фильтр по направлению -->
        <v-row
          v-if="courses"
          align="center"
          class="ga-2"
        >
          <v-col>
            <v-autocomplete
              v-model="course"
              v-model:search="courseSearchModel"
              :items="courses"
              item-title="title"
              item-value="uid"
              label="Курс"
              variant="outlined"
              clearable
              hide-details
            />
          </v-col>
        </v-row>

        <!-- Фильтр по статусу -->
        <v-row align="center" class="ga-2 mt-2">
          <v-chip-group
            v-model="statusModel"
            mandatory
            class="pb-0 overflow-x-auto"
          >
            <v-chip value="all" filter>
              Все
            </v-chip>
            <v-chip value="active" filter>
              Активные
            </v-chip>
            <v-chip value="archived" filter>
              Архив
            </v-chip>
          </v-chip-group>
        </v-row>

        <!-- Сортировка -->
        <v-row align="center" class="flex-nowrap mt-2">
          <span>Сортировка по</span>
          <v-select
            v-model="sortModel"
            @update:model-value="$emit('update:sort-by')"
            width="120"
            :items="sortItems"
            item-title="title"
            item-value="value"
            label="Сортировка"
            variant="outlined"
            hide-details
            density="compact"
            single-line
          />
        </v-row>
      </v-card>
    </v-menu>

    <!-- Кнопка создания -->
    <v-btn
      v-if="permissions.update"
      @click="$emit('create')"
      color="primary"
      icon="mdi-plus"
      size="small"
    />
  </v-row>
</template>

<script setup lang="ts">
import type { CourseOutput } from '@/types/generated'
import { computed, ref, watch } from 'vue'
import { useEntityPermissions } from '@/composables/useEntityPermissions'
import { useStatusFilter } from '@/composables/useStatusFilter'

const filterMenuCoordinates = {
  y: 22,
  x: 64,
}

const filterBadgeCoordinates = {
  y: -10,
  x: -8,
}

const props = defineProps<{
  filterCount: number
  courses?: CourseOutput[]
}>()

const search = defineModel<string>('search', { default: '' })
const archived = defineModel<boolean | null | undefined>('archived')
const course = defineModel<string | null>('course', { default: '' })
const sort = defineModel<{ key: string, order: 'asc' | 'desc' | undefined }[]>('sort')

const courseSearch = ref<string | null>()
const courseSearchModel = computed({
  get: () => courseSearch.value ?? undefined,
  set: (val: string | undefined) => {
    courseSearch.value = val ?? null
  },
})

const permissions = useEntityPermissions('themes', ['update'])

const internalFilterCount = computed(() => {
  if (!props.courses) return props.filterCount - 1
  return props.filterCount
})

const debounce = ref<number>()

const delayEnv = Number(import.meta.env.VITE_DELAY_PAST_SEARCH_STR) || 500

const emit = defineEmits<{
  (e: 'create' | 'update:sort-by' | 'update:courses-list'): void
}>()

const sortItems = [
  { title: 'имени', value: 'title' },
  { title: 'порядку', value: 'order' },
  { title: 'архивности', value: 'is_archived' },
]

const statusModel = useStatusFilter(archived)

const sortModel = computed({
  get: () => {
    if (sort.value === undefined || sort.value[0] === undefined) return null
    return sort.value[0].key
  },
  set: (value: string) => {
    if (sort.value != undefined && sort.value[0] != undefined) {
      sort.value[0].key = value
    }
  },
})

watch(courseSearch, () => {
  clearTimeout(debounce.value)
  debounce.value = window.setTimeout(() => {
    emit('update:courses-list')
  }, delayEnv)
})
</script>
