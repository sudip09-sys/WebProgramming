import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  build: { rollupOptions: { input: fileURLToPath(new URL('./lab.html', import.meta.url)) } },
});
