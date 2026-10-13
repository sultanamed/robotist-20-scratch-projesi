(() => {
  const projects = [...document.querySelectorAll('.project')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const search = document.querySelector('#search');
  const notice = document.querySelector('#download-notice');
  let level = 'all';
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
