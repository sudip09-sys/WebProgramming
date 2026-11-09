import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../week6/jokelab/script.js', import.meta.url), 'utf8');

function app(fetch) {
  class Element {
    constructor() { this.textContent = ''; this.children = []; this.listeners = {}; this.attributes = {}; this.disabled = false; }
    addEventListener(type, fn) { this.listeners[type] = fn; }
    setAttribute(name, value) { this.attributes[name] = value; }
    querySelector(selector) { return this.parts[selector]; }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.append(child); }
    replaceChildren(...children) { this.children = children; }
    click() { if (!this.disabled) return this.listeners.click?.({ preventDefault() {} }); }
  }
  const elements = new Map();
  const get = id => { if (!elements.has(id)) elements.set(id, new Element()); return elements.get(id); };
  get('load-joke').parts = { '.button-icon': new Element(), 'span:nth-child(2)': new Element() };
  const storage = new Map();
  const timers = new Map();
  let nextTimer = 0;
  const context = vm.createContext({
    document: { getElementById: get, createElement: () => new Element() },
    fetch, AbortController,
    setTimeout(fn, ms) { timers.set(++nextTimer, { fn, ms }); return nextTimer; },
    clearTimeout(id) { timers.delete(id); },
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    console: { error() {} }, window: { scrollTo() {} }
  });
  vm.runInContext(source, context);
  return { get, timers, storage };
}

const joke = (id = 1) => ({ error: false, type: 'twopart', id, setup: 'Why did the developer smile?', delivery: 'The tests passed.' });
const response = data => ({ ok: true, json: async () => data });

test('reload requests another joke and favourites survive subsequent reloads', async () => {
  let requests = 0;
  const ui = app(async (url, options) => {
    assert.match(url, /v2\.jokeapi\.dev/);
    assert.match(url, /safe-mode/);
    assert.equal(options.cache, 'no-store');
    return response(joke(++requests));
  });
  await ui.get('load-joke').click();
  assert.equal(ui.get('setup').textContent, joke().setup);
  assert.equal(ui.get('punchline').textContent, joke().delivery);
  assert.equal(ui.get('load-joke').disabled, false);
  assert.equal(ui.get('spinner').hidden, true);
  ui.get('save-favourite').click();
  ui.get('save-favourite').click();
  assert.equal(ui.get('favourites-list').children.length, 1);
  await ui.get('load-joke').click();
  assert.equal(requests, 2);
  assert.equal(ui.get('joke-number').textContent, 'NO. 002');
  assert.equal(ui.get('favourites-list').children.length, 1);
  assert.equal(JSON.parse(ui.storage.get('randomJokeFavourites'))[0].id, 'jokeapi-1');
  assert.equal(ui.timers.size, 0);
});

for (const [name, fetch] of [
  ['HTTP failure', async () => ({ ok: false, status: 503 })],
  ['network failure', async () => { throw new TypeError('Failed to fetch'); }],
  ['malformed data', async () => response({ error: false, type: 'twopart', setup: 'Missing punchline' })],
  ['API error payload', async () => response({ error: true, message: 'Unavailable' })]
]) {
  test(name + ' restores the reload button and does not allow saving an empty joke', async () => {
    const ui = app(fetch);
    await ui.get('load-joke').click();
    assert.equal(ui.get('load-joke').disabled, false);
    assert.equal(ui.get('load-joke').attributes['aria-busy'], 'false');
    assert.equal(ui.get('spinner').hidden, true);
    assert.equal(ui.get('save-favourite').disabled, true);
    assert.equal(ui.get('joke-content').hidden, true);
    assert.equal(ui.get('error-message').hidden, false);
    assert.equal(ui.timers.size, 0);
  });
}

test('a stalled request times out, blocks duplicate clicks and can be retried', async () => {
  let requests = 0;
  const ui = app((url, { signal }) => {
    if (++requests > 1) return Promise.resolve(response(joke()));
    return new Promise((resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Timed out', 'AbortError'))));
  });
  const pending = ui.get('load-joke').click();
  ui.get('load-joke').click();
  assert.equal(requests, 1);
  assert.equal(ui.get('spinner').hidden, false);
  const timeout = [...ui.timers.values()][0];
  assert.equal(timeout.ms, 8000);
  timeout.fn();
  await pending;
  assert.match(ui.get('error-message').textContent, /took too long/);
  assert.equal(ui.get('load-joke').disabled, false);
  await ui.get('load-joke').click();
  assert.equal(ui.get('error-message').hidden, true);
  assert.equal(ui.get('joke-content').hidden, false);
  assert.equal(ui.get('save-favourite').disabled, false);
});
