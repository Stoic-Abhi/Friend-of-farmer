import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',

  // Proxy API requests to Express backend in dev
  server: {
    proxy: {
      '/auth':          { target: 'http://localhost:4000', changeOrigin: true },
      '/products':      { target: 'http://localhost:4000', changeOrigin: true },
      '/orders':        { target: 'http://localhost:4000', changeOrigin: true },
      '/farmers':       { target: 'http://localhost:4000', changeOrigin: true },
      '/notifications': { target: 'http://localhost:4000', changeOrigin: true },
      '/profile':       { target: 'http://localhost:4000', changeOrigin: true },
      '/health':        { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
})