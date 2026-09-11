// AI Price Calculator — real matrix logic
(function(){
  const $ = (id) => document.getElementById(id);
  const type = $('c-type'), surface = $('c-surface');
  const rangeVal = $('c-surface-val'), priceOut = $('c-price'), rangeOut = $('c-range');
  const durOut = $('c-duration'), warrOut = $('c-warranty');
  if (!type) return;

  const typeMul = { apartment:1.0, house:1.2, office:1.1, facade:1.4 };
  const condAdd = { normal:0, mold:0.25, cracks:0.15, nicotine:0.30 };
  const compBase = { walls:24, ceilings:18, doors:8, frames:6, radiators:5, skirting:4 }; // CHF/m² weight
  const addOnMul = { express:0.20, cleaning:0.08 };

  function chipsSelected(id){ return [...document.querySelectorAll('#'+id+' .chip.on')].map(c=>c.dataset.v); }
  function singleSelected(id){ const c = document.querySelector('#'+id+' .chip.on'); return c ? c.dataset.v : null; }

  // Chip behavior
  document.querySelectorAll('#c-comps .chip, #c-add .chip').forEach(c=>c.addEventListener('click',()=>{c.classList.toggle('on');recompute();}));
  document.querySelectorAll('#c-cond .chip, #c-mat .chip').forEach(c=>c.addEventListener('click',()=>{
    c.parentElement.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));
    c.classList.add('on'); recompute();
  }));

  function animateNum(elm, from, to, format){
    const dur = 700, start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      elm.innerHTML = format(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  let lastPrice = 0, lastDur = 0;

  function recompute(){
    const s = parseFloat(surface.value); rangeVal.textContent = s + ' m²';
    const comps = chipsSelected('c-comps');
    const cond = singleSelected('c-cond') || 'normal';
    const mat = singleSelected('c-mat') || 'standard';
    const adds = chipsSelected('c-add');

    const compRate = comps.reduce((a,k)=>a+(compBase[k]||0), 0) || 10;
    let base = compRate * s * typeMul[type.value];
    base *= (1 + condAdd[cond]);
    if (mat === 'premium') base *= 1.35;
    adds.forEach(a => base *= (1 + addOnMul[a]));

    const price = Math.round(base);
    const days = Math.max(2, Math.round((s / 20) * (mat==='premium'?1.15:0.9) * (1+condAdd[cond]) * 10) / 10);
    animateNum(priceOut, lastPrice, price, v => `<span class="currency">CHF</span>${Math.round(v).toLocaleString('de-CH').replace(/,/g,"'")}`);
    animateNum(durOut, lastDur, days, v => `${v.toFixed(1)} <span style="font-size:14px;color:var(--grey)">days</span>`);
    rangeOut.textContent = `Range: CHF ${Math.round(price*0.9).toLocaleString('de-CH').replace(/,/g,"'")} – ${Math.round(price*1.15).toLocaleString('de-CH').replace(/,/g,"'")}`;
    warrOut.textContent = mat === 'premium' ? '12-year warranty' : '5-year warranty';
    lastPrice = price; lastDur = days;
  }
  [type, surface].forEach(i => { i.addEventListener('input', recompute); i.addEventListener('change', recompute); });
  recompute();

  // Dropzone with mock AI analysis
  const dz = $('c-drop'), dzText = $('c-drop-text'), dzPrev = $('c-drop-preview'), dzInput = $('c-drop-input');
  const aiLoad = $('c-ai-load'), aiText = $('c-ai-text');
  if (dz) {
    ['dragenter','dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('drag'); }));
    ['dragleave','drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('drag'); }));
    dz.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
    dz.addEventListener('click', () => dzInput.click());
    dzInput.addEventListener('change', e => handleFiles(e.target.files));
  }
  function handleFiles(files){
    if (!files || !files.length) return;
    const f = files[0];
    dzText.textContent = f.name + ' · ' + (f.size/1024).toFixed(1) + ' KB';
    dzPrev.textContent = '';
    aiLoad.classList.add('on'); aiText.textContent = 'AI is analyzing your plan…';
    setTimeout(()=>{ aiText.textContent = 'Detecting walls & ceilings…'; }, 900);
    setTimeout(()=>{ aiText.textContent = 'Extracting surfaces…'; }, 1800);
    setTimeout(()=>{
      aiLoad.classList.remove('on');
      const detected = 80 + Math.floor(Math.random()*140);
      dzPrev.innerHTML = `✓ Extracted <b style="color:var(--gold)">${detected} m²</b> net surface · ${Math.floor(detected*0.6)} m² walls · ${Math.floor(detected*0.4)} m² ceilings`;
      surface.value = detected; recompute();
    }, 2700);
  }
})();
