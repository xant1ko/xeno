<template>
  <v-card
    class="pa-4 mt-2" border
  >
    <!-- Заголовок -->
    <v-card-title class="d-flex flex-wrap align-center ga-2 pa-0">
      <span class="text-pre-wrap">{{ item.title }}</span>
      <v-btn
        v-if="permissions.update"
        @click="$emit('edit', item.uid)"
        icon="mdi-pencil"
        variant="text"
        size="small"
        class="ms-auto"
      />
    </v-card-title>

    <!-- Описание -->
    <v-card-text
      opacity="0.5"
      class="my-2 pa-0 pr-6"
    >
      {{ item.description }}
    </v-card-text>
    <v-row class="ga-1">
      <v-chip
        v-if="item.course_uid && courseInfo"
        prepend-icon="mdi-book-multiple"
        color="yellow-darken-2"
        variant="tonal"
      >
        {{ courseInfo.title }}
      </v-chip>
      <!-- Статус (активен/архив) -->
      <v-chip
        :prepend-icon="item.is_archived
          ? 'mdi-archive-outline'
          : 'mdi-check-circle-outline'
        "
        :color="item.is_archived ? 'grey' : 'success'"
        variant="tonal"
      >
        {{ item.is_archived ? 'Архив' : 'Активен' }}
      </v-chip>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
import type { ThemeItem } from '../../ThemesTable.vue'
import { computed } from 'vue'
import { useEntityPermissions } from '@/composables/useEntityPermissions'
import { useCourseStore } from '@/stores'

const props = defineProps<{
  item: ThemeItem
}>()

defineEmits<{
  (e: 'edit', uid: string | undefined): void
}>()

const courseStore = useCourseStore()
const permissions = useEntityPermissions('themes', ['update'])
const courseInfo = computed(() => courseStore.courseList.find(c => c.uid === props.item.course_uid))
</script>
