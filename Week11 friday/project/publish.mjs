import { readdir, cp, rm } from 'node:fs/promises';

const output = new URL('./dist/', import.meta.url);
const publishedAssets = new URL('../assets/', import.meta.url);
const currentAssets = new Set(await readdir(new URL('assets/', output)));
// Only remove old hashed build files; keep photos and other supplied assets.
for (const name of await readdir(publishedAssets)) {
  if (/-[\w-]{8}\.(?:js|css)$/.test(name) && !currentAssets.has(name)) {
    await rm(new URL(name, publishedAssets));
  }
}
for (const name of await readdir(output)) {
  await cp(new URL(name, output), new URL('../' + name, import.meta.url), { recursive: true });
}
