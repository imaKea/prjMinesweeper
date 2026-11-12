/* Thành phần giao diện dùng chung cho mọi trang: header, menu tài khoản, toast, bảng xếp hạng, cửa hàng */
(function () {
  'use strict';

  const api = window.MF_API;
  const cfg = window.MF_CONFIG || {};
  const routes = cfg.ROUTES || {};
  const { MODES, DIFFICULTIES } = window.MinefieldEngine;

  const $ = (sel, root) => (root || document).querySelector(sel);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* SVG icon đồng xu dùng chung */
  const COIN_SVG_SM = '<svg class="coin-svg" viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/><circle cx="12" cy="12" r="7" fill="none" stroke="#d97706" stroke-width="1" opacity=".4"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400e" font-family="sans-serif">$</text></svg>';
  const COIN_SVG_LG = '<svg class="coin-svg" viewBox="0 0 24 24" width="28" height="28"><circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/><circle cx="12" cy="12" r="7" fill="none" stroke="#d97706" stroke-width="1" opacity=".4"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400e" font-family="sans-serif">$</text></svg>';

  /** 38000 -> "00:38"; precise=true -> "00:38.42" */
  function formatTime(ms, precise) {
    if (ms == null) return '--:--';
    const total = Math.floor(ms / 1000);
    const mm = String(Math.floor(total / 60)).padStart(2, '0');
    const ss = String(total % 60).padStart(2, '0');
    if (!precise) return mm + ':' + ss;
    return mm + ':' + ss + '.' + String(Math.floor((ms % 1000) / 10)).padStart(2, '0');
  }

  function requireSession() {
    const s = api.getSession();
    if (!s) { location.replace(routes.home || '/'); return null; }
    return s;
  }

  function initials(s) {
    if (s.guest) return 'KM';
    const words = String(s.displayName || s.username || '?').trim().split(/\s+/);
    return (words.length > 1 ? words[0][0] + words[1][0] : words[0].slice(0, 2)).toUpperCase();
  }

  // ------------------------------------------------------------------- pastel themes
  const PASTEL_THEMES = [
    { id: 'gold', name: 'Vàng Kim', swatch: '#ffc83d' },
    { id: 'pink', name: 'Hồng Phấn', swatch: '#f497b0' },
    { id: 'green', name: 'Xanh Lá', swatch: '#86efac' },
    { id: 'blue', name: 'Xanh Lam', swatch: '#7dd3fc' },
    { id: 'purple', name: 'Xanh Tím', swatch: '#c084fc' },
    { id: 'red', name: 'Đỏ San Hô', swatch: '#f87171' },
    { id: 'white', name: 'Trắng Ngọc', swatch: '#e2e8f0' }
  ];

  function getActivePastelTheme() {
    return document.documentElement.dataset.theme || localStorage.getItem('mf_pastel_theme') || 'gold';
  }

  function setPastelTheme(themeId) {
    if (themeId === 'gold') {
      delete document.documentElement.dataset.theme;
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.dataset.theme = themeId;
    }
    try {
      localStorage.setItem('mf_pastel_theme', themeId);
    } catch (e) {}

    const dot = document.getElementById('theme-swatch-dot');
    const matched = PASTEL_THEMES.find((t) => t.id === themeId) || PASTEL_THEMES[0];
    if (dot) {
      dot.style.backgroundColor = matched.swatch;
      dot.style.boxShadow = '0 0 8px ' + matched.swatch;
    }

    document.querySelectorAll('.theme-opt-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.theme === themeId);
    });

    window.dispatchEvent(new CustomEvent('mf_theme_change', { detail: { theme: themeId } }));
  }

  function themePickerHtml() {
    const curTheme = getActivePastelTheme();
    const curMatched = PASTEL_THEMES.find((t) => t.id === curTheme) || PASTEL_THEMES[0];
    return '<div class="theme-dropdown-wrap">' +
      '<button type="button" class="theme-toggle-btn" id="theme-toggle-btn" aria-haspopup="true" aria-expanded="false" title="Đổi chủ đề màu Pastel">' +
        '<svg class="theme-palette-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"/></svg>' +
        '<span class="theme-swatch-dot" id="theme-swatch-dot" style="background-color:' + curMatched.swatch + ';box-shadow:0 0 8px ' + curMatched.swatch + ';" aria-hidden="true"></span>' +
        '<span class="theme-toggle-label">Pastel</span>' +
      '</button>' +
      '<div class="theme-popover" id="theme-popover" role="menu" hidden>' +
        '<div class="theme-popover__title">CHỦ ĐỀ MÀU PASTEL</div>' +
        '<div class="theme-options-grid">' +
          PASTEL_THEMES.map((t) =>
            '<button type="button" class="theme-opt-btn ' + (t.id === curTheme ? 'is-active' : '') + '" data-theme="' + t.id + '">' +
              '<span class="theme-swatch-circle" style="background:' + t.swatch + ';"></span>' +
              '<span>' + t.name + '</span>' +
              '<span class="theme-check-icon" aria-hidden="true">✓</span>' +
            '</button>'
          ).join('') +
        '</div>' +
      '</div>' +
    '</div>';
  }

  // ------------------------------------------------------------------- header
  function initHeader(opts) {
    opts = opts || {};
    const host = $('#app-header');
    if (!host) return;
    const session = api.getSession();
    const coins = api.getCoins ? api.getCoins() : 0;
    const path = window.location.pathname;
    const isPlayActive = path.endsWith('/modes') || path.endsWith('/game');
    const isShopActive = path.endsWith('/shop');
    const isAuthPage = document.body.classList.contains('page-auth') || path === '/' || path.endsWith('/login');
    const showCoins = !isAuthPage && !!session && opts.showCoins !== false;

    host.classList.toggle('app-header--bordered', !!opts.bordered);
    host.innerHTML =
      '<div class="app-header__inner">' +
        '<a class="brand" href="' + (session ? (routes.modes || '/modes') : (routes.home || '/')) + '" aria-label="Dò Mìn trang chủ">' +
          '<span class="brand__mark" aria-hidden="true">' + '<i></i>'.repeat(9) + '</span>' +
          '<span class="brand__name">DÒ MÌN</span>' +
        '</a>' +
        '<nav class="header-nav">' +
          '<a class="header-nav-link ' + (isPlayActive ? 'is-active' : '') + '" href="' + (routes.modes || '/modes') + '">Chơi ngay</a>' +
          '<a class="header-nav-link ' + (isShopActive ? 'is-active' : '') + '" id="header-nav-shop" href="' + (routes.shop || '/shop') + '">Cửa hàng</a>' +
          '<button type="button" class="header-nav-link" id="header-nav-lb">Bảng xếp hạng</button>' +
        '</nav>' +
        '<div class="header-actions">' +
          themePickerHtml() +
          (showCoins
            ? '<a class="coin-pill" id="header-shop-btn" href="' + (routes.shop || '/shop') + '" title="Mở cửa hàng trang phục">' +
                '<span class="coin-pill__icon coin-spin" aria-hidden="true">' + COIN_SVG_SM + '</span>' +
                '<span class="coin-pill__count" id="header-coin-count">' + coins + '</span>' +
                '<span class="coin-pill__label">Xu</span>' +
              '</a>'
            : '') +
          (opts.showUser !== false && session ? userMenuHtml(session) : '<a class="header-login-btn" href="' + (routes.home || '/') + '">Đăng nhập →</a>') +
        '</div>' +
      '</div>';
    wireHeaderActions(host);
  }

  function userMenuHtml(s) {
    const who = s.guest ? 'Khách' : s.displayName;
    const sub = s.guest ? 'Kết quả không được lưu' : '@' + s.username;
    return '<div class="user-menu">' +
      '<button type="button" class="avatar" id="avatar-btn" aria-haspopup="menu" aria-expanded="false" title="' + esc(who) + '">' + esc(initials(s)) + '</button>' +
      '<div class="menu" id="user-menu" role="menu" hidden>' +
        '<div class="menu__who"><strong>' + esc(who) + '</strong><small>' + esc(sub) + '</small></div>' +
        '<a role="menuitem" href="' + (routes.shop || '/shop') + '">' + COIN_SVG_SM + ' Cửa hàng trang phục</a>' +
        '<button type="button" role="menuitem" data-act="leaderboard">Bảng xếp hạng</button>' +
        (s.role === 'admin' ? '<a role="menuitem" href="' + esc(routes.admin || cfg.ADMIN_URL || '/admin') + '">Quản trị</a>' : '') +
        '<button type="button" role="menuitem" data-act="' + (s.guest ? 'login' : 'logout') + '">' + (s.guest ? 'Đăng nhập / Đăng ký' : 'Đăng xuất') + '</button>' +
      '</div>' +
    '</div>';
  }

  function wireHeaderActions(host) {
    const themeBtn = $('#theme-toggle-btn', host);
    const themePopover = $('#theme-popover', host);
    if (themeBtn && themePopover) {
      const closeTheme = () => {
        themePopover.hidden = true;
        themeBtn.setAttribute('aria-expanded', 'false');
      };
      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        themePopover.hidden = !themePopover.hidden;
        themeBtn.setAttribute('aria-expanded', String(!themePopover.hidden));
      });
      document.addEventListener('click', (e) => {
        if (!themePopover.contains(e.target) && !themeBtn.contains(e.target)) closeTheme();
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeTheme();
      });
      themePopover.addEventListener('click', (e) => {
        const opt = e.target.closest('.theme-opt-btn');
        if (!opt) return;
        const themeId = opt.dataset.theme;
        setPastelTheme(themeId);
        closeTheme();
      });
    }

    const navLb = $('#header-nav-lb', host);
    if (navLb) {
      navLb.addEventListener('click', (e) => {
        e.preventDefault();
        openLeaderboard();
      });
    }

    const navShop = $('#header-nav-shop', host);
    if (navShop) {
      navShop.addEventListener('click', (e) => {
        if (document.body.classList.contains('page-game') || window.location.pathname.includes('/game')) {
          e.preventDefault();
          openShopDialog('board');
        }
      });
    }

    const shopBtn = $('#header-shop-btn', host);
    if (shopBtn) {
      shopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openShop();
      });
    }

    const btn = $('#avatar-btn', host);
    const menu = $('#user-menu', host);
    if (btn && menu) {
      const close = () => { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); };
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
        btn.setAttribute('aria-expanded', String(!menu.hidden));
      });
      document.addEventListener('click', (e) => { if (!menu.contains(e.target)) close(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
      menu.addEventListener('click', async (e) => {
        const item = e.target.closest('[data-act]');
        if (!item) return;
        close();
        const act = item.dataset.act;
        if (act === 'leaderboard') openLeaderboard();
        else { await api.logout(); location.href = routes.home || '/'; }
      });
    }

    api.onCoinsChange((coins) => {
      const el = $('#header-coin-count');
      if (el) {
        el.textContent = coins;
        el.classList.add('coin-bump');
        setTimeout(() => el.classList.remove('coin-bump'), 400);
      }
    });
  }

  // ------------------------------------------------------------ segmented ctl
  function segmented(host, options, value, onChange) {
    host.setAttribute('role', 'radiogroup');
    host.innerHTML = options.map((o) =>
      '<button type="button" role="radio" aria-checked="false" data-value="' + esc(o.value) + '">' + (o.html != null ? o.html : esc(o.label)) + '</button>').join('');
    const set = (v) => host.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.value === v;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    host.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      set(b.dataset.value);
      if (onChange) onChange(b.dataset.value);
    });
    set(value);
    return { set };
  }

  // ------------------------------------------------------------ pattern tile
  /** Ô 3x3 minh hoạ chế độ: ô giữa màu vàng, ô được tính là láng giềng tô đặc. */
  function patternTile(modeId) {
    const on = MODES[modeId].offsets.map((o) => (o[0] + 1) * 3 + (o[1] + 1));
    let html = '';
    for (let i = 0; i < 9; i++) html += '<i class="' + (i === 4 ? 'is-center' : on.indexOf(i) >= 0 ? 'is-on' : '') + '"></i>';
    return '<span class="pattern" aria-hidden="true">' + html + '</span>';
  }

  // -------------------------------------------------------------------- toast
  let toastTimer = null;
  function toast(msg) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    el.hidden = false;
    el.classList.add('toast-enter');
    setTimeout(() => el.classList.remove('toast-enter'), 300);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2800);
  }

  // ----------------------------------------------------------------- dialogs
  function makeDialog(id, html) {
    let d = document.getElementById(id);
    if (!d) {
      d = document.createElement('dialog');
      d.className = 'dlg';
      d.id = id;
      d.innerHTML = html;
      d.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) {
          d.close();
          return;
        }
        if (e.target === d) {
          const rect = d.getBoundingClientRect();
          const inDialog = (
            rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
            rect.left <= e.clientX && e.clientX <= rect.left + rect.width
          );
          if (!inDialog) d.close();
        }
      });
      document.body.appendChild(d);
    }
    return d;
  }

  // -------------------------------------------------------------- leaderboard
  let lbDialog = null;
  let lbSegs = null;
  let lbReq = 0;
  const lbState = { mode: Object.keys(MODES)[0], difficulty: Object.keys(DIFFICULTIES)[0] };

  function buildLeaderboard() {
    lbDialog = makeDialog('lb-dialog',
      '<div class="lb-modal-wrapper">' +
        '<div class="lb-header-bar">' +
          '<div class="lb-header-title-group">' +
            '<p class="eyebrow eyebrow--gold">NHỮNG NƯỚC ĐI XUẤT SẮC</p>' +
            '<h2>Bảng xếp hạng</h2>' +
            '<p class="muted lb-header-sub">Từng phần trăm giây đều đáng giá. Chọn chế độ để tìm người dẫn đầu.</p>' +
          '</div>' +
          '<div class="lb-header-right">' +
            '<div class="lb-stat-badge">' +
              '<span class="lb-stat-badge__num" id="lb-stat-count">00</span>' +
              '<div class="lb-stat-badge__text">' +
                '<strong>Kỷ lục đã ghi nhận</strong>' +
                '<small>Thành tích tốt nhất mỗi người</small>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="icon-btn lb-close-btn" data-close aria-label="Đóng">✕</button>' +
          '</div>' +
        '</div>' +

        '<div class="lb-grid-layout">' +
          '<!-- Left Table Column -->' +
          '<div class="lb-col-table">' +
            '<div class="lb-filters-card">' +
              '<div class="lb-filter-line">' +
                '<span class="lb-filter-tag">Chế độ</span>' +
                '<div class="seg seg--sm" id="lb-mode"></div>' +
              '</div>' +
              '<div class="lb-filter-line">' +
                '<span class="lb-filter-tag">Độ khó</span>' +
                '<div class="seg seg--sm" id="lb-diff"></div>' +
              '</div>' +
            '</div>' +

            '<div class="lb-table-card">' +
              '<div class="lb-sub-header">' +
                '<strong id="lb-field-info">Cổ điển / Dễ 9 × 9</strong>' +
                '<span class="muted" id="lb-player-count">0 người chơi</span>' +
              '</div>' +
              '<div class="dlg__body lb-body-scroll" id="lb-body"></div>' +
              '<p class="lb-footer-note">Đã hiển thị tất cả kỷ lục của chế độ này.</p>' +
            '</div>' +

            '<div class="lb-cta-card">' +
              '<div class="lb-cta-text">' +
                '<strong>Nước đi tiếp theo có thể là kỷ lục.</strong>' +
                '<p>Hoàn thành bãi mìn nhanh nhất có thể. Thành tích tốt nhất sẽ được lưu tự động.</p>' +
              '</div>' +
              '<button type="button" class="btn btn--primary btn--sm" id="lb-try-btn" data-close>Thử sức →</button>' +
            '</div>' +
          '</div>' +

          '<!-- Right Spotlight Card Column -->' +
          '<div class="lb-col-spotlight">' +
            '<div class="lb-spotlight-card" id="lb-spotlight-card">' +
              '<div class="spotlight-badge">ĐANG DẪN ĐẦU</div>' +
              '<div class="spotlight-visual-card">' +
                '<span class="spotlight-big-rank">01</span>' +
                '<span class="spotlight-trophy-badge">' +
                  '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M6 9H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3m12 6h3a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-3M6 3h12v7a6 6 0 0 1-12 0V3z" fill="none" stroke="#222" stroke-width="2"/><path d="M9 21h6M12 16v5" stroke="#222" stroke-width="2" stroke-linecap="round"/></svg>' +
                '</span>' +
              '</div>' +
              '<div class="spotlight-info">' +
                '<h3 class="spotlight-name" id="spotlight-name">Chưa có ai</h3>' +
                '<p class="spotlight-handle" id="spotlight-handle">Hãy là người đầu tiên</p>' +
                '<div class="spotlight-time-display" id="spotlight-time">--:--</div>' +
              '</div>' +
              '<div class="spotlight-quote">' +
                'Một bãi mìn sạch.<br>Một vị trí xứng đáng.<br>Ai sẽ là người tiếp theo?' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>');

    lbSegs = {
      mode: segmented($('#lb-mode', lbDialog), Object.values(MODES).map((m) => ({ value: m.id, label: m.label })), lbState.mode,
        (v) => { lbState.mode = v; refreshLeaderboard(); }),
      diff: segmented($('#lb-diff', lbDialog), Object.values(DIFFICULTIES).map((d) => ({ value: d.id, label: d.label })), lbState.difficulty,
        (v) => { lbState.difficulty = v; refreshLeaderboard(); }),
    };
  }

  async function refreshLeaderboard() {
    const id = ++lbReq;
    const body = $('#lb-body', lbDialog);
    const fieldInfo = $('#lb-field-info', lbDialog);
    const playerCount = $('#lb-player-count', lbDialog);
    const statCount = $('#lb-stat-count', lbDialog);
    const spotName = $('#spotlight-name', lbDialog);
    const spotHandle = $('#spotlight-handle', lbDialog);
    const spotTime = $('#spotlight-time', lbDialog);

    const curMode = MODES[lbState.mode] || { label: lbState.mode };
    const curDiff = DIFFICULTIES[lbState.difficulty] || { label: lbState.difficulty, cols: 9, rows: 9 };

    if (fieldInfo) {
      fieldInfo.textContent = curMode.label + ' / ' + curDiff.label + ' ' + (curDiff.cols || 9) + ' × ' + (curDiff.rows || 9);
    }

    let rows = [];
    try {
      rows = await api.getLeaderboard({ mode: lbState.mode, difficulty: lbState.difficulty, limit: 10 });
    } catch (err) {
      if (id !== lbReq) return;
      body.innerHTML = '<p class="empty">' + esc(err.message || 'Không thể tải bảng xếp hạng.') + '</p>';
      return;
    }
    if (id !== lbReq) return;

    if (statCount) {
      statCount.textContent = String(rows.length).padStart(2, '0');
    }
    if (playerCount) {
      playerCount.textContent = rows.length + ' người chơi';
    }

    if (!rows.length) {
      body.innerHTML = '<p class="empty">Chưa có kỷ lục nào cho bãi mìn này. Đăng nhập, dò sạch và chiếm vị trí đầu!</p>';
      if (spotName) spotName.textContent = 'Chưa có ai';
      if (spotHandle) spotHandle.textContent = curMode.label + ' · ' + curDiff.label;
      if (spotTime) spotTime.textContent = '--:--';
      return;
    }

    // Top 1 spotlight
    const top1 = rows[0];
    if (spotName) spotName.textContent = top1.displayName || top1.username;
    if (spotHandle) spotHandle.textContent = '@' + top1.username + ' · ' + curMode.label + ' / ' + curDiff.label;
    if (spotTime) spotTime.textContent = formatTime(top1.timeMs, true);

    const me = api.getSession();
    body.innerHTML = '<table class="lb"><thead><tr><th>HẠNG</th><th>NGƯỜI CHƠI</th><th class="num">THỜI GIAN</th><th class="num">NGÀY ĐẠT</th></tr></thead><tbody>' +
      rows.map((r) => {
        const isMe = me && me.username === r.username;
        const initialStr = esc(initials({ displayName: r.displayName, username: r.username }));
        const rankFormatted = String(r.rank).padStart(2, '0');
        return '<tr' + (isMe ? ' class="is-me"' : '') + '>' +
          '<td class="rank"><span class="rank-badge rank-' + r.rank + '">' + rankFormatted + '</span></td>' +
          '<td><div class="lb-user-cell"><span class="lb-avatar-sm">' + initialStr + '</span><div><strong>' + esc(r.displayName) + '</strong> <small>@' + esc(r.username) + '</small></div></div></td>' +
          '<td class="num time"><strong>' + formatTime(r.timeMs, true) + '</strong></td>' +
          '<td class="num muted">' + (r.at ? new Date(r.at).toLocaleDateString('vi-VN') : '—') + '</td></tr>';
      }).join('') +
      '</tbody></table>';
  }

  function openLeaderboard(initial) {
    Object.assign(lbState, initial || {});
    if (!lbDialog) buildLeaderboard();
    lbSegs.mode.set(lbState.mode);
    lbSegs.diff.set(lbState.difficulty);
    refreshLeaderboard();
    if (!lbDialog.open) lbDialog.showModal();
  }

  // ------------------------------------------------------------------ shop
  let shopDialog = null;
  let shopSeg = null;
  let shopType = 'board';
  let shopData = null;

  const skins = window.MF_SKINS || {};

  function renderShopContent() {
    if (!shopDialog || !shopData) return;
    const coinsVal = $('#shop-coins-display', shopDialog);
    if (coinsVal) coinsVal.textContent = Number(shopData.coins || 0).toLocaleString('vi-VN');

    const isBoard = shopType === 'board';
    const items = isBoard ? (shopData.catalog.boards || []) : (shopData.catalog.flags || []);
    const equippedId = isBoard ? (shopData.equipped && shopData.equipped.board) : (shopData.equipped && shopData.equipped.flag);

    const body = $('#shop-body', shopDialog);
    if (!body) return;

    let cardsHtml = items.map((item, idx) => {
      const isEquipped = item.id === equippedId;
      const isOwned = item.price === 0 || (shopData.unlocked && shopData.unlocked.includes(item.id));
      const canAfford = (shopData.coins || 0) >= item.price;

      const previewHtml = isBoard
        ? skins.renderBoardPreviewHtml(item)
        : skins.renderFlagPreviewHtml(item.id, item.accent);

      let actionBtnHtml = '';
      if (isEquipped) {
        actionBtnHtml = '<span class="skin-badge skin-badge--equipped">ĐANG DÙNG ✓</span>';
      } else if (isOwned) {
        actionBtnHtml = '<button type="button" class="btn btn--sm btn--ghost" data-act="equip" data-id="' + esc(item.id) + '" data-type="' + esc(item.type) + '" data-name="' + esc(item.name) + '">Trang bị</button>';
      } else {
        actionBtnHtml = '<button type="button" class="btn btn--sm btn--gold" data-act="buy" data-id="' + esc(item.id) + '" data-type="' + esc(item.type) + '" data-name="' + esc(item.name) + '" ' + (!canAfford ? 'disabled' : '') + '>Mua ' + item.price + ' ' + COIN_SVG_SM + '</button>';
      }

      return '<div class="shop-card anim-fade-up" style="animation-delay:' + (idx * 35) + 'ms">' +
        '<div class="shop-card__head" style="display:flex;gap:14px;align-items:flex-start;">' +
          previewHtml +
          '<div class="shop-card__info-block">' +
            '<strong class="shop-card__title">' + esc(item.name) + '</strong>' +
            '<p class="shop-card__desc">' + esc(item.description) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="shop-card__foot-block">' +
          '<span class="shop-card__price' + (item.price === 0 ? ' shop-card__price--free' : '') + '">' +
            (item.price === 0 ? 'MIỄN PHÍ' : item.price + ' ' + COIN_SVG_SM) +
          '</span>' +
          actionBtnHtml +
        '</div>' +
      '</div>';
    }).join('');

    body.innerHTML = '<div class="shop-grid" style="display:grid;grid-template-columns:repeat(auto-fill, minmax(280px, 1fr));gap:14px;">' + cardsHtml + '</div>';
  }

  function buildShop() {
    shopDialog = makeDialog('shop-dialog',
      '<div class="dlg__head">' +
        '<h2>' + COIN_SVG_SM + ' Cửa hàng trang phục</h2>' +
        '<button type="button" class="icon-btn" data-close aria-label="Đóng">✕</button>' +
      '</div>' +
      '<div class="shop-hero">' +
        '<div class="shop-hero__balance">' +
          '<span class="shop-hero__coin-icon coin-spin" aria-hidden="true">' + COIN_SVG_LG + '</span>' +
          '<div class="shop-hero__balance-text">' +
            '<span class="shop-hero__balance-label">SỐ DƯ CỦA BẠN</span>' +
            '<span class="shop-hero__balance-val" id="shop-coins-display">0</span>' +
          '</div>' +
        '</div>' +
        '<div class="shop-hero__info">' +
          'Kiếm xu bằng cách thắng — độ khó càng cao, thưởng càng lớn! (Không phải tiền thật).' +
          '<div class="shop-hero__rates">Thưởng: Dễ +30 ' + COIN_SVG_SM + ' · Trung bình +75 ' + COIN_SVG_SM + ' · Khó +180 ' + COIN_SVG_SM + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="dlg__filters">' +
        '<div class="seg seg--sm" id="shop-type-seg"></div>' +
      '</div>' +
      '<div class="dlg__body" id="shop-body"><p class="empty">Đang tải cửa hàng…</p></div>' +
      '<div class="dlg__foot" style="padding:10px 24px 16px;display:flex;justify-content:flex-end;border-top:1px solid rgba(255,255,255,0.06);">' +
        '<a href="' + (routes.shop || '/shop') + '" class="link" style="font-size:13px;color:var(--text-2);">Mở trang cửa hàng đầy đủ →</a>' +
      '</div>'
    );
    shopDialog.classList.add('dlg--shop');

    shopSeg = segmented($('#shop-type-seg', shopDialog), [
      { value: 'board', label: 'Giao diện bàn chơi' },
      { value: 'flag', label: 'Kiểu cờ đánh dấu' },
    ], shopType, (v) => {
      shopType = v;
      renderShopContent();
    });

    $('#shop-body', shopDialog).addEventListener('click', async (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;
      const skinId = btn.dataset.id;
      const type = btn.dataset.type;
      btn.disabled = true;
      btn.textContent = '…';

      try {
        if (act === 'buy') {
          const res = await api.buySkin({ skinId, type });
          toast('Đã mua & trang bị ' + esc(btn.dataset.name || skinId) + '!');
          shopData.coins = res.coins;
          shopData.equipped = res.equipped;
          shopData.unlocked = res.unlocked;
        } else if (act === 'equip') {
          const res = await api.equipSkin({ skinId, type });
          toast('Đã trang bị ' + esc(btn.dataset.name || skinId) + '!');
          shopData.equipped = res.equipped;
        }
      } catch (err) {
        toast(err.message || 'Thao tác không thành công');
      } finally {
        renderShopContent();
      }
    });
  }

  async function openShopDialog(initialTab) {
    if (initialTab) shopType = initialTab;
    if (!shopDialog) buildShop();
    if (shopSeg) shopSeg.set(shopType);
    const body = $('#shop-body', shopDialog);
    if (body) body.innerHTML = '<p class="empty">Đang tải cửa hàng…</p>';

    if (!shopDialog.open) {
      try {
        shopDialog.showModal();
      } catch (err) {
        shopDialog.setAttribute('open', '');
      }
    }

    try {
      shopData = await api.getShop();
      renderShopContent();
    } catch (e) {
      if (body) body.innerHTML = '<p class="empty">' + esc(e.message) + '</p>';
    }
  }

  function openShop(initialTab) {
    if (document.body.classList.contains('page-game') || window.location.pathname.includes('/game')) {
      openShopDialog(initialTab || 'board');
    } else {
      location.href = routes.shop || '/shop';
    }
  }

  window.MF_UI = {
    $, esc, formatTime, requireSession, initHeader, segmented, patternTile,
    toast, makeDialog, openLeaderboard, openShop, openShopDialog, COIN_SVG_SM, COIN_SVG_LG,
    setPastelTheme, getActivePastelTheme, PASTEL_THEMES,
  };
})();
