// AMIGOS IMMO - shared interactions

// Sticky header
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Scroll-driven "Why AMIGOS" timeline fill
(() => {
  const fill = document.getElementById('tl-fill');
  const tl = document.querySelector('.tl');
  const items = document.querySelectorAll('.tl-item');
  if (!fill || !tl) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.35 });
  items.forEach(i => io.observe(i));
  const onScroll = () => {
    const rect = tl.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.7;
    const end = vh * 0.2;
    const total = rect.height + (start - end);
    const scrolled = Math.min(Math.max(start - rect.top, 0), total);
    const p = Math.min(1, scrolled / rect.height);
    fill.style.height = (p * 100) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// Reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      // Trigger counters
      e.target.querySelectorAll('[data-count]').forEach(el => {
        if (el.dataset.done) return;
        el.dataset.done = '1';
        const target = parseFloat(el.dataset.count);
        const dur = 1600;
        const start = performance.now();
        const step = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = target >= 100 ? Math.round(val).toLocaleString() : val.toFixed(1);
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target >= 100 ? Math.round(target).toLocaleString() : String(target);
        };
        requestAnimationFrame(step);
      });
      // Trigger progress bars
      e.target.querySelectorAll('[data-fill]').forEach(el => {
        el.style.width = el.dataset.fill + '%';
      });
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, section').forEach(el => {
  el.classList.add('reveal');
  io.observe(el);
});

// Cursor glow
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

// Active nav
const path = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(a => {
  if ((a.getAttribute('href') || '').endsWith(path)) a.classList.add('active');
});

// FAQ
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.q').addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    item.parentElement.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Tabs (generic)
document.querySelectorAll('[data-tabs]').forEach(root => {
  const tabs = root.querySelectorAll('.tab');
  const panels = root.querySelectorAll('.tab-panel');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x => x.classList.remove('on'));
    panels.forEach(x => x.classList.remove('on'));
    t.classList.add('on');
    const target = root.querySelector('.tab-panel[data-panel="' + t.dataset.tab + '"]');
    if (target) target.classList.add('on');
  }));
});

// Case study expand
document.querySelectorAll('.case').forEach(c => c.addEventListener('click', () => c.classList.toggle('open')));

// Cursor trail — soft gold brush trail
if (window.matchMedia('(pointer:fine)').matches) {
  let last = 0;
  document.addEventListener('mousemove', e => {
    const now = performance.now();
    if (now - last < 30) return; last = now;
    const t = document.createElement('div');
    t.className = 'trail';
    t.style.left = e.clientX + 'px'; t.style.top = e.clientY + 'px';
    document.body.appendChild(t);
    requestAnimationFrame(()=>{
      t.style.transition = 'opacity .8s ease, transform .8s ease';
      t.style.opacity = '0';
      t.style.transform = 'translate(-50%,-50%) scale(3)';
    });
    setTimeout(()=>t.remove(), 900);
  });
}
