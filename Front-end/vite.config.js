import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'lucide-react': '/node_modules/lucide-react' // Alias para o módulo
    }
  },
  build: {
    rollupOptions: {
      external: ['lucide-react']
    }
  }
});
