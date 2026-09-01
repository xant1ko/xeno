<template>
  <v-card class="pa-2">
    <v-card-title class="d-flex align-center justify-space-between">
      <div>
        <div class="text-h6 font-weight-bold">
          {{ props.uidItem ? 'Редактирование темы' : 'Новая тема' }}
        </div>
      </div>

      <v-btn
        @click="emit('close')" icon="mdi-close"
        variant="text"
      />
    </v-card-title>

    <v-divider />

    <v-overlay
      :model-value="loadingForm"
      contained
      class="align-center justify-center"
    >
      <v-progress-circular indeterminate />
    </v-overlay>

    <v-form
      v-model="valid" @submit.prevent="checkDataToValid"
      class="pa-4 d-flex flex-column ga-2"
    >
      <v-text-field
        v-model="editForm.title"
        label="Название темы"
        variant="outlined"
        :rules="[valid_rules.required]"
      />

      <v-textarea
        v-model="editForm.description"
        label="Описание"
        variant="outlined"
        rows="3"
        auto-grow
      />

      <v-text-field
        v-model.number="editForm.order"
        label="Порядок"
        variant="outlined"
        type="number"
        min="0"
      />

      <v-row class="ga-1">
        <v-switch
          v-model="editForm.is_archived"
          label="Архивная тема"
          color="red"
          inset
          hide-details
        />
      </v-row>

      <v-divider class="my-4" />

      <div class="text-subtitle-2 mb-3 text-medium-emphasis">
        Привязка к курсу
      </div>

      <v-autocomplete
        v-model="editForm.course_uid"
        :items="referenseStore.courseList"
        item-title="title"
        item-value="uid"
        label="Курс"
        variant="outlined"
        clearable
        :rules="[valid_rules.required]"
      />
      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />

        <v-btn @click="emit('close')" variant="text">
          Отмена
        </v-btn>

        <v-btn
          type="submit"
          color="primary"
          variant="flat"
          :loading="loadingForm"
          :disabled="loadingForm"
        >
          {{ props.uidItem ? 'Сохранить' : 'Создать' }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import { useReferenceStore, useThemeStore } from '@/stores'
import { valid_rules } from '@/utils/validRules'

const props = defineProps<{
  uidItem?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const notify = useNotify()
const themeStore = useThemeStore()
const referenseStore = useReferenceStore()
const { loadingForm } = storeToRefs(themeStore)
const editForm = themeStore.editForm

const valid = ref(false)

function checkDataToValid (): void {
  if (!valid.value) {
    notify.error('Проверьте заполнение формы')
    return
  }

  sendData()
}

async function sendData (): Promise<void> {
  try {
    await themeStore.saveTheme(props.uidItem, editForm)
    emit('close')
  } catch {
    // ошибка уже обработана в сторе
  }
}

onMounted(async () => {
  await themeStore.initForm(props.uidItem)
})

// {
//   "title": "Как правильно понять, чью маму ебать?",
//   "description": "Эта тема относится к психологии прохождения собесов, а точнее к тому, как правильно себя вести при отказе от эйчарки",
//   "course_uid": "3eebf53b-9d8c-4699-8468-a2ba0f1e57c3",
//   "order": 67,
//   "is_archived": false
// }
</script>
