(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const prev = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const overview = document.querySelector('#overview');
  let current = 0;
  let all = false;
  function render() {
    slides.forEach((slide, index) => { slide.hidden = !all && index !== current; });
    document.querySelector('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    document.querySelector('#progress').style.width = `${(current + 1) / slides.length * 100}%`;
    prev.disabled = current === 0;
    next.disabled = current === slides.length - 1;
  }
  function go(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    history.replaceState(null, '', `#slide-${current + 1}`);
    render();
    if (all) slides[current].scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }
  function readHash() {
    const match = location.hash.match(/^#slide-(\d+)$/);
    go(match ? Number(match[1]) - 1 : 0);
  }
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  overview.addEventListener('click', () => {
    all = !all;
    document.body.classList.toggle('overview', all);
    overview.setAttribute('aria-pressed', String(all));
    overview.textContent = all ? '発表表示' : '一覧表示';
    render();
    if (!all) go(current);
  });
  document.querySelector('#print').addEventListener('click', () => window.print());
  const fullscreen = document.querySelector('#fullscreen');
  if (!document.documentElement.requestFullscreen) fullscreen.hidden = true;
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { fullscreen.textContent = '全画面を利用できません'; }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.textContent = document.fullscreenElement ? '全画面を終了' : '全画面';
  });
  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT|BUTTON|A/.test(event.target.tagName)) return;
    const steps = { ArrowRight: 1, PageDown: 1, ArrowLeft: -1, PageUp: -1 };
    if (event.key in steps) { event.preventDefault(); go(current + steps[event.key]); }
    if (event.key === 'Home') { event.preventDefault(); go(0); }
    if (event.key === 'End') { event.preventDefault(); go(slides.length - 1); }
  });
  window.addEventListener('hashchange', readHash);
  readHash();
})();
