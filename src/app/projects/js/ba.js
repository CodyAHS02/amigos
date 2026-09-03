// Before/After slider
document.querySelectorAll('.ba').forEach(root => {
  const wrap = root.querySelector('.ba-after-wrap');
  const handle = root.querySelector('.ba-handle');
  let dragging = false;
  const move = (x) => {
    const rect = root.getBoundingClientRect();
    let p = ((x - rect.left) / rect.width) * 100;
    p = Math.max(0, Math.min(100, p));
    wrap.style.width = p + '%';
    handle.style.left = p + '%';
  };
  root.addEventListener('mousedown', e => { dragging = true; move(e.clientX); });
  window.addEventListener('mousemove', e => { if (dragging) move(e.clientX); });
  window.addEventListener('mouseup', () => dragging = false);
  root.addEventListener('touchstart', e => { dragging = true; move(e.touches[0].clientX); }, { passive: true });
  root.addEventListener('touchmove', e => { if (dragging) move(e.touches[0].clientX); }, { passive: true });
  root.addEventListener('touchend', () => dragging = false);
});
