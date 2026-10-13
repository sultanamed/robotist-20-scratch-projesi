(() => {
  const projects = [...document.querySelectorAll('.project')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#search');
  const notice = document.querySelector('#download-notice');
  let level = 'all';
  const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
  const motionToggle = document.querySelector('#motion-toggle');
  const previews = [...document.querySelectorAll('img[data-gif]')];
  const inView = new Set();
  let paused = motionPreference.matches;
  function syncPreviews() {
    previews.forEach(img => {
      const play = !paused && !document.hidden && !img.closest('.project').hidden && inView.has(img);
      const source = play ? img.dataset.gif : img.dataset.still;
      if (img.getAttribute('src') !== source) img.src = source;
    });
    motionToggle.textContent = paused ? '▶ Önizlemeleri oynat' : 'Ⅱ Önizlemeleri durdur';
    motionToggle.setAttribute('aria-pressed', String(paused));
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => isIntersecting ? inView.add(target) : inView.delete(target));
    syncPreviews();
  }, {threshold: 0.05});
  previews.forEach(img => observer.observe(img));
  motionToggle.addEventListener('click', () => { paused = !paused; syncPreviews(); });
  motionPreference.addEventListener('change', event => { paused = event.matches; syncPreviews(); });
  document.addEventListener('visibilitychange', syncPreviews);
  syncPreviews();
  const normalize = value => value.toLocaleLowerCase('tr-TR').replaceAll('ı', 'i').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  function update() {
    const query = normalize(search.value.trim());
    let count = 0;
    projects.forEach(project => {
      const visible = (level === 'all' || project.dataset.level === level) && normalize(project.dataset.search).includes(query);
      project.hidden = !visible;
      if (visible) count++;
    });
    document.querySelector('#result-count').textContent = `${count} proje`;
    document.querySelector('#empty').hidden = count !== 0;
    syncPreviews();
    filters.forEach(button => {
      const active = button.dataset.filter === level;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  filters.forEach(button => button.addEventListener('click', () => { level = button.dataset.filter; update(); }));
  search.addEventListener('input', update);
  document.querySelector('#clear-search').addEventListener('click', () => { level = 'all'; search.value = ''; update(); search.focus(); });
  document.querySelectorAll('a[download]').forEach(link => link.addEventListener('click', () => { notice.hidden = false; }));
  notice.querySelector('button').addEventListener('click', () => { notice.hidden = true; });
})();
