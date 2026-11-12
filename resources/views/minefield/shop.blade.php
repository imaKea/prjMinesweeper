<!doctype html>
<html lang="vi">
@include('minefield.partials.head', ['title' => 'Dò Mìn · Cửa hàng trang phục'])
<body class="page-shop">
  <header class="app-header" id="app-header"></header>

  <main class="shop-page">
    <!-- Back to Game Navigation -->
    <div class="shop-nav-back anim-fade-up" style="margin-bottom: 1.25rem;">
      <a class="back back-pill" href="{{ route('minefield.game') }}" id="shop-back-to-game">
        ← Quay lại bàn chơi
      </a>
    </div>

    <!-- Tactical Live Atelier Hero -->
    <section class="shop-atelier-hero anim-fade-up" aria-labelledby="shop-hero-heading">
      <div class="shop-hero-left">
        <p class="eyebrow">PHÒNG THỬ CHIẾN THUẬT · CỬA HÀNG TRANG PHỤC</p>
        <h1 class="hero" id="shop-hero-heading">Bàn chơi mới.<br><span class="hero-highlight">Chất riêng mới.</span></h1>
        <p class="lead">Phối thử bàn cờ và lá cờ ngay trên bàn 5×5 trước khi đổi bằng xu tài năng. Mua một lần, dùng mãi mãi.</p>

        <div class="shop-wallet-card" id="shop-balance-card">
          <div class="shop-wallet-top">
            <div class="shop-wallet-balance-wrap">
              <span class="shop-wallet-label">SỐ DƯ HIỆN TẠI</span>
              <div class="shop-wallet-value-row">
                <span class="shop-wallet-coin-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400e" font-family="sans-serif">$</text></svg>
                </span>
                <span class="balance-card-amount" id="shop-page-coins">0</span>
                <span class="shop-wallet-unit">xu</span>
              </div>
            </div>
            <div class="shop-wallet-owned">
              <span class="shop-wallet-label">BỘ SƯU TẬP</span>
              <strong class="shop-owned-fraction" id="shop-owned-total">2 / 26</strong>
            </div>
          </div>

          <!-- Pinned Target Goal Slot (hydrated by shop.js) -->
          <div class="shop-target-pin" id="shop-target-pin-box">
            <p class="shop-target-pin__hint">Nhấn nút ghim trên một trang phục bất kỳ để đặt làm mục tiêu tích xu.</p>
          </div>

          <!-- Collapsible Economy Transparency Bar -->
          <div class="shop-economy-disclosure">
            <button type="button" class="shop-economy-toggle" id="shop-reward-toggle" aria-expanded="false" aria-controls="shop-reward-panel">
              <span>Cách kiếm xu · Không nạp tiền</span>
              <span class="shop-economy-rates-mini">Dễ +30 · TB +75 · Khó +180</span>
              <svg class="shop-chevron" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M5 7.5L10 12.5L15 7.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <div class="shop-economy-panel" id="shop-reward-panel" hidden>
              <ul class="shop-economy-list">
                <li><strong>Thắng theo độ khó:</strong> Dễ <code>+30</code> · Trung bình <code>+75</code> · Khó <code>+180</code> xu.</li>
                <li><strong>Biến thể Dấu cộng / Góc chéo:</strong> Thưởng cơ bản <code>×1.2</code> (<code>36</code> / <code>90</code> / <code>216</code> xu).</li>
                <li><strong>Thưởng tốc độ:</strong> Dưới 30s <code>+100</code> · Dưới 60s <code>+50</code> · Dưới 100s <code>+25</code> xu.</li>
              </ul>
              <a class="shop-economy-cta" href="{{ route('minefield.modes') }}">Vào bàn kiếm thêm xu →</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Interactive 5x5 Live Tactical Trial Stage -->
      <div class="shop-trial-stage" id="shop-trial-stage" aria-label="Bàn thử trực tiếp 5x5">
        <div class="shop-trial-head">
          <div>
            <span class="shop-trial-kicker">BÀN THỬ TRỰC TIẾP · 5×5</span>
            <h2 class="shop-trial-combo" id="shop-trial-combo-label">Cổ điển × Cờ Đỏ Cổ Điển</h2>
          </div>
          <span class="shop-trial-status" id="shop-trial-status-badge">Đang trang bị</span>
        </div>

        <div class="shop-trial-board-wrap">
          <div id="shop-trial-board" class="shop-trial-board-host"></div>
          <p class="shop-trial-tip" id="shop-trial-tip">Nhấn ô kín để thử mở số, chuột phải hoặc bật chế độ cắm cờ để thử cờ.</p>
        </div>

        <div class="shop-trial-controls">
          <button type="button" class="shop-chip-btn" id="shop-trial-flag-mode" aria-pressed="false" title="Chuyển chế độ nhấn chuột thành cắm cờ">
            <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true"><path d="M5 2.5v15M5.5 3.5l9.5 3-9.5 3.5z" fill="currentColor" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
            <span>Chế độ cắm cờ</span>
          </button>
          <button type="button" class="shop-chip-btn" id="shop-trial-reset-board" title="Khôi phục trạng thái ô ban đầu">Đặt lại ô</button>
          <button type="button" class="shop-chip-btn" id="shop-trial-random" title="Thử phối ngẫu nhiên 1 cặp bàn và cờ">Phối ngẫu nhiên</button>
          <button type="button" class="shop-chip-btn shop-chip-btn--ghost" id="shop-trial-revert" hidden>Về bộ đang dùng</button>
        </div>

        <div class="shop-trial-footer" id="shop-trial-actions">
          <!-- Populated dynamically by shop.js: Equip / Unlock / Equipped summary for previewed pair -->
        </div>
      </div>
    </section>

    <!-- Contextual Notices (Guest mode + Undo Equipped Action) -->
    <div id="shop-status-banners" class="shop-status-banners" aria-live="polite"></div>

    <!-- Filter & Search Toolbar -->
    <section class="shop-toolbar anim-fade-up anim-d1" aria-label="Bộ lọc cửa hàng">
      <div class="shop-toolbar-top">
        <div class="seg seg--sm shop-tabs" id="shop-page-type-seg" role="tablist" aria-label="Loại trang phục">
          <button type="button" role="tab" class="is-active" data-value="board" aria-selected="true">Giao diện bàn <span class="shop-tab-count" id="tab-count-board">(13)</span></button>
          <button type="button" role="tab" data-value="flag" aria-selected="false">Kiểu cờ đánh dấu <span class="shop-tab-count" id="tab-count-flag">(13)</span></button>
        </div>

        <div class="shop-toolbar-tools">
          <div class="shop-search-box">
            <svg class="shop-search-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M13 13l4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
            <input type="search" id="shop-search-input" class="shop-search-input" placeholder="Tìm theo tên hoặc phong cách…" autocomplete="off" aria-label="Tìm trang phục">
            <button type="button" id="shop-search-clear" class="shop-search-clear" aria-label="Xóa từ khóa" hidden>×</button>
          </div>

          <label class="shop-sort-wrap">
            <span class="sr-only">Sắp xếp theo</span>
            <select id="shop-sort-select" class="shop-sort-select" aria-label="Sắp xếp trang phục">
              <option value="default">Mặc định</option>
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="affordable">Đủ xu mua ngay</option>
              <option value="owned-first">Đã sở hữu trước</option>
            </select>
          </label>
        </div>
      </div>

      <div class="shop-toolbar-filters">
        <div class="shop-chip-group" id="shop-own-filters" role="group" aria-label="Lọc theo trạng thái sở hữu">
          <button type="button" class="shop-filter-chip is-active" data-own="all" aria-pressed="true">Tất cả</button>
          <button type="button" class="shop-filter-chip" data-own="affordable" aria-pressed="false">Đủ xu mua</button>
          <button type="button" class="shop-filter-chip" data-own="unowned" aria-pressed="false">Chưa sở hữu</button>
          <button type="button" class="shop-filter-chip" data-own="owned" aria-pressed="false">Đã sở hữu</button>
        </div>

        <div class="shop-chip-group" id="shop-tier-filters" role="group" aria-label="Lọc theo bậc thiết kế">
          <button type="button" class="shop-filter-chip is-active" data-tier="all" aria-pressed="true">Mọi bậc</button>
          <button type="button" class="shop-filter-chip" data-tier="standard" aria-pressed="false">Tiêu chuẩn</button>
          <button type="button" class="shop-filter-chip" data-tier="tactical" aria-pressed="false">Chiến thuật</button>
          <button type="button" class="shop-filter-chip" data-tier="specops" aria-pressed="false">Đặc nhiệm</button>
          <button type="button" class="shop-filter-chip" data-tier="elite" aria-pressed="false">Tinh anh</button>
        </div>

        <div class="shop-toolbar-meta">
          <span class="shop-items-counter" id="shop-items-counter">13 giao diện · Mua một lần, dùng mãi mãi</span>
          <button type="button" class="shop-filter-reset" id="shop-filter-reset" hidden>Xóa bộ lọc</button>
        </div>
      </div>
    </section>

    <!-- Product Grid -->
    <div class="shop-grid" id="shop-page-grid" aria-live="polite">
      <div class="shop-card shop-card--skeleton" aria-hidden="true"><div class="skel skel-preview"></div><div class="skel skel-line"></div><div class="skel skel-line skel-line--short"></div></div>
      <div class="shop-card shop-card--skeleton" aria-hidden="true"><div class="skel skel-preview"></div><div class="skel skel-line"></div><div class="skel skel-line skel-line--short"></div></div>
      <div class="shop-card shop-card--skeleton" aria-hidden="true"><div class="skel skel-preview"></div><div class="skel skel-line"></div><div class="skel skel-line skel-line--short"></div></div>
      <div class="shop-card shop-card--skeleton" aria-hidden="true"><div class="skel skel-preview"></div><div class="skel skel-line"></div><div class="skel skel-line skel-line--short"></div></div>
    </div>

    <!-- Footer Note -->
    <footer class="shop-page-footer anim-fade-up">
      <p>Giao diện chỉ thay đổi diện mạo. Luật chơi và cơ hội chiến thắng luôn như nhau.</p>
    </footer>
  </main>

  <!-- Mobile Sticky Preview Dock (< 640px) -->
  <aside class="shop-mobile-dock" id="shop-mobile-dock" hidden aria-label="Bản xem thử đang chọn">
    <div class="shop-mobile-dock__info">
      <span class="shop-mobile-dock__label">ĐANG THỬ PHỐI</span>
      <strong class="shop-mobile-dock__name" id="shop-mobile-dock-name">Cổ điển × Cờ Đỏ Cổ Điển</strong>
    </div>
    <div class="shop-mobile-dock__actions">
      <button type="button" class="shop-chip-btn shop-chip-btn--sm" id="shop-mobile-dock-jump">Xem bàn 5×5</button>
      <button type="button" class="shop-chip-btn shop-chip-btn--sm shop-chip-btn--ghost" id="shop-mobile-dock-revert" hidden>Hoàn tác</button>
    </div>
  </aside>

  <!-- Accessible Detail / Confirm Modal (Bottom sheet on mobile) -->
  <div class="shop-modal-backdrop" id="shop-detail-modal" hidden>
    <div class="shop-modal" role="dialog" aria-modal="true" aria-labelledby="shop-modal-title" tabindex="-1">
      <div class="shop-modal__head">
        <div class="shop-modal__tier" id="shop-modal-tier"></div>
        <button type="button" class="shop-modal__close" id="shop-modal-close" aria-label="Đóng chi tiết">×</button>
      </div>
      <div class="shop-modal__body" id="shop-modal-body"></div>
    </div>
  </div>

  @include('minefield.partials.scripts', ['pageScript' => 'shop.js'])
</body>
</html>
