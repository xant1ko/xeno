<template>
  <v-container
    class="h-100 w-100 d-flex justify-center flex-column align-center"
  >
    <AppLogo height="30" class="mb-4" />
    <v-card
      class="pa-4 w-100"
      max-width="600"
    >
      <h3 class="mt-0 mb-2 ">
        {{ currentOrg.title }} / <span>{{ route.name }}</span>
      </h3>

      <v-divider thickness="1" class="my-4" />
      <RouterView />
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AppLogo from '@/components/AppLogo.vue'
import { currentOrg } from '@/config'

const route = useRoute()
</script>
