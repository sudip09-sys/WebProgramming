const img = document.querySelector('picture img');
function show() {
  document.getElementById('image-choice').textContent =
    'Browser-selected file: ' +
    img.currentSrc.split('/').pop() +
    ' (device pixel ratio ' +
    devicePixelRatio +
    ').';
}
img.addEventListener('load', show);
if (img.complete) show();
window.addEventListener('resize', show);
