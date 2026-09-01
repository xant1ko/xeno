import type { App } from 'vue'
import { vMaska } from 'maska/vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '../router'
import { registerApiAuthInterceptor } from './apiAuthInterceptor'
import vuetify from './vuetify'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

export function registerPlugins (app: App): void {
  app.directive('maska', vMaska)
  app.use(vuetify)
  app.use(pinia)
  app.use(router)
  registerApiAuthInterceptor()
}
