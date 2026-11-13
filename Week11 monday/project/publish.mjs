import { readdir, cp } from 'node:fs/promises';

const output = new URL('./dist/', import.meta.url);
for (const name of await readdir(output)) {
  await cp(new URL(name, output), new URL('../' + name, import.meta.url), { recursive: true });
}
