<template>
  <v-navigation-drawer
    permanent
    :rail="navigateStore.isDrawerRail"
  >
    <AppNavigationList :compact="navigateStore.isDrawerRail" />

    <template #append>
      <v-list nav>
        <v-tooltip :disabled="!navigateStore.isDrawerRail" :text="userStore.userData.fullname">
          <template #activator="{ props: activator}">
            <v-divider />
            <v-list-item :prepend-icon="!appThemeStore.isDark() ? 'mdi-moon-waning-crescent' : 'mdi-weather-sunny'" title="Переключить тему">
              <template #append>
                <v-switch
                  v-model="appThemeStore.themeName"
                  true-value="light"
                  false-value="dark"
                  inset="square"
                  size="x-small"
                  hide-details
                />
              </template>
            </v-list-item>
            <v-list-item
              v-if="userStore.isAuth"
              @click="redirectToAccount(userStore.userData.uid)"
              v-bind="activator"
              :active="route.path.startsWith('/account')"
              active-color="primary"
              prepend-icon="mdi-account-circle-outline"
              :title="userStore.userData.fullname"
            />
          </template>
        </v-tooltip>
      </v-list>
      <v-divider />
      <v-btn
        @click="navigateStore.isDrawerRail = !navigateStore.isDrawerRail"
        class="text-medium-emphasis"
        :icon="navigateStore.isDrawerRail ? 'mdi-arrow-right' : 'mdi-arrow-left'"
        density="compact"
        block
      />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import router from '@/router'
import { useAppThemeStore, useNavigateStore, useUserStore } from '@/stores'
import AppNavigationList from './AppNavigationList.vue'

const userStore = useUserStore()
const route = useRoute()
const appThemeStore = useAppThemeStore()
const navigateStore = useNavigateStore()

function redirectToAccount (uid: string): void {
  router.push(`/account/${uid}`)
}

</script>
