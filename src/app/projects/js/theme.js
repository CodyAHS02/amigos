// AMIGOS IMMO — Theme toggle (Dark default / Light)
// - Respects saved preference (localStorage) then system prefers-color-scheme
// - Injects a Sun/Moon toggle into .site-header (before .btn if present)
// - Persists user choice; smooth transitions handled in theme.css

(function () {
  const STORAGE_KEY = 'amigos-theme';
  const root = document.documentElement;

  function systemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'light'
      : 'dark';
  }

  function getInitialTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) {}
    return systemPref();
  }

  function applyTheme(theme, { animate = true } = {}) {
    if (!animate) root.classList.add('theme-no-transition');
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    if (!animate) {
      // Force reflow then re-enable transitions
      // eslint-disable-next-line no-unused-expressions
      root.offsetHeight;
      requestAnimationFrame(() => root.classList.remove('theme-no-transition'));
    }
  }

  // Apply BEFORE DOM ready to avoid flash
  applyTheme(getInitialTheme(), { animate: false });

  function buildToggle() {
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Toggle color theme');
    btn.setAttribute('title', 'Toggle theme');
    btn.innerHTML = `
      <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>
      </svg>
      <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4"/>
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>
      </svg>
    `;
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
    return btn;
  }

  function inject() {
    const header = document.querySelector('.site-header');
    if (!header || header.querySelector('.theme-toggle')) return;
    const toggle = buildToggle();
    // Place toggle just before the header's trailing CTA (Customer Portal), if any
    const trailingBtn = header.querySelector(':scope > .btn');
    if (trailingBtn) {
      const wrap = document.createElement('div');
      wrap.className = 'header-right';
      header.insertBefore(wrap, trailingBtn);
      wrap.appendChild(toggle);
      wrap.appendChild(trailingBtn);
    } else {
      header.appendChild(toggle);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  // React to OS changes only when user hasn't manually chosen
  if (window.matchMedia) {
    const mm = window.matchMedia('(prefers-color-scheme: light)');
    const handler = (e) => {
      let saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
      if (saved !== 'light' && saved !== 'dark') {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    };
    if (mm.addEventListener) mm.addEventListener('change', handler);
    else if (mm.addListener) mm.addListener(handler);
  }
})();
