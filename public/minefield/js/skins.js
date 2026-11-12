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
  };

  function getFlagSvg(skinId) {
    return FLAG_SVGS[skinId] || FLAG_SVGS.classic;
  }

  window.MF_SKINS = {
    FLAG_SVGS,
    getFlagSvg,
  };
})();

