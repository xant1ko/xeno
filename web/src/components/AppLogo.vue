<template>
  <img
    :src="logoSrc"
    :alt="currentOrg.name"
  >
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { currentOrg } from '@/config'
import { useAppThemeStore } from '@/stores'

const appThemeStore = useAppThemeStore()

const logoSrc = computed(() => appThemeStore.isDark()
  ? currentOrg.assets.logo.dark
  : currentOrg.assets.logo.light)
</script>
