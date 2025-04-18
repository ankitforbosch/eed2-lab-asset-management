import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: '.', // Project root
  publicDir: 'public', // Explicitly set public directory
  build: {
    outDir: 'dist', // Output directory for build
    sourcemap: false
  }
});
