import {installTextReveal} from './text-reveal.mjs?v=20261026';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window) {
 const reveal=installTextReveal(()=>reduced.matches||document.hidden);
 reduced.addEventListener('change',()=>reveal.finishAll());
 document.addEventListener('visibilitychange',()=>reveal.finishAll());
}
