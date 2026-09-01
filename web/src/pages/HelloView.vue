<template>
  <v-container max-width="1000" class="h-100 d-flex flex-column justify-center align-center">
    <AppLogo height="30" class="mb-4" />
    <h2 class="text-center my-0">
      Добро пожаловать! Обратитесь к администратору для обсуждения вашей дальнейшей роли в приложении
    </h2>
    <v-btn
      @click="logout()" class="mt-2"
      color="primary" text="Выйти из системы"
    />
  </v-container>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import { useUserStore } from '@/stores'

const { logout } = useUserStore()
</script>
