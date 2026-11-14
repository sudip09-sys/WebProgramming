const events = (window.practiceTimeline = window.practiceTimeline || []);
events.push({
  name: 'deferred app executed; document.readyState=' + document.readyState,
  time: performance.now(),
});
document.getElementById('script-status').textContent =
  'The DOM was ready when the deferred app script ran.';
document.getElementById('dom-ready').textContent = String(
  Boolean(document.getElementById('script-status')),
);
function render() {
  document.getElementById('analytics-status').textContent = window.practiceAnalytics?.executed
    ? 'Executed independently; no data sent.'
    : 'Waiting for async download.';
  document.getElementById('load-events').replaceChildren(
    ...events.map((event) => {
      const item = document.createElement('li');
      item.textContent = event.name + ' at ' + event.time.toFixed(1) + ' ms';
      return item;
    }),
  );
}
window.addEventListener('practice-analytics-ready', render);
render();
document.addEventListener(
  'DOMContentLoaded',
  () => {
    events.push({ name: 'DOMContentLoaded', time: performance.now() });
    render();
  },
  { once: true },
);
let clicks = 0;
document
  .getElementById('script-action')
  .addEventListener(
    'click',
    () =>
      (document.getElementById('click-status').textContent =
        'Button activated ' + ++clicks + ' time(s).'),
  );
