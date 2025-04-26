import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // ➔ ⚡ Ajout obligatoire pour un fonctionnement SPA propre sur Vercel
  plugins: [react()],
  server: {
    port: 5173
  }
});
