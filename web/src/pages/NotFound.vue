<template>
  <v-container
    max-width="1000"
    class="h-100 d-flex ga-2 flex-column justify-center align-center"
  >
    <AppLogo height="30" class="mb-4" />
    <h2 class="text-center my-0">
      Страница не найдена, <br> или у вас недостаточно прав для просмотра страницы
    </h2>
    <v-btn
      @click="$router.push({name: 'Домашняя страница'})" color="primary"
      text="На главную"
    />
  </v-container>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>
