<template>
  <v-list
    v-model:opened="openedGroups" nav
    :border="props.border"
  >
    <v-list-group
      v-for="group in navigateStore.filteredPages"
      :key="group.id"
      :value="group.id"
    >
      <template #activator="{ props: groupProps }">
        <v-tooltip
          :disabled="!props.compact"
          content-class="pa-0 bg-transparent opacity-100"
          location="end"
          interactive
        >
          <template #activator="{ props: activatorProps }">
            <v-list-item
              density="compact"
              size="small"
              v-bind="{
                ...(props.compact ? {} : groupProps),
                ...activatorProps,
              }"
              :active="group.items.some(page => route.path.startsWith(page.path))"
              active-color="primary"
              :prepend-icon="group.icon"
              :title="group.title"
            />
          </template>

          <v-card border>
            <v-list
              density="compact"
              bg-color="transparent"
            >
              <v-card-subtitle>{{ group.title }}</v-card-subtitle>
              <v-list-item
                v-for="page in group.items"
                :key="page.id"
                @click="router.push(page.path)"
                :active="route.path.startsWith(page.path)"
                active-color="primary"
                :title="page.title"
                density="compact"
                size="x-small"
                append-icon=""
              />
            </v-list>
          </v-card>
        </v-tooltip>
      </template>

      <v-tooltip
        v-for="page in group.items"
        :key="page.id"
        :disabled="!props.compact"
        content-class="rounded-lg"
      >
        <template #activator="{ props: activatorProps }">
          <v-list-item
            @click="router.push(page.path)"
            v-bind="activatorProps"
            :active="route.path.startsWith(page.path)"
            active-color="primary"
            :title="page.title"
            density="compact"
            size="small"
          />
        </template>
        {{ page.title }}
      </v-tooltip>
    </v-list-group>
  </v-list>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNavigateStore } from '@/stores'

const props = withDefaults(defineProps<{
  compact?: boolean
  border?: boolean
}>(), {
  compact: false,
  border: false,
})

const route = useRoute()
const router = useRouter()
const navigateStore = useNavigateStore()
const { isDrawerRail } = storeToRefs(navigateStore)

const openedGroups = ref<string[]>([])

watch(isDrawerRail, isRail => {
  if (isRail) {
    openedGroups.value = []
  }
})
</script>
