<template>
  <div class="pa-6 d-flex flex-column ga-6 flex-col-container">
    <ThemesFilters
      v-model:search="queryState.filters.value.search_str"
      v-model:archived="queryState.filters.value.is_archived"
      v-model:course="queryState.filters.value.course_uid"
      v-model:sort="queryState.sortBy.value"
      @create="openCreateDialog"
      :filter-count="queryState.countOfSelectedFilters.value"
      :courses="referenceStore.courseList"
    />
    <div class="flex-grow-1 flex-table-wrapper">
      <ThemesMobileList
        v-if="isMobileList"
        @update:page="queryState.pagination.value.page = $event"
        @update:items-per-page="queryState.pagination.value.itemsPerPage = $event"
        @update:sort-by="queryState.sortBy.value = $event"
        @edit="goToEditItem"
        :items="themeStore.themeList"
        :loading="themeStore.loadingList"
        :page="queryState.pagination.value.page"
        :items-per-page="queryState.pagination.value.itemsPerPage"
        :total-items="themeStore.totalItems"
        :sort-by="queryState.sortBy.value"
      />
      <ThemesTable
        v-else
        @update:page="queryState.pagination.value.page = $event"
        @update:items-per-page="queryState.pagination.value.itemsPerPage = $event"
        @update:sort-by="queryState.sortBy.value = $event"
        @edit="goToEditItem"
        :items="themeStore.themeList"
        :loading="themeStore.loadingList"
        :page="queryState.pagination.value.page"
        :items-per-page="queryState.pagination.value.itemsPerPage"
        :total-items="themeStore.totalItems"
        :sort-by="queryState.sortBy.value"
        :courses="referenceStore.courseList"
      />
    </div>

    <v-dialog
      v-model="isEditItem"
      max-width="700"
    >
      <AddTheme
        @close="closeDialog"
        :uid-item="uidItemToEdit"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAdaptive } from '@/composables/useAdaptive.ts'
import { useQueryState } from '@/composables/useQueryState.ts'
import { useReferenceStore, useThemeStore } from '@/stores'
import { FilterParseType } from '@/utils/filterConstants'
import AddTheme from './AddTheme.vue'
import ThemesMobileList from './mobile-templates/ThemesMobileList.vue'
import ThemesFilters from './ThemesFilters.vue'
import ThemesTable from './ThemesTable.vue'

const themeStore = useThemeStore()
const referenceStore = useReferenceStore()
const { isMobileList } = useAdaptive()

const queryState = useQueryState({
  individualFilterDefaults: {
    course_uid: undefined as string | undefined,
  },
  individualFilterParsingTypes: {
    course_uid: FilterParseType.String,
  },
  sortDefaults: [{ key: 'order', order: undefined as 'asc' | 'desc' | undefined }],
  onFetch: loadList,
})

const isEditItem = ref(false)
const uidItemToEdit = ref<string>()

async function loadList (): Promise<void> {
  const request = queryState.getRequestParams()
  await themeStore.fetchList(request)
}

function openCreateDialog (): void {
  uidItemToEdit.value = undefined
  isEditItem.value = true
}

function goToEditItem (uid: string | undefined): void {
  uidItemToEdit.value = uid
  isEditItem.value = true
}

function closeDialog (): void {
  isEditItem.value = false
  uidItemToEdit.value = undefined
  themeStore.resetForm()
  loadList()
}

onMounted(async () => {
  await loadList()
})
</script>
