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
      @submit.prevent="checkValidToSend"
      class="d-flex flex-column ga-3"
    >
      <v-text-field
        v-model="dataToSend.login"
        label="Email"
        :rules="[valid_rules.required, valid_rules.isEmail]"
        variant="outlined"
      />
      <v-text-field
        v-model="dataToSend.password"
        label="Новый пароль"
        :rules="[valid_rules.required]"
        type="password"
        variant="outlined"
      />
      <v-text-field
        v-model="retryPassword"
        label="Повторите пароль"
        :rules="[valid_rules.isSamePassword(dataToSend.password, retryPassword)]"
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
            block
            color="primary"
            :disabled="authStore.loading"
            type="submit"
            variant="flat"
          >
            Восстановить пароль
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import router from '@/router'
import { useAuthStore } from '@/stores'
import { valid_rules } from '@/utils/validRules'

const valid = ref(false)
const retryPassword = ref<string>('')

const dataToSend = reactive({
  login: '',
  password: '',
})

const authStore = useAuthStore()
const notify = useNotify()

function checkValidToSend (): void {
  if (valid.value) {
    authStore.recoverPassword(dataToSend.login, dataToSend.password)
  } else {
    notify.error('Проверьте правильность заполнения полей')
  }
}
</script>
