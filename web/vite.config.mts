import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  server: {
    host: true,
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path): string => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [
    vueDevTools(),
    createHtmlPlugin({
      inject: {
        data: {
          title: 'xeno',
          faviconDark: '/favicons/xnt-logo-white.svg',
          faviconLight: '/favicons/xnt-logo-black.svg',
          orgName: 'xeno',
        },
      },
    }),
    vue(),
    vuetify(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
})
