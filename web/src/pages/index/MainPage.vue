<template>
  <v-container
    max-width="1000"
    class="h-100 d-flex flex-column justify-center align-center"
  >
    <AppLogo height="60" />
  </v-container>
</template>

<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
import { currentOrg } from '@/config'
</script>
