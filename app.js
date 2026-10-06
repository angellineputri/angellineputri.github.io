(function () {
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var projects = DATA.projects;
  var tabDefs = [
    { key: 'all', label: 'All' }, { key: 'systems', label: 'Systems' }, { key: 'mobile', label: 'Mobile' },
    { key: 'web', label: 'Web' }, { key: 'games', label: 'Games' }
  ];
  var filter = 'all';

  /* ---------- project filter tabs and cards ---------- */
  function renderTabs() {
    $('tabs').innerHTML = tabDefs.map(function (d) {
      var count = d.key === 'all' ? projects.length : projects.filter(function (p) { return p.cats.indexOf(d.key) > -1; }).length;
      var on = d.key === filter;
      return '<button type="button" data-key="' + d.key + '" aria-pressed="' + on + '" style="cursor: pointer; min-height: 44px; padding: 0 22px; border-radius: 999px; font-size: 17px; background: ' + (on ? 'var(--accent)' : '#FFFFFF') + '; color: ' + (on ? '#FFFFFF' : '#1F2A3A') + '; border: 1px solid ' + (on ? 'var(--accent)' : '#B9C7D8') + '">' + d.label + ' (' + count + ')</button>';
    }).join('');
  }
  function renderCards() {
    var list = projects.filter(function (p) { return filter === 'all' || p.cats.indexOf(filter) > -1; });
    $('cards').innerHTML = list.map(function (p) {
      var tags = p.tags.map(function (t) { return '<span style="background: ' + t.bg + '; padding: 2px 12px; border-radius: 999px; font-size: 14px">' + esc(t.label) + '</span>'; }).join('');
      var shots = p.shots.length ? '<div style="display: flex; gap: 14px; overflow-x: auto; padding: 4px 0 12px">' + p.shots.map(function (s) {
        return '<img class="shot" src="' + s.url + '" alt="' + esc(s.alt) + '" loading="lazy" title="Click to enlarge" style="height: ' + p.shotH + 'px; width: auto; flex: none; border-radius: 18px; border: 1px solid #DCE5EF; cursor: zoom-in">';
      }).join('') + '</div>' : '';
      var links = p.links.map(function (l) {
        var ext = l.href.charAt(0) === '#' ? '' : ' target="_blank" rel="noopener"';
        return '<a href="' + l.href + '"' + ext + ' style="display: inline-flex; align-items: center; min-height: 44px; padding: 0 24px; border-radius: 999px; text-decoration: none; background: ' + l.bg + '; color: ' + l.fg + '; border: 1px solid ' + l.bd + '">' + esc(l.label) + '</a>';
      }).join('');
      var more = p.core ? '<button type="button" class="openCore" style="cursor: pointer; display: inline-flex; align-items: center; min-height: 44px; padding: 0 24px; border-radius: 999px; background: #FFFFFF; color: var(--accent); border: 1px solid var(--accent); font-size: 19px">See everything I studied</button>' : '';
      var note = p.note ? '<p style="margin: 0; color: #4A5A6E; font-size: 15px; font-style: italic">' + esc(p.note) + '</p>' : '';
      return '<article class="lift" style="flex: 1 1 480px; min-width: 0; background: #F3F6FA; border: 1px solid #DCE5EF; border-radius: 26px; overflow: hidden; display: flex; flex-direction: column">' +
        '<div style="background: ' + p.cover + '; padding: 24px 28px; min-height: 150px; display: flex; align-items: flex-end; justify-content: space-between; gap: 16px"><div style="font-style: italic; font-size: 36px; line-height: 1.1">' + esc(p.kind) + '</div><div style="font-size: 18px; letter-spacing: 0.1em">' + p.num + '</div></div>' +
        '<div style="padding: 28px; display: flex; flex-direction: column; gap: 14px; flex: 1">' +
        '<div style="display: flex; flex-wrap: wrap; gap: 8px">' + tags + '</div>' +
        '<h3 style="margin: 0; font-weight: 400; font-size: 30px; line-height: 1.2">' + esc(p.title) + '</h3>' +
        '<p style="margin: 0">' + esc(p.summary) + '</p>' +
        '<p style="margin: 0; color: #4A5A6E; font-size: 17px">' + esc(p.detail) + '</p>' + note + shots +
        '<div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: auto; padding-top: 8px">' + links + more + '</div>' +
        '</div></article>';
    }).join('');
  }
  $('tabs').addEventListener('click', function (e) {
    var b = e.target.closest('button[data-key]');
    if (!b) return;
    filter = b.getAttribute('data-key');
    renderTabs(); renderCards();
  });

  /* ---------- Common Core page ---------- */
  function renderCore() {
    var c = DATA.core;
    var stats = c.stats.map(function (st) {
      return '<div style="background: #EEF2F7; border-radius: 22px; padding: 18px 28px; min-width: 150px"><div style="font-size: 40px; line-height: 1.1; font-style: italic; color: var(--accent)">' + st.value + '</div><div style="font-size: 16px; color: #4A5A6E">' + esc(st.label) + '</div></div>';
    }).join('');
    var groups = c.groups.map(function (g) {
      var items = g.items.map(function (i) {
        var code = i.hasLink ? '<a href="' + i.link + '" target="_blank" rel="noopener" style="color: var(--accent); font-size: 16px">Code</a>' : '';
        return '<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px 20px; padding: 14px 0; border-top: 1px solid #E1E8F0"><div style="flex: 1 1 180px; min-width: 0; font-size: 20px">' + esc(i.name) + '</div><div style="flex: 3 1 320px; min-width: 0; color: #4A5A6E; font-size: 17px">' + esc(i.desc) + '</div><div style="flex: none; display: flex; align-items: center; gap: 12px"><span style="background: ' + i.rbg + '; padding: 2px 14px; border-radius: 999px; font-size: 14px">' + esc(i.result) + '</span>' + code + '</div></div>';
      }).join('');
      return '<div style="background: #FFFFFF; border-radius: 26px; padding: 28px; display: flex; flex-direction: column; gap: 6px"><h3 style="margin: 0; font-weight: 400; font-style: italic; font-size: 28px">' + esc(g.title) + '</h3><p style="margin: 0 0 10px; color: #4A5A6E; font-size: 17px">' + esc(g.blurb) + '</p>' + items + '</div>';
    }).join('');
    var skills = c.skills.map(function (k) {
      return '<div class="lift" style="flex: 1 1 300px; min-width: 0; background: #F3F6FA; border: 1px solid #DCE5EF; border-radius: 22px; padding: 24px; display: flex; flex-direction: column; gap: 8px"><div style="font-style: italic; font-size: 24px">' + esc(k.title) + '</div><div style="color: #4A5A6E; font-size: 17px">' + esc(k.text) + '</div></div>';
    }).join('');
    var gh = 'https://github.com/angellineputri/42-Common-Core';
    $('core').innerHTML =
      '<section style="background: #FFFFFF"><div style="max-width: 1120px; margin: 0 auto; padding: 40px 24px 56px; display: flex; flex-direction: column; align-items: flex-start; gap: 22px">' +
      '<button type="button" class="backHome" style="cursor: pointer; min-height: 44px; padding: 0 22px; border-radius: 999px; background: #FFFFFF; color: #1F2A3A; border: 1px solid #B9C7D8; font-size: 17px">&larr; Back to portfolio</button>' +
      '<div style="font-size: 14px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent)">42 Singapore</div>' +
      '<h1 style="margin: 0; font-weight: 400; font-size: clamp(38px, 6vw, 68px); line-height: 1.08">The <span style="font-style: italic; color: var(--accent)">Common Core</span></h1>' +
      '<p style="margin: 0; max-width: 720px; color: #4A5A6E; font-size: 21px">The common core is the first half of the 42 curriculum. There are no teachers and no lectures. You learn by building projects, testing each other\'s work, and passing peer evaluations. I completed it at 42 Singapore.</p>' +
      '<div style="display: flex; flex-wrap: wrap; gap: 14px; padding-top: 8px">' + stats + '</div>' +
      '<p style="margin: 0; max-width: 720px; color: #4A5A6E; font-size: 16px">Scores: 100/100 is a full pass. 125/125 means the project had a bonus part, and I completed the bonus too.</p>' +
      '<a href="' + gh + '" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 28px; border-radius: 999px; background: var(--accent); color: #FFFFFF; text-decoration: none; font-size: 18px">Source code on GitHub</a>' +
      '</div></section>' +
      '<section style="background: #E4EAF1"><div style="max-width: 1120px; margin: 0 auto; padding: 72px 24px 80px; display: flex; flex-direction: column; gap: 28px">' +
      '<h2 style="margin: 0; font-weight: 400; font-size: clamp(30px, 4vw, 42px); line-height: 1.15">Everything I <span style="font-style: italic; color: var(--accent)">studied</span></h2>' + groups +
      '<div style="background: #FFFFFF; border-radius: 26px; padding: 28px; display: flex; flex-direction: column; gap: 6px"><h3 style="margin: 0; font-weight: 400; font-style: italic; font-size: 28px">Exams</h3><p style="margin: 0; color: #4A5A6E; font-size: 17px">' + esc(c.examNote) + '</p></div>' +
      '</div></section>' +
      '<section style="background: #FFFFFF"><div style="max-width: 1120px; margin: 0 auto; padding: 80px 24px 88px; display: flex; flex-direction: column; gap: 28px">' +
      '<h2 style="margin: 0; font-weight: 400; font-size: clamp(30px, 4vw, 42px); line-height: 1.15">Skills I <span style="font-style: italic; color: var(--accent)">built</span></h2>' +
      '<div style="display: flex; flex-wrap: wrap; gap: 20px">' + skills + '</div>' +
      '<div style="display: flex; flex-wrap: wrap; gap: 12px; padding-top: 12px"><button type="button" class="backHome" style="cursor: pointer; min-height: 48px; padding: 0 28px; border-radius: 999px; background: var(--accent); color: #FFFFFF; border: none; font-size: 18px">&larr; Back to portfolio</button>' +
      '<a href="' + gh + '" target="_blank" rel="noopener" style="display: inline-flex; align-items: center; min-height: 48px; padding: 0 28px; border-radius: 999px; border: 1px solid #B9C7D8; color: #1F2A3A; text-decoration: none; font-size: 18px">Source code on GitHub</a></div>' +
      '</div></section>';
  }

  /* ---------- switch between home and the Common Core page ---------- */
  function show(view, targetId) {
    var core = view === 'core';
    $('home').hidden = core;
    $('core').hidden = !core;
    if (core) { history.replaceState(null, '', '#common-core'); window.scrollTo(0, 0); }
    else {
      history.replaceState(null, '', targetId ? '#' + targetId : location.pathname);
      var el = targetId ? $(targetId) : null;
      if (el) el.scrollIntoView(); else window.scrollTo(0, 0);
    }
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest('.openCore')) { show('core'); return; }
    if (e.target.closest('.backHome')) { show('home', 'projects'); return; }
    var a = e.target.closest('header a[href^="#"]');
    if (a && !$('core').hidden) { e.preventDefault(); var id = a.getAttribute('href').slice(1); show('home', id === 'top' ? '' : id); }
  });

  /* ---------- picture viewer with zoom ---------- */
  var steps = [1, 1.5, 2, 3, 4], zi = 0;
  function applyZoom() {
    var img = $('vImg'), z = steps[zi];
    if (z === 1) { img.style.maxWidth = '100%'; img.style.maxHeight = 'calc(100vh - 100px)'; img.style.width = 'auto'; img.style.objectFit = 'contain'; }
    else { img.style.maxWidth = 'none'; img.style.maxHeight = 'none'; img.style.width = Math.round(z * 90) + 'vw'; }
    img.style.height = 'auto';
    $('zPct').textContent = Math.round(z * 100) + '%';
  }
  function openViewer(src, alt) { $('vImg').src = src; $('vImg').alt = alt || ''; zi = 0; applyZoom(); $('viewer').hidden = false; }
  function closeViewer() { $('viewer').hidden = true; $('vImg').src = ''; }
  $('cards').addEventListener('click', function (e) { var im = e.target.closest('img.shot'); if (im) openViewer(im.getAttribute('src'), im.alt); });
  $('zIn').addEventListener('click', function () { zi = Math.min(steps.length - 1, zi + 1); applyZoom(); });
  $('zOut').addEventListener('click', function () { zi = Math.max(0, zi - 1); applyZoom(); });
  $('zClose').addEventListener('click', closeViewer);
  $('vImg').addEventListener('click', function () { zi = zi === 0 ? 2 : 0; applyZoom(); });
  $('vBg').addEventListener('click', function (e) { if (e.target === e.currentTarget) closeViewer(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeViewer(); });

  /* ---------- copy email ---------- */
  var cb = $('copyBtn');
  if (cb) cb.addEventListener('click', function () {
    var text = 'angellineputri@gmail.com';
    var done = function () { cb.textContent = 'Copied'; setTimeout(function () { cb.textContent = 'Copy email'; }, 2000); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, function () {});
    else { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (err) {} document.body.removeChild(ta); }
  });

  renderTabs(); renderCards(); renderCore();
  if (location.hash === '#common-core') show('core');
})();
