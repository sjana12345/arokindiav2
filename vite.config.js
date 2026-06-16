import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/react-dom') || id.includes('/node_modules/react/') || id.includes('/node_modules/scheduler')) {
            return 'react-vendor';
          }
          if (id.includes('/node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('/node_modules/react-router') || id.includes('/node_modules/react-scroll')) {
            return 'router';
          }
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
      '/uploads': 'http://localhost:5001',
    },
  },
})
