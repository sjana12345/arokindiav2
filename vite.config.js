import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Makes <link rel="stylesheet"> non-render-blocking in the built HTML
const deferCssPlugin = {
  name: 'defer-css',
  transformIndexHtml(html) {
    return html.replace(
      /<link rel="stylesheet"([^>]+)>/g,
      (_, attrs) =>
        `<link rel="preload"${attrs} as="style" onload="this.onload=null;this.rel='stylesheet'">` +
        `<noscript><link rel="stylesheet"${attrs}></noscript>`,
    );
  },
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    deferCssPlugin,
  ],
  build: {
    outDir: 'dist/client',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:5001',
      '/uploads': 'http://localhost:5001',
    },
  },
})
