import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { build } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

async function load(name) {
  const outDir = `.check/${name}`;
  const bundle = await build({ configFile: false, logLevel: 'silent', build: { ssr: `src/${name}.jsx`, outDir, emptyOutDir: true } });
  const entry = bundle.output.find(chunk => chunk.type === 'chunk' && chunk.isEntry);
  return import(pathToFileURL(resolve(outDir, entry.fileName)).href);
}
const render = (component, props = {}, children) => renderToStaticMarkup(React.createElement(component, props, children));
const app = await load('App');
const directory = render(app.default);
assert.equal((directory.match(/class="profile-card"/g) || []).length, 3);
for (const id of ['202637610', '202637724', '202637684']) assert.ok(directory.includes(id));
assert.equal((directory.match(/<strong>Major:<\/strong> Computer Engineering/g) || []).length, 3);
const product = await load('ProductCard');
assert.ok(render(product.ProductCard, { name: 'Earbuds', price: 89000, rating: 4.5, inStock: true }).includes('89,000원'));
assert.ok(render(product.ProductCard, { name: 'Earbuds', price: 89000, rating: 4.5, inStock: true }).includes('4.5 / 5 stars'));
assert.ok(render(product.ProductCard, { name: 'Keyboard', price: 69000, rating: 4.2, inStock: false }).includes('Out of Stock'));
const course = await load('CourseCatalog');
const catalog = render(course.default);
assert.ok(render(course.CourseCard, { title: 'Required demo', credits: 3, required: true }).includes('필수 · Required'));
assert.ok(render(course.CourseCard, { title: 'Elective demo', credits: 1, required: false }).includes('선택 · Elective'));
for (const [title, credits] of [['Operating Systems', 3], ['Artificial Intelligence', 2], ['Discrete Mathematics', 3], ['College English', 1]]) {
  assert.equal(course.courses.find(c => c.title === title)?.credits, credits);
  assert.ok(catalog.includes(title));
}
assert.ok(catalog.includes('<strong>1</strong> credit'));
assert.equal((render(product.default).match(/class="catalog-card product-card"/g) || []).length, 9);
const gallery = await load('Gallery');
assert.equal((render(gallery.ProjectList, { projects: gallery.projects }).match(/class="catalog-card gallery-card"/g) || []).length, 3);
const reactProjects = gallery.projects.filter(project => project.technologies.includes('React'));
assert.equal(reactProjects.length, 1);
assert.ok(render(gallery.ProjectList, { projects: reactProjects }).includes('Student Directory'));
assert.ok(render(gallery.ProjectList, { projects: [] }).includes('No projects match'));
const practice = await load('practice');
assert.ok(render(practice.ProfileCard, { name: 'Test', role: 'Student', email: 'test@invalid.local' }).includes('./avatar.svg'));
assert.ok(render(practice.Card, { title: 'Wrapper' }, React.createElement('p', null, 'Nested content')).includes('<p>Nested content</p>'));
console.log('PASS: three confirmed student cards; KRW price and rating; out-of-stock branch; required/elective courses; gallery lists and empty state; default avatar and children.');

const examples = await load('Examples');
assert.ok(render(examples.GradeCard, { student: { id: 'demo', name: 'Sample', score: 60 } }).includes('Pass'));
assert.ok(render(examples.GradeCard, { student: { id: 'demo', name: 'Sample', score: 59 } }).includes('Fail'));
assert.equal(render(examples.Alert, { type: 'info', message: '' }), '');
assert.ok(render(examples.StudentList).includes('202637684'));
console.log('PASS: grade threshold boundary, empty alert, and keyed student list.');
