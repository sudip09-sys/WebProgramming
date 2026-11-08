(() => {
  'use strict';
  function mountCourseTheme() {
  const script = document.querySelector('script[data-course-theme]');
  if (!script || document.querySelector('.course-tools')) return;

  const base = new URL('../../', script.src);
  const root = document.documentElement;
  const body = document.body;
  const catalog = window.SudipCourseCatalog || [];
  const pageMode = body.dataset.courseMode;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let tone = 'dark';
  let motionEnabled = !reducedMotion.matches;
  try {
    tone = localStorage.getItem('sudip-course-tone') === 'light' ? 'light' : 'dark';
    motionEnabled = !reducedMotion.matches && localStorage.getItem('sudip-course-motion') !== 'off';
  } catch {
    // Controls also work when browser storage is unavailable.
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function button(text) {
    const node = element('button', '', text);
    node.type = 'button';
    return node;
  }

  const toolbar = element('aside', 'course-tools');
  toolbar.setAttribute('aria-label', 'Coursework tools');
  const home = element('a', '', 'S. LAB');
  home.href = new URL('index.html#coursework', base).href;
  const browseButton = button('Browse tasks');
  const skillsButton = button('Skills');
  const motionButton = button('Motion on');
  const toneButton = button('Light mode');
  toolbar.append(home, browseButton, skillsButton, motionButton, toneButton);
  body.append(toolbar);

  function createDrawer(id, title, trigger) {
    const drawer = element('dialog', 'course-drawer');
    drawer.id = id;
    drawer.setAttribute('aria-labelledby', id + '-title');
    const heading = element('div', 'course-drawer-head');
    const text = element('div');
    text.append(element('p', 'course-kicker', 'SUDIP / WEB PROGRAMMING'));
    const label = element('h2', '', title);
    label.id = id + '-title';
    text.append(label);
    const close = button('Close');
    close.className = 'course-drawer-close';
    close.setAttribute('autofocus', '');
    heading.append(text, close);
    drawer.append(heading);
    body.append(drawer);
    trigger.setAttribute('aria-controls', id);
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.addEventListener('click', () => {
      if (typeof drawer.showModal === 'function') drawer.showModal();
      else drawer.setAttribute('open', '');
      close.focus();
    });
    close.addEventListener('click', () => {
      if (typeof drawer.close === 'function') drawer.close();
      else drawer.removeAttribute('open');
      trigger.focus();
    });
    drawer.addEventListener('close', () => trigger.focus());
    drawer.addEventListener('keydown', event => {
      if (event.key === 'Escape' && typeof drawer.close !== 'function') {
        drawer.removeAttribute('open');
        trigger.focus();
      }
    });
    return drawer;
  }

  const browser = createDrawer('course-task-browser', 'Find your next exercise.', browseButton);
  const searchbar = element('div', 'course-searchbar');
  const searchGroup = element('div');
  const searchLabel = element('label', 'course-search-label', 'Search tasks and projects');
  searchLabel.htmlFor = 'course-task-search';
  const search = element('input');
  search.id = 'course-task-search';
  search.type = 'search';
  search.placeholder = 'Forms, CSS, Book Search…';
  searchGroup.append(searchLabel, search);
  const groupWrapper = element('div');
  const groupLabel = element('label', 'course-search-label', 'Topic');
  groupLabel.htmlFor = 'course-task-group';
  const groupSelect = element('select');
  groupSelect.id = 'course-task-group';
  const groups = ['All topics', ...new Set(catalog.map(item => item.group))];
  groups.forEach((name, index) => {
    const option = element('option', '', name);
    option.value = index === 0 ? '' : name;
    groupSelect.append(option);
  });
  groupWrapper.append(groupLabel, groupSelect);
  searchbar.append(searchGroup, groupWrapper);
  const filters = element('div', 'course-filterbar');
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'Filter tasks and projects');
  const filterButtons = ['All', 'Exercises', 'Projects'].map(label => {
    const control = button(label);
    control.dataset.kind = label === 'All' ? '' : label === 'Exercises' ? 'exercise' : 'project';
    control.setAttribute('aria-pressed', String(label === 'All'));
    filters.append(control);
    return control;
  });
  const count = element('p', 'course-result-count');
  count.setAttribute('role', 'status');
  count.setAttribute('aria-live', 'polite');
  const taskList = element('ul', 'course-task-list');
  browser.append(searchbar, filters, count, taskList);
  let kind = '';

  function renderTasks() {
    const query = search.value.trim().toLowerCase();
    const matches = catalog.filter(item => {
      return (!kind || item.kind === kind) &&
        (!groupSelect.value || item.group === groupSelect.value) &&
        (item.title + ' ' + item.group + ' ' + item.path).toLowerCase().includes(query);
    });
    taskList.replaceChildren(...matches.map(item => {
      const row = element('li');
      const link = element('a');
      const destination = new URL(item.path, base);
      link.href = destination.href;
      if (destination.pathname === window.location.pathname) link.setAttribute('aria-current', 'page');
      link.append(element('small', '', item.group), element('strong', '', item.title));
      row.append(link);
      return row;
    }));
    count.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'item' : 'items'} found` : 'No matches. Try another topic or search.';
  }
  search.addEventListener('input', renderTasks);
  groupSelect.addEventListener('change', renderTasks);
  filterButtons.forEach(control => control.addEventListener('click', () => {
    kind = control.dataset.kind;
    filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === control)));
    renderTasks();
  }));
  browseButton.addEventListener('click', renderTasks);

  const skillDrawer = createDrawer('course-skill-browser', 'Code meets the cut.', skillsButton);
  const profile = element('div', 'course-skill-layout');
  const profileCopy = element('div');
  profileCopy.append(element('h3', '', 'Sudip Sah'), element('p', '', 'Computer Engineering at Gachon University. Video editing at LumaCreatives. Learning through projects.'));
  profile.append(profileCopy);
  const skillTabs = element('div', 'course-skill-tabs');
  skillTabs.setAttribute('role', 'group');
  skillTabs.setAttribute('aria-label', 'Skill areas');
  const skillButtonsGroup = element('div', 'course-skill-buttons');
  const skillDescription = element('p', 'course-skill-description');
  skillDescription.id = 'course-skill-detail';
  skillDescription.setAttribute('role', 'status');
  skillDescription.setAttribute('aria-live', 'polite');
  const skillData = {
    'Web development': {
      'HTML': 'I structure pages with semantic elements, headings and properly labelled form controls.',
      'CSS': 'I use Grid, Flexbox and media queries to make layouts fit different screen sizes.',
      'JavaScript': 'I use events, DOM updates and game states to build interactive projects.',
      'APIs': 'Book Search and JokeLab practise fetching data, loading feedback and error handling.',
      'Accessibility': 'I practise keyboard navigation, focus styles and accessible validation messages.'
    },
    'Video editing': {
      'Premiere Pro': 'Premiere Pro is part of my video editing toolkit at LumaCreatives.',
      'DaVinci Resolve': 'I use DaVinci Resolve for editing and working with color.',
      'Color grading': 'I work with color to give footage a consistent look and support the story.',
      'Pacing': 'I pay attention to the timing of cuts and the relationship between picture and sound.'
    },
    'Engineering': {
      'Python': 'Python is part of my programming toolkit as a Computer Engineering student.',
      'Problem solving': 'I break larger tasks into smaller steps, build them and check the result.',
      'Databases': 'My coursework includes SQL and a Library Management System project.',
      'Git': 'I practise commits, branches, merging and publishing code with GitHub Pages.'
    }
  };

  function showSkillArea(name) {
    const skills = Object.entries(skillData[name]);
    skillTabs.querySelectorAll('button').forEach(control => control.setAttribute('aria-pressed', String(control.textContent === name)));
    skillButtonsGroup.replaceChildren(...skills.map(([label, description], index) => {
      const control = button(label);
      control.setAttribute('aria-pressed', String(index === 0));
      control.setAttribute('aria-controls', 'course-skill-detail');
      control.addEventListener('click', () => {
        skillButtonsGroup.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === control)));
        skillDescription.textContent = description;
      });
      return control;
    }));
    skillDescription.textContent = skills[0][1];
  }
  Object.keys(skillData).forEach(name => {
    const control = button(name);
    control.addEventListener('click', () => showSkillArea(name));
    skillTabs.append(control);
  });
  skillDrawer.append(profile, skillTabs, skillButtonsGroup, skillDescription);
  showSkillArea('Web development');

  if (pageMode === 'page') {
    const heading = document.querySelector('h1');
    if (heading && !heading.closest('.demo, .project-art, .card-art')) heading.classList.add('course-outlined');
  }

  const currentRoute = window.location.pathname.slice(base.pathname.length);
  const heading = document.querySelector('h1');
  if (heading && currentRoute !== '' && currentRoute !== 'index.html') {
    const banner = element('div', 'course-banner');
    const copy = element('div');
    copy.append(element('p', 'course-kicker', 'SUDIP / WEB LAB'));
    copy.append(element('p', 'course-banner-title', (body.dataset.courseGroup || 'COURSEWORK').toUpperCase()));
    banner.append(copy);
    const main = heading.closest('main');
    if (main) main.prepend(banner);
    else body.insertBefore(banner, heading.closest('body > *') || body.firstChild);
  }

  const originalThemeButton = pageMode === 'page' ? document.getElementById('theme-toggle') : null;
  function applyTone() {
    root.dataset.courseTone = tone;
    if (pageMode === 'page') root.dataset.theme = tone;
    if (originalThemeButton) {
      originalThemeButton.textContent = tone === 'dark' ? 'Light mode' : 'Dark mode';
      originalThemeButton.setAttribute('aria-pressed', String(tone === 'dark'));
    }
    toneButton.textContent = tone === 'dark' ? 'Light mode' : 'Dark mode';
    toneButton.setAttribute('aria-pressed', String(tone === 'light'));
  }
  applyTone();
  function toggleTone() {
    tone = tone === 'dark' ? 'light' : 'dark';
    applyTone();
    try { localStorage.setItem('sudip-course-tone', tone); } catch {}
  }
  toneButton.addEventListener('click', toggleTone);
  if (originalThemeButton) originalThemeButton.addEventListener('click', event => {
    event.stopImmediatePropagation();
    toggleTone();
  }, true);

  const revealTargets = pageMode === 'page'
    ? [...document.querySelectorAll('main > section, .grid > article, .project-grid > article, .lesson-list > li, .cards > li, .about-copy')]
    : [];
  let observer;
  if ('IntersectionObserver' in window && revealTargets.length) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const belowViewport = entry.boundingClientRect.top >= window.innerHeight * .8;
        entry.target.classList.toggle('course-pending', motionEnabled && !entry.isIntersecting && belowViewport);
      });
    }, { threshold: .06 });
    revealTargets.forEach(target => {
      target.classList.add('course-reveal');
      observer.observe(target);
    });
  }

  function applyMotion() {
    if (reducedMotion.matches) motionEnabled = false;
    motionButton.textContent = reducedMotion.matches ? 'Reduced motion' : motionEnabled ? 'Motion on' : 'Motion off';
    motionButton.disabled = reducedMotion.matches;
    motionButton.setAttribute('aria-pressed', String(motionEnabled));
    revealTargets.forEach(target => {
      const belowViewport = target.getBoundingClientRect().top > window.innerHeight;
      target.classList.toggle('course-pending', motionEnabled && belowViewport);
    });
  }
  applyMotion();
  motionButton.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    applyMotion();
    try { localStorage.setItem('sudip-course-motion', motionEnabled ? 'on' : 'off'); } catch {}
  });
  reducedMotion.addEventListener('change', () => {
    motionEnabled = !reducedMotion.matches;
    applyMotion();
  });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountCourseTheme, { once: true });
  else mountCourseTheme();
})();
