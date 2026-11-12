(function () {
  'use strict';

  const api = window.MF_API;
  const ui = window.MF_UI;
  const cfg = window.MF_CONFIG || {};
  const routes = cfg.ROUTES || {};
  const $ = (id) => document.getElementById(id);

  ui.initHeader();

  const COPY = {
    login:  {
      heroTitle: 'Một ô nữa.<br><span class="text-gold-gradient">Một kỷ lục mới.</span>',
      heroLead: 'Bài toán mở cho một cái đầu nhạy bén. Mở ô, cắm cờ và chinh phục bãi mìn theo cách của bạn.',
      eyebrow: 'CHÀO MỪNG TRỞ LẠI',
      title: 'Sẵn sàng dò mìn?',
      sub: 'Đăng nhập để tiếp tục chuỗi chiến thắng.',
      submit: 'Vào bãi mìn →',
      footnote: 'Chơi ngay không cần tài khoản: Kỷ lục và xu không lưu lại',
    },
    signup: {
      heroTitle: 'Nước đi đầu.<br><span class="text-gold-gradient">Dấu ấn riêng.</span>',
      heroLead: 'Lưu thành tích, tích xu chiến thắng và biến mỗi bàn chơi thành phong cách của bạn.',
      eyebrow: 'GIA NHẬP BÃI MÌN',
      title: 'Lần đầu đến?',
      sub: 'Mở tài khoản. Mở kỷ lục của bạn.',
      submit: 'Tạo tài khoản →',
      footnote: 'Lưu kỷ lục · Tích xu · Mở khóa giao diện',
    },
  };

  const tabs = $('auth-tabs');
  const form = $('auth-form');
  const errorEl = $('form-error');
  const submitBtn = $('submit');
  let tab = 'login';

  function showError(msg) {
    errorEl.textContent = msg || '';
    errorEl.hidden = !msg;
  }

  function setTab(next) {
    tab = next;
    tabs.querySelectorAll('button').forEach((b) => {
      const on = b.dataset.tab === next;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    const heroTitleEl = $('auth-hero-title');
    const heroLeadEl = $('auth-hero-lead');
    const eyebrowEl = $('auth-eyebrow');
    const titleEl = $('auth-title');
    const subEl = $('auth-sub');
    const microSubEl = $('auth-micro-sub');

    if (heroTitleEl) heroTitleEl.innerHTML = COPY[next].heroTitle;
    if (heroLeadEl) heroLeadEl.textContent = COPY[next].heroLead;
    if (eyebrowEl) eyebrowEl.textContent = COPY[next].eyebrow;
    if (titleEl) titleEl.textContent = COPY[next].title;
    if (subEl) subEl.textContent = COPY[next].sub;
    if (microSubEl) microSubEl.textContent = COPY[next].footnote;

    submitBtn.textContent = COPY[next].submit;
    $('field-display').hidden = next !== 'signup';
    $('password').autocomplete = next === 'signup' ? 'new-password' : 'current-password';
    showError('');
  }

  // Password visibility toggle
  const togglePwBtn = $('toggle-pw');
  if (togglePwBtn) {
    togglePwBtn.addEventListener('click', () => {
      const pwInput = $('password');
      if (!pwInput) return;
      const isPw = pwInput.type === 'password';
      pwInput.type = isPw ? 'text' : 'password';
      togglePwBtn.classList.toggle('is-showing', isPw);
    });
  }

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-tab]');
    if (b) setTab(b.dataset.tab);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');
    const username = $('username').value.trim();
    const password = $('password').value;
    if (!username || !password) { showError('Hãy nhập tên đăng nhập và mật khẩu.'); return; }

    submitBtn.disabled = true;
    try {
      const authenticated = tab === 'login'
        ? await api.login({ username, password })
        : await api.signup({ username, password, displayName: $('display').value });
      location.href = authenticated.role === 'admin' ? (routes.admin || '/admin') : (routes.modes || '/modes');
    } catch (err) {
      showError(err.message);
      submitBtn.disabled = false;
    }
  });

  $('guest').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await api.playAsGuest();
      location.href = routes.modes || '/modes';
    } catch (error) {
      showError(error.message);
    }
  });

  $('admin-link').href = routes.adminLogin || cfg.ADMIN_URL || '/admin/login';

  setTab('login');
})();
