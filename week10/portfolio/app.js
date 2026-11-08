(() => {
  'use strict';
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedTheme;
  try {
    savedTheme = localStorage.getItem('sudip-portfolio-theme');
  } catch {
    // The site also works when browser storage is unavailable.
  }
  function setTheme(theme) {
    root.dataset.theme = theme;
    themeButton.setAttribute('aria-pressed', String(theme === 'light'));
    themeButton.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#0d0d0f' : '#f6f2ed';
  }
  setTheme(savedTheme === 'light' ? 'light' : 'dark');
  themeButton.hidden = false;
  themeButton.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('sudip-portfolio-theme', next);
    } catch {
      // Theme switching does not depend on persistence.
    }
  });

  const filterGroup = document.querySelector('.filters');
  const filterButtons = [...filterGroup.querySelectorAll('button')];
  const projects = [...document.querySelectorAll('.project')];
  const filterStatus = document.getElementById('filter-status');
  filterGroup.hidden = false;
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      let count = 0;
      projects.forEach(project => {
        const visible = button.dataset.filter === 'all' || project.dataset.category === button.dataset.filter;
        project.hidden = !visible;
        if (visible) {
          project.classList.add('is-visible');
          count += 1;
        }
      });
      filterStatus.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
    });
  });

  const skillAreas = {
    web: {
      label: 'WEB DEVELOPMENT',
      title: 'From a blank file to a working page.',
      description: 'HTML for structure, CSS for layout, and JavaScript for the moments when a page needs to respond. I practise through small projects, forms and API-powered apps.',
      tools: ['HTML', 'CSS', 'JavaScript', 'Git & GitHub', 'Responsive layouts', 'Accessibility']
    },
    editing: {
      label: 'VIDEO EDITING',
      title: 'Every frame has a reason to be there.',
      description: 'At LumaCreatives, I work with footage, pacing and color to shape a story. Editing has been part of my work since 2022, alongside my studies.',
      tools: ['Premiere Pro', 'DaVinci Resolve', 'Color grading', 'Visual storytelling', 'Pacing & sound']
    },
    engineering: {
      label: 'ENGINEERING',
      title: 'Understand the problem. Build from there.',
      description: 'I’m studying Computer Engineering at Gachon University. My current foundation includes Python, programming logic, databases and algorithms, with a longer-term interest in biomedical engineering.',
      tools: ['Python', 'Problem solving', 'Algorithms', 'Databases', 'Computer Engineering']
    }
  };
  const skillControls = document.querySelector('.skill-controls');
  const skillButtons = [...skillControls.querySelectorAll('button')];
  const skillList = document.getElementById('skill-list');
  const skillDetail = document.getElementById('skill-detail');
  const skillPanel = document.getElementById('skill-panel');
  const skillDetails = {
    'HTML': 'I use semantic HTML to structure project pages and label form controls.',
    'CSS': 'I use CSS Grid, Flexbox and media queries to build layouts for different screens.',
    'JavaScript': 'JavaScript powers Memory Match game states, form validation and the project filters on this page.',
    'Git & GitHub': 'I practise commits, feature branches, merging and publishing projects with GitHub Pages.',
    'Responsive layouts': 'My layouts adapt from a single column on phones to wider project grids on desktop.',
    'Accessibility': 'I practise keyboard navigation, visible focus, semantic markup and accessible form feedback.',
    'Premiere Pro': 'Premiere Pro is one of the tools I use for video editing at LumaCreatives.',
    'DaVinci Resolve': 'I use DaVinci Resolve as part of my editing and color workflow.',
    'Color grading': 'I work with color to give footage a consistent look and support the story.',
    'Visual storytelling': 'I arrange shots to make the story clear and keep the audience engaged.',
    'Pacing & sound': 'I pay attention to the timing of cuts and how sound supports each moment.',
    'Python': 'Python is part of my programming toolkit as a Computer Engineering student.',
    'Problem solving': 'I break a larger task into smaller steps, then check each part as I build.',
    'Algorithms': 'I study algorithms and practise translating rules into working program logic.',
    'Databases': 'My coursework includes database design, SQL and a Library Management System project.',
    'Computer Engineering': 'I study Computer Engineering at Gachon University in South Korea.'
  };
  let panelAnimation;

  function renderSkillArea(key) {
    const area = skillAreas[key];
    document.getElementById('skill-label').textContent = area.label;
    document.getElementById('skill-title').textContent = area.title;
    document.getElementById('skill-description').textContent = area.description;
    skillDetail.textContent = skillDetails[area.tools[0]];
    skillList.replaceChildren(...area.tools.map((tool, index) => {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.tool = tool;
      button.textContent = tool;
      button.setAttribute('aria-pressed', String(index === 0));
      button.setAttribute('aria-controls', 'skill-detail');
      item.append(button);
      return item;
    }));
  }

  skillList.addEventListener('click', event => {
    const button = event.target.closest('button[data-tool]');
    if (!button) return;
    skillList.querySelectorAll('button').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    skillDetail.textContent = skillDetails[button.dataset.tool];
  });

  skillControls.hidden = false;
  renderSkillArea('web');
  skillButtons.forEach(button => {
    button.addEventListener('click', () => {
      skillButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      renderSkillArea(button.dataset.skill);
      if (!motionPreference.matches && skillPanel.animate) {
        panelAnimation?.cancel();
        panelAnimation = skillPanel.animate([
          { opacity: 0.35, transform: 'translateY(14px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 350, easing: 'ease-out' });
      }
    });
  });

  const revealElements = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !motionPreference.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.1 });
    revealElements.forEach(element => observer.observe(element));
    root.classList.add('motion-ready');
  }

  const progress = document.querySelector('.scroll-progress');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navigationLinks = [...document.querySelectorAll('.site-header nav a')];
  let scrollPending = false;
  function updateScroll() {
    const distance = root.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
    const shift = motionPreference.matches ? 0 : Math.min(window.scrollY * 0.035, 24);
    root.style.setProperty('--masthead-shift', `${shift}px`);
    let activeId = 'home';
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 160) activeId = section.id;
    });
    navigationLinks.forEach(link => {
      if (link.hash === `#${activeId}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scrollPending = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScroll);
  updateScroll();

  const portrait = document.querySelector('[data-tilt]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  portrait.addEventListener('pointermove', event => {
    if (motionPreference.matches || !finePointer.matches) return;
    const bounds = portrait.getBoundingClientRect();
    portrait.style.setProperty('--ry', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 8}deg`);
    portrait.style.setProperty('--rx', `${((event.clientY - bounds.top) / bounds.height - 0.5) * -8}deg`);
  });
  function resetPortrait() {
    portrait.style.setProperty('--rx', '0deg');
    portrait.style.setProperty('--ry', '0deg');
  }
  portrait.addEventListener('pointerleave', resetPortrait);
  motionPreference.addEventListener('change', () => {
    resetPortrait();
    if (motionPreference.matches) root.classList.remove('motion-ready');
  });
})();
