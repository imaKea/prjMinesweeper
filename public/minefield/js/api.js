(function () {
  'use strict';

  const BASE = (window.MF_CONFIG && window.MF_CONFIG.API_BASE) || '/api';
  let session = window.MF_INITIAL_SESSION || null;
  const prefsKey = 'mf_prefs';

  async function request(path, options) {
    let response;
    try {
      response = await fetch(BASE + path, {
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
          ...(options && options.headers),
        },
        ...options,
      });
    } catch (error) {
      throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra mạng.');
    }

    let body = null;
    if (response.status !== 204) {
      try {
        body = await response.json();
      } catch (error) {
        body = null;
      }
    }
    if (!response.ok) {
      const validationMessage = body && body.errors ? Object.values(body.errors).flat()[0] : null;
      const fallback = response.status === 419
        ? 'Phiên làm việc đã hết hạn. Hãy tải lại trang và thử lại.'
        : 'Yêu cầu không thể hoàn thành.';
      throw new Error(response.status === 419 ? fallback : (validationMessage || (body && body.message) || fallback));
    }
    return body;
  }

  const post = (path, data) => request(path, { method: 'POST', body: JSON.stringify(data || {}) });

  async function signup(data) { session = await post('/signup', data); return session; }
  async function login(data) { session = await post('/login', data); return session; }
  async function adminLogin(data) { session = await post('/admin/login', data); return session; }
  async function playAsGuest() { session = await post('/guest'); return session; }

  async function logout() {
    await post('/logout');
    session = null;
  }

  async function submitResult({ token, mode, difficulty, timeMs }) {
    if (!token) throw new Error('Không tìm thấy phiên chơi.');
    const result = await post('/games/' + encodeURIComponent(token) + '/win', { mode, difficulty, timeMs: Math.round(timeMs) });
    if (result && result.coinsEarned != null) {
      if (session && !session.guest && result.coins != null) {
        session.coins = result.coins;
      } else {
        const currentGuestCoins = getGuestCoins() + result.coinsEarned;
        setGuestCoins(currentGuestCoins);
        if (session) session.coins = currentGuestCoins;
      }
      notifyCoinsChange(session ? session.coins : 0, result.coinsEarned);
    }
    return result;
  }

  // ------------------------------------------------------------- guest skins
  const guestCoinsKey = 'mf_guest_coins';
  const guestSkinsKey = 'mf_guest_unlocked';
  const guestEquippedKey = 'mf_guest_equipped';

  function isGuest() {
    return !session || session.guest;
  }

  function getGuestCoins() {
    return parseInt(localStorage.getItem(guestCoinsKey) || '0', 10) || 0;
  }
  function setGuestCoins(val) {
    localStorage.setItem(guestCoinsKey, String(Math.max(0, val)));
  }
  function getGuestUnlocked() {
    try {
      const arr = JSON.parse(localStorage.getItem(guestSkinsKey) || '[]');
      return Array.isArray(arr) ? ['classic', ...arr.filter((x) => x !== 'classic')] : ['classic'];
    } catch (e) {
      return ['classic'];
    }
  }
  function getGuestEquipped() {
    try {
      return Object.assign({ board: 'classic', flag: 'classic' }, JSON.parse(localStorage.getItem(guestEquippedKey) || '{}'));
    } catch (e) {
      return { board: 'classic', flag: 'classic' };
    }
  }

  // ---------------------------------------------------------------- shop API
  const skinListeners = [];
  const coinsListeners = [];

  function onSkinChange(fn) { skinListeners.push(fn); }
  function onCoinsChange(fn) { coinsListeners.push(fn); }
  function notifySkinChange(equipped) {
    skinListeners.forEach((fn) => { try { fn(equipped); } catch (e) {} });
  }
  function notifyCoinsChange(coins, earned) {
    coinsListeners.forEach((fn) => { try { fn(coins, earned); } catch (e) {} });
  }

  async function getShop() {
    const data = await request('/shop');
    if (isGuest()) {
      data.coins = getGuestCoins();
      data.equipped = getGuestEquipped();
      data.unlocked = getGuestUnlocked();
    } else {
      session.coins = data.coins;
      session.equippedBoardSkin = data.equipped.board;
      session.equippedFlagSkin = data.equipped.flag;
    }
    return data;
  }

  async function buySkin({ skinId, type }) {
    if (isGuest()) {
      const catalogData = await request('/shop');
      const list = (catalogData.catalog && catalogData.catalog[type === 'board' ? 'boards' : 'flags']) || [];
      const item = list.find((s) => s.id === skinId);
      if (!item) throw new Error('Không tìm thấy trang phục.');
      const coins = getGuestCoins();
      if (coins < item.price) throw new Error('Không đủ xu! Hãy thắng thêm các ván chơi để kiếm xu.');
      const unlocked = getGuestUnlocked();
      if (!unlocked.includes(skinId)) unlocked.push(skinId);
      localStorage.setItem(guestSkinsKey, JSON.stringify(unlocked));
      setGuestCoins(coins - item.price);
      const equipped = getGuestEquipped();
      equipped[type] = skinId;
      localStorage.setItem(guestEquippedKey, JSON.stringify(equipped));
      if (session) {
        session.coins = coins - item.price;
        if (type === 'board') session.equippedBoardSkin = skinId;
        else session.equippedFlagSkin = skinId;
      }
      notifyCoinsChange(getGuestCoins());
      notifySkinChange(equipped);
      return { success: true, coins: getGuestCoins(), equipped, unlocked };
    }

    const res = await post('/shop/buy', { skin_id: skinId, type });
    if (session && res.coins != null) {
      session.coins = res.coins;
      session.equippedBoardSkin = res.equipped.board;
      session.equippedFlagSkin = res.equipped.flag;
    }
    notifyCoinsChange(res.coins);
    notifySkinChange(res.equipped);
    return res;
  }

  async function equipSkin({ skinId, type }) {
    if (isGuest()) {
      const unlocked = getGuestUnlocked();
      if (skinId !== 'classic' && !unlocked.includes(skinId)) {
        throw new Error('Bạn chưa sở hữu trang phục này.');
      }
      const equipped = getGuestEquipped();
      equipped[type] = skinId;
      localStorage.setItem(guestEquippedKey, JSON.stringify(equipped));
      if (session) {
        if (type === 'board') session.equippedBoardSkin = skinId;
        else session.equippedFlagSkin = skinId;
      }
      notifySkinChange(equipped);
      return { success: true, equipped };
    }

    const res = await post('/shop/equip', { skin_id: skinId, type });
    if (session && res.equipped) {
      session.equippedBoardSkin = res.equipped.board;
      session.equippedFlagSkin = res.equipped.flag;
    }
    notifySkinChange(res.equipped);
    return res;
  }

  async function giveCoins(amount = null) {
    const res = await post('/admin/give-coins', amount != null ? { amount } : {});
    if (res && res.coins != null) {
      if (session) session.coins = res.coins;
      notifyCoinsChange(res.coins);
    }
    return res;
  }
  const grantAdminCoins = giveCoins;

  function getEquipped() {
    if (isGuest()) {
      return getGuestEquipped();
    }
    return {
      board: (session && session.equippedBoardSkin) || 'classic',
      flag: (session && session.equippedFlagSkin) || 'classic',
    };
  }

  function getCoins() {
    if (isGuest()) {
      return getGuestCoins();
    }
    return (session && session.coins) || 0;
  }

  async function submitLoss(token) {
    if (!token) return { saved: false };
    return post('/games/' + encodeURIComponent(token) + '/loss');
  }

  async function useHint(token) {
    if (!token) throw new Error('Không tìm thấy phiên chơi.');
    const hintCost = 100;
    if (isGuest()) {
      const coins = getGuestCoins();
      if (coins < hintCost) {
        throw new Error('Bạn không đủ xu! Cần ' + hintCost + ' xu để sử dụng gợi ý (Số dư: ' + coins + ' xu).');
      }
    }

    const res = await post('/games/' + encodeURIComponent(token) + '/hint');
    if (res && res.success) {
      if (isGuest()) {
        const newCoins = Math.max(0, getGuestCoins() - hintCost);
        setGuestCoins(newCoins);
        if (session) session.coins = newCoins;
        res.coins = newCoins;
        notifyCoinsChange(newCoins);
      } else if (res.coins != null) {
        if (session) session.coins = res.coins;
        notifyCoinsChange(res.coins);
      }
    }
    return res;
  }

  async function getLeaderboard({ mode, difficulty, limit = 10 }) {
    const params = new URLSearchParams({ mode, difficulty, limit: String(limit) });
    return request('/leaderboard?' + params.toString());
  }

  async function getBestTime({ mode, difficulty }) {
    const params = new URLSearchParams({ mode, difficulty });
    return (await request('/best-time?' + params.toString())).timeMs;
  }

  function getPrefs() {
    try {
      return Object.assign({ mode: 'classic', difficulty: 'medium' }, JSON.parse(localStorage.getItem(prefsKey) || '{}'));
    } catch (error) {
      return { mode: 'classic', difficulty: 'medium' };
    }
  }

  function setPrefs(value) {
    localStorage.setItem(prefsKey, JSON.stringify(Object.assign(getPrefs(), value)));
  }

  window.MF_API = {
    getSession: () => session,
    signup,
    login,
    adminLogin,
    playAsGuest,
    logout,
    startGame: (data) => post('/games', data),
    useHint,
    submitResult,
    submitLoss,
    getLeaderboard,
    getBestTime,
    getPrefs,
    setPrefs,
    getShop,
    buySkin,
    equipSkin,
    giveCoins,
    grantAdminCoins,
    getEquipped,
    getCoins,
    onSkinChange,
    onCoinsChange,
  };
})();