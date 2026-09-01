<template>
  <div>
    <v-text-field
      v-model="inputValue"
      @blur="commitInput"
      @click:append-inner="isMenu = !isMenu"
      @click:clear="clearDate"
      @keydown.enter.prevent="commitInput"
      @paste="handlePaste"
      append-inner-icon="mdi-calendar"
      :clearable="!!clearable"
      :density="density"
      :error-messages="errorMessages"
      :hide-details="hideDetails"
      :label="label"
      :placeholder="DATE_INPUT_FORMAT"
      :rounded="rounded || 'lg'"
      :rules="rules"
      :variant="variant || 'solo-filled'"
    />
    <v-menu
      v-model="isMenu"
      :close-on-content-click="false"
      :open-on-click="false"
      activator="parent"
      transition="scale-transition"
    >
      <v-date-picker
        v-model="localDate"
        @update:model-value="selectDate"
        hide-header
        :max="max"
        :min="min"
      />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  DATE_INPUT_FORMAT,
  dateToApiDateTime,
  formatDateForInput,
  isDateInRange,
  parseApiDate,
  parseManualDate,
} from '@/utils/dateUtils'

const props = defineProps<{
  lteDateProps?: Date | undefined
  gteDateProps?: Date | undefined
  min?: Date | undefined
  max?: Date | undefined
  errors?: string | string[]
  label?: string
  rounded?: boolean
  rules?: ((value: any) => boolean | string)[]
  variant?:
    | 'solo-filled'
    | 'filled'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'underlined'
    | undefined
  density?: any
  hideDetails?: boolean
  clearable: boolean
}>()

const notify = useNotify()
const isMenu = ref(false)
const localDate = ref<Date>()
const model = defineModel<string | null>()
const inputValue = ref('')
const errorMessages = ref<string | string[]>(props.errors ?? '')

watch(() => props.errors, value => {
  errorMessages.value = value ?? ''
})

watch(() => model.value, value => {
  if (!value) {
    inputValue.value = ''
    localDate.value = undefined
    return
  }

  const date = parseApiDate(value)
  if (Number.isNaN(date.getTime())) {
    clearDate()
    return
  }

  localDate.value = date
  inputValue.value = formatDateForInput(date)
}, { immediate: true })

function setDate (date: Date): void {
  localDate.value = date
  inputValue.value = formatDateForInput(date)
  model.value = dateToApiDateTime(date)
  errorMessages.value = ''
}

function clearDate (): void {
  localDate.value = undefined
  inputValue.value = ''
  model.value = null
}

function showInvalidDateWarning (): void {
  notify.warning('Не удалось распознать дату', `Используйте формат ${DATE_INPUT_FORMAT}`)
}

function commitInput (): void {
  const value = inputValue.value.trim()
  if (!value) {
    clearDate()
    return
  }

  const date = parseManualDate(value)
  if (!date || !isDateInRange(date, props.min, props.max)) {
    clearDate()
    showInvalidDateWarning()
    return
  }

  setDate(date)
}

function handlePaste (event: ClipboardEvent): void {
  const value = event.clipboardData?.getData('text')
  if (value === undefined) return

  event.preventDefault()
  inputValue.value = value.trim()
  commitInput()
}

function selectDate (value: Date | undefined): void {
  if (!value) {
    clearDate()
    return
  }

  setDate(value)
  isMenu.value = false
}
</script>
