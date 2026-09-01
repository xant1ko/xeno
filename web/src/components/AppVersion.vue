<template>
  <v-footer
    color="transparent"
    app
    height="30"
  >
    <v-spacer />
    {{ webVersion }}-{{ apiVersion }}
  </v-footer>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import appPackageInfo from '@/../package.json'
import { getAppInfo } from '@/types/generated'

const webVersion = appPackageInfo.version
const apiVersion = ref('')

onMounted(() => {
  getAppInfo().then(r => {
    apiVersion.value = r.data!.back_version
  })
})
</script>
