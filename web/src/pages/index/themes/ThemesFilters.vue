<template>
  <v-card :class="isMobileFilters ? 'mobile-filters-card' : ''" border>
    <v-card-text :class="isMobileFilters ? 'pa-3': ''">
      <template v-if="isMobileFilters">
        <themes-mobile-filters
          v-model:search="search"
          v-model:course="course"
          v-model:archived="archived"
          v-model:sort="sort"
          @create="$emit('create')"
          @update:sort-by="$emit('update:sort-by')"
          :filter-count="filterCount"
          :courses="courses"
        />
      </template>
      <template v-else>
        <v-row align="center" class="ga-3">
          <v-text-field
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            label="Поиск темы"
            placeholder="Название"
            variant="outlined"
            clearable
            hide-details
          />
          <v-autocomplete
            v-model="course"
            v-if="courses"
            :items="courses"
            item-title="title"
            item-value="uid"
            label="Курс"
            variant="outlined"
            clearable
            hide-details
          />
          <v-chip-group
            v-model="statusModel"
            mandatory
          >
            <v-chip value="active" filter>
              Активные
            </v-chip>
            <v-chip value="all" filter>
              Все
            </v-chip>
            <v-chip value="archived" filter>
              Архив
            </v-chip>
          </v-chip-group>
          <v-spacer />
          <v-btn
            v-if="permissions.update"
            @click="$emit('create')"
            color="primary"
            prepend-icon="mdi-plus"
          >
            Новая тема
          </v-btn>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { CourseOutput } from '@/types/generated/types.gen.ts'
import { useAdaptive } from '@/composables/useAdaptive.ts'
import { useEntityPermissions } from '@/composables/useEntityPermissions'
import { useStatusFilter } from '@/composables/useStatusFilter'
import ThemesMobileFilters from './mobile-templates/ThemesMobileFilters.vue'

defineProps<{
  filterCount: number
  courses?: CourseOutput[]
}>()

defineEmits<{ (e: 'create' | 'update:sort-by'): void }>()

const search = defineModel<string>('search', { default: '' })
const course = defineModel<string>('course', { default: '' })
const archived = defineModel<boolean | null | undefined>('archived')

const sort = defineModel<{ key: string, order: 'asc' | 'desc' | undefined }[]>('sort')

const statusModel = useStatusFilter(archived)

const { isMobileFilters } = useAdaptive()
const permissions = useEntityPermissions('themes', ['update'])
</script>
