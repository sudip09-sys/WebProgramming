import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const walk = (dir) =>
  fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) => !['.git', 'node_modules', 'dist'].includes(e.name) && !e.name.startsWith('.check'),
    )
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
const files = walk(root);
let errors = 0,
  html = 0,
  scripts = 0;
const fail = (f, message) => {
  console.error(path.relative(root, f) + ': ' + message);
  errors++;
};
for (const file of files) {
  const ext = path.extname(file);
  if (ext === '.js' || ext === '.mjs') {
    try {
      new vm.Script(fs.readFileSync(file, 'utf8'), { filename: file });
      scripts++;
    } catch (e) {
      const result = spawnSync(process.execPath, ['--input-type=module', '--check'], {
        input: fs.readFileSync(file, 'utf8'),
        encoding: 'utf8',
      });
      if (result.status !== 0) fail(file, result.stderr.trim());
      else scripts++;
    }
  }
  if (ext !== '.html') continue;
  html++;
  const text = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  for (const m of text.matchAll(/<(a|link|script|img)\b[^>]*?\b(?:href|src)=["']([^"']+)["']/gi)) {
    const url = m[2];
    if (/^(?:https?:|mailto:|data:|#|javascript:)/i.test(url)) continue;
    let target;
    try {
      const local = decodeURIComponent(url.split(/[?#]/)[0]);
      const relative = path.relative(root, file).split(path.sep).join('/');
      const viteRoot = relative.match(/^(Week11 (?:monday|friday)[\/]project)[\/]/)?.[1];
      target = local.startsWith('/WebProgramming/')
        ? path.join(root, local.slice('/WebProgramming/'.length))
        : local.startsWith('/src/') && viteRoot
          ? path.join(root, viteRoot, local.slice(1))
          : local.startsWith('/')
            ? path.join(root, local.slice(1))
            : path.resolve(path.dirname(file), local);
    } catch {
      fail(file, 'Invalid URL ' + url);
      continue;
    }
    if (!fs.existsSync(target)) {
      if (
        path.relative(root, file).split(path.sep).join('/') === 'week10/index.html' &&
        url === './this-does-not-exist.html'
      )
        continue;
      fail(file, 'Missing local target ' + url);
    }
  }
  for (const m of text.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc=/.test(m[1]) || /type=["']application\//.test(m[1])) continue;
    try {
      new vm.Script(m[2], { filename: file });
      scripts++;
    } catch (e) {
      fail(file, e.message);
    }
  }
}
console.log(`${html} HTML pages, ${scripts} JavaScript sources checked; ${errors} errors.`);
process.exitCode = errors ? 1 : 0;
