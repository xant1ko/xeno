<template>
  <v-app class="theme-transition">
    <app-alert />
    <router-view />
    <app-version />
  </v-app>
</template>

<script setup lang="ts">
import AppAlert from './components/AppAlert.vue'
import AppVersion from './components/AppVersion.vue'
</script>
