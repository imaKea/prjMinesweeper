(function () {
  'use strict';

  const ui = window.MF_UI;
  const api = window.MF_API;
  const routes = (window.MF_CONFIG && window.MF_CONFIG.ROUTES) || {};
  if (!ui.requireSession()) return;
  ui.initHeader();

  const { MODES, DIFFICULTIES } = window.MinefieldEngine;
  const $ = (id) => document.getElementById(id);

  const prefs = api.getPrefs();
  let mode = MODES[prefs.mode] ? prefs.mode : (MODES.classic ? 'classic' : Object.keys(MODES)[0]);
  let difficulty = DIFFICULTIES[prefs.difficulty] ? prefs.difficulty : (DIFFICULTIES.medium ? 'medium' : Object.keys(DIFFICULTIES)[0]);

  // ---- Game mode cards
  const grid = $('mode-grid');
  grid.innerHTML = Object.values(MODES).map((m, idx) =>
    '<button type="button" class="mode-card anim-fade-up" style="animation-delay:' + (idx * 80) + 'ms" role="radio" aria-checked="false" data-mode="' + ui.esc(m.id) + '">' +
      ui.patternTile(m.id) +
      '<span class="mode-card__text"><strong>' + ui.esc(m.label) + '</strong><small>' + ui.esc(m.hint) + '</small></span>' +
      '<span class="radio" aria-hidden="true"></span>' +
    '</button>').join('');

  function paintModes() {
    grid.querySelectorAll('.mode-card').forEach((c) => {
      const on = c.dataset.mode === mode;
      c.classList.toggle('is-selected', on);
      c.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.mode-card');
    if (!card) return;
    mode = card.dataset.mode;
    paintModes();
    refreshTopTime();
  });

  // ---- Difficulty
  const diffSeg = ui.segmented($('diff-seg'),
    Object.values(DIFFICULTIES).map((d) => ({ value: d.id, label: d.label + ' · ' + d.cols + '×' + d.rows })),
    difficulty,
    (v) => { difficulty = v; refreshTopTime(); });

  // ---- Top time (kỷ lục nhanh nhất của chế độ + độ khó đang chọn)
  let topReq = 0;
  async function refreshTopTime() {
    const id = ++topReq;
    let val = null;
    try {
      val = await api.getBestTime({ mode: mode, difficulty: difficulty });
    } catch (e) {
      val = null;
    }
    if (id !== topReq) return;
    $('toptime-label').textContent = 'Kỷ lục · ' + MODES[mode].label;
    $('toptime-value').textContent = ui.formatTime(val);
    $('toptime').title = 'Kỷ lục ' + DIFFICULTIES[difficulty].label.toLowerCase() + ' — mở bảng xếp hạng';
  }
  $('toptime').addEventListener('click', () => ui.openLeaderboard({ mode: mode, difficulty: difficulty }));

  // ---- Play
  $('play').addEventListener('click', () => {
    api.setPrefs({ mode: mode, difficulty: difficulty });
    location.href = (routes.game || '/game') + '?mode=' + mode + '&diff=' + difficulty;
  });

  // ---- "Ô nào được tính là láng giềng?"
  const nb = ui.makeDialog('nb-dialog',
    '<div class="dlg__head"><h2>Ô nào được tính là láng giềng?</h2><button type="button" class="icon-btn" data-close aria-label="Đóng">✕</button></div>' +
    '<div class="dlg__body">' +
      '<p class="muted">Một con số cho biết có bao nhiêu mìn chạm vào ô đó. "Chạm" nghĩa là gì phụ thuộc vào chế độ. Ô vàng là ô bạn đang xem.</p>' +
      '<ul class="nb-list">' +
        Object.values(MODES).map((m) =>
          '<li>' + ui.patternTile(m.id) + '<div><strong>' + ui.esc(m.label) + '</strong><p class="muted">' + ui.esc(m.hint) + '</p></div></li>').join('') +
      '</ul>' +
    '</div>');
  $('open-neighbors').addEventListener('click', () => nb.showModal());
  const openShopBtn = $('open-shop');
  if (openShopBtn) {
    openShopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      ui.openShop();
    });
  }

  paintModes();
  refreshTopTime();
})();
