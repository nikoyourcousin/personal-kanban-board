import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/repository-name/' : '/',
  plugins: [vue()],
  server: {
    port: 3000,
    open: true
  }
})
