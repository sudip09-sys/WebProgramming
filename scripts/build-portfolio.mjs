import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

await build({
  entryPoints: [fileURLToPath(new URL('../week10/portfolio/src/main.jsx', import.meta.url))],
  outfile: fileURLToPath(new URL('../week10/portfolio/assets/projects.min.js', import.meta.url)),
  bundle: true,
  minify: true,
  format: 'esm',
  jsx: 'automatic',
  target: 'chrome100',
  define: { 'process.env.NODE_ENV': '"production"' },
});
console.log('Portfolio React projects built.');
