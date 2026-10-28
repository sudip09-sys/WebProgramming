(() => {
  'use strict';
  const prompts = [
    {id:'travel-journal', focus:'html', category:'HTML · Storytelling', time:'15–20 min', title:'A pocket-sized travel journal', prompt:'Build a one-page journal for a place you would love to visit. Use a figure, a caption, and a short itinerary.', twist:'Tell the story using just three headings and one image.', example:'week2/semantic-html/index.html'},
    {id:'recipe', focus:'html', category:'HTML · Structure', time:'15–20 min', title:'A recipe worth passing on', prompt:'Write a recipe page for your favourite meal. Separate ingredients from steps and add an expandable cooking tip.', twist:'Make the instructions easy enough for someone cooking it for the first time.', example:'week2/html-basics/recipe.html'},
    {id:'palette', focus:'css', category:'CSS · Visual play', time:'20–30 min', title:'A colour palette with a mood', prompt:'Design five colour swatches inspired by a song, a season, or a place. Give every colour a name and a hex value.', twist:'Make the same palette work as a tiny mobile poster.', example:'week3/exercises/E3_Color_Palette.html'},
    {id:'hover-postcard', focus:'css', category:'CSS · Motion', time:'20–30 min', title:'A postcard that comes alive', prompt:'Build a postcard component with a corner stamp and a subtle hover transition. Keep the message readable at every size.', twist:'Give keyboard focus the same care as hover, and honour reduced motion.', example:'week3/advanced/combined-component.html'},
    {id:'mood-switch', focus:'js', category:'JavaScript · State', time:'20–30 min', title:'A workspace with two personalities', prompt:'Create a focus-mode switch that changes a card’s colours and message using classList.', twist:'Give each mode a distinct voice while keeping button labels clear.', example:'week4/class-list.html'},
    {id:'tiny-list', focus:'js', category:'JavaScript · DOM', time:'25–35 min', title:'Three tiny wins for today', prompt:'Build a list where you can add, complete, and remove small goals. Use real form controls and show an empty state.', twist:'Celebrate a completed list with one thoughtful sentence instead of a popup.', example:'week4/exercises/index.html'},
    {id:'book-shelf', focus:'js', category:'JavaScript · APIs', time:'30–45 min', title:'A bookshelf for a curious friend', prompt:'Use a book search API to build a themed reading shelf. Display a title, author, and a cover fallback.', twist:'Choose a theme like space, food, or design, then make the empty state feel helpful.', example:'week7/solution.html'},
    {id:'weather-note', focus:'js', category:'JavaScript · APIs', time:'25–35 min', title:'A weather report with a human touch', prompt:'Fetch the weather and show a concise observation with its time and units.', twist:'Add a short outfit suggestion based on temperature, and label it as your own rule.', example:'week6/lessons/weather.html'}
  ];
  const byId = new Map(prompts.map(prompt => [prompt.id, prompt]));
  const focus = document.getElementById('idea-focus');
  const save = document.getElementById('idea-save');
  const status = document.getElementById('idea-status');
  const storageKey = 'sudip-studio-saved-sparks-v1';
  let current = prompts[0];
  let saved = [];
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(stored)) saved = [...new Set(stored.filter(id => byId.has(id)))];
  } catch { /* The mixer also works when browser storage is unavailable. */ }

  function renderSaved() {
    const list = document.getElementById('saved-ideas-list');
    list.replaceChildren();
    document.getElementById('saved-count').textContent = '(' + saved.length + ')';
    document.getElementById('saved-empty').hidden = saved.length > 0;
    saved.forEach(id => {
      const prompt = byId.get(id);
      const item = document.createElement('li');
      const info = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = prompt.title;
      const detail = document.createElement('p');
      detail.textContent = prompt.category + ' · ' + prompt.time;
      const link = document.createElement('a');
      link.href = prompt.example;
      link.textContent = 'Explore the concept ↗';
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', 'Remove ' + prompt.title);
      remove.addEventListener('click', () => {
        saved = saved.filter(value => value !== id);
        const persisted = persist();
        render();
        status.textContent = persisted ? 'Idea removed from your saved sparks.' : 'Removed for this visit. Browser storage is unavailable.';
      });
      info.append(title, detail, link);
      item.append(info, remove);
      list.append(item);
    });
  }

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); return true; }
    catch { return false; }
  }

  function render() {
    for (const key of ['category', 'time', 'title', 'prompt', 'twist']) {
      document.getElementById('idea-' + key).textContent = current[key];
    }
    document.getElementById('idea-example').href = current.example;
    const isSaved = saved.includes(current.id);
    save.textContent = isSaved ? 'Saved ✓' : 'Save idea';
    save.setAttribute('aria-pressed', String(isSaved));
    renderSaved();
  }

  function shuffle() {
    const pool = prompts.filter(prompt => (focus.value === 'all' || prompt.focus === focus.value) && prompt.id !== current.id);
    current = pool[Math.floor(Math.random() * pool.length)];
    render();
    status.textContent = 'New spark: ' + current.title + '.';
  }
  focus.addEventListener('change', shuffle);
  document.getElementById('idea-shuffle').addEventListener('click', shuffle);
  save.addEventListener('click', () => {
    const exists = saved.includes(current.id);
    saved = exists ? saved.filter(id => id !== current.id) : [...saved, current.id];
    const persisted = persist();
    render();
    status.textContent = persisted ? (exists ? 'Idea removed.' : 'Saved for your next practice session.') : 'Kept for this visit. Browser storage is unavailable.';
  });
  render();
})();
