(function () {
  'use strict';

  const ui = window.MF_UI;
  const api = window.MF_API;
  const session = ui.requireSession();
  if (!session) return;
  ui.initHeader({ bordered: true });

  const { Minesweeper, MODES, DIFFICULTIES } = window.MinefieldEngine;
  const $ = (id) => document.getElementById(id);
  const el = {
    board: $('board'), mines: $('mines'), time: $('time'), status: $('status'),
    title: $('title'), eyebrow: $('eyebrow'), result: $('result'),
  };

  const FLAG_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2v12" stroke="#9fb0c3" stroke-width="1.6" stroke-linecap="round"/><path d="M5 2.6 12.5 5.6 5 8.6z" fill="#e4a63b"/></svg>';
  const MINE_SVG = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.6" fill="currentColor"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3M3.4 3.4l2.1 2.1M10.5 10.5l2.1 2.1M12.6 3.4l-2.1 2.1M5.5 10.5l-2.1 2.1" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>';
  const COIN_SVG_SM = ui.COIN_SVG_SM;

  function currentFlagSvg() {
    const flagSkin = (api.getEquipped && api.getEquipped().flag) || 'classic';
    return (window.MF_SKINS && window.MF_SKINS.getFlagSvg(flagSkin)) || FLAG_SVG;
  }

  // ---------------------------------------------------------------- state
  const params = new URLSearchParams(location.search);
  const prefs = api.getPrefs();
  const pick = (a, table, b) => (table[a] ? a : table[b] ? b : Object.keys(table)[0]);
  let mode = pick(params.get('mode'), MODES, prefs.mode);
  let difficulty = pick(params.get('diff'), DIFFICULTIES, prefs.difficulty);

  let game = null;
  let cells = [];
  let timerId = null;
  let runId = 0;
  let startPromise = null;
  let isHintPending = false;

  const MODE_LABELS = { classic: 'Cổ điển', plus: 'Dấu cộng', corner: 'Góc chéo' };
  const DIFF_LABELS = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
  const modeSubLabels = {
    classic: '8 ô xung quanh',
    plus: '4 ô ngang, dọc',
    corner: '4 ô góc chéo',
  };

  const modeSeg = ui.segmented($('mode-seg'),
    Object.values(MODES).map((m) => ({
      value: m.id,
      label: m.label,
      html: ui.patternTile(m.id) + '<div class="seg-mode-text"><strong>' + ui.esc(m.label) + '</strong><small>' + (modeSubLabels[m.id] || ui.esc(m.hint || '')) + '</small></div>',
    })), mode,
    (v) => configure(v, difficulty));

  const diffSeg = ui.segmented($('diff-seg'),
    Object.values(DIFFICULTIES).map((d) => ({
      value: d.id,
      label: d.label,
      html: '<div class="seg-diff-inner"><strong>' + ui.esc(d.label) + '</strong><span class="diff-dim">' + d.cols + ' × ' + d.rows + '</span></div>',
    })), difficulty,
    (v) => configure(mode, v));

  function updateSkinDisplay() {
    const skinNameEl = $('game-equipped-skin-name');
    const miniBoard = document.querySelector('.skin-mini-board');
    if (api.getEquipped) {
      const eq = api.getEquipped();
      const catalog = (window.MF_SKINS && window.MF_SKINS.catalog) || {};
      const s = catalog.board && catalog.board[eq.board];
      if (skinNameEl) skinNameEl.textContent = s ? s.name : 'Cổ Điển Trầm';
      if (miniBoard) {
        miniBoard.dataset.skin = eq.board || 'classic';
        miniBoard.querySelectorAll('.sm-cell.is-flag').forEach((flagCell) => {
          flagCell.innerHTML = currentFlagSvg();
        });
      }
    }
  }

  function calculateBaseCoins(m, d) {
    let base = d === 'hard' ? 180 : d === 'medium' ? 75 : 30;
    if (m && m !== 'classic') {
      base = Math.round(base * 1.2);
    }
    return base;
  }

  // ---------------------------------------------------------------- setup
  function configure(m, d) {
    const currentRun = ++runId;
    stopTimer();
    startPromise = null;
    isHintPending = false;
    mode = m;
    difficulty = d;
    const cfg = DIFFICULTIES[d];

    game = new Minesweeper({ rows: cfg.rows, cols: cfg.cols, mines: cfg.mines, mode: m });
    game.onStateChange = onStateChange;

    modeSeg.set(m);
    diffSeg.set(d);
    el.eyebrow.textContent = 'Chế độ ' + (MODE_LABELS[m] || MODES[m].label);
    el.title.textContent = 'Bãi mìn ' + (DIFF_LABELS[d] || cfg.label);
    document.title = 'Dò Mìn · ' + (MODE_LABELS[m] || MODES[m].label) + ' · ' + (DIFF_LABELS[d] || cfg.label);
    api.setPrefs({ mode: m, difficulty: d });
    try { history.replaceState(null, '', '?mode=' + m + '&diff=' + d); } catch (e) { /* file:// */ }

    const boardDimEl = $('board-matrix-dim');
    if (boardDimEl) boardDimEl.textContent = cfg.cols + ' × ' + cfg.rows + ' / ' + (MODE_LABELS[m] || m).toUpperCase();

    const recTitleEl = $('record-card-title');
    if (recTitleEl) recTitleEl.textContent = 'KỶ LỤC / ' + (MODE_LABELS[m] || m).toUpperCase() + ' - ' + (DIFF_LABELS[d] || d).toUpperCase();

    const recTimeEl = $('record-time-val');
    const recFootEl = $('record-footnote');
    if (recTimeEl) {
      recTimeEl.textContent = '-- : --';
      if (recFootEl) recFootEl.textContent = 'Đang kiểm tra kỷ lục…';
      api.getBestTime({ mode: m, difficulty: d })
        .then((ms) => {
          if (currentRun !== runId) return;
          if (recTimeEl) recTimeEl.textContent = ui.formatTime(ms);
          if (recFootEl) {
            recFootEl.textContent = ms != null ? 'Kỷ lục tốt nhất của chế độ này.' : 'Chưa có kỷ lục. Bắt đầu bằng một chiến thắng.';
          }
        })
        .catch(() => {
          if (currentRun !== runId) return;
          if (recTimeEl) recTimeEl.textContent = '-- : --';
          if (recFootEl) recFootEl.textContent = 'Chưa thể tải kỷ lục.';
        });
    }

    const rewValEl = $('target-reward-val');
    const rewDescEl = document.querySelector('.target-reward-desc');
    if (rewValEl) {
      const baseCoins = calculateBaseCoins(m, d);
      rewValEl.textContent = '+' + baseCoins + ' xu';
      if (rewDescEl) {
        rewDescEl.innerHTML =
          'Thưởng <strong>+' + baseCoins + ' xu</strong> cơ bản khi thắng. Thưởng thêm tốc độ:<br>' +
          '⚡ &lt;30s: <strong>+100 xu</strong><br>' +
          '⚡ &lt;60s: <strong>+50 xu</strong><br>' +
          '⚡ &lt;100s: <strong>+25 xu</strong><br>' +
          '⏱️ &ge;100s: <strong>+0 xu</strong>';
      }
    }

    const ruleEl = $('game-rule-text');
    if (ruleEl) {
      ruleEl.textContent = m === 'plus'
        ? 'Mỗi số là tổng mìn trong 4 ô kề cạnh (ngang & dọc).'
        : m === 'corner'
        ? 'Mỗi số là tổng mìn trong 4 ô góc chéo.'
        : 'Mỗi số là tổng mìn trong 8 ô xung quanh.';
    }

    updateSkinDisplay();
    buildBoard();
    hideResult();
    onStateChange('ready');
    renderCounters();
  }

  function buildBoard() {
    el.board.style.setProperty('--cols', game.cols);
    el.board.dataset.skin = (api.getEquipped && api.getEquipped().board) || 'classic';
    el.board.innerHTML = '';
    cells = [];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < game.cells.length; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cell';
      b.dataset.i = i;
      cells.push(b);
      frag.appendChild(b);
    }
    el.board.appendChild(frag);
    for (let i = 0; i < cells.length; i++) renderCell(i);
  }

  function restart() {
    runId++;
    stopTimer();
    startPromise = null;
    isHintPending = false;
    game.reset();
    hideResult();
    for (let i = 0; i < cells.length; i++) renderCell(i);
    renderCounters();
  }

  // ------------------------------------------------------------- rendering
  function renderCell(i) {
    const v = game.view(i);
    const b = cells[i];
    if (!b) return;

    const targetKind = v.kind || 'hidden';
    const targetN = v.n != null ? String(v.n) : '';
    if (b.dataset.renderedKind === targetKind && b.dataset.renderedN === targetN) {
      return;
    }
    b.dataset.renderedKind = targetKind;
    b.dataset.renderedN = targetN;

    const pos = 'Hàng ' + (Math.floor(i / game.cols) + 1) + ', cột ' + ((i % game.cols) + 1) + ': ';
    b.className = 'cell';
    b.innerHTML = '';
    let label = 'ẩn';
    switch (v.kind) {
      case 'number':
        b.classList.add('is-open', 'n' + v.n);
        b.textContent = v.n;
        label = v.n + ' mìn xung quanh';
        break;
      case 'empty':
        b.classList.add('is-open');
        label = 'trống';
        break;
      case 'flag':
        b.classList.add('is-flag');
        b.innerHTML = currentFlagSvg();
        label = 'đã cắm cờ';
        break;
      case 'mine':
        b.classList.add('is-open', 'is-mine');
        b.innerHTML = MINE_SVG;
        label = 'mìn';
        break;
      case 'exploded':
        b.classList.add('is-open', 'is-mine', 'is-exploded');
        b.innerHTML = MINE_SVG;
        label = 'mìn phát nổ';
        break;
      case 'wrongflag':
        b.classList.add('is-wrong');
        b.innerHTML = currentFlagSvg();
        label = 'cắm cờ sai';
        break;
      default:
        break;
    }
    b.setAttribute('aria-label', pos + label);
  }

  function apply(changed) {
    if (!changed || changed.length === 0) return;
    const seen = new Set(changed);
    seen.forEach(renderCell);
    renderCounters();
  }

  function fmt3(n) {
    return n < 0 ? '-' + String(Math.min(99, -n)).padStart(2, '0') : String(Math.min(999, n)).padStart(3, '0');
  }

  function renderCounters() {
    el.mines.textContent = fmt3(game.minesLeft);
    el.time.textContent = fmt3(Math.floor(game.elapsedMs() / 1000));
    const flagFoot = $('board-flags-count');
    if (flagFoot && game) {
      flagFoot.textContent = '🚩 ' + game.flags + ' cờ đã đặt';
    }
  }

  // ----------------------------------------------------------------- timer
  function tick() {
    el.time.textContent = fmt3(Math.floor(game.elapsedMs() / 1000));
  }

  function startTimer() {
    stopTimer();
    tick();
    timerId = setInterval(tick, 100);
  }

  function stopTimer() {
    if (timerId != null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  // ------------------------------------------------------------ game events
  function onStateChange(s) {
    el.status.dataset.state = s;
    el.board.classList.toggle('is-over', s === 'won' || s === 'lost');

    const pill = $('live-pill');
    const pillLabel = $('live-pill-label');
    if (pill && pillLabel) {
      pill.dataset.state = s;
      if (s === 'playing') pillLabel.textContent = 'Đang chơi';
      else if (s === 'won') pillLabel.textContent = 'Chiến thắng';
      else if (s === 'lost') pillLabel.textContent = 'Nổ tung';
      else pillLabel.textContent = 'Sẵn sàng';
    }

    if (s === 'playing') {
      startTimer();
      if (!startPromise) {
        startPromise = api.startGame({ mode: mode, difficulty: difficulty });
      }
    } else if (s === 'won' || s === 'lost') {
      stopTimer();
      tick();
      if (s === 'won') {
        onWin(runId);
      } else {
        onLoss(runId);
        showResult({ won: false });
      }
    }
  }

  async function onWin(id) {
    const m = mode, d = difficulty;
    const timeMs = game.elapsedMs();
    showResult({ won: true, timeMs: timeMs, pending: true });
    let res = { saved: false };
    try {
      const started = await startPromise;
      if (!started || !started.token) throw new Error('Không thể tạo phiên chơi. Hãy tải lại trang.');
      res = await api.submitResult({ token: started.token, mode: m, difficulty: d, timeMs: timeMs });
    } catch (err) {
      res = { saved: false, error: err.message };
    }
    if (id !== runId) return;
    showResult({ won: true, timeMs: timeMs, res: res });
  }

  async function onLoss(id) {
    try {
      const started = await startPromise;
      if (started && started.token) await api.submitLoss(started.token);
    } catch (error) {
      if (id === runId) ui.toast(error.message);
    }
  }

  async function onHintClick() {
    if (!game || game.state === 'won' || game.state === 'lost') {
      ui.toast('Ván chơi đã kết thúc.');
      return;
    }
    if (!game.hasUnflaggedMine()) {
      ui.toast('Tất cả các mìn đều đã được cắm cờ!');
      return;
    }
    if (isHintPending) return;

    const currentCoins = api.getCoins ? api.getCoins() : 0;
    if (currentCoins < 100) {
      ui.toast('Bạn không đủ xu! Cần 100 xu để sử dụng gợi ý (Số dư: ' + currentCoins + ' xu).');
      return;
    }

    const currentRun = runId;
    isHintPending = true;

    try {
      if (!startPromise) {
        startPromise = api.startGame({ mode: mode, difficulty: difficulty });
      }
      const started = await startPromise;
      if (!started || !started.token) throw new Error('Không thể tạo phiên chơi. Hãy tải lại trang.');
      if (currentRun !== runId) return;

      await api.useHint(started.token);
      if (currentRun !== runId) return;

      const hintRes = game.applyHint();
      if (!hintRes) {
        ui.toast('Không còn ô mìn chưa cắm cờ.');
        return;
      }

      apply(hintRes.changed);

      const cellEl = cells[hintRes.hintIndex];
      if (cellEl) {
        cellEl.classList.remove('cell-hint-detected');
        void cellEl.offsetWidth;
        cellEl.classList.add('cell-hint-detected');
        setTimeout(() => cellEl.classList.remove('cell-hint-detected'), 2500);
      }

      ui.toast('Gợi ý thành công (-100 xu)! Đã định vị và cắm cờ 1 quả mìn.');
    } catch (err) {
      if (err.status === 404 || (err.message && err.message.includes('Không tìm thấy phiên chơi'))) {
        ui.toast('Phiên chơi đã hết hạn. Đang tạo ván mới...');
        restart();
        return;
      }
      ui.toast(err.message || 'Lỗi sử dụng gợi ý.');
    } finally {
      isHintPending = false;
    }
  }

  // ------------------------------------------------------------- results UI
  function showResult(r) {
    el.result.hidden = false;
    el.result.dataset.tone = r.won ? 'win' : 'lose';
    el.result.classList.add('result-enter');
    setTimeout(() => el.result.classList.remove('result-enter'), 400);

    if (!r.won) {
      el.result.innerHTML =
        '<div class="result__text"><strong>💥 Nổ tung!</strong><span>Bạn đã giẫm mìn. Hãy thử lại!</span></div>' +
        '<div class="result__actions"><button type="button" class="btn btn--primary btn--sm" data-act="again">Thử lại</button></div>';
      return;
    }

    let note = '';
    const speedBonus = (r.res && r.res.speedBonus) || 0;
    const baseCoins = (r.res && r.res.baseCoins) || ((r.res && r.res.coinsEarned != null) ? Math.max(0, r.res.coinsEarned - speedBonus) : 0);
    const coinBreakdown = (r.res && r.res.coinsEarned != null)
      ? (speedBonus > 0
          ? ' · +' + r.res.coinsEarned + ' Xu (' + baseCoins + ' cơ bản + ' + speedBonus + ' tốc độ)'
          : ' · +' + r.res.coinsEarned + ' Xu (Cơ bản)')
      : '';

    if (r.pending) {
      note = 'Đang lưu…';
    } else if (r.res && r.res.saved) {
      note = (r.res.isBest ? 'Kỷ lục cá nhân mới · ' : '') + 'Hạng #' + r.res.rank + coinBreakdown;
    } else if (session.guest) {
      note = 'Đăng nhập để lưu kỷ lục vào bảng xếp hạng.' + (coinBreakdown ? ' (' + coinBreakdown.replace(/^ · /, '') + ' đã nhận!)' : '');
    } else if (r.res && r.res.error) {
      note = ui.esc(r.res.error);
    } else if (r.res && !r.res.saved) {
      note = 'Kết quả không được lưu. Hãy đăng nhập trước khi bắt đầu ván mới.';
    }

    el.result.innerHTML =
      '<div class="result__text"><strong>🎉 Dò sạch · <span class="result__time">' + ui.formatTime(r.timeMs, true) + '</span></strong><span>' + note + '</span></div>' +
      '<div class="result__actions">' +
        '<button type="button" class="btn btn--gold btn--sm" data-act="shop">' + COIN_SVG_SM + ' Cửa hàng</button>' +
        '<button type="button" class="btn btn--ghost btn--sm" data-act="board">Bảng xếp hạng</button>' +
        '<button type="button" class="btn btn--primary btn--sm" data-act="again">Chơi lại</button>' +
      '</div>';
  }

  function hideResult() {
    el.result.hidden = true;
    el.result.innerHTML = '';
  }

  el.result.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'again') {
      restart();
    } else if (b.dataset.act === 'shop') {
      e.stopPropagation();
      if (ui.openShopDialog) ui.openShopDialog();
      else ui.openShop();
    } else {
      ui.openLeaderboard({ mode: mode, difficulty: difficulty });
    }
  });

  el.status.addEventListener('click', restart);

  if (api.onSkinChange) {
    api.onSkinChange((equipped) => {
      updateSkinDisplay();
      if (el.board) el.board.dataset.skin = equipped.board || 'classic';
      for (let i = 0; i < cells.length; i++) {
        if (!game) break;
        const v = game.view(i);
        if (v.kind === 'flag' || v.kind === 'wrongflag') {
          delete cells[i].dataset.renderedKind;
          delete cells[i].dataset.renderedN;
          renderCell(i);
        }
      }
    });
  }

  const btnLb = $('game-btn-lb');
  if (btnLb) btnLb.addEventListener('click', () => ui.openLeaderboard({ mode: mode, difficulty: difficulty }));
  const btnShop = $('game-btn-shop');
  if (btnShop) {
    btnShop.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (ui.openShopDialog) ui.openShopDialog('board');
      else ui.openShop('board');
    });
  }
  const btnHint = $('game-btn-hint');
  if (btnHint) btnHint.addEventListener('click', onHintClick);

  // ----------------------------------------------------------------- input
  function reveal(i) {
    apply(game.cells[i].revealed ? game.chord(i) : game.reveal(i));
  }

  function flag(i) {
    apply(game.toggleFlag(i));
  }

  let touchLongPressed = false;
  let suppressClick = false;
  let pressTimer = null;
  let pressStartX = 0;
  let pressStartY = 0;

  function clearLongPress() {
    if (pressTimer != null) {
      clearTimeout(pressTimer);
      pressTimer = null;
    }
  }

  el.board.addEventListener('click', (e) => {
    const b = e.target.closest('.cell');
    if (!b) return;
    if (suppressClick) { suppressClick = false; return; }
    reveal(+b.dataset.i);
  });

  el.board.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (touchLongPressed) {
      touchLongPressed = false;
      return;
    }
    const b = e.target.closest('.cell');
    if (b) flag(+b.dataset.i);
  });

  el.board.addEventListener('pointerdown', (e) => {
    suppressClick = false;
    touchLongPressed = false;
    if (e.pointerType !== 'touch') return;
    const b = e.target.closest('.cell');
    if (!b) return;
    pressStartX = e.clientX;
    pressStartY = e.clientY;
    clearLongPress();
    pressTimer = setTimeout(() => {
      pressTimer = null;
      suppressClick = true;
      touchLongPressed = true;
      setTimeout(() => { touchLongPressed = false; }, 400);
      flag(+b.dataset.i);
      if (navigator.vibrate) navigator.vibrate(15);
    }, 380);
  });
  el.board.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'touch' || pressTimer == null) return;
    if (Math.hypot(e.clientX - pressStartX, e.clientY - pressStartY) > 10) {
      clearLongPress();
    }
  }, { passive: true });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) =>
    el.board.addEventListener(t, clearLongPress));

  el.board.addEventListener('keydown', (e) => {
    const b = e.target.closest('.cell');
    if (b && (e.key === 'f' || e.key === 'F')) {
      e.preventDefault();
      flag(+b.dataset.i);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (/^(input|textarea|select)$/i.test(e.target.tagName) || document.querySelector('dialog[open]')) return;
    if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const hovered = document.querySelector('.cell:hover') || (document.activeElement && document.activeElement.closest('.cell'));
      if (hovered && hovered.dataset.i != null) {
        e.preventDefault();
        flag(+hovered.dataset.i);
        return;
      }
    }
    if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      onHintClick();
      return;
    }
    if ((e.key !== 'r' && e.key !== 'R') || e.ctrlKey || e.metaKey || e.altKey) return;
    restart();
  });

  configure(mode, difficulty);
})();
