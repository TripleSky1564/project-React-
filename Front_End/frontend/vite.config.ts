import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const backendOrigin = process.env.VITE_BACKEND_ORIGIN ?? 'http://localhost:8081'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    // Ensure the dev server always opens the root page
    open: '/',
    // Use a fixed port; if occupied, fail instead of switching silently
    port: 5180,
    strictPort: true,
    proxy: {
      '/api/chatbot': {
        target: 'http://49.50.138.5:9500',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chatbot/, '/stream-chat'),
      },
      '/auth': {
        target: backendOrigin,
        changeOrigin: true,
      },
      '/api': {
        target: backendOrigin,
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4180,
    strictPort: true,
    open: '/',
    proxy: {
      '/api/chatbot': {
        target: 'http://49.50.138.5:9500',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chatbot/, '/stream-chat'),
      },
      '/auth': {
        target: backendOrigin,
        changeOrigin: true,
      },
      '/api': {
        target: backendOrigin,
        changeOrigin: true,
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})
