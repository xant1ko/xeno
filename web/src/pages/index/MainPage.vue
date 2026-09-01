<template>
  <v-container
    max-width="1000"
    class="h-100 d-flex flex-column justify-center align-center"
  >
    <AppLogo height="30" />
    <h2 class="text-center">
      xeno {{ currentOrg.name }}
    </h2>
  </v-container>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import { currentOrg } from '@/config'
</script>
