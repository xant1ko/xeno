<template>
  <v-app-bar
    color="transparent"
    elevation="0"
    class="app-bar"
  >
    <template #prepend>
      <div
        @click="goHome" class="d-flex align-center logo-wrapper ml-4"
      >
        <AppLogo height="20" />
      </div>
      <breadcrumbs />
    </template>

    <template #append>
      <div class="d-flex align-center ga-3">
        <template v-if="userStore.isAuth">
          <span v-if="!isMobileLogin">{{ user.fullname }}</span>
          <v-btn
            @click="redirectToAccount(user.uid)" variant="text"
            class="user-btn" icon="mdi-account-circle-outline"
          />
          <v-tooltip text="Выйти">
            <template #activator="{ props }">
              <v-btn
                @click="userStore.logout()" v-bind="props"
                icon="mdi-logout" variant="text"
                class="hover-btn"
              />
            </template>
          </v-tooltip>
        </template>
        <template v-else>
          <v-btn
            @click="router.push('/auth')" color="primary"
            variant="flat"
          >
            Войти
          </v-btn>
        </template>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import AppLogo from '@/components/AppLogo.vue'
import { useAdaptive } from '@/composables/useAdaptive.ts'
import router from '@/router'
import { useUserStore } from '@/stores'
import Breadcrumbs from './Breadcrumbs.vue'

const userStore = useUserStore()
const user = computed(() => userStore.getUser())

const { isMobileLogin } = useAdaptive()

function redirectToAccount (uid: string): void {
  router.push(`/account/${uid}`)
}

function goHome (): void {
  router.push('/')
}
</script>

<style scoped>

.app-bar{
    backdrop-filter: blur(20px);
}

.logo-wrapper {
  cursor: pointer;
  opacity: 0.7;
  transition: 0.2s;
}
.logo-wrapper:hover {
  opacity: 1;
}
.user-btn {
  text-transform: none;
  font-weight: 500;
}
</style>
