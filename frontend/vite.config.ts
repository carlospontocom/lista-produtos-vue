import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Quando o axios chamar '/produtos', o Vite intercepta e joga para o backend
      '/produtos': {
        target: 'https://5000-firebase-vueapi-1778871500827.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
