<template>
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
        v-model="authForm.email"
        autocomplete="email"
        label="Электронная почта"
        :rules="[valid_rules.required]"
        type="email"
        variant="outlined"
      />
      <v-text-field
        v-model="authForm.password"
        @click:append-inner="showPassword = !showPassword"
        append-inner-icon="mdi-eye"
        label="Пароль"
        :rules="[valid_rules.required]"
        :type="showPassword ? 'text' : 'password'"
        variant="outlined"
      />
      <v-btn
        block
        color="primary"
        :disabled="authStore.loading"
        type="submit"
        variant="flat"
      >
        Войти
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useNotify } from '@/composables/useNotify'
import router from '@/router'
import { useAuthStore, useUserStore } from '@/stores'
import { valid_rules } from '@/utils/validRules'

const authForm = reactive({
  email: '',
  password: '',
})

const showPassword = ref()
const valid = ref(false)

const user = useUserStore()
const authStore = useAuthStore()
const notify = useNotify()

watch(() => user.isAuth, isAuth => {
  if (isAuth) {
    router.push({ name: 'Домашняя страница' })
  }
})

function checkDataToValid (): void {
  if (!valid.value) {
    notify.error('Проверьте правильность заполнения полей')
    return
  }
  authStore.login(authForm.email, authForm.password)
}
</script>
