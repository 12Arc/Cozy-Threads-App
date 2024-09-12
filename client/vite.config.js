import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',  // Backend server for development
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',  // This is where the build will go (default is `dist`)
    rollupOptions: {
      input: './index.html',  // Ensure Vite finds index.html in the client folder
    },
  },
});

