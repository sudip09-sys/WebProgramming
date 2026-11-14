import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import {create, beginPreview, endPreview, tick} from '../teamproject/engine.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

for (const path of ['week4/studyhub/script.js', 'Week4_1/script.js']) {
  test(path + ': countdown follows elapsed time and restarts after completion', () => {
    const elements = new Map();
    const document = {querySelector(selector) {
      if (!elements.has(selector)) elements.set(selector, {
        textContent: '', style: {}, listeners: {},
        addEventListener(name, fn) { this.listeners[name] = fn; }
      });
      return elements.get(selector);
    }};
    let now = 0, callback, alerts = 0;
    const context = vm.createContext({document, Date: {now: () => now},
      setInterval: fn => { callback = fn; return 1; },
      clearInterval: () => { callback = null; }, alert: () => alerts++});
    const source = read(path);
    vm.runInContext(source.slice(source.indexOf('const timerDisplay'), source.indexOf('// ---------- PROFILE MODAL')), context);
    const click = selector => document.querySelector(selector).listeners.click();
    const display = () => document.querySelector('#timerDisplay').textContent;
    click('#startTimer'); now += 5500; callback(); assert.equal(display(), '24:55');
    click('#pauseTimer'); now += 60000; assert.equal(display(), '24:55');
    click('#startTimer'); now += 500; callback(); assert.equal(display(), '24:54');
    now += 25 * 60000; callback();
    assert.equal(display(), '00:00'); assert.equal(alerts, 1); assert.equal(callback, null);
    click('#startTimer'); assert.equal(display(), '25:00');
    click('#resetTimer'); assert.equal(display(), '25:00'); assert.equal(callback, null);
  });
}

for (const path of ['week6/jokelab/script.js', 'Week6_Random_Joke_Fetcher/script.js']) {
  test(path + ': discard malformed favourites without losing valid entries', () => {
    const source = read(path);
    let stored = JSON.stringify([null, {}, {id: 1, setup: 'Question', punchline: 'Answer'}]);
    const context = vm.createContext({STORAGE_KEY: 'test', localStorage: {getItem() { return stored; }}});
    vm.runInContext(source.slice(source.indexOf('function readFavourites()'), source.indexOf('function persistFavourites()')), context);
    assert.equal(vm.runInContext('readFavourites().length', context), 1);
    stored = 'invalid JSON'; assert.equal(vm.runInContext('readFavourites().length', context), 0);
    stored = '{}'; assert.equal(vm.runInContext('readFavourites().length', context), 0);
  });
}

test('game preview deducts time elapsed beyond the preview deadline', () => {
  const game = create('easy', 'timed'); beginPreview(game);
  const source = read('teamproject/game.mjs');
  const context = vm.createContext({game, previewEnds: 3000, last: 0,
    performance: {now: () => 8000}, endPreview, tick});
  vm.runInContext(source.slice(source.indexOf('function advance()'), source.indexOf('function render()')), context);
  vm.runInContext('advance()', context);
  assert.equal(game.time, 115); assert.equal(game.phase, 'playing');
});
