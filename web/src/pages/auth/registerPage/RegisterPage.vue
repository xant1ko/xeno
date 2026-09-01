<template>
  <template v-if="!authStore.isRegistrationComplete">
    <div class="d-flex flex-column ga-4">
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
          v-model="registerForm.fullname"
          autocomplete="username"
          label="ФИО"
          :rules="[valid_rules.required]"
          variant="outlined"
        />
        <v-text-field
          v-model="registerForm.email"
          disabled
          label="Электронная почта"
          :rules="[valid_rules.required]"
          type="email"
          variant="outlined"
        />
        <v-text-field
          v-model="registerForm.password"
          label="Пароль"
          :rules="[
            valid_rules.required,
            valid_rules.minPassword(registerForm.password, 8),
          ]"
          type="password"
          variant="outlined"
        />
        <v-text-field
          v-model="repeatPassword"
          label="Повторите пароль"
          :rules="[
            valid_rules.required,
            valid_rules.isSamePassword(registerForm.password, repeatPassword)
          ]"
          type="password"
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
              color="primary"
              :disabled="authStore.loading"
              type="submit"
              variant="flat"
            >
              Зарегистрироваться
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </template>
  <div
    v-else
    class="text-center "
  >
    <p class="mb-4">
      Регистрация успешно завершена!
    </p>
    <v-btn
      @click="router.push('/auth')"
      block
      color="primary"
      variant="flat"
    >
      На главную
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useNotify } from '@/composables/useNotify'
import router from '@/router'
import { useAuthStore } from '@/stores'
import { valid_rules } from '@/utils/validRules'

const valid = ref(false)
const route = useRoute()
const regToken = ref('')

const registerForm = reactive({
  email: '',
  fullname: '',
  password: '',
})

const repeatPassword = ref('')

const authStore = useAuthStore()
const notify = useNotify()

function checkDataToValid (): void {
  if (!valid.value) {
    notify.error('Проверьте правильность заполнения полей')
    return
  }
  authStore.confirmRegistration({ ...registerForm }, regToken.value)
}

onMounted(() => {
  if (route.query.email) {
    registerForm.email = route.query.email as string
  }

  if (route.query.token) {
    regToken.value = route.query.token as string
  }
})
</script>
