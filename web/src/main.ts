import mitt from 'mitt'
import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'
import './css/style.css'

const app = createApp(App)

registerPlugins(app)

export const emitter = mitt()
app.provide('emitter', emitter)

app.mount('#app')
