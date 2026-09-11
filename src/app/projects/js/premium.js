// AMIGOS IMMO — Premium interactions

/* ============ CUSTOM CURSOR ============ */
if (window.matchMedia('(pointer:fine)').matches) {
  const dot = document.createElement('div'); dot.className = 'cur-dot';
  const ring = document.createElement('div'); ring.className = 'cur-ring';
  document.body.appendChild(dot); document.body.appendChild(ring);
  let mx=window.innerWidth/2, my=window.innerHeight/2, rx=mx, ry=my;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  const tick = () => {
    rx += (mx-rx)*0.18; ry += (my-ry)*0.18;
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(tick);
  };
  tick();
  const hoverSel = 'a,button,.btn,.chip,.aud,.plan,.case,.tile,.faq-item,.svc-card,.eco-card,.hotspot,.showcase-item,.testi,input,select,label';
  document.addEventListener('mouseover', e => { if (e.target.closest(hoverSel)) { ring.classList.add('hover'); dot.classList.add('hover'); } });
  document.addEventListener('mouseout', e => { if (e.target.closest(hoverSel)) { ring.classList.remove('hover'); dot.classList.remove('hover'); } });
  document.addEventListener('mousedown', () => ring.classList.add('click'));
  document.addEventListener('mouseup', () => ring.classList.remove('click'));
}

/* ============ MAGNETIC BUTTONS ============ */
document.querySelectorAll('.btn, .mag').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width/2;
    const y = e.clientY - r.top - r.height/2;
    el.style.transform = `translate(${x*0.25}px,${y*0.35}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* ============ HERO PARTICLES ============ */
(() => {
  const p = document.querySelector('.hero-particles');
  if (!p) return;
  for (let i=0;i<48;i++){
    const s = document.createElement('i');
    s.style.left = Math.random()*100+'%';
    s.style.animationDuration = (8+Math.random()*16)+'s';
    s.style.animationDelay = (-Math.random()*20)+'s';
    const size = 2 + Math.random()*3;
    s.style.width = size+'px'; s.style.height = size+'px';
    s.style.opacity = (0.45+Math.random()*0.5).toFixed(2);
    p.appendChild(s);
  }
})();

/* ============ PLAY CANVAS — light follows mouse, particles trail ============ */
(() => {
  const c = document.querySelector('.play-canvas');
  if (!c) return;
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const x = ((e.clientX - r.left)/r.width)*100;
    const y = ((e.clientY - r.top)/r.height)*100;
    c.style.setProperty('--mx', x+'%');
    c.style.setProperty('--my', y+'%');
    if (Math.random() < 0.35) {
      const p = document.createElement('span');
      p.className = 'play-particle';
      p.style.left = (e.clientX - r.left)+'px';
      p.style.top = (e.clientY - r.top)+'px';
      c.appendChild(p);
      const dx = (Math.random()-0.5)*60, dy = (Math.random()-0.5)*60-30;
      requestAnimationFrame(() => {
        p.style.transition = 'transform 1.2s cubic-bezier(.2,.8,.2,1), opacity 1.2s ease';
        p.style.transform = `translate(${dx}px,${dy}px) scale(0)`;
        p.style.opacity = '0';
      });
      setTimeout(() => p.remove(), 1300);
    }
  });
})();

/* ============ HOTSPOTS — toggle on click for touch ============ */
document.querySelectorAll('.hotspot').forEach(h => h.addEventListener('click', e => {
  e.stopPropagation();
  document.querySelectorAll('.hotspot.on').forEach(x => x!==h && x.classList.remove('on'));
  h.classList.toggle('on');
}));

/* ============ SERVICES · SCROLL-DRIVEN HORIZONTAL REVEAL ============ */
(() => {
  const section = document.querySelector('.svc-h');
  const track = document.getElementById('svc-track');
  const wrap = section && section.querySelector('.svc-track-wrap');
  if (!section || !track || !wrap) return;
  if (window.matchMedia('(max-width:800px)').matches) return;

  let maxX = 0;
  const measure = () => {
    const trackW = track.scrollWidth;
    const wrapW = wrap.clientWidth;
    maxX = Math.max(0, trackW - wrapW + 48);
  };
  measure();
  window.addEventListener('resize', () => { measure(); update(); });

  let ticking = false;
  const update = () => {
    ticking = false;
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = section.offsetHeight - vh;
    if (total <= 0) return;
    const p = Math.max(0, Math.min(1, -rect.top / total));
    track.style.transform = `translate3d(${-p * maxX}px,0,0)`;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();
