import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from 'vite-plugin-vercel';

export default defineConfig({
  base: '/',
  plugins: [react(), vercel()],
  server: {
    port: 5173
  }
});
