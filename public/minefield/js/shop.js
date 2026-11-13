// Shop Page Controller ("Phòng Thử Chiến Thuật" — Tactical Live Atelier)
// Zero backend edits: enriches API catalog client-side using MF_UI, MF_API, MF_SKINS.
(() => {
  const { $, esc, requireSession, initHeader, toast, COIN_SVG_SM, COIN_SVG_LG } = window.MF_UI;
  const { getShop, buySkin, equipSkin, getSession } = window.MF_API;
  const {
    renderBoardPreviewHtml,
    renderFlagPreviewHtml,
    renderTacticalTrialBoardHtml,
  } = window.MF_SKINS;

  function isGuestSession() {
    const s = typeof getSession === 'function' ? getSession() : null;
    return !s || !!s.guest;
  }

  const PIN_STORAGE_KEY = 'mf_shop_target_pin';

  // Verified backend economy constants (tests/Feature/ShopAndCurrencyTest.php)
  const ECONOMY = {
    easy: 30,
    medium: 75,
    hard: 180,
    variantMult: 1.2, // Dấu cộng / Góc chéo
  };

  // Curated client-side tags & synergy recommendations (no backend change required)
  const CURATED_META = {
    board: {
      classic:   { tag: 'Tương phản chuẩn', pair: 'classic' },
      matrix:    { tag: 'Terminal xanh',    pair: 'radar' },
      glacier:   { tag: 'Băng dịu mắt',     pair: 'sapphire' },
      synthwave: { tag: 'Neon retro',       pair: 'crystal' },
      sakura:    { tag: 'Ấm áp nhẹ nhàng',  pair: 'sakura' },
      wood:      { tag: 'Thủ công mộc',     pair: 'shield' },
      ocean:     { tag: 'Biển sâu tĩnh',    pair: 'pirate' },
      amethyst:  { tag: 'Pha lê tím',       pair: 'crystal' },
      emerald:   { tag: 'Ngọc lục sắc nét', pair: 'shield' },
      magma:     { tag: 'Dung nham rực',    pair: 'phoenix' },
      cyberpunk: { tag: 'Tương lai sáng',   pair: 'lightning' },
      royal:     { tag: 'Hoàng gia vàng',   pair: 'crown' },
      obsidian:  { tag: 'Đêm tối thượng',   pair: 'skull' },
    },
    flag: {
      classic:   { tag: 'Cổ điển dễ nhận',  pair: 'classic' },
      pirate:    { tag: 'Hải tặc đại dương',pair: 'ocean' },
      sakura:    { tag: 'Cánh hoa thanh',   pair: 'sakura' },
      hazard:    { tag: 'Cảnh báo nổi bật', pair: 'cyberpunk' },
      lightning: { tag: 'Xung điện nhanh',  pair: 'cyberpunk' },
      sapphire:  { tag: 'Ngọc lam mát',     pair: 'glacier' },
      shield:    { tag: 'Khiên phòng tuyến',pair: 'emerald' },
      radar:     { tag: 'Tín hiệu dò mìn',  pair: 'matrix' },
      crystal:   { tag: 'Phản quang tím',   pair: 'synthwave' },
      star:      { tag: 'Sao dẫn đường',    pair: 'royal' },
      phoenix:   { tag: 'Lửa phượng hoàng', pair: 'magma' },
      skull:     { tag: 'Sinh tồn áp lực',  pair: 'obsidian' },
      crown:     { tag: 'Vương miện vàng',  pair: 'royal' },
    },
  };

  // 4 Tactical Tiers inferred purely from coin price, paired with geometric SVG icons
  function getTierInfo(price) {
    const p = Number(price) || 0;
    if (p <= 180) {
      return {
        key: 'standard',
        label: 'Tiêu chuẩn',
        svg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><polygon points="8,2 14,13 2,13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
      };
    }
    if (p <= 360) {
      return {
        key: 'tactical',
        label: 'Chiến thuật',
        svg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><polygon points="8,1.5 14.5,8 8,14.5 1.5,8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
      };
    }
    if (p <= 620) {
      return {
        key: 'specops',
        label: 'Đặc nhiệm',
        svg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><polygon points="8,1.5 13.5,4.7 13.5,11.3 8,14.5 2.5,11.3 2.5,4.7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
      };
    }
    return {
      key: 'elite',
      label: 'Tinh anh',
      svg: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M8 1.5l1.9 4.2 4.6.5-3.4 3.1.9 4.5L8 11.5l-4 2.3.9-4.5L1.5 6.2l4.6-.5z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    };
  }

  function fmtCoins(n) {
    return Number(n || 0).toLocaleString('vi-VN');
  }

  function loadPinnedTarget() {
    try {
      const raw = localStorage.getItem(PIN_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.type === 'board' || parsed.type === 'flag') && parsed.id) {
        return parsed;
      }
    } catch (_) {}
    return null;
  }

  function savePinnedTarget(target) {
    try {
      if (!target) localStorage.removeItem(PIN_STORAGE_KEY);
      else localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(target));
    } catch (_) {}
  }

  const state = {
    catalog: null,
    activeType: 'board',
    searchQuery: '',
    ownFilter: 'all',    // all | affordable | unowned | owned
    tierFilter: 'all',   // all | standard | tactical | specops | elite
    sortBy: 'default',   // default | price-asc | price-desc | affordable | owned-first
    previewBoardId: 'classic',
    previewFlagId: 'classic',
    trialFlagMode: false,
    trialOpened: {},
    trialFlagged: {},
    pinnedTarget: loadPinnedTarget(),
    undoChange: null,
    undoTimerId: null,
    guestBannerDismissed: false,
    modalItem: null,
    modalCompareMode: false,
    autoEquipOnBuy: true,
    busyKey: null,
    lastFocusedEl: null,
  };

  function getItemsByType(type) {
    if (!state.catalog || !state.catalog.catalog) return [];
    return type === 'board' ? (state.catalog.catalog.boards || []) : (state.catalog.catalog.flags || []);
  }

  function findItem(type, id) {
    return getItemsByType(type).find((it) => it.id === id) || null;
  }

  function getUnlockedSet() {
    if (!state.catalog || !Array.isArray(state.catalog.unlocked)) return new Set(['classic']);
    return new Set(state.catalog.unlocked);
  }

  function getEquippedId(type) {
    if (!state.catalog || !state.catalog.equipped) return 'classic';
    return state.catalog.equipped[type] || 'classic';
  }

  function getMetaFor(type, id) {
    const group = CURATED_META[type] || {};
    return group[id] || { tag: 'Phong cách chiến thuật', pair: 'classic' };
  }

  function estimateWinsText(deficit) {
    if (deficit <= 0) return '';
    const hardWins = Math.ceil(deficit / ECONOMY.hard);
    const plusMed = Math.ceil(deficit / Math.round(ECONOMY.medium * ECONOMY.variantMult)); // 90 xu
    const medWins = Math.ceil(deficit / ECONOMY.medium);
    return 'Cần thêm ' + fmtCoins(deficit) + ' xu (~' + hardWins + ' ván Khó 180 xu hoặc ' + plusMed + ' ván Dấu cộng Trung bình 90 xu; không tính thưởng tốc độ, ' + medWins + ' ván Cổ điển TB).';
  }

  // ---------------------------------------------------------------------------
  // Wallet, Pinned Target & Reward Toggle
  // ---------------------------------------------------------------------------
  function renderWallet() {
    if (!state.catalog) return;
    const coins = Number(state.catalog.coins || 0);
    const unlockedSet = getUnlockedSet();
    const boards = getItemsByType('board');
    const flags = getItemsByType('flag');
    const totalOwned = boards.filter((b) => unlockedSet.has(b.id)).length + flags.filter((f) => unlockedSet.has(f.id)).length;
    const totalAll = boards.length + flags.length;

    const coinsEl = $('#shop-page-coins');
    if (coinsEl) coinsEl.textContent = fmtCoins(coins);

    const ownedTotalEl = $('#shop-owned-total');
    if (ownedTotalEl) ownedTotalEl.textContent = totalOwned + ' / ' + totalAll;

    const headerCoins = document.getElementById('header-coin-count');
    if (headerCoins) headerCoins.textContent = fmtCoins(coins);

    const tabBoardCount = $('#tab-count-board');
    if (tabBoardCount) tabBoardCount.textContent = '(' + boards.length + ')';
    const tabFlagCount = $('#tab-count-flag');
    if (tabFlagCount) tabFlagCount.textContent = '(' + flags.length + ')';

    renderPinnedGoal();
  }

  function renderPinnedGoal() {
    const box = $('#shop-target-pin-box');
    if (!box || !state.catalog) return;

    if (!state.pinnedTarget) {
      box.innerHTML = '<p class="shop-target-pin__hint">Nhấn biểu tượng ghim trên bất kỳ trang phục nào chưa sở hữu để theo dõi tiến độ tích xu.</p>';
      return;
    }

    const item = findItem(state.pinnedTarget.type, state.pinnedTarget.id);
    if (!item) {
      state.pinnedTarget = null;
      savePinnedTarget(null);
      box.innerHTML = '<p class="shop-target-pin__hint">Nhấn biểu tượng ghim trên bất kỳ trang phục nào chưa sở hữu để theo dõi tiến độ tích xu.</p>';
      return;
    }

    const owned = getUnlockedSet(state.pinnedTarget.type).has(item.id);
    const equipped = getEquippedId(state.pinnedTarget.type) === item.id;
    const coins = Number(state.catalog.coins || 0);
    const price = Math.max(0, Number(item.price || 0));
    const pct = price === 0 ? 100 : Math.min(100, Math.round((coins / price) * 100));
    const deficit = Math.max(0, price - coins);

    let subText;
    if (equipped) {
      subText = '<span class="shop-pin-status is-done">Đã sở hữu và đang trang bị.</span>';
    } else if (owned) {
      subText = '<span class="shop-pin-status is-done">Đã mở khóa! Nhấn mở chi tiết để trang bị.</span>';
    } else if (deficit === 0) {
      subText = '<span class="shop-pin-status is-ready">Đã đủ ' + fmtCoins(price) + ' xu — sẵn sàng mở khóa!</span>';
    } else {
      const hardWins = Math.ceil(deficit / ECONOMY.hard);
      subText = '<span class="shop-pin-status">Còn thiếu <strong>' + fmtCoins(deficit) + '</strong> xu (~' + hardWins + ' ván Khó)</span>';
    }

    box.innerHTML =
      '<div class="shop-pin-head">' +
        '<span class="shop-pin-label">MỤC TIÊU ĐANG GHIM: <strong>' + esc(item.name) + '</strong></span>' +
        '<div class="shop-pin-actions">' +
          '<button type="button" class="shop-link-btn" data-pin-open="1">Xem</button>' +
          '<button type="button" class="shop-link-btn shop-link-btn--muted" data-pin-clear="1" aria-label="Bỏ ghim mục tiêu">Bỏ ghim</button>' +
        '</div>' +
      '</div>' +
      '<div class="shop-pin-bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100">' +
        '<span class="shop-pin-bar__fill' + (pct >= 100 || owned ? ' is-ready' : '') + '" style="width:' + pct + '%"></span>' +
      '</div>' +
      '<div class="shop-pin-foot">' + subText + '<span class="shop-pin-pct">' + (owned ? '100%' : pct + '%') + '</span></div>';

    const openBtn = box.querySelector('[data-pin-open]');
    if (openBtn) {
      openBtn.addEventListener('click', () => openItemModal(state.pinnedTarget.type, item.id, openBtn));
    }
    const clearBtn = box.querySelector('[data-pin-clear]');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        const oldId = state.pinnedTarget.id;
        const oldType = state.pinnedTarget.type;
        state.pinnedTarget = null;
        savePinnedTarget(null);
        renderPinnedGoal();
        patchSingleCard(oldType, oldId);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Interactive 5x5 Live Tactical Trial Stage & Mobile Sticky Dock
  // ---------------------------------------------------------------------------
  function renderTrialStage() {
    if (!state.catalog) return;
    const boardItem = findItem('board', state.previewBoardId) || findItem('board', 'classic') || { id: 'classic', name: 'Cổ điển' };
    const flagItem = findItem('flag', state.previewFlagId) || findItem('flag', 'classic') || { id: 'classic', name: 'Cổ điển' };

    const isSameAsEquipped =
      boardItem.id === getEquippedId('board') &&
      flagItem.id === getEquippedId('flag');

    const comboLabel = $('#shop-trial-combo-label');
    if (comboLabel) comboLabel.textContent = boardItem.name + ' × ' + flagItem.name;

    const statusBadge = $('#shop-trial-status-badge');
    if (statusBadge) {
      statusBadge.textContent = isSameAsEquipped ? 'Đang trang bị' : 'Đang thử phối';
      statusBadge.className = 'shop-trial-status ' + (isSameAsEquipped ? 'is-equipped' : 'is-preview');
    }

    const revertBtn = $('#shop-trial-revert');
    if (revertBtn) revertBtn.hidden = isSameAsEquipped;

    const host = $('#shop-trial-board');
    if (host) {
      host.innerHTML = renderTacticalTrialBoardHtml({
        board: boardItem,
        flagId: flagItem.id,
        openedSet: state.trialOpened,
        flaggedSet: state.trialFlagged,
        interactive: true,
      });
    }

    const flagModeBtn = $('#shop-trial-flag-mode');
    if (flagModeBtn) {
      flagModeBtn.classList.toggle('is-active', state.trialFlagMode);
      flagModeBtn.setAttribute('aria-pressed', state.trialFlagMode ? 'true' : 'false');
    }

    const tipEl = $('#shop-trial-tip');
    if (tipEl) {
      tipEl.textContent = state.trialFlagMode
        ? 'Chế độ cắm cờ đang bật: nhấn vào ô kín để cắm hoặc gỡ cờ.'
        : 'Nhấn ô kín để thử mở số, chuột phải hoặc bật chế độ cắm cờ để thử lá cờ.';
    }

    renderTrialFooterActions(boardItem, flagItem, isSameAsEquipped);
    renderMobileDock(boardItem, flagItem, isSameAsEquipped);
  }

  function renderTrialFooterActions(boardItem, flagItem, isSameAsEquipped) {
    const wrap = $('#shop-trial-actions');
    if (!wrap) return;

    const unlockedBoards = getUnlockedSet('board');
    const unlockedFlags = getUnlockedSet('flag');
    const ownBoard = unlockedBoards.has(boardItem.id);
    const ownFlag = unlockedFlags.has(flagItem.id);
    const eqBoard = getEquippedId('board');
    const eqFlag = getEquippedId('flag');

    const parts = [];
    if (ownBoard && boardItem.id !== eqBoard) {
      parts.push('<button type="button" class="btn btn--primary btn--sm" data-stage-equip-type="board" data-stage-equip-id="' + esc(boardItem.id) + '">Trang bị bàn ' + esc(boardItem.name) + '</button>');
    } else if (!ownBoard) {
      parts.push('<button type="button" class="btn btn--gold btn--sm" data-stage-open-type="board" data-stage-open-id="' + esc(boardItem.id) + '">Mở bàn (' + fmtCoins(boardItem.price) + ' xu)</button>');
    }

    if (ownFlag && flagItem.id !== eqFlag) {
      parts.push('<button type="button" class="btn btn--primary btn--sm" data-stage-equip-type="flag" data-stage-equip-id="' + esc(flagItem.id) + '">Trang bị cờ ' + esc(flagItem.name) + '</button>');
    } else if (!ownFlag) {
      parts.push('<button type="button" class="btn btn--gold btn--sm" data-stage-open-type="flag" data-stage-open-id="' + esc(flagItem.id) + '">Mở cờ (' + fmtCoins(flagItem.price) + ' xu)</button>');
    }

    if (isSameAsEquipped || parts.length === 0) {
      wrap.innerHTML = '<span class="shop-trial-footer__note">Đang xem bộ trang phục hiện tại của bạn.</span>' +
        '<a class="shop-trial-footer__play" href="' + esc(window.MF_CONFIG?.ROUTES?.game || '/game') + '">Mang vào bàn chơi →</a>';
    } else {
      wrap.innerHTML = '<div class="shop-trial-footer__btns">' + parts.join('') + '</div>';
    }
  }

  function renderMobileDock(boardItem, flagItem, isSameAsEquipped) {
    const dock = $('#shop-mobile-dock');
    if (!dock) return;
    const dockName = $('#shop-mobile-dock-name');
    const dockRevert = $('#shop-mobile-dock-revert');
    if (dockName) dockName.textContent = boardItem.name + ' × ' + flagItem.name;
    if (dockRevert) dockRevert.hidden = isSameAsEquipped;
    dock.hidden = false;
  }

  function handleTrialCellInteraction(key, isRightClick) {
    const useFlag = isRightClick || state.trialFlagMode;
    if (useFlag) {
      const baseIsFlag = key === '2,1';
      const currentlyFlagged = (key in state.trialFlagged) ? !!state.trialFlagged[key] : baseIsFlag;
      state.trialFlagged[key] = !currentlyFlagged;
    } else {
      const hasFlag = (key in state.trialFlagged) ? !!state.trialFlagged[key] : (key === '2,1');
      if (hasFlag) return;
      state.trialOpened[key] = !state.trialOpened[key];
    }
    renderTrialStage();
  }

  // ---------------------------------------------------------------------------
  // Status Banners (Guest notice + Inline Undo Bar)
  // ---------------------------------------------------------------------------
  function renderStatusBanners() {
    const host = $('#shop-status-banners');
    if (!host) return;
    const chunks = [];

    if (state.undoChange) {
      const u = state.undoChange;
      chunks.push(
        '<div class="shop-banner shop-banner--undo">' +
          '<span>Đã trang bị <strong>' + esc(u.newName) + '</strong>.</span>' +
          '<div class="shop-banner__actions">' +
            '<button type="button" class="shop-chip-btn shop-chip-btn--sm" id="shop-undo-equip-btn">Hoàn tác về ' + esc(u.prevName) + '</button>' +
            '<button type="button" class="shop-banner__close" id="shop-undo-close-btn" aria-label="Đóng thông báo hoàn tác">×</button>' +
          '</div>' +
        '</div>'
      );
    }

    if (isGuestSession() && !state.guestBannerDismissed) {
      chunks.push(
        '<div class="shop-banner shop-banner--info">' +
          '<span><strong>Chế độ Khách:</strong> Xu và trang phục được lưu trên trình duyệt này. Đăng nhập để đồng bộ kỷ lục &amp; kho đồ lên tài khoản.</span>' +
          '<button type="button" class="shop-banner__close" id="shop-guest-close-btn" aria-label="Ẩn thông báo chế độ Khách">×</button>' +
        '</div>'
      );
    }

    host.innerHTML = chunks.join('');

    const undoBtn = $('#shop-undo-equip-btn');
    if (undoBtn && state.undoChange) {
      undoBtn.addEventListener('click', () => {
        const target = state.undoChange;
        clearUndoState();
        performEquip(target.type, target.prevId, { recordUndo: false });
      });
    }
    const undoClose = $('#shop-undo-close-btn');
    if (undoClose) undoClose.addEventListener('click', clearUndoState);

    const guestClose = $('#shop-guest-close-btn');
    if (guestClose) {
      guestClose.addEventListener('click', () => {
        state.guestBannerDismissed = true;
        renderStatusBanners();
      });
    }
  }

  function setUndoState(change) {
    if (state.undoTimerId) clearTimeout(state.undoTimerId);
    state.undoChange = change;
    renderStatusBanners();
    state.undoTimerId = setTimeout(clearUndoState, 10000);
  }

  function clearUndoState() {
    if (state.undoTimerId) clearTimeout(state.undoTimerId);
    state.undoTimerId = null;
    if (state.undoChange) {
      state.undoChange = null;
      renderStatusBanners();
    }
  }

  // ---------------------------------------------------------------------------
  // Catalog Filtering, Sorting & Card Rendering
  // ---------------------------------------------------------------------------
  function getFilteredItems() {
    const items = getItemsByType(state.activeType).slice();
    const unlocked = getUnlockedSet(state.activeType);
    const coins = Number(state.catalog?.coins || 0);
    const q = state.searchQuery.trim().toLowerCase();

    const filtered = items.filter((item) => {
      const owned = unlocked.has(item.id);
      const price = Number(item.price || 0);
      const tier = getTierInfo(price).key;
      const meta = getMetaFor(state.activeType, item.id);

      if (state.ownFilter === 'owned' && !owned) return false;
      if (state.ownFilter === 'unowned' && owned) return false;
      if (state.ownFilter === 'affordable' && (owned || coins < price)) return false;

      if (state.tierFilter !== 'all' && tier !== state.tierFilter) return false;

      if (q) {
        const hay = (item.name + ' ' + item.description + ' ' + meta.tag + ' ' + item.id).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (state.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (state.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (state.sortBy === 'owned-first') {
      filtered.sort((a, b) => {
        const oa = unlocked.has(a.id) ? 0 : 1;
        const ob = unlocked.has(b.id) ? 0 : 1;
        return oa !== ob ? oa - ob : a.price - b.price;
      });
    } else if (state.sortBy === 'affordable') {
      filtered.sort((a, b) => {
        const ca = (!unlocked.has(a.id) && coins >= a.price) ? 0 : (unlocked.has(a.id) ? 1 : 2);
        const cb = (!unlocked.has(b.id) && coins >= b.price) ? 0 : (unlocked.has(b.id) ? 1 : 2);
        return ca !== cb ? ca - cb : a.price - b.price;
      });
    }

    return filtered;
  }

  function hasActiveFilters() {
    return state.searchQuery.trim() !== '' || state.ownFilter !== 'all' || state.tierFilter !== 'all' || state.sortBy !== 'default';
  }

  function buildCardHtml(item, type) {
    const unlocked = getUnlockedSet(type).has(item.id);
    const equipped = getEquippedId(type) === item.id;
    const isPreviewing = (type === 'board' ? state.previewBoardId : state.previewFlagId) === item.id;
    const coins = Number(state.catalog?.coins || 0);
    const price = Number(item.price || 0);
    const canAfford = coins >= price;
    const isPinned = state.pinnedTarget && state.pinnedTarget.type === type && state.pinnedTarget.id === item.id;
    const isBusy = state.busyKey === (type + ':' + item.id);

    const tier = getTierInfo(price);
    const meta = getMetaFor(type, item.id);

    let statusPillHtml = '';
    if (equipped) {
      statusPillHtml = '<span class="shop-status-pill is-equipped">Đang dùng</span>';
    } else if (unlocked) {
      statusPillHtml = '<span class="shop-status-pill is-owned">Đã sở hữu</span>';
    } else if (canAfford) {
      statusPillHtml = '<span class="shop-status-pill is-affordable">Đủ xu</span>';
    } else {
      statusPillHtml = '<span class="shop-status-pill is-locked">Thiếu ' + fmtCoins(price - coins) + '</span>';
    }

    const previewHtml = type === 'board'
      ? renderBoardPreviewHtml(item, item.palette, item.accent, state.previewFlagId)
      : renderFlagPreviewHtml(item.id, item.accent, findItem('board', state.previewBoardId));

    let footPriceHtml = price === 0
      ? '<span class="shop-card__price shop-card__price--free">Miễn phí</span>'
      : '<span class="shop-card__price' + (!unlocked && !canAfford ? ' is-short' : '') + '">' + COIN_SVG_SM + ' ' + fmtCoins(price) + '</span>';

    let primaryBtnHtml = '';
    if (equipped) {
      primaryBtnHtml = '<span class="skin-badge--equipped">✓ Đang trang bị</span>';
    } else if (unlocked) {
      primaryBtnHtml = '<button type="button" class="btn btn--primary btn--sm" data-card-action="equip" ' + (isBusy ? 'disabled' : '') + '>' + (isBusy ? 'Đang xử lý…' : 'Trang bị') + '</button>';
    } else if (canAfford) {
      primaryBtnHtml = '<button type="button" class="btn btn--gold btn--sm" data-card-action="buy-modal" ' + (isBusy ? 'disabled' : '') + '>Mở khóa</button>';
    } else {
      primaryBtnHtml = '<button type="button" class="btn btn--ghost btn--sm" data-card-action="inspect">Chi tiết</button>';
    }

    const pinBtnHtml = unlocked
      ? ''
      : '<button type="button" class="shop-pin-btn' + (isPinned ? ' is-pinned' : '') + '" data-card-action="pin" aria-pressed="' + (isPinned ? 'true' : 'false') + '" aria-label="' + (isPinned ? 'Bỏ ghim mục tiêu ' : 'Ghim làm mục tiêu ') + esc(item.name) + '" title="' + (isPinned ? 'Bỏ ghim mục tiêu' : 'Ghim làm mục tiêu tích xu') + '">' +
          '<svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M12.5 3.5l4 4-2 2v3.5l-1.5 1.5-3.2-3.2-3.8 3.8-.8-.8 3.8-3.8L5.8 7.3 7.3 5.8h3.5l1.7-2.3z" fill="' + (isPinned ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>' +
        '</button>';

    return '<article class="shop-card shop-card--atelier' +
        (equipped ? ' is-equipped' : '') +
        (isPreviewing ? ' is-previewing' : '') +
        (!unlocked && !canAfford ? ' is-locked-card' : '') +
      '" data-skin-card="' + esc(item.id) + '" data-skin-type="' + esc(type) + '">' +
      '<div class="shop-card__head">' +
        '<span class="shop-tier-badge shop-tier--' + tier.key + '">' + tier.svg + '<span>' + tier.label + '</span></span>' +
        '<div class="shop-card__head-right">' + statusPillHtml + pinBtnHtml + '</div>' +
      '</div>' +

      '<button type="button" class="shop-card__preview-wrap shop-card__preview-btn" data-card-action="preview" aria-label="Thử phối ' + esc(item.name) + ' trên bàn 5×5" aria-pressed="' + (isPreviewing ? 'true' : 'false') + '">' +
        previewHtml +
        '<span class="shop-preview-hover-pill">' + (isPreviewing ? 'Đang hiển thị trên bàn thử' : 'Nhấn để thử phối') + '</span>' +
      '</button>' +

      '<div class="shop-card__info-block">' +
        '<div class="shop-card__title-row">' +
          '<strong class="shop-card__title">' + esc(item.name) + '</strong>' +
          '<span class="shop-card__tag">' + esc(meta.tag) + '</span>' +
        '</div>' +
        '<p class="shop-card__desc">' + esc(item.description) + '</p>' +
      '</div>' +

      '<div class="shop-card__foot-block">' +
        '<div class="shop-card__price-col">' + footPriceHtml + '</div>' +
        '<div class="shop-card__actions">' +
          '<button type="button" class="shop-detail-icon-btn" data-card-action="inspect" aria-label="Xem chi tiết ' + esc(item.name) + '" title="Xem chi tiết &amp; phối gợi ý">' +
            '<svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 9v4.5M10 6.5h.01" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>' +
          '</button>' +
          primaryBtnHtml +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderGrid(preserveScroll) {
    const grid = $('#shop-page-grid');
    if (!grid || !state.catalog) return;

    const prevY = preserveScroll ? window.scrollY : null;
    const type = state.activeType;
    const allItems = getItemsByType(type);
    const items = getFilteredItems();

    const counter = $('#shop-items-counter');
    if (counter) {
      const noun = type === 'board' ? 'giao diện' : 'kiểu cờ';
      const prefix = items.length === allItems.length
        ? (allItems.length + ' ' + noun)
        : (items.length + ' / ' + allItems.length + ' ' + noun);
      counter.textContent = prefix + ' · Mua một lần, dùng mãi mãi';
    }

    const resetBtn = $('#shop-filter-reset');
    if (resetBtn) resetBtn.hidden = !hasActiveFilters();

    if (items.length === 0) {
      grid.innerHTML =
        '<div class="shop-empty-state">' +
          '<p class="shop-empty-title">Không tìm thấy trang phục phù hợp với bộ lọc hiện tại.</p>' +
          '<p class="shop-empty-sub">Thử từ khóa khác hoặc đặt lại bộ lọc để xem toàn bộ danh mục.</p>' +
          '<button type="button" class="btn btn--ghost btn--sm" id="shop-empty-reset-btn">Đặt lại bộ lọc</button>' +
        '</div>';
      const emptyReset = $('#shop-empty-reset-btn');
      if (emptyReset) emptyReset.addEventListener('click', resetFilters);
      return;
    }

    grid.innerHTML = items.map((item) => buildCardHtml(item, type)).join('');

    if (prevY !== null && Math.abs(window.scrollY - prevY) > 4) {
      window.scrollTo({ top: prevY });
    }
  }

  // Targeted DOM patching: updates cards in place without rebuilding #shop-page-grid (preserves focus & scroll!)
  function patchAllVisibleCards() {
    const grid = $('#shop-page-grid');
    if (!grid || !state.catalog) return;
    const cards = grid.querySelectorAll('[data-skin-card]');
    cards.forEach((el) => {
      const id = el.getAttribute('data-skin-card');
      const type = el.getAttribute('data-skin-type');
      patchCardElement(el, type, id);
    });
  }

  function patchSingleCard(type, id) {
    if (type !== state.activeType) return;
    const grid = $('#shop-page-grid');
    if (!grid) return;
    const el = grid.querySelector('[data-skin-card="' + CSS.escape(id) + '"]');
    if (el) patchCardElement(el, type, id);
  }

  function patchCardElement(el, type, id) {
    const item = findItem(type, id);
    if (!item) return;
    const wasFocusedAction = el.contains(document.activeElement)
      ? document.activeElement.getAttribute('data-card-action')
      : null;

    const temp = document.createElement('div');
    temp.innerHTML = buildCardHtml(item, type);
    const fresh = temp.firstElementChild;
    if (!fresh) return;
    el.replaceWith(fresh);

    if (wasFocusedAction) {
      const restore = fresh.querySelector('[data-card-action="' + wasFocusedAction + '"]');
      if (restore) restore.focus({ preventScroll: true });
    }
  }

  function resetFilters() {
    state.searchQuery = '';
    state.ownFilter = 'all';
    state.tierFilter = 'all';
    state.sortBy = 'default';

    const searchInput = $('#shop-search-input');
    if (searchInput) searchInput.value = '';
    const searchClear = $('#shop-search-clear');
    if (searchClear) searchClear.hidden = true;
    const sortSel = $('#shop-sort-select');
    if (sortSel) sortSel.value = 'default';

    syncChipGroup('#shop-own-filters', 'data-own', 'all');
    syncChipGroup('#shop-tier-filters', 'data-tier', 'all');
    renderGrid(false);
  }

  function syncChipGroup(selector, attr, activeValue) {
    const group = $(selector);
    if (!group) return;
    group.querySelectorAll('.shop-filter-chip').forEach((btn) => {
      const match = btn.getAttribute(attr) === activeValue;
      btn.classList.toggle('is-active', match);
      btn.setAttribute('aria-pressed', match ? 'true' : 'false');
    });
  }

  // ---------------------------------------------------------------------------
  // Accessible Detail / Confirm Modal (Desktop Dialog & Mobile Bottom Sheet)
  // ---------------------------------------------------------------------------
  function openItemModal(type, id, triggerEl) {
    const item = findItem(type, id);
    if (!item || !state.catalog) return;

    state.lastFocusedEl = triggerEl || document.activeElement;
    state.modalItem = { type, id };
    state.modalCompareMode = false;

    const backdrop = $('#shop-detail-modal');
    if (!backdrop) return;
    renderModalContent();
    backdrop.hidden = false;
    document.body.classList.add('shop-modal-open');

    const closeBtn = $('#shop-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    const backdrop = $('#shop-detail-modal');
    if (!backdrop || backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.classList.remove('shop-modal-open');
    state.modalItem = null;

    if (state.lastFocusedEl && typeof state.lastFocusedEl.focus === 'function' && document.contains(state.lastFocusedEl)) {
      state.lastFocusedEl.focus({ preventScroll: true });
    }
    state.lastFocusedEl = null;
  }

  function renderModalContent() {
    if (!state.modalItem || !state.catalog) return;
    const { type, id } = state.modalItem;
    const item = findItem(type, id);
    if (!item) return;

    const tierEl = $('#shop-modal-tier');
    const bodyEl = $('#shop-modal-body');
    if (!bodyEl) return;

    const unlocked = getUnlockedSet(type).has(item.id);
    const equippedId = getEquippedId(type);
    const isEquipped = equippedId === item.id;
    const coins = Number(state.catalog.coins || 0);
    const price = Number(item.price || 0);
    const canAfford = coins >= price;
    const tier = getTierInfo(price);
    const meta = getMetaFor(type, item.id);
    const isBusy = state.busyKey === (type + ':' + id);

    // Counterpart pairing (curated recommendation vs currently equipped)
    const counterpartType = type === 'board' ? 'flag' : 'board';
    const pairItem = findItem(counterpartType, meta.pair) || findItem(counterpartType, 'classic');
    const currentCounterpart = findItem(counterpartType, type === 'board' ? state.previewFlagId : state.previewBoardId) || pairItem;

    const previewBoard = type === 'board' ? item : currentCounterpart;
    const previewFlag = type === 'flag' ? item : currentCounterpart;

    const equippedBoard = findItem('board', getEquippedId('board'));
    const equippedFlag = findItem('flag', getEquippedId('flag'));

    if (tierEl) {
      tierEl.innerHTML =
        '<span class="shop-tier-badge shop-tier--' + tier.key + '">' + tier.svg + '<span>' + tier.label + '</span></span>' +
        '<span class="shop-modal__kind">' + (type === 'board' ? 'Giao diện bàn chơi' : 'Kiểu cờ đánh dấu') + '</span>';
    }

    const swatchesHtml = Array.isArray(item.palette) && item.palette.length
      ? '<div class="shop-swatches">' +
          item.palette.map((c) => '<span class="shop-swatch" style="background:' + esc(c) + '" title="' + esc(c) + '"></span>').join('') +
        '</div>'
      : '';

    let stagePreviewHtml = '';
    if (state.modalCompareMode && !isEquipped) {
      stagePreviewHtml =
        '<div class="shop-ab-grid">' +
          '<div class="shop-ab-pane">' +
            '<span class="shop-ab-label">Đang dùng hiện tại</span>' +
            renderTacticalTrialBoardHtml({ board: equippedBoard, flagId: equippedFlag?.id || 'classic', compact: true }) +
            '<span class="shop-ab-name">' + esc(type === 'board' ? equippedBoard?.name : equippedFlag?.name) + '</span>' +
          '</div>' +
          '<div class="shop-ab-pane is-candidate">' +
            '<span class="shop-ab-label">Mẫu đang xem</span>' +
            renderTacticalTrialBoardHtml({ board: previewBoard, flagId: previewFlag?.id || 'classic', compact: true }) +
            '<span class="shop-ab-name">' + esc(item.name) + '</span>' +
          '</div>' +
        '</div>';
    } else {
      stagePreviewHtml =
        '<div class="shop-modal-stage-single">' +
          renderTacticalTrialBoardHtml({ board: previewBoard, flagId: previewFlag?.id || 'classic' }) +
          (type === 'flag'
            ? '<div class="shop-modal-flag-zoom">' + renderFlagPreviewHtml(item.id, item.accent, previewBoard) + '</div>'
            : '') +
        '</div>';
    }

    let actionPanelHtml = '';
    if (isEquipped) {
      actionPanelHtml =
        '<div class="shop-modal-owned-bar">' +
          '<span class="skin-badge--equipped">✓ Đang trang bị trên bàn chơi</span>' +
          '<a class="btn btn--primary btn--sm" href="' + esc(window.MF_CONFIG?.ROUTES?.game || '/game') + '">Vào chơi ngay</a>' +
        '</div>';
    } else if (unlocked) {
      actionPanelHtml =
        '<div class="shop-modal-cta-row">' +
          '<button type="button" class="btn btn--primary" id="shop-modal-equip-btn" ' + (isBusy ? 'disabled' : '') + '>' + (isBusy ? 'Đang trang bị…' : 'Trang bị ngay') + '</button>' +
          '<button type="button" class="btn btn--ghost" id="shop-modal-try-btn">Đưa lên bàn thử 5×5</button>' +
        '</div>';
    } else if (canAfford) {
      const remaining = coins - price;
      actionPanelHtml =
        '<div class="shop-modal-confirm-box">' +
          '<div class="shop-confirm-math">' +
            '<div><span>Giá mở khóa</span><strong>' + COIN_SVG_LG + ' ' + fmtCoins(price) + ' xu</strong></div>' +
            '<div><span>Số dư sau khi đổi</span><strong>' + fmtCoins(remaining) + ' xu</strong></div>' +
          '</div>' +
          '<p class="shop-autoequip-note">Mở khóa sẽ tự động trang bị ngay trên bàn chơi (có nút Hoàn tác).</p>' +
          '<button type="button" class="btn btn--gold shop-modal-buy-btn" id="shop-modal-buy-btn" ' + (isBusy ? 'disabled' : '') + '>' +
            (isBusy ? 'Đang xử lý giao dịch…' : 'Xác nhận mở khóa · ' + fmtCoins(price) + ' xu') +
          '</button>' +
        '</div>';
    } else {
      const deficit = price - coins;
      actionPanelHtml =
        '<div class="shop-modal-deficit-box">' +
          '<p class="shop-deficit-title">Chưa đủ xu để mở khóa (' + fmtCoins(coins) + ' / ' + fmtCoins(price) + ' xu)</p>' +
          '<p class="shop-deficit-desc">' + esc(estimateWinsText(deficit)) + '</p>' +
          '<div class="shop-modal-cta-row">' +
            '<a class="btn btn--primary btn--sm" href="' + esc(window.MF_CONFIG?.ROUTES?.modes || '/modes') + '">Vào bàn kiếm xu</a>' +
            '<button type="button" class="btn btn--ghost btn--sm" id="shop-modal-pin-btn">' +
              (state.pinnedTarget && state.pinnedTarget.type === type && state.pinnedTarget.id === id ? 'Bỏ ghim mục tiêu' : 'Ghim làm mục tiêu') +
            '</button>' +
          '</div>' +
        '</div>';
    }

    const guestNote = (!unlocked && isGuestSession())
      ? '<p class="shop-modal-guest-note">Chế độ Khách lưu trong trình duyệt này; đăng nhập để đồng bộ kho trang phục.</p>'
      : '';

    bodyEl.innerHTML =
      '<div class="shop-modal-layout">' +
        '<div class="shop-modal-preview-col">' +
          stagePreviewHtml +
          '<div class="shop-modal-preview-tools">' +
            (!isEquipped
              ? '<button type="button" class="shop-chip-btn shop-chip-btn--sm' + (state.modalCompareMode ? ' is-active' : '') + '" id="shop-modal-ab-btn" aria-pressed="' + (state.modalCompareMode ? 'true' : 'false') + '">So với đang dùng (A/B)</button>'
              : '') +
            '<button type="button" class="shop-chip-btn shop-chip-btn--sm" id="shop-modal-stage-try">Thử trên bàn 5×5</button>' +
          '</div>' +
        '</div>' +

        '<div class="shop-modal-info-col">' +
          '<h2 class="shop-modal__title" id="shop-modal-title">' + esc(item.name) + '</h2>' +
          '<p class="shop-modal__desc">' + esc(item.description) + '</p>' +
          '<div class="shop-modal__meta-row">' +
            '<span class="shop-card__tag">' + esc(meta.tag) + '</span>' +
            swatchesHtml +
          '</div>' +

          (pairItem
            ? '<div class="shop-synergy-box">' +
                '<div>' +
                  '<span class="shop-synergy-label">PHỐI ĂN Ý ĐỀ XUẤT</span>' +
                  '<strong class="shop-synergy-name">' + esc(type === 'board' ? (item.name + ' × ' + pairItem.name) : (pairItem.name + ' × ' + item.name)) + '</strong>' +
                '</div>' +
                '<button type="button" class="shop-chip-btn shop-chip-btn--sm" id="shop-modal-try-pair">Thử cặp này</button>' +
              '</div>'
            : '') +

          actionPanelHtml +
          guestNote +
        '</div>' +
      '</div>';

    // Wire modal interactions
    const abBtn = $('#shop-modal-ab-btn');
    if (abBtn) {
      abBtn.addEventListener('click', () => {
        state.modalCompareMode = !state.modalCompareMode;
        renderModalContent();
      });
    }

    const stageTryBtn = $('#shop-modal-stage-try');
    if (stageTryBtn) {
      stageTryBtn.addEventListener('click', () => {
        setPreviewSkin(type, id);
        toast('Đã đưa "' + item.name + '" lên bàn thử 5×5.');
      });
    }

    const tryBtn = $('#shop-modal-try-btn');
    if (tryBtn) {
      tryBtn.addEventListener('click', () => {
        setPreviewSkin(type, id);
        closeModal();
        $('#shop-trial-stage')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }

    const tryPairBtn = $('#shop-modal-try-pair');
    if (tryPairBtn && pairItem) {
      tryPairBtn.addEventListener('click', () => {
        if (type === 'board') {
          state.previewBoardId = item.id;
          state.previewFlagId = pairItem.id;
        } else {
          state.previewFlagId = item.id;
          state.previewBoardId = pairItem.id;
        }
        renderTrialStage();
        patchAllVisibleCards();
        renderModalContent();
        toast('Đang thử cặp ' + (type === 'board' ? (item.name + ' × ' + pairItem.name) : (pairItem.name + ' × ' + item.name)));
      });
    }

    const buyBtn = $('#shop-modal-buy-btn');
    if (buyBtn) {
      buyBtn.addEventListener('click', () => performBuy(type, id));
    }

    const equipBtn = $('#shop-modal-equip-btn');
    if (equipBtn) {
      equipBtn.addEventListener('click', async () => {
        await performEquip(type, id, { recordUndo: true });
        if (state.modalItem) renderModalContent();
      });
    }

    const pinBtn = $('#shop-modal-pin-btn');
    if (pinBtn) {
      pinBtn.addEventListener('click', () => {
        togglePinTarget(type, id);
        renderModalContent();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Actions: Preview, Pin, Buy, Equip (Targeted Updates)
  // ---------------------------------------------------------------------------
  function setPreviewSkin(type, id) {
    if (type === 'board') state.previewBoardId = id;
    else state.previewFlagId = id;

    renderTrialStage();
    // Updating grid cards cleanly in place: same-type preview highlight + opposite-type auto-paired thumbnails
    patchAllVisibleCards();
  }

  function togglePinTarget(type, id) {
    if (state.pinnedTarget && state.pinnedTarget.type === type && state.pinnedTarget.id === id) {
      state.pinnedTarget = null;
      savePinnedTarget(null);
      toast('Đã bỏ ghim mục tiêu.');
    } else {
      state.pinnedTarget = { type, id };
      savePinnedTarget(state.pinnedTarget);
      const item = findItem(type, id);
      if (item) toast('Đã ghim "' + item.name + '" làm mục tiêu tích xu.');
    }
    renderPinnedGoal();
    patchSingleCard(type, id);
  }

  async function performBuy(type, id) {
    const key = type + ':' + id;
    if (state.busyKey) return;
    const prevId = getEquippedId(type);
    const prevItem = findItem(type, prevId);
    state.busyKey = key;
    if (state.modalItem) renderModalContent();
    patchSingleCard(type, id);

    try {
      const res = await buySkin({ skinId: id, type });
      state.catalog.coins = res.coins;
      if (Array.isArray(res.unlocked)) {
        state.catalog.unlocked = res.unlocked;
      } else if (Array.isArray(state.catalog.unlocked) && !state.catalog.unlocked.includes(id)) {
        state.catalog.unlocked.push(id);
      }
      if (res.equipped) {
        state.catalog.equipped = res.equipped;
      } else {
        state.catalog.equipped = Object.assign({}, state.catalog.equipped, { [type]: id });
      }

      const boughtItem = findItem(type, id);
      if (state.pinnedTarget && state.pinnedTarget.type === type && state.pinnedTarget.id === id) {
        state.pinnedTarget = null;
        savePinnedTarget(null);
      }

      setPreviewSkin(type, id);
      if (prevId && prevId !== id) {
        setUndoState({
          type,
          prevId,
          prevName: prevItem ? prevItem.name : prevId,
          newId: id,
          newName: boughtItem ? boughtItem.name : id,
        });
      }
      toast('Đã mở khóa và trang bị "' + (boughtItem ? boughtItem.name : id) + '"!');

      renderWallet();
      renderTrialStage();

      if (state.ownFilter !== 'all' || state.sortBy === 'affordable' || state.sortBy === 'owned-first') {
        renderGrid(true);
      } else {
        patchAllVisibleCards();
      }
      if (state.modalItem) renderModalContent();
    } catch (e) {
      toast(e.message || 'Không thể mở khóa trang phục lúc này.');
    } finally {
      state.busyKey = null;
      if (state.modalItem) renderModalContent();
      patchSingleCard(type, id);
    }
  }

  async function performEquip(type, id, opts) {
    const recordUndo = opts ? opts.recordUndo !== false : true;
    const key = type + ':' + id;
    if (state.busyKey) return;
    const prevId = getEquippedId(type);
    if (prevId === id) return;
    const prevItem = findItem(type, prevId);
    const nextItem = findItem(type, id);

    state.busyKey = key;
    patchSingleCard(type, id);

    try {
      const res = await equipSkin({ skinId: id, type });
      if (res && res.equipped) {
        state.catalog.equipped = res.equipped;
      } else {
        state.catalog.equipped = Object.assign({}, state.catalog.equipped, { [type]: id });
      }

      // Sync stage preview to newly equipped skin on that channel
      if (type === 'board') state.previewBoardId = id;
      else state.previewFlagId = id;

      if (recordUndo) {
        setUndoState({
          type,
          prevId,
          prevName: prevItem ? prevItem.name : prevId,
          newId: id,
          newName: nextItem ? nextItem.name : id,
        });
      }

      renderTrialStage();
      patchAllVisibleCards();
      renderPinnedGoal();
      toast('Đã trang bị "' + (nextItem ? nextItem.name : id) + '".');
    } catch (e) {
      toast(e.message || 'Không thể trang bị trang phục.');
    } finally {
      state.busyKey = null;
      patchSingleCard(type, id);
    }
  }

  // ---------------------------------------------------------------------------
  // Event Wiring & Bootstrap
  // ---------------------------------------------------------------------------
  function bindEvents() {
    // Collapsible reward rules
    const rewardToggle = $('#shop-reward-toggle');
    const rewardPanel = $('#shop-reward-panel');
    if (rewardToggle && rewardPanel) {
      rewardToggle.addEventListener('click', () => {
        const nextOpen = rewardPanel.hidden;
        rewardPanel.hidden = !nextOpen;
        rewardToggle.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
        rewardToggle.classList.toggle('is-open', nextOpen);
      });
    }

    // Interactive 5x5 Trial Stage cells (left & right click)
    const trialBoard = $('#shop-trial-board');
    if (trialBoard) {
      trialBoard.addEventListener('click', (e) => {
        const cell = e.target.closest('[data-trial-cell]');
        if (!cell) return;
        handleTrialCellInteraction(cell.getAttribute('data-trial-cell'), false);
      });
      trialBoard.addEventListener('contextmenu', (e) => {
        const cell = e.target.closest('[data-trial-cell]');
        if (!cell) return;
        e.preventDefault();
        handleTrialCellInteraction(cell.getAttribute('data-trial-cell'), true);
      });
    }

    $('#shop-trial-flag-mode')?.addEventListener('click', () => {
      state.trialFlagMode = !state.trialFlagMode;
      renderTrialStage();
    });

    $('#shop-trial-reset-board')?.addEventListener('click', () => {
      state.trialOpened = {};
      state.trialFlagged = {};
      renderTrialStage();
    });

    $('#shop-trial-random')?.addEventListener('click', () => {
      if (!state.catalog) return;
      const boards = getItemsByType('board');
      const flags = getItemsByType('flag');
      if (boards.length) state.previewBoardId = boards[Math.floor(Math.random() * boards.length)].id;
      if (flags.length) state.previewFlagId = flags[Math.floor(Math.random() * flags.length)].id;
      renderTrialStage();
      patchAllVisibleCards();
    });

    const revertToEquipped = () => {
      state.previewBoardId = getEquippedId('board');
      state.previewFlagId = getEquippedId('flag');
      renderTrialStage();
      patchAllVisibleCards();
    };
    $('#shop-trial-revert')?.addEventListener('click', revertToEquipped);
    $('#shop-mobile-dock-revert')?.addEventListener('click', revertToEquipped);

    $('#shop-mobile-dock-jump')?.addEventListener('click', () => {
      $('#shop-trial-stage')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Stage footer delegated equip/open triggers
    $('#shop-trial-actions')?.addEventListener('click', (e) => {
      const eqBtn = e.target.closest('[data-stage-equip-id]');
      if (eqBtn) {
        performEquip(eqBtn.getAttribute('data-stage-equip-type'), eqBtn.getAttribute('data-stage-equip-id'), { recordUndo: true });
        return;
      }
      const openBtn = e.target.closest('[data-stage-open-id]');
      if (openBtn) {
        openItemModal(openBtn.getAttribute('data-stage-open-type'), openBtn.getAttribute('data-stage-open-id'), openBtn);
      }
    });

    // Category Tabs (Board / Flag)
    const tabGroup = $('#shop-page-type-seg');
    if (tabGroup) {
      tabGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-value]');
        if (!btn) return;
        const nextType = btn.getAttribute('data-value');
        if (nextType === state.activeType) return;
        state.activeType = nextType;
        tabGroup.querySelectorAll('button[role="tab"]').forEach((b) => {
          const act = b === btn;
          b.classList.toggle('is-active', act);
          b.setAttribute('aria-selected', act ? 'true' : 'false');
        });
        renderGrid(false);
      });
    }

    // Search input
    const searchInput = $('#shop-search-input');
    const searchClear = $('#shop-search-clear');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.searchQuery = searchInput.value;
        if (searchClear) searchClear.hidden = state.searchQuery.length === 0;
        renderGrid(false);
      });
    }
    if (searchClear && searchInput) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        state.searchQuery = '';
        searchClear.hidden = true;
        searchInput.focus();
        renderGrid(false);
      });
    }

    // Sort select
    const sortSel = $('#shop-sort-select');
    if (sortSel) {
      sortSel.addEventListener('change', () => {
        state.sortBy = sortSel.value;
        renderGrid(false);
      });
    }

    // Ownership filter chips
    $('#shop-own-filters')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-own]');
      if (!btn) return;
      state.ownFilter = btn.getAttribute('data-own');
      syncChipGroup('#shop-own-filters', 'data-own', state.ownFilter);
      renderGrid(false);
    });

    // Tier filter chips
    $('#shop-tier-filters')?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-tier]');
      if (!btn) return;
      state.tierFilter = btn.getAttribute('data-tier');
      syncChipGroup('#shop-tier-filters', 'data-tier', state.tierFilter);
      renderGrid(false);
    });

    $('#shop-filter-reset')?.addEventListener('click', resetFilters);

    // Delegated Product Grid clicks
    const grid = $('#shop-page-grid');
    if (grid) {
      grid.addEventListener('click', (e) => {
        const actionEl = e.target.closest('[data-card-action]');
        const cardEl = e.target.closest('[data-skin-card]');
        if (!actionEl || !cardEl) return;

        const action = actionEl.getAttribute('data-card-action');
        const id = cardEl.getAttribute('data-skin-card');
        const type = cardEl.getAttribute('data-skin-type');

        if (action === 'preview') {
          setPreviewSkin(type, id);
        } else if (action === 'pin') {
          togglePinTarget(type, id);
        } else if (action === 'equip') {
          performEquip(type, id, { recordUndo: true });
        } else if (action === 'buy-modal' || action === 'inspect') {
          openItemModal(type, id, actionEl);
        }
      });
    }

    // Accessible Modal close + keyboard focus trap
    const modalBackdrop = $('#shop-detail-modal');
    $('#shop-modal-close')?.addEventListener('click', closeModal);
    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!modalBackdrop || modalBackdrop.hidden) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key === 'Tab') {
        const focusable = Array.from(
          modalBackdrop.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')
        ).filter((el) => !el.hidden && el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  async function loadCatalog() {
    const grid = $('#shop-page-grid');
    try {
      state.catalog = await getShop();
      state.previewBoardId = getEquippedId('board');
      state.previewFlagId = getEquippedId('flag');
      renderWallet();
      renderTrialStage();
      renderStatusBanners();
      renderGrid(false);
    } catch (e) {
      if (grid) {
        grid.innerHTML =
          '<div class="shop-empty-state shop-empty-state--error">' +
            '<p class="shop-empty-title">Không thể tải cửa hàng trang phục.</p>' +
            '<p class="shop-empty-sub">' + esc(e.message || 'Vui lòng kiểm tra kết nối và thử lại.') + '</p>' +
            '<button type="button" class="btn btn--primary btn--sm" id="shop-retry-load">Thử tải lại</button>' +
          '</div>';
        $('#shop-retry-load')?.addEventListener('click', loadCatalog);
      }
    }
  }

  async function boot() {
    const session = await requireSession();
    if (!session) return;
    initHeader('shop');
    bindEvents();
    await loadCatalog();
  }

  boot();
})();
