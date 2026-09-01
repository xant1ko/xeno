<template>
  <v-menu location="left top">
    <template #activator="{props: activator}">
      <v-btn
        v-bind="activator"
        color="primary"
        class="fixed-btn"
        icon="mdi-menu"
      />
    </template>
    <template #default>
      <AppNavigationList border />
    </template>
  </v-menu>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNavigationList from './AppNavigationList.vue'

const route = useRoute()
const router = useRouter()

watch(
  () => route.path,
  newVal => {
    if (newVal == undefined) router.push({ name: 'Home' })
  },
)
</script>

<style scoped>
.fixed-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 10;
}
</style>
