<template>
  <v-card
    border
    elevation="0"
  >
    <v-card-text class=" d-flex justify-space-between align-center">
      <div class="d-flex ga-4 justify-center align-center">
        <div
          v-if="!hideChartButtons"
          class="d-flex ga-3"
        >
          <v-chip-group
            v-model="chartType"
            mandatory
          >
            <v-chip
              v-for="graph in graphs"
              :key="graph.value"
              :value="graph.value"
              :variant="chartType === graph.value ? 'flat' : 'text'"
              :color="chartType === graph.value ? 'primary' : undefined"
              border
              filter
            >
              {{ graph.label }}
            </v-chip>
          </v-chip-group>
        </div>

        <v-divider
          v-if="!hideChartButtons"
          vertical
        />

        <div class="d-flex ga-3">
          <v-chip-group
            v-model="period"
            mandatory
          >
            <v-chip
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              :variant="period === option.value ? 'flat' : 'text'"
              :color="period === option.value ? 'primary' : undefined"
              border
              filter
            >
              {{ option.label }}
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  subTitle?: string
  hideChartButtons?: boolean
}>()

const period = defineModel<'monthly' | 'quarterly' | 'yearly'>('period', { default: 'monthly' })
const chartType = defineModel<'cumulative' | 'discrete'>('chartType', { default: 'cumulative' })

const options = [
  { value: 'monthly', label: 'Месяц' },
  { value: 'quarterly', label: 'Квартал' },
  { value: 'yearly', label: 'Год' },
]

const graphs = [
  { value: 'discrete', label: 'Активность' },
  { value: 'cumulative', label: 'Пройденный материал' },
]
</script>
