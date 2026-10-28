(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const pageMap = {
    'index.html': 'home',
    'studio.html': 'studio',
    'products.html': 'products',
    'labs.html': 'labs',
    'journal.html': 'journal',
    'publishing.html': 'publishing',
    'about.html': 'about',
    'contact.html': 'contact',
    'now.html': 'now',
    'future.html': 'future'
  };

  const searchIndex = [
    ['MindFrame', 'Studio', 'studio-mindframe.html', 'workspace product AI workflows systems thinking'],
    ['HireFrame', 'Studio', 'studio-hireframe.html', 'ATS resume positioning career UX AI product'],
    ['FRAMEBOUND', 'Studio', 'studio-framebound.html', 'creative work identity typography memories photobook'],
    ['TECHFEST 2026', 'Studio', 'studio-techfest-2026.html', 'event design identity creative graphic design'],
    ['AURIX XH1', 'Studio', 'studio-aurix-xh1.html', 'product visual advertising headphones graphic design'],
    ['ReviewFlow AI', 'Studio / Labs', 'studio-reviewflow-ai.html', 'AI workflow prototype automation review decision support'],
    ['MindFrame by TheNeshVerse', 'Product', 'products-mindframe.html', 'digital workspace planning thinking building'],
    ['HireFrame by TheNeshVerse', 'Product', 'products-hireframe.html', 'AI resume builder ATS optimization career'],
    ['ReviewFlow AI', 'Lab', 'labs-reviewflow-ai.html', 'prototype decision support automation'],
    ['Interface plays', 'Lab', 'labs-interface-plays.html', 'web design UX interface clarity'],
    ['Craft automation', 'Lab', 'labs-craft-automation.html', 'automation tools productivity'],
    ['Systems memo', 'Lab', 'labs-systems-memo.html', 'experimental publishing research knowledge system'],
    ['Learning by making', 'Journal', 'journal-learning-by-making.html', 'learning making creative work'],
    ['Choosing clarity', 'Journal', 'journal-choosing-clarity.html', 'systems communication design clarity'],
    ['The AI Mastery Journey', 'Publishing', 'publishing-ai-mastery-journey.html', 'AI learning series publishing'],
    ['The Essentials', 'Vol. I', 'publishing-vol-1.html', 'foundations prompting learning'],
    ['The Power Toolkit', 'Vol. II', 'publishing-vol-2.html', 'applications study creation'],
    ['The Workflow Engine', 'Vol. III', 'publishing-vol-3.html', 'workflows projects process'],
    ['The Master Vault', 'Vol. IV', 'publishing-vol-4.html', 'advanced problem solving technical'],
    ['Studio', 'Page', 'studio.html', 'completed work creative systems projects'],
    ['Products', 'Page', 'products.html', 'product direction useful tools'],
    ['Labs', 'Page', 'labs.html', 'experiments prototypes unfinished ideas'],
    ['Journal', 'Page', 'journal.html', 'ideas observations frameworks'],
    ['Publishing', 'Page', 'publishing.html', 'AI Mastery Journey books'],
    ['About', 'Page', 'about.html', 'Neshakar Murali TheNeshVerse'],
    ['Contact', 'Page', 'contact.html', 'collaborations partnerships build'],
    ['Now', 'Page', 'now.html', 'current building thinking'],
    ['Future Watch', 'Page', 'future.html', 'artificial intelligence robotics spatial computing cybersecurity quantum computing']
  ];

  const currentFile = location.pathname.split('/').pop() || 'index.html';
  const currentPage = pageMap[currentFile] || '';
  $$('.primary-nav a, .footer-bottom nav a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href === currentFile) {
      link.setAttribute('aria-current', 'page');
      link.classList.add('is-current');
    }
  });

  // Theme persistence across all static pages.
  const themeButton = $('.theme-toggle');
  const savedTheme = localStorage.getItem('neshverse-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') {
    document.documentElement.dataset.theme = savedTheme;
  }
  const syncThemeLabel = () => {
    if (!themeButton) return;
    const dark = document.documentElement.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  syncThemeLabel();
  themeButton?.addEventListener('click', () => {
    const dark = document.documentElement.dataset.theme !== 'dark';
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('neshverse-theme', dark ? 'dark' : 'light');
    syncThemeLabel();
  });

  // Mobile navigation.
  const menuButton = $('.mobile-menu');
  const nav = $('#primary-nav');
  const closeMenu = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('is-open');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav?.classList.toggle('is-open', open);
  });
  $$('.primary-nav a').forEach((link) => link.addEventListener('click', closeMenu));

  // Search is local and navigates with real HTML links.
  const dialog = $('#search-dialog');
  const searchInput = $('#search-input');
  const results = $('#search-results');
  const renderSearch = (query = '') => {
    if (!results) return;
    const value = query.trim().toLowerCase();
    if (!value) {
      results.innerHTML = '<p class="search-empty">Try “AI”, “learning” or “design”.</p>';
      return;
    }
    const matches = searchIndex.filter((item) => `${item[0]} ${item[1]} ${item[3]}`.toLowerCase().includes(value)).slice(0, 8);
    results.innerHTML = matches.length
      ? matches.map(([title, type, href]) => `<a class="search-result" href="${href}"><span><strong>${title}</strong><small>${type}</small></span><b>↗</b></a>`).join('')
      : '<p class="search-empty">No matches yet. Try a different word.</p>';
  };
  $$('.search-trigger').forEach((button) => {
    button.addEventListener('click', () => {
      if (!dialog) return;
      dialog.showModal();
      if (searchInput) {
        searchInput.value = '';
        renderSearch('');
        searchInput.focus();
      }
    });
  });
  $('.dialog-close')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  searchInput?.addEventListener('input', () => renderSearch(searchInput.value));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      if (dialog?.open) dialog.close();
    }
    const activeTag = document.activeElement?.tagName || '';
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(activeTag) && !document.activeElement?.isContentEditable) {
      event.preventDefault();
      dialog?.showModal();
      searchInput?.focus();
      renderSearch('');
    }
  });

  // Home Build Lab filter remains interactive without controlling page navigation.
  const filterRow = $('.filter-row[data-filter-group="projects"]');
  const projectGrid = $('#project-grid');
  if (filterRow && projectGrid) {
    const chips = $$('.filter-chip', filterRow);
    const cards = $$('.project-card', projectGrid);
    chips.forEach((chip) => chip.addEventListener('click', () => {
      const filter = (chip.dataset.filter || 'All').toLowerCase();
      chips.forEach((c) => {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
      });
      cards.forEach((card) => {
        const haystack = card.textContent.toLowerCase();
        card.hidden = filter !== 'all' && !haystack.includes(filter);
      });
    }));
  }

  // Light progressive reveal on static pages. Navigation never depends on this.
  const revealItems = $$('.reveal-item');
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  // Do not claim a subscription succeeded unless a real provider confirms it.
  const newsletter = $('#newsletter-form');
  const formStatus = $('#form-status');
  newsletter?.addEventListener('submit', (event) => {
    event.preventDefault();
    const emailInput = $('#newsletter-email');
    if (!emailInput || !emailInput.checkValidity()) {
      emailInput?.reportValidity();
      return;
    }
    if (formStatus) {
      formStatus.textContent = 'Newsletter sign-up is not available yet. No subscription was created.';
    }
  });

  // Ensure back-to-top links always start at the top on static pages.
  $$('.footer-top').forEach((link) => link.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })));
})();
