import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    host: true,
    port: 5173,         // starting port
    strictPort: false,  // <— allow fallback to the next free port
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
    watch: { usePolling: true, interval: 100 },
  },
})
