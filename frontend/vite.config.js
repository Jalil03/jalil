// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,
    port: 5173,          // dev port
    strictPort: true,    // keep 5173 stable so CORS never changes
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
    watch: { usePolling: true, interval: 100 },
  },
  preview: {
    port: 4173,          // preview (production build) port
    strictPort: true,
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
})
