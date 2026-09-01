<template>
  <div class="d-flex flex-column ga-4">
    <h2 class="text-h6 font-weight-bold text-center">
      {{ authStore.isRecoveryConfirmed ? 'Вы успешно сменили пароль' : 'Ошибка при изменении пароля' }}
    </h2>
    <v-divider />
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
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'
import { useAuthStore } from '@/stores'

const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token as string
  await authStore.confirmPasswordRecovery(token)
})
</script>
