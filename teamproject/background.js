(() => {
  'use strict';
  const canvas = document.getElementById('embers');
  const button = document.getElementById('motion-toggle');
  const context = canvas.getContext('2d');
  if (!context) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let width,
    height,
    particles,
    frame = 0,
    last = 0,
    paused = false;
  function paint(delta = 0) {
    context.clearRect(0, 0, width, height);
    for (const [index, particle] of particles.entries()) {
      particle.y -= particle.speed * delta;
      if (particle.y < -10) {
        particle.y = height + 10;
        particle.x = Math.random() * width;
      }
      context.globalAlpha = particle.opacity;
      context.fillStyle = index % 4 ? '#f33748' : '#ff9653';
      context.shadowColor = '#ef263c';
      context.shadowBlur = index % 4 ? 5 : 10;
      context.beginPath();
      context.ellipse(
        particle.x,
        particle.y,
        particle.radius,
        particle.radius * 1.6,
        0.65,
        0,
        Math.PI * 2,
      );
      context.fill();
    }
  }
  function animate(now) {
    if (now - last >= 32) {
      paint(Math.min((now - (last || now)) / 16.67, 3));
      last = now;
    }
    frame = requestAnimationFrame(animate);
  }
  function update() {
    cancelAnimationFrame(frame);
    last = 0;
    const stopped = paused || reducedMotion.matches;
    button.textContent = reducedMotion.matches
      ? 'Reduced motion'
      : paused
        ? 'Resume background'
        : 'Pause background';
    button.setAttribute('aria-pressed', String(stopped));
    button.disabled = reducedMotion.matches;
    paint();
    if (!stopped && !document.hidden) frame = requestAnimationFrame(animate);
  }
  function resize() {
    width = innerWidth;
    height = innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: width < 700 ? 22 : 48 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.5 + Math.random() * 1.4,
      speed: 0.12 + Math.random() * 0.32,
      opacity: 0.15 + Math.random() * 0.6,
    }));
    update();
  }
  button.hidden = false;
  button.addEventListener('click', () => {
    paused = !paused;
    update();
  });
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('resize', resize, { passive: true });
  resize();
})();
