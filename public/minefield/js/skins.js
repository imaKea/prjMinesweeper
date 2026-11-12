(function () {
  'use strict';

  const FLAG_SVGS = {
    classic: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.5 2v12" stroke="#9fb0c3" stroke-width="1.6" stroke-linecap="round"/><path d="M5 2.6 12.5 5.6 5 8.6z" fill="#e4a63b"/></svg>',
    pirate: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2v12" stroke="#64748b" stroke-width="1.6" stroke-linecap="round"/><path d="M4 2.5h8.5v6.5H4z" fill="#0f172a"/><circle cx="8.2" cy="5.2" r="1.6" fill="#f8fafc"/><path d="M6.5 7.8l3.4-2.4M9.9 7.8L6.5 5.4" stroke="#f8fafc" stroke-width="0.8" stroke-linecap="round"/></svg>',
    hazard: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 14.5h8" stroke="#64748b" stroke-width="1.5" stroke-linecap="round"/><path d="M8 14V4" stroke="#64748b" stroke-width="1.5"/><path d="M8 2.5l5 7H3z" fill="#facc15" stroke="#ca8a04" stroke-width="0.8"/><circle cx="8" cy="8.2" r="0.6" fill="#000"/><path d="M8 5.2v2" stroke="#000" stroke-width="1.2" stroke-linecap="round"/></svg>',
    sapphire: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 1.5v13" stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round"/><circle cx="4" cy="1.5" r="1.2" fill="#fbbf24"/><path d="M4.5 2.5h7.5l-2.5 3 2.5 3H4.5z" fill="#2563eb" stroke="#1d4ed8" stroke-width="0.5"/><path d="M6.5 5.5h3.5" stroke="#fbbf24" stroke-width="1" stroke-linecap="round"/></svg>',
    radar: '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#06b6d4" stroke-width="1.2" stroke-dasharray="2 1"/><circle cx="8" cy="8" r="2.2" fill="rgba(6,182,212,0.3)" stroke="#06b6d4" stroke-width="1"/><path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="#22d3ee" stroke-width="1.4" stroke-linecap="round"/></svg>',
    star: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.5l1.9 4.2 4.6.6-3.4 3.1.9 4.6L8 11.7l-4 2.3.9-4.6L1.5 6.3l4.6-.6z" fill="#f59e0b" stroke="#d97706" stroke-width="0.8"/><circle cx="8" cy="7.5" r="1.5" fill="#fef08a"/></svg>',
    skull: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2a4.5 4.5 0 0 0-4.5 4.5c0 1.9 1 3.2 2 4.1v2.4h5v-2.4c1-.9 2-2.2 2-4.1A4.5 4.5 0 0 0 8 2z" fill="#e11d48" stroke="#be123c" stroke-width="0.8"/><circle cx="6.2" cy="6" r="1" fill="#1e1b4b"/><circle cx="9.8" cy="6" r="1" fill="#1e1b4b"/><path d="M7 11.5v1.5M9 11.5v1.5" stroke="#be123c" stroke-width="0.8"/></svg>',
    sakura: '<svg viewBox="0 0 16 16" aria-hidden="true"><g fill="#f472b6" stroke="#fbcfe8" stroke-width="0.4"><ellipse cx="8" cy="4.2" rx="1.7" ry="2.6"/><ellipse cx="8" cy="4.2" rx="1.7" ry="2.6" transform="rotate(72 8 8)"/><ellipse cx="8" cy="4.2" rx="1.7" ry="2.6" transform="rotate(144 8 8)"/><ellipse cx="8" cy="4.2" rx="1.7" ry="2.6" transform="rotate(216 8 8)"/><ellipse cx="8" cy="4.2" rx="1.7" ry="2.6" transform="rotate(288 8 8)"/></g><circle cx="8" cy="8" r="1.6" fill="#fef08a"/></svg>',
    lightning: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M9.4 1.5 3.8 8.7h4L6.6 14.5l5.6-7.2h-4z" fill="#facc15" stroke="#fef08a" stroke-width="0.8" stroke-linejoin="round"/></svg>',
    shield: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8 13.2 4v4c0 3.3-2.2 5.4-5.2 6.4C5 13.4 2.8 11.3 2.8 8V4z" fill="#065f46" stroke="#34d399" stroke-width="1.1"/><path d="m5.7 8 1.6 1.6 3.2-3.2" fill="none" stroke="#a7f3d0" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    crystal: '<svg viewBox="0 0 16 16" aria-hidden="true"><polygon points="8,1.5 13,6 8,14.5 3,6" fill="#0ea5e9" stroke="#bae6fd" stroke-width="0.9"/><polygon points="8,1.5 10.5,6 8,14.5 5.5,6" fill="#7dd3fc" opacity="0.65"/><line x1="3" y1="6" x2="13" y2="6" stroke="#e0f2fe" stroke-width="0.8"/></svg>',
    phoenix: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8.5 1.5C6.2 4 5.5 6.1 6.2 7.8c-1.1-.4-1.8-1.3-2-2.4-1.4 1.5-1.7 4-.4 5.9 1 1.5 2.6 2.5 4.4 2.5 2.7 0 4.6-2 4.6-4.7 0-2.7-1.9-5.1-4.3-7.6z" fill="#f97316" stroke="#fed7aa" stroke-width="0.6"/><path d="M8 6.4c-1.3 1.4-1.6 3-.8 4.4.6 1 1.8 1.4 2.8.8 1-.6 1.3-2 .6-3.2-.6-1-1.5-1.6-2.6-2z" fill="#fde047"/></svg>',
    crown: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 11.5 3.1 4.5 6 7.4 8 3l2 4.4 2.9-2.9 1.1 7z" fill="#eab308" stroke="#fef08a" stroke-width="0.8" stroke-linejoin="round"/><rect x="2" y="11.8" width="12" height="1.8" rx="0.7" fill="#ca8a04"/><circle cx="8" cy="9" r="1" fill="#f43f5e"/><circle cx="4.8" cy="9.4" r="0.8" fill="#38bdf8"/><circle cx="11.2" cy="9.4" r="0.8" fill="#38bdf8"/></svg>',
  };

  function escAttr(s) {
    return String(s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
  }

  function getFlagSvg(skinId) {
    return FLAG_SVGS[skinId] || FLAG_SVGS.classic;
  }

  function buildPreviewStyleVars(itemOrSkinId, palette, accent) {
    const item = (itemOrSkinId && typeof itemOrSkinId === 'object')
      ? itemOrSkinId
      : { id: itemOrSkinId || 'classic', palette: palette, accent: accent };
    const skinId = item.id || 'classic';
    const pal = item.palette || ['#141c25', '#2a3541', '#344252', '#e4a63b'];
    const borderCol = item.accent || pal[3] || '#e4a63b';
    const style =
      '--sp-bg:' + escAttr(pal[0]) + ';' +
      '--sp-open:' + escAttr(pal[0]) + ';' +
      '--sp-cell:' + escAttr(pal[1]) + ';' +
      '--sp-cell-hi:' + escAttr(pal[2] || pal[1]) + ';' +
      '--sp-accent:' + escAttr(borderCol) + ';' +
      'background:' + escAttr(pal[0]) + ';' +
      'border-color:' + escAttr(borderCol) + ';' +
      'box-shadow:0 8px 20px rgba(0,0,0,0.45), 0 0 16px ' + escAttr(borderCol) + '33;';
    return { skinId, style };
  }

  function renderBoardPreviewHtml(itemOrSkinId, palette, accent, flagSkinId) {
    const { skinId, style } = buildPreviewStyleVars(itemOrSkinId, palette, accent);
    const activeFlag = (itemOrSkinId && typeof itemOrSkinId === 'object' && itemOrSkinId.flagId)
      ? itemOrSkinId.flagId
      : (flagSkinId || 'classic');
    const flagSvg = getFlagSvg(activeFlag);

    const c = (cls, text) => '<span class="sp-c ' + cls + '">' + (text || '') + '</span>';
    const closed = () => c('sp-c--closed');
    const open = (cls, text) => c('sp-c--open ' + (cls || ''), text);

    return '<div class="shop-preview-matrix" data-skin="' + escAttr(skinId) + '" style="' + style + '">' +
      '<div class="sp-row">' + closed() + closed() + closed() + closed() + closed() + '</div>' +
      '<div class="sp-row">' + closed() + closed() + open('n1', '1') + open('n1', '1') + open('n1', '1') + '</div>' +
      '<div class="sp-row">' + closed() + open('n1', '1') + open('n2', '2') + c('sp-c--closed is-flag', flagSvg) + open('n1', '1') + '</div>' +
      '<div class="sp-row">' + closed() + open('n1', '1') + closed() + open('n2', '2') + open('n1', '1') + '</div>' +
      '<div class="sp-row">' + closed() + open('n1', '1') + open('n1', '1') + open('n1', '1') + open('', '') + '</div>' +
    '</div>';
  }

  function renderFlagPreviewHtml(skinId, accent, boardItem) {
    const styles = [];
    if (accent) styles.push('--flag-accent:' + escAttr(accent));
    let cls = 'shop-preview-flag';
    if (boardItem && typeof boardItem === 'object' && Array.isArray(boardItem.palette)) {
      cls += ' shop-preview-flag--on-board';
      styles.push('--sp-bg:' + escAttr(boardItem.palette[0] || '#141c25'));
      styles.push('--sp-cell:' + escAttr(boardItem.palette[1] || '#2a3541'));
      styles.push('--sp-accent:' + escAttr(boardItem.accent || boardItem.palette[3] || accent || '#e4a63b'));
    }
    const styleAttr = styles.length ? (' style="' + styles.join(';') + '"') : '';
    return '<div class="' + cls + '"' + styleAttr + '>' + getFlagSvg(skinId) + '</div>';
  }

  // Canonical 5x5 mini puzzle used by the Shop Live Tactical Trial Stage & A/B compare
  const TRIAL_LAYOUT = [
    ['C', 'C', 'C', '1', '0'],
    ['C', '3', '2', '1', '0'],
    ['2', 'F', '1', '0', '0'],
    ['1', '2', '2', '1', 'C'],
    ['0', '1', 'C', 'C', 'C'],
  ];

  function renderTacticalTrialBoardHtml(opts) {
    const cfg = opts || {};
    const { skinId, style } = buildPreviewStyleVars(cfg.board || 'classic');
    const flagSvg = getFlagSvg(cfg.flagId || 'classic');
    const openedSet = cfg.openedSet || {};
    const flaggedSet = cfg.flaggedSet || {};
    const interactive = !!cfg.interactive;
    const extraCls = cfg.compact ? ' shop-trial-matrix--compact' : '';

    let rowsHtml = '';
    for (let r = 0; r < 5; r++) {
      let rowCells = '';
      for (let cIdx = 0; cIdx < 5; cIdx++) {
        const key = r + ',' + cIdx;
        const baseToken = TRIAL_LAYOUT[r][cIdx];
        const isPresetFlag = baseToken === 'F';
        const isClosedBase = baseToken === 'C' || isPresetFlag;
        const isUserOpened = !!openedSet[key];
        const hasFlag = (key in flaggedSet) ? !!flaggedSet[key] : isPresetFlag;

        let cellCls = 'sp-c';
        let inner = '';
        let ariaLabel = '';

        if (!isClosedBase || (isUserOpened && !hasFlag)) {
          const num = isClosedBase ? ((r + cIdx) % 3 === 0 ? '2' : '1') : baseToken;
          cellCls += ' sp-c--open';
          if (num === '1' || num === '2' || num === '3') {
            cellCls += ' n' + num;
            inner = num;
            ariaLabel = 'Ô đã mở số ' + num;
          } else {
            ariaLabel = 'Ô đã mở trống';
          }
        } else if (hasFlag) {
          cellCls += ' sp-c--closed is-flag';
          inner = flagSvg;
          ariaLabel = 'Ô đang cắm cờ';
        } else {
          cellCls += ' sp-c--closed';
          ariaLabel = 'Ô chưa mở';
        }

        if (interactive) {
          rowCells += '<button type="button" class="' + cellCls + ' sp-c--btn" data-trial-cell="' + key + '" aria-label="' + ariaLabel + '">' + inner + '</button>';
        } else {
          rowCells += '<span class="' + cellCls + '">' + inner + '</span>';
        }
      }
      rowsHtml += '<div class="sp-row">' + rowCells + '</div>';
    }

    return '<div class="shop-preview-matrix shop-trial-matrix' + extraCls + '" data-skin="' + escAttr(skinId) + '" style="' + style + '">' + rowsHtml + '</div>';
  }

  window.MF_SKINS = {
    FLAG_SVGS,
    getFlagSvg,
    renderBoardPreviewHtml,
    renderFlagPreviewHtml,
    renderTacticalTrialBoardHtml,
  };
})();
