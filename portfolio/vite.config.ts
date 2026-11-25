import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/apex-strategy-v6/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
