(() => {
  'use strict';
  const root = document.documentElement;
  const $ = id => document.getElementById(id);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  const email = 'sudipsah403@gmail.com';
  const readPreference = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const savePreference = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
  let motionRequested = readPreference('sudip-portfolio-motion') !== 'off';
  let motionEnabled = motionRequested && !reducedMotion.matches;
  let theme = readPreference('sudip-portfolio-theme') === 'light' ? 'light' : 'dark';

  function applyTheme() {
    root.dataset.theme = theme;
    $('theme-toggle').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    $('theme-toggle').setAttribute('aria-pressed', String(theme === 'light'));
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#09090c' : '#f6f0ec';
  }
  applyTheme();
  $('theme-toggle').hidden = false;
  $('theme-toggle').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    applyTheme();
    savePreference('sudip-portfolio-theme', theme);
    if (!motionEnabled) paintEmbers(0);
  });

  const menu = $('main-nav');
  const menuButton = $('menu-toggle');
  menuButton.hidden = false;
  function closeMenu(returnFocus = false) {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
  });

  // Project navigation is manual: cards never move away while someone reads them.
  const cards = [...document.querySelectorAll('.project-card')];
  const deck = $('project-deck');
  const stage = document.querySelector('.project-stage');
  const index = document.querySelector('.project-index');
  let selectedFilter = 'all';
  let visibleCards = cards;
  let current = 0;
  deck.tabIndex = 0;
  deck.setAttribute('role', 'region');
  deck.setAttribute('aria-roledescription', 'carousel');
  const projectIndexButtons = cards.map((card, number) => {
    const button = document.createElement('button');
    button.type = 'button';
    const label = document.createElement('span');
    label.textContent = String(number + 1).padStart(2, '0');
    button.append(label, document.createTextNode(card.querySelector('h3').textContent));
    button.setAttribute('aria-controls', 'project-deck');
    button.addEventListener('click', () => setProject(visibleCards.indexOf(card)));
    index.append(button);
    card.addEventListener('click', event => {
      if (visibleCards[current] !== card && visibleCards.includes(card)) {
        event.preventDefault();
        event.stopPropagation();
        setProject(visibleCards.indexOf(card));
      }
    }, true);
    card.addEventListener('pointermove', event => {
      if (!motionEnabled || !finePointer.matches || card !== visibleCards[current]) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 3}deg`);
      card.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 3}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
    return button;
  });

  function setProject(next) {
    const count = visibleCards.length;
    if (!count) return;
    current = (next + count) % count;
    cards.forEach((card, number) => {
      const position = visibleCards.indexOf(card);
      card.hidden = position < 0;
      projectIndexButtons[number].hidden = position < 0;
      const selected = card === visibleCards[current];
      let offset = (position - current + count) % count;
      if (offset === count - 1 && !selected) offset = -1;
      card.dataset.slot = String(offset > 1 ? 2 : offset);
      card.setAttribute('aria-hidden', String(!selected));
      card.querySelectorAll('a, button').forEach(control => {
        if (selected) control.removeAttribute('tabindex');
        else control.tabIndex = -1;
      });
      projectIndexButtons[number].setAttribute('aria-pressed', String(selected));
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
    $('project-position').textContent = `${String(current + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    $('project-prev').disabled = count < 2;
    $('project-next').disabled = count < 2;
    const focusedCard = document.activeElement?.closest('.project-card');
    if (focusedCard && focusedCard !== visibleCards[current]) deck.focus({ preventScroll: true });
  }
  $('project-prev').addEventListener('click', () => setProject(current - 1));
  $('project-next').addEventListener('click', () => setProject(current + 1));
  stage.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setProject(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  let swipeStart;
  stage.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'touch') return;
    swipeStart = { x: event.clientX, y: event.clientY };
  }, { passive: true });
  stage.addEventListener('pointerup', event => {
    if (!swipeStart) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) setProject(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  stage.addEventListener('pointercancel', () => { swipeStart = null; }, { passive: true });
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  filterButtons.forEach(button => button.addEventListener('click', () => {
    selectedFilter = button.dataset.filter;
    visibleCards = cards.filter(card => selectedFilter === 'all' || card.dataset.category === selectedFilter);
    filterButtons.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
    setProject(0);
    $('filter-status').textContent = `${visibleCards.length} ${visibleCards.length === 1 ? 'project' : 'projects'} in this selection.`;
  }));
  document.querySelector('.filters').hidden = false;
  document.querySelector('.deck-controls').hidden = false;
  index.hidden = false;
  setProject(0);

  const projectDetails = {
    memory: { category: 'JAVASCRIPT / TEAM PROJECT', title: 'Memory Match', description: 'A memory game built around clear game phases. Players can practise, race a timer or take turns in a local duel.', features: ['Card matching, scoring, hints and restart behaviour.', 'Separate game-engine logic for checking the rules.', 'Practice, timed challenges and two-player turn handling.'], live: 'https://sudip09-sys.github.io/WebProgramming/teamproject/', source: 'https://github.com/sudip09-sys/WebProgramming/tree/main/teamproject' },
    books: { category: 'OPEN LIBRARY / FETCH API', title: 'Book Search', description: 'A small search interface for Open Library. The interesting part is making each request feel understandable, including when something goes wrong.', features: ['Search by title or author with book covers and publication details.', 'Loading feedback and usable error states.', 'A responsive layout for exploring results on a smaller screen.'], live: 'https://sudip09-sys.github.io/webpro-book-search/', source: 'https://github.com/sudip09-sys/webpro-book-search' },
    jokes: { category: 'ASYNC JAVASCRIPT / LOCAL STORAGE', title: 'JokeLab', description: 'An exercise in requests, feedback and persistence, disguised as a very small comedy club.', features: ['Programming jokes requested from JokeAPI in safe mode.', 'An eight-second timeout prevents a stalled request from trapping the reload button.', 'Favourite jokes stay in browser storage between visits.'], live: 'https://sudip09-sys.github.io/WebProgramming/week6/jokelab/', source: 'https://github.com/sudip09-sys/WebProgramming/tree/main/week6/jokelab' },
    editing: { category: 'LUMACREATIVES / VIDEO EDITING', title: 'The feeling between frames.', description: 'I started editing at LumaCreatives in 2022. I work with the shape of a story: the cuts that move it forward, the color that sets its mood and the sound that holds it together.', features: ['Premiere Pro and DaVinci Resolve are part of my editing toolkit.', 'Pacing, color grading and visual continuity.', 'See the LumaCreatives profile for editing work.'], live: 'https://www.instagram.com/lumacreatives_/' }
  };
  const dialog = $('project-dialog');
  let dialogTrigger;
  document.querySelectorAll('[data-details]').forEach(button => {
    button.hidden = false;
    button.addEventListener('click', () => {
      const data = projectDetails[button.dataset.details];
      dialogTrigger = button;
      $('dialog-category').textContent = data.category;
      $('dialog-title').textContent = data.title;
      $('dialog-description').textContent = data.description;
      $('dialog-features').replaceChildren(...data.features.map(text => {
        const item = document.createElement('li'); item.textContent = text; return item;
      }));
      $('dialog-live').href = data.live;
      $('dialog-live').textContent = data.source ? 'Open project ↗' : 'View editing profile ↗';
      $('dialog-source').hidden = !data.source;
      if (data.source) $('dialog-source').href = data.source;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
      $('dialog-close').focus();
    });
  });
  function closeDialog() {
    if (typeof dialog.close === 'function') dialog.close();
    else { dialog.removeAttribute('open'); dialogTrigger?.focus(); }
  }
  $('dialog-close').addEventListener('click', closeDialog);
  dialog.addEventListener('close', () => dialogTrigger?.focus());
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('keydown', event => { if (event.key === 'Escape' && typeof dialog.close !== 'function') closeDialog(); });

  const skills = {
    editing: [
      ['Premiere Pro', 'Pr', '#291544', '#cd9dff', 'VIDEO EDITING', 'Find the rhythm.', 'Premiere Pro is part of my editing toolkit at LumaCreatives. I work with pacing, footage and sound to shape the flow of a video.', 'https://www.instagram.com/lumacreatives_/', 'Explore my editing profile', 'CUT.'],
      ['DaVinci Resolve', '◉', '#142b34', '#85d9de', 'EDITING & COLOR', 'Give the picture a feeling.', 'I use DaVinci Resolve for editing and working with color. My attention is on consistency, mood and the way one shot sits next to another.', 'https://www.instagram.com/lumacreatives_/', 'Explore my editing profile', 'COLOR.'],
      ['Color grading', '◎', '#352128', '#ffb793', 'VISUAL STORYTELLING', 'Color has a voice.', 'A grade should support the story. I pay attention to skin tones, shot matching and the atmosphere the picture creates.', 'https://www.instagram.com/lumacreatives_/', 'Explore my editing profile', 'FEEL.'],
      ['Pacing & sound', '≋', '#292233', '#cca9ed', 'THE EDIT', 'A cut is also a beat.', 'The rhythm of the edit comes from what you see and what you hear. I look for transitions that feel intentional, even when you hardly notice them.', 'https://www.instagram.com/lumacreatives_/', 'Explore my editing profile', 'RHYTHM.']
    ],
    web: [
      ['HTML', '<>', '#3a211d', '#ffab83', 'SEMANTIC HTML', 'Give the page a structure.', 'I use landmarks, headings and properly labelled controls to make the content understandable and easier to navigate with a keyboard.', 'https://sudip09-sys.github.io/WebProgramming/week8_2/', 'Explore the forms lab', 'BUILD.'],
      ['CSS', '#', '#172f49', '#8bc7ff', 'RESPONSIVE CSS', 'Make the layout respond.', 'Grid, Flexbox and media queries help me build interfaces that fit different screens. Small details such as focus states matter as much as the layout.', 'https://sudip09-sys.github.io/WebProgramming/week3/', 'Explore the CSS coursework', 'SHAPE.'],
      ['JavaScript', 'JS', '#eed34f', '#231e0b', 'DOM & EVENTS', 'Turn a page into an experience.', 'Events and DOM updates connect the interface to its logic. Memory Match is one place I practise keeping interactions and game states in sync.', 'https://sudip09-sys.github.io/WebProgramming/teamproject/', 'Try Memory Match', 'PLAY.'],
      ['APIs', '{}', '#1e3431', '#9bddc4', 'FETCH / ASYNC / AWAIT', 'Make waiting understandable.', 'Book Search and JokeLab practise fetching data, showing loading feedback and handling failed requests without leaving controls stuck.', 'https://sudip09-sys.github.io/WebProgramming/week6/jokelab/', 'Explore JokeLab', 'FETCH.']
    ],
    engineering: [
      ['Python', 'Py', '#183044', '#f3cf65', 'PROGRAMMING', 'Break the problem into steps.', 'Python is part of my programming toolkit as a Computer Engineering student. I use small exercises to build a clearer understanding of how a solution works.', 'https://github.com/sudip09-sys', 'Visit my GitHub', 'SOLVE.'],
      ['Git & GitHub', 'G', '#3d2320', '#ffab94', 'VERSION CONTROL', 'Keep track of the changes.', 'I practise commits, branches and merging, and publish my web projects with GitHub Pages. The history is part of how I learn from each revision.', 'https://github.com/sudip09-sys/git-exercise', 'Explore my Git practice', 'COMMIT.'],
      ['Databases', 'DB', '#272744', '#b7bcff', 'DATABASE SYSTEMS', 'Think in relationships.', 'My Database Systems coursework includes SQL and a Library Management System project. I am building a foundation in schemas, queries and the way data connects.', 'https://github.com/sudip09-sys', 'Visit my GitHub', 'CONNECT.'],
      ['Problem solving', '→', '#2d3122', '#c7df97', 'ENGINEERING MINDSET', 'Make it work. Look again.', 'I break bigger tasks into smaller parts, check the behaviour and revise. That habit carries across coursework, web projects and editing.', 'https://sudip09-sys.github.io/WebProgramming/', 'Explore my coursework', 'LEARN.']
    ]
  };
  const skillTiles = $('skill-tiles');
  function showSkill(data, chosen) {
    skillTiles.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button === chosen)));
    $('skill-label').textContent = data[4];
    $('skill-title').textContent = data[5];
    $('skill-description').textContent = data[6];
    $('skill-link').href = data[7];
    $('skill-link').textContent = data[8] + ' ↗';
    document.querySelector('.detail-watermark').textContent = data[9];
  }
  function showArea(area) {
    document.querySelectorAll('[data-area]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.area === area)));
    skillTiles.replaceChildren(...skills[area].map(data => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'skill-tile';
      button.setAttribute('aria-controls', 'skill-detail');
      const icon = document.createElement('span'); icon.className = 'tool-icon'; icon.textContent = data[1]; icon.setAttribute('aria-hidden', 'true');
      icon.style.setProperty('--icon-bg', data[2]); icon.style.setProperty('--icon-ink', data[3]);
      button.append(icon, document.createTextNode(data[0]));
      button.addEventListener('click', () => showSkill(data, button));
      return button;
    }));
    showSkill(skills[area][0], skillTiles.firstElementChild);
  }
  document.querySelectorAll('[data-area]').forEach(button => button.addEventListener('click', () => showArea(button.dataset.area)));
  document.querySelector('.skill-areas').hidden = false;
  showArea('editing');

  $('copy-email').hidden = false;
  $('copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(email);
      $('copy-status').textContent = 'Email copied. Say hello when you are ready.';
    } catch {
      const range = document.createRange(); const address = document.querySelector('.email-link').firstChild;
      range.setStart(address, 0); range.setEnd(address, email.length);
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      $('copy-status').textContent = 'Select and copy the email address above.';
    }
  });
  const form = $('contact-form');
  form.hidden = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = $('contact-name').value.trim();
    const sender = $('contact-email').value.trim();
    const message = $('contact-message').value.trim();
    if (!name || !message) {
      $('contact-status').textContent = 'Please add your name and a short message.';
      return;
    }
    const draft = document.createElement('a');
    draft.href = `mailto:${email}?subject=${encodeURIComponent('Portfolio enquiry from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + '\nEmail: ' + sender)}`;
    draft.textContent = 'Open the email draft again ↗';
    draft.click();
    $('contact-status').replaceChildren(document.createTextNode('If your email app did not open, '), draft);
  });

  // Decorative canvas: capped particle count and frame rate, no pointer interception.
  const canvas = $('embers');
  let painter;
  try { painter = canvas.getContext('2d'); } catch { painter = null; }
  let width = innerWidth, height = innerHeight, particles = [], animation = 0, lastPaint = 0;
  let pointer = { x: 0, y: 0 };
  function resizeCanvas() {
    width = innerWidth; height = innerHeight;
    if (!painter) return;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    painter.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: width < 700 ? 22 : 48 }, () => ({ x: Math.random() * width, y: Math.random() * height, radius: .5 + Math.random() * 1.4, speed: .12 + Math.random() * .32, drift: Math.random() * .14 - .07, opacity: .15 + Math.random() * .6 }));
    if (!motionEnabled) paintEmbers(0);
  }
  function paintEmbers(delta) {
    if (!painter) return;
    painter.clearRect(0, 0, width, height);
    particles.forEach((particle, number) => {
      if (delta) {
        particle.y -= particle.speed * delta;
        particle.x += particle.drift * delta;
        if (particle.y < -10) { particle.y = height + 10; particle.x = Math.random() * width; }
      }
      painter.globalAlpha = particle.opacity * (motionEnabled ? 1 : .5);
      painter.fillStyle = theme === 'dark' ? (number % 4 ? '#f33748' : '#ff9653') : '#bb1630';
      painter.shadowColor = '#ef263c'; painter.shadowBlur = number % 4 ? 5 : 10;
      const x = particle.x + (motionEnabled ? pointer.x * (number % 3 + 1) : 0);
      const y = particle.y + (motionEnabled ? pointer.y * (number % 3 + 1) : 0);
      painter.beginPath(); painter.ellipse(x, y, particle.radius, particle.radius * 1.6, .65, 0, Math.PI * 2); painter.fill();
    });
    painter.globalAlpha = 1; painter.shadowBlur = 0;
  }
  function animate(now) {
    animation = 0;
    if (!motionEnabled || document.hidden || !painter) return;
    if (now - lastPaint >= 32) {
      paintEmbers(Math.min((now - (lastPaint || now - 32)) / 16.67, 3)); lastPaint = now;
    }
    animation = requestAnimationFrame(animate);
  }
  const revealTargets = [...document.querySelectorAll('.reveal')];
  function applyMotion() {
    motionEnabled = motionRequested && !reducedMotion.matches;
    root.dataset.motion = motionEnabled ? 'on' : 'off';
    const button = $('motion-toggle');
    button.disabled = reducedMotion.matches;
    button.querySelector('span:last-child').textContent = reducedMotion.matches ? 'Reduced motion' : motionEnabled ? 'Pause motion' : 'Resume motion';
    button.setAttribute('aria-pressed', String(!motionEnabled));
    if (animation) cancelAnimationFrame(animation);
    animation = 0; lastPaint = 0;
    cards.forEach(card => { card.style.removeProperty('--tilt-x'); card.style.removeProperty('--tilt-y'); });
    revealTargets.forEach(target => target.classList.toggle('is-pending', motionEnabled && target.getBoundingClientRect().top > innerHeight));
    if (motionEnabled && !document.hidden && painter) animation = requestAnimationFrame(animate);
    else paintEmbers(0);
  }
  $('motion-toggle').hidden = false;
  $('motion-toggle').addEventListener('click', () => {
    motionRequested = !motionRequested;
    savePreference('sudip-portfolio-motion', motionRequested ? 'on' : 'off');
    applyMotion();
  });
  reducedMotion.addEventListener('change', applyMotion);
  document.addEventListener('visibilitychange', applyMotion);
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('pointermove', event => {
    if (!motionEnabled || !finePointer.matches) return;
    pointer = { x: (event.clientX / width - .5) * 3, y: (event.clientY / height - .5) * 3 };
  }, { passive: true });
  const hero = document.querySelector('.hero');
  const heroArt = document.querySelector('.hero-art');
  hero.addEventListener('pointermove', event => {
    if (!motionEnabled || !finePointer.matches) return;
    const rect = hero.getBoundingClientRect();
    heroArt.style.setProperty('--portrait-x', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 10}px`);
    heroArt.style.setProperty('--portrait-y', `${(event.clientY - rect.top - rect.height / 2) / rect.height * 6}px`);
  }, { passive: true });
  hero.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--portrait-x', '0px'); heroArt.style.setProperty('--portrait-y', '0px');
  });
  if ('IntersectionObserver' in window) {
    root.classList.add('has-reveals');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      const below = entry.boundingClientRect.top >= innerHeight * .9;
      entry.target.classList.toggle('is-pending', motionEnabled && !entry.isIntersecting && below);
    }), { threshold: .04 });
    revealTargets.forEach(target => observer.observe(target));
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      menu.querySelectorAll('a').forEach(link => {
        if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-15% 0px -45% 0px', threshold: 0 });
    document.querySelectorAll('#work, #about, #skills, #contact').forEach(section => navObserver.observe(section));
  }
  let scrollFrame = 0;
  function updateProgress() {
    scrollFrame = 0;
    const distance = document.documentElement.scrollHeight - innerHeight;
    const progress = distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0;
    document.querySelector('.reading-progress').style.transform = `scaleX(${progress})`;
  }
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress); }, { passive: true });
  document.querySelector('.skip').addEventListener('click', () => $('main').focus({ preventScroll: true }));
  root.classList.add('is-enhanced');
  resizeCanvas(); applyMotion(); updateProgress();
})();
