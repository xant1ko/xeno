<template>
  <AppBottomNav v-model="isOpenDrawer" v-if="isMobileNav" />
  <AppDrawer v-else />
  <AppHeader />
  <v-main>
    <RouterView />
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppBottomNav from '@/components/navigation/AppBottomNav.vue'
import AppDrawer from '@/components/navigation/AppDrawer.vue'
import AppHeader from '@/components/navigation/AppHeader.vue'
import { useAdaptive } from '@/composables/useAdaptive'

const isOpenDrawer = ref(false)

const { isMobileNav } = useAdaptive()

</script>
