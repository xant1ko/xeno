import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Позволяем открыть Vite из Docker-контейнера через порт хоста.
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    proxy: {
      // В браузере все запросы остаются на текущем origin, а Vite передаёт их API.
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET ?? 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
