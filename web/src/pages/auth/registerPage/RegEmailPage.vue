<template>
  <div class="d-flex flex-column ga-4">
    <template v-if="!authStore.isEmailSent">
      <v-divider />
      <v-overlay
        :model-value="authStore.loading"
        contained
        class="align-center justify-center"
      >
        <v-progress-circular indeterminate />
      </v-overlay>
      <v-form
        v-model="valid"
        @submit.prevent="checkDataToValid"
        class="d-flex flex-column ga-3"
      >
        <v-text-field
          v-model="email"
          label="Электронная почта"
          :rules="[valid_rules.required, valid_rules.isEmail]"
          type="email"
          variant="outlined"
        />
        <v-row justify="end">
          <v-col cols="auto">
            <v-btn
              @click="router.push('/auth')"
              block
              color=""
              variant="text"
            >
              На главную
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              block
              color="primary"
              :disabled="authStore.loading"
              :loading="authStore.loading"
              type="submit"
              variant="flat"
            >
              Подтвердить
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
    <template v-else>
      <div class="text-center pa-4 ">
        На электронную почту <span class="text-decoration-underline">{{ email }}</span> была отправлена ссылка на
        продолжение регистрации.
      </div>
      <v-btn
        @click="router.push('/auth')"
        block
        color="primary"
        variant="flat"
      >
        На главную
      </v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import router from '@/router'
import { useAuthStore } from '@/stores'
import { valid_rules } from '@/utils/validRules'

const email = ref('')
const valid = ref(false)

const authStore = useAuthStore()
const notify = useNotify()

function checkDataToValid (): void {
  if (!valid.value) {
    notify.error('Проверьте правильность заполнения полей')
    return
  }
  authStore.sendRegistrationEmail(email.value)
}
</script>
