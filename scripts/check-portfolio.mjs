import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { projects, filterProjects } from '../week10/portfolio/src/projects.mjs';

const output = new URL('../.check-portfolio/', import.meta.url);
await mkdir(output, { recursive: true });
const bundle = await build({
  entryPoints: [
    fileURLToPath(new URL('../week10/portfolio/src/PortfolioProjects.jsx', import.meta.url)),
  ],
  bundle: true,
  write: false,
  packages: 'external',
  platform: 'node',
  format: 'esm',
  jsx: 'automatic',
});
const entry = new URL('components.mjs', output);
await writeFile(entry, bundle.outputFiles[0].text);
const {
  default: PortfolioProjects,
  ProjectCard,
  ProjectList,
  FilterBar,
} = await import(entry.href);
const render = (component, props) => renderToStaticMarkup(React.createElement(component, props));

assert.ok(projects.length >= 3);
assert.equal(new Set(projects.map((project) => project.id)).size, projects.length);
for (const project of projects.filter((project) => project.id !== 'editing')) {
  for (const key of ['title', 'description', 'githubUrl', 'demoUrl']) assert.ok(project[key]);
  assert.ok(project.technologies.length > 0);
  assert.ok(render(ProjectCard, { project }).includes(project.title));
}
assert.equal(filterProjects(projects, 'All').length, 5);
assert.deepEqual(
  filterProjects(projects, 'React').map((project) => project.id),
  ['directory'],
);
assert.equal(filterProjects(projects, 'JavaScript').length, 3);
assert.deepEqual(filterProjects(projects, 'Unknown'), []);
assert.match(render(ProjectList, { projects: [] }), /No projects use this technology/);
assert.match(
  render(FilterBar, { technologies: ['All', 'React'], selected: 'React' }),
  /aria-pressed="true"[^>]*>React/,
);
const html = render(PortfolioProjects);
assert.equal((html.match(/class="project-card"/g) || []).length, 5);
assert.equal((html.match(/data-slot="[^"]*" aria-hidden="true"/g) || []).length, 4);
assert.match(render(ProjectCard, { project: projects[0], active: false }), /tabindex="-1"/);
assert.ok(html.includes('SELECTED WORK'));
assert.ok(html.includes('Student Directory'));
console.log(
  'PASS: portfolio React composition, project props, filters, empty state and inactive cards.',
);
