(function () {
  'use strict';

  const ui = window.MF_UI;
  const api = window.MF_API;
  const esc = ui.esc;
  const COIN_SVG_SM = ui.COIN_SVG_SM;

  if (!ui.requireSession()) return;
  ui.initHeader({ bordered: true });

  const $ = (id) => document.getElementById(id);
  const coinsDisplay = $('shop-page-coins');
  const itemsCounter = $('shop-items-counter');
  const gridEl = $('shop-page-grid');
  const tabsEl = $('shop-page-type-seg');

  let currentTab = 'board';
  let shopData = null;

  function render5x5BoardPreview(skinId, palette, accent) {
    const pal = palette || ['#141c25', '#2a3541', '#344252', '#e4a63b'];
    // 5x5 preview matrix strictly obeying Minesweeper rules (mines at [2,3] and [3,2])
    return '<div class="shop-preview-matrix" data-skin="' + esc(skinId) + '" style="background:' + pal[0] + ';border-color:' + (accent || pal[3]) + '">' +
      '<div class="sp-row"><span class="sp-c"></span><span class="sp-c"></span><span class="sp-c"></span><span class="sp-c"></span><span class="sp-c"></span></div>' +
      '<div class="sp-row"><span class="sp-c"></span><span class="sp-c"></span><span class="sp-c n1">1</span><span class="sp-c n1">1</span><span class="sp-c n1">1</span></div>' +
      '<div class="sp-row"><span class="sp-c"></span><span class="sp-c n1">1</span><span class="sp-c n2">2</span><span class="sp-c is-flag">🚩</span><span class="sp-c n1">1</span></div>' +
      '<div class="sp-row"><span class="sp-c"></span><span class="sp-c n1">1</span><span class="sp-c"></span><span class="sp-c n2">2</span><span class="sp-c n1">1</span></div>' +
      '<div class="sp-row"><span class="sp-c"></span><span class="sp-c n1">1</span><span class="sp-c n1">1</span><span class="sp-c n1">1</span><span class="sp-c"></span></div>' +
    '</div>';
  }

  function renderFlagPreview(skinId) {
    const flagSvg = (window.MF_SKINS && window.MF_SKINS.getFlagSvg(skinId)) || '';
    return '<div class="shop-preview-flag">' + flagSvg + '</div>';
  }

  function renderGrid() {
    if (!shopData) return;

    if (coinsDisplay) {
      coinsDisplay.textContent = Number(shopData.coins || 0).toLocaleString('vi-VN');
    }

    const isBoard = currentTab === 'board';
    const items = isBoard ? (shopData.catalog.boards || []) : (shopData.catalog.flags || []);
    const equippedId = isBoard ? (shopData.equipped && shopData.equipped.board) : (shopData.equipped && shopData.equipped.flag);

    if (itemsCounter) {
      const totalCount = String(items.length).padStart(2, '0');
      itemsCounter.textContent = isBoard
        ? totalCount + ' giao diện · Mua một lần, dùng mãi mãi'
        : totalCount + ' kiểu cờ · Mua một lần, dùng mãi mãi';
    }

    let cardsHtml = items.map((item, idx) => {
      const isEquipped = item.id === equippedId;
      const isOwned = item.price === 0 || (shopData.unlocked && shopData.unlocked.includes(item.id));
      const canAfford = (shopData.coins || 0) >= item.price;

      const previewHtml = isBoard
        ? render5x5BoardPreview(item.id, item.palette, item.accent)
        : renderFlagPreview(item.id);

      let actionBtnHtml = '';
      if (isEquipped) {
        actionBtnHtml = '<span class="skin-badge skin-badge--equipped">Đang dùng ✓</span>';
      } else if (isOwned) {
        actionBtnHtml = '<button type="button" class="btn btn--sm btn--ghost" data-act="equip" data-id="' + esc(item.id) + '" data-type="' + esc(item.type) + '" data-name="' + esc(item.name) + '">Trang bị</button>';
      } else {
        actionBtnHtml = '<button type="button" class="btn btn--sm btn--gold" data-act="buy" data-id="' + esc(item.id) + '" data-type="' + esc(item.type) + '" data-name="' + esc(item.name) + '" ' + (!canAfford ? 'disabled' : '') + '>Mua ' + item.price + '</button>';
      }

      return '<div class="shop-card anim-fade-up" style="animation-delay:' + (idx * 50) + 'ms">' +
        '<div class="shop-card__preview-wrap">' +
          previewHtml +
        '</div>' +
        '<div class="shop-card__info-block">' +
          '<strong class="shop-card__title">' + esc(item.name) + '</strong>' +
          '<p class="shop-card__desc">' + esc(item.description) + '</p>' +
        '</div>' +
        '<div class="shop-card__foot-block">' +
          '<span class="shop-card__price' + (item.price === 0 ? ' shop-card__price--free' : '') + '">' +
            (item.price === 0 ? 'MIỄN PHÍ' : item.price + ' xu') +
          '</span>' +
          actionBtnHtml +
        '</div>' +
      '</div>';
    }).join('');

    // Promo Card (Matching Image 2 - card 8)
    const promoCardHtml = isBoard
      ? ('<div class="shop-card shop-card--promo anim-fade-up" style="animation-delay:' + (items.length * 50) + 'ms">' +
          '<div class="promo-badge-stack" aria-hidden="true">' +
            '<span class="promo-mini-flag promo-flag--1">🚩</span>' +
            '<span class="promo-mini-flag promo-flag--2">🏴‍☠️</span>' +
            '<span class="promo-mini-flag promo-flag--3">⚠️</span>' +
          '</div>' +
          '<div class="promo-content">' +
            '<p class="promo-eyebrow">DẤU ẤN NHỎ, CÁ TÍNH LỚN</p>' +
            '<h3 class="promo-title">Cắm cờ.<br>Khẳng định chất riêng.</h3>' +
            '<p class="promo-desc">Khám phá danh mục kiểu cờ đánh dấu cho bàn chơi của bạn.</p>' +
            '<button type="button" class="btn-promo-action" id="btn-switch-to-flag">Xem kiểu cờ →</button>' +
          '</div>' +
        '</div>')
      : ('<div class="shop-card shop-card--promo anim-fade-up" style="animation-delay:' + (items.length * 50) + 'ms">' +
          '<div class="promo-badge-stack" aria-hidden="true">' +
            '<span class="promo-mini-board-tile" style="background:#0a2314;color:#10b981">1</span>' +
            '<span class="promo-mini-board-tile" style="background:#1e1837;color:#f43f5e">2</span>' +
            '<span class="promo-mini-board-tile" style="background:#302812;color:#facc15">💣</span>' +
          '</div>' +
          '<div class="promo-content">' +
            '<p class="promo-eyebrow">DIỆN MẠO BÀN CHƠI</p>' +
            '<h3 class="promo-title">Bàn chơi mới.<br>Chất riêng mới.</h3>' +
            '<p class="promo-desc">Đổi xu chiến thắng lấy một diện mạo xứng tầm nước đi của bạn.</p>' +
            '<button type="button" class="btn-promo-action" id="btn-switch-to-board">Xem giao diện bàn chơi →</button>' +
          '</div>' +
        '</div>');

    gridEl.innerHTML = cardsHtml + promoCardHtml;

    // Hook promo card buttons
    const toFlagBtn = $('btn-switch-to-flag');
    if (toFlagBtn) {
      toFlagBtn.addEventListener('click', () => switchTab('flag'));
    }
    const toBoardBtn = $('btn-switch-to-board');
    if (toBoardBtn) {
      toBoardBtn.addEventListener('click', () => switchTab('board'));
    }
  }

  function switchTab(nextTab) {
    currentTab = nextTab;
    tabsEl.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.value === nextTab;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    renderGrid();
  }

  tabsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-value]');
    if (!btn) return;
    switchTab(btn.dataset.value);
  });

  gridEl.addEventListener('click', async (e) => {
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
        ui.toast('Đã mua & trang bị ' + (btn.dataset.name || skinId) + '!');
        shopData.coins = res.coins;
        shopData.equipped = res.equipped;
        shopData.unlocked = res.unlocked;
      } else if (act === 'equip') {
        const res = await api.equipSkin({ skinId, type });
        ui.toast('Đã trang bị ' + (btn.dataset.name || skinId) + '!');
        shopData.equipped = res.equipped;
      }
    } catch (err) {
      ui.toast(err.message);
    } finally {
      renderGrid();
    }
  });

  // Load catalog on page entry
  async function loadCatalog() {
    try {
      shopData = await api.getShop();
      renderGrid();
    } catch (err) {
      gridEl.innerHTML = '<p class="form-error">' + esc(err.message) + '</p>';
    }
  }

  loadCatalog();
})();
