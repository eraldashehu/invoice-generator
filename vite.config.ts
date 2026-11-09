import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative paths, so the build works on GitLab Pages, GitHub Pages and Vercel alike.
  base: './',
});
