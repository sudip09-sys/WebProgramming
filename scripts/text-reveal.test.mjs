import test from 'node:test';import assert from 'node:assert/strict';import {scrambleFrame} from '../assets/js/text-reveal.mjs';
test('text begins as code, changes phases, then resolves exactly',()=>{const text='Small tools. Big possibilities.';const a=scrambleFrame(text,0,0),b=scrambleFrame(text,0,1);assert.notEqual(a,text);assert.notEqual(a,b);assert.equal(a.length,text.length);assert.equal(scrambleFrame(text,1),text);assert.equal(scrambleFrame(text,2),text)});
test('partial decoding resolves the beginning and preserves spaces',()=>{const text='Build useful things';const result=scrambleFrame(text,.6,3);assert.ok(result.startsWith('Build'));assert.equal(result[5],' ');assert.equal(result[12],' ');assert.notEqual(result,text)});
test('empty text and unicode resolve without losing characters',()=>{assert.equal(scrambleFrame('',0),'');assert.equal(scrambleFrame('Café → ideas',1),'Café → ideas');assert.equal(Array.from(scrambleFrame('A 🌟 B',.5)).length,5)});

import {scrambleGlyphs} from '../assets/js/text-reveal.mjs';
test('unsettled glyphs use the portrait palette and settled text clears every tint',()=>{const text='Build 🌟 ideas';const cells=scrambleGlyphs(text,0);assert.deepEqual(new Set(cells.filter(c=>c.tint).map(c=>c.tint)),new Set(['cyan','violet','pink']));assert.equal(cells[5].tint,'');assert.ok(scrambleGlyphs(text,1).every(c=>!c.tint));assert.equal(scrambleGlyphs(text,1).map(c=>c.char).join(''),text);assert.ok(scrambleGlyphs(text,.7).slice(0,6).every(c=>!c.tint));});

import {wordParts} from '../assets/js/text-reveal.mjs';
test('word overlays preserve every space and Unicode character in body copy',()=>{for(const text of ['', 'Useful little tools. Playful experiments.', 'Café 🌟  ideas\nnew\tline']){const parts=wordParts(text);assert.equal(parts.join(''),text);assert.ok(parts.every(p=>/^\s+$/.test(p)||!p.trim().includes(' ')));}});
