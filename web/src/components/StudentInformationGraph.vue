<template>
  <v-card
    v-if="!loading"
    border
    class="fill-height pa-5"
    elevation="0"
  >
    <div
      v-if="title"
      class="pa-0 text-body-2 font-weight-medium text-medium-emphasis mb-2"
    >
      {{ title }}
    </div>

    <v-sparkline
      fill
      color="on-primary"
      :gradient="['#3B82F650', '#1E40AF50']"
      :min="0"
      :max="max"
      :labels="chartData.map(item => String(item.label))"
      :model-value="chartData.map(item => item.themes)"
      auto-draw
      auto-draw-duration="1000"
      line-width="1"
      smooth="5"
      stroke-linecap="round"
      height="100%"
      interactive
      :tooltip="{ class: 'bg-grey-darken-4' }"
    >
      <template #tooltip="{ value }">
        <v-list-item
          density="compact"
          lines="one"
          style="min-height: 0;"
        >
          <div class="text-body-small">
            {{ value }}
          </div>
        </v-list-item>
      </template>
    </v-sparkline>
  </v-card>
  <div
    v-else
    class="pa-15 h-100 d-flex justify-center"
  >
    <v-progress-circular indeterminate size="x-large" />
  </div>
</template>

<script setup lang="ts">
import type { StudentProgressPoint } from '@/types/generated'
import { toRef, watch } from 'vue'
import { useStudentProgressGraphData } from '@/composables/useStudentProgressGraphData'

const props = withDefaults(defineProps<{
  period: 'monthly' | 'quarterly' | 'yearly'
  chartType: 'cumulative' | 'discrete'
  rawData: StudentProgressPoint[]
  max?: number
  showPeriodButtons?: boolean
  title?: string
  loading: boolean
}>(), {
  max: 100,
  title: '',
})

const emit = defineEmits<{ 'update:localMax': [value: number] }>()

const { chartData, localMax } = useStudentProgressGraphData(
  toRef(props, 'rawData'),
  toRef(props, 'period'),
  toRef(props, 'chartType'),
)

watch(localMax, val => emit('update:localMax', val), { immediate: true })
</script>
