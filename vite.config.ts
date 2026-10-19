// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      // Proxy /api to Spring Boot backend to avoid CORS during local development
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true,
        secure: false,
        // Ensure the Origin header seen by the backend matches the backend host
        headers: {
          origin: 'http://localhost:8082',
        },
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  ssr: {
    noExternal: ['react-router'],
  },
})
