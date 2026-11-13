/**
 * Dò Mìn — Admin Command Deck Interactive Controller (admin.js)
 * Supports: +Xu Modal with custom amounts & presets, live search, tab switching, AJAX updates & toasts.
 */
document.addEventListener('DOMContentLoaded', function () {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  const adminBase = (window.MF_CONFIG && window.MF_CONFIG.ROUTES && window.MF_CONFIG.ROUTES.admin) || '/admin';
  const cleanAdmin = adminBase.replace(/\/+$/, '');

  // --------------------------------------------------------------------------
  // 1. Toast Notification Utility
  // --------------------------------------------------------------------------
  function showToast(message, type = 'success') {
    let container = document.getElementById('admin-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'admin-toast-container';
      container.className = 'admin-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `admin-toast admin-toast--${type}`;
    const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
    toast.innerHTML = `<span class="admin-toast__icon">${icon}</span><span class="admin-toast__text">${escapeHtml(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('is-leaving');
      setTimeout(() => toast.remove(), 300);
    }, 3800);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  }

  // --------------------------------------------------------------------------
  // 2. Tab Switching (Tài khoản & Kỷ lục)
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.admin-tab-btn');
  const tabPanels = document.querySelectorAll('.admin-tab-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      tabButtons.forEach((b) => b.classList.toggle('is-active', b === btn));
      tabPanels.forEach((p) => {
        const isMatch = p.id === `tab-${targetTab}`;
        p.classList.toggle('is-active', isMatch);
        p.hidden = !isMatch;
      });
      // Save active tab in localStorage
      try { localStorage.setItem('mf_admin_tab', targetTab); } catch (e) {}
    });
  });

  // Restore active tab
  try {
    const savedTab = localStorage.getItem('mf_admin_tab');
    if (savedTab) {
      const matchingBtn = document.querySelector(`.admin-tab-btn[data-tab="${savedTab}"]`);
      if (matchingBtn) matchingBtn.click();
    }
  } catch (e) {}

  // --------------------------------------------------------------------------
  // 3. Collapsible Forms (Thêm tài khoản & Thêm kỷ lục)
  // --------------------------------------------------------------------------
  document.querySelectorAll('[data-toggle-collapse]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.toggleCollapse;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const isHidden = targetEl.hidden;
        targetEl.hidden = !isHidden;
        btn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        if (isHidden) {
          const firstInput = targetEl.querySelector('input:not([type="hidden"])');
          if (firstInput) firstInput.focus();
        }
      }
    });
  });

  // --------------------------------------------------------------------------
  // 4. Modal "+ Xu" (Nhập số xu muốn cộng & chọn số xu nhanh)
  // --------------------------------------------------------------------------
  const modal = document.getElementById('add-coins-modal');
  const modalUserTitle = document.getElementById('modal-coins-user');
  const modalBalance = document.getElementById('modal-coins-balance');
  const modalInput = document.getElementById('modal-coins-amount');
  const modalForm = document.getElementById('modal-coins-form');
  const modalUserIdInput = document.getElementById('modal-coins-user-id');
  const modalCloseBtns = document.querySelectorAll('.modal-close-trigger');

  let activeUserRow = null;

  function openAddCoinsModal(btn) {
    if (!modal) return;
    const userId = btn.dataset.userId;
    const username = btn.dataset.username || 'Người chơi';
    const currentCoins = parseInt(btn.dataset.currentCoins || '0', 10);

    activeUserRow = btn.closest('tr');
    if (modalUserIdInput) modalUserIdInput.value = userId;
    if (modalUserTitle) modalUserTitle.textContent = username;
    if (modalBalance) modalBalance.textContent = formatNumber(currentCoins) + ' xu';
    if (modalInput) {
      modalInput.value = '1000';
      modalInput.min = '1';
      modalInput.step = '1';
    }
    if (modalForm) {
      modalForm.action = `${cleanAdmin}/users/${userId}/give-coins`;
    }

    modal.hidden = false;
    modal.classList.add('is-open');
    document.body.classList.add('modal-is-open');

    setTimeout(() => {
      if (modalInput) {
        modalInput.focus();
        modalInput.select();
      }
    }, 60);
  }

  function closeAddCoinsModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-is-open');
    setTimeout(() => {
      modal.hidden = true;
    }, 220);
  }

  // Open modal on click
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.btn-add-coins');
    if (trigger) {
      e.preventDefault();
      openAddCoinsModal(trigger);
    }
  });

  // Close triggers
  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', closeAddCoinsModal);
  });

  // Close on Escape or click outside
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && !modal.hidden) {
      closeAddCoinsModal();
    }
  });
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
        closeAddCoinsModal();
      }
    });
  }

  // Quick Preset Buttons (+500, +1,000, +5,000, +20,000, +100,000, +999,999)
  document.querySelectorAll('.coin-preset-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.amount;
      if (modalInput && val) {
        modalInput.value = val;
        modalInput.focus();
      }
    });
  });

  // Handle "+ Xu" Submit via AJAX
  if (modalForm) {
    modalForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const userId = modalUserIdInput ? modalUserIdInput.value : '';
      const amount = parseInt(modalInput ? modalInput.value : '0', 10);

      if (!userId || isNaN(amount) || amount <= 0) {
        showToast('Vui lòng nhập số xu hợp lệ lớn hơn 0!', 'error');
        return;
      }

      const submitBtn = modalForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang xử lý...';
      }

      try {
        const url = `${cleanAdmin}/users/${userId}/give-coins`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify({ amount: amount })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          showToast(data.message || `Đã cộng +${formatNumber(amount)} xu thành công!`, 'success');

          // Update table row if present
          if (activeUserRow) {
            const coinBadge = activeUserRow.querySelector('.user-coins-display');
            if (coinBadge) {
              coinBadge.innerHTML = `<span class="coin-icon">🪙</span> ${formatNumber(data.coins)} <span class="coin-unit">xu</span>`;
              coinBadge.classList.add('is-bumped');
              setTimeout(() => coinBadge.classList.remove('is-bumped'), 700);
            }
            const coinInput = activeUserRow.querySelector('input[name="coins"]');
            if (coinInput) coinInput.value = data.coins;

            const addCoinsBtn = activeUserRow.querySelector('.btn-add-coins');
            if (addCoinsBtn) addCoinsBtn.dataset.currentCoins = data.coins;
          }

          closeAddCoinsModal();
        } else {
          showToast(data.message || 'Có lỗi xảy ra khi cộng xu!', 'error');
        }
      } catch (err) {
        modalForm.submit();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Xác nhận cộng xu';
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. Live Search & Filters for User Table
  // --------------------------------------------------------------------------
  const userSearchInput = document.getElementById('user-search-input');
  const userRoleFilter = document.getElementById('user-role-filter');
  const userStatusFilter = document.getElementById('user-status-filter');
  const userRows = document.querySelectorAll('.user-table-row');
  const userEmptyRow = document.getElementById('user-empty-search-row');

  function filterUsers() {
    const query = (userSearchInput ? userSearchInput.value : '').trim().toLowerCase();
    const role = userRoleFilter ? userRoleFilter.value : '';
    const status = userStatusFilter ? userStatusFilter.value : '';

    let visibleCount = 0;

    userRows.forEach((row) => {
      const username = (row.dataset.username || '').toLowerCase();
      const displayName = (row.dataset.displayName || '').toLowerCase();
      const userRole = row.dataset.role || '';
      const userStatus = row.dataset.status || '';

      const matchQuery = !query || username.includes(query) || displayName.includes(query);
      const matchRole = !role || userRole === role;
      const matchStatus = !status || userStatus === status;

      const isMatch = matchQuery && matchRole && matchStatus;
      row.style.display = isMatch ? '' : 'none';
      if (isMatch) visibleCount++;
    });

    if (userEmptyRow) {
      userEmptyRow.style.display = visibleCount === 0 && userRows.length > 0 ? '' : 'none';
    }
  }

  if (userSearchInput) userSearchInput.addEventListener('input', filterUsers);
  if (userRoleFilter) userRoleFilter.addEventListener('change', filterUsers);
  if (userStatusFilter) userStatusFilter.addEventListener('change', filterUsers);

  // --------------------------------------------------------------------------
  // 6. Live Search & Filters for Records Table
  // --------------------------------------------------------------------------
  const recordSearchInput = document.getElementById('record-search-input');
  const recordModeFilter = document.getElementById('record-mode-filter');
  const recordDiffFilter = document.getElementById('record-diff-filter');
  const recordRows = document.querySelectorAll('.record-table-row');
  const recordEmptyRow = document.getElementById('record-empty-search-row');

  function filterRecords() {
    const query = (recordSearchInput ? recordSearchInput.value : '').trim().toLowerCase();
    const mode = recordModeFilter ? recordModeFilter.value : '';
    const diff = recordDiffFilter ? recordDiffFilter.value : '';

    let visibleCount = 0;

    recordRows.forEach((row) => {
      const player = (row.dataset.player || '').toLowerCase();
      const rowMode = row.dataset.mode || '';
      const rowDiff = row.dataset.difficulty || '';

      const matchQuery = !query || player.includes(query);
      const matchMode = !mode || rowMode === mode;
      const matchDiff = !diff || rowDiff === diff;

      const isMatch = matchQuery && matchMode && matchDiff;
      row.style.display = isMatch ? '' : 'none';
      if (isMatch) visibleCount++;
    });

    if (recordEmptyRow) {
      recordEmptyRow.style.display = visibleCount === 0 && recordRows.length > 0 ? '' : 'none';
    }
  }

  if (recordSearchInput) recordSearchInput.addEventListener('input', filterRecords);
  if (recordModeFilter) recordModeFilter.addEventListener('change', filterRecords);
  if (recordDiffFilter) recordDiffFilter.addEventListener('change', filterRecords);

  // --------------------------------------------------------------------------
  // 7. Lock / Unlock AJAX Toggle
  // --------------------------------------------------------------------------
  document.querySelectorAll('.btn-lock-toggle').forEach((btn) => {
    btn.addEventListener('click', async function (e) {
      e.preventDefault();
      const form = btn.closest('form');
      if (!form) return;

      btn.disabled = true;
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(data.message, 'success');
          const row = btn.closest('tr');
          if (row) {
            row.dataset.status = data.is_locked ? 'locked' : 'active';
            const statusBadge = row.querySelector('.user-status-cell');
            if (statusBadge) {
              statusBadge.innerHTML = data.is_locked
                ? '<span class="status-pill status-pill--locked"><span class="status-dot"></span> Bị khóa</span>'
                : '<span class="status-pill status-pill--active"><span class="status-dot"></span> Hoạt động</span>';
            }
            btn.textContent = data.is_locked ? 'Mở khóa' : 'Khóa';
            btn.className = `btn btn--sm ${data.is_locked ? 'btn--success' : 'btn--warning'}`;
          }
        } else {
          showToast(data.message || 'Lỗi khi thay đổi trạng thái!', 'error');
        }
      } catch (err) {
        form.submit();
      } finally {
        btn.disabled = false;
      }
    });
  });
});
