import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        practice: fileURLToPath(new URL('./practice.html', import.meta.url)),
        products: fileURLToPath(new URL('./products.html', import.meta.url)),
        courses: fileURLToPath(new URL('./courses.html', import.meta.url)),
        gallery: fileURLToPath(new URL('./gallery.html', import.meta.url)),
        examples: fileURLToPath(new URL('./examples.html', import.meta.url)),
      },
    },
  },
});
