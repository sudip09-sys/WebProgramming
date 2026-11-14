/* Decorative companions load after the page, leaving game and navigation first. */
(() => {
  const script = document.currentScript;
  if (!script) return;
  const url = new URL('../optimized/spider.min.js?v=20261103-clean', script.src).href;
  const load = () => {
    if (document.querySelector('script[data-sudip-spider]')) return;
    const companion = document.createElement('script');
    companion.src = url;
    companion.async = true;
    companion.dataset.sudipSpider = '';
    document.body.append(companion);
  };
  const schedule = () => {
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 1500 });
    else setTimeout(load, 0);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
})();
