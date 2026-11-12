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

    <!-- Top Hero Section (Image 2 Design in Dark Tactical Theme) -->
    <div class="shop-hero-section">
      <div class="shop-hero-left">
        <p class="eyebrow anim-fade-up">CỬA HÀNG TRANG PHỤC</p>
        <h1 class="hero anim-fade-up anim-d1">Bàn chơi mới.<br><span class="hero-highlight">Chất riêng mới.</span></h1>
        <p class="lead anim-fade-up anim-d2">Đổi xu chiến thắng lấy một diện mạo xứng tầm nước đi của bạn.</p>
      </div>

      <div class="shop-balance-card anim-fade-up anim-d2" id="shop-balance-card">
        <div class="balance-card-header">
          <span class="balance-card-label">SỐ DƯ CỦA BẠN</span>
          <span class="balance-card-coin-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400e" font-family="sans-serif">$</text></svg>
          </span>
        </div>
        <div class="balance-card-amount" id="shop-page-coins">0</div>
        <span class="balance-card-sub">Xu tài năng · không phải tiền thật</span>
      </div>
    </div>

    <!-- Reward Rules Banner (Image 2 Design) -->
    <div class="shop-reward-strip anim-fade-up anim-d3">
      <div class="reward-strip-left">
        <strong>Thắng càng khó, thưởng càng lớn.</strong>
        <p class="reward-strip-sub">Kiếm xu khi chiến thắng. Không nạp tiền, chỉ vinh danh bản lĩnh.</p>
      </div>
      <div class="reward-strip-rates">
        <span class="reward-rate-badge"><span class="reward-diff-label">Dễ</span> <strong class="reward-num">+30</strong></span>
        <span class="reward-rate-badge"><span class="reward-diff-label">Trung bình</span> <strong class="reward-num">+75</strong></span>
        <span class="reward-rate-badge"><span class="reward-diff-label">Khó</span> <strong class="reward-num">+180</strong></span>
      </div>
    </div>

    <!-- Sub-Nav Filter Tabs & Count (Image 2 Design) -->
    <div class="shop-nav-bar anim-fade-up anim-d3">
      <div class="seg seg--sm shop-tabs" id="shop-page-type-seg" role="tablist">
        <button type="button" role="tab" class="is-active" data-value="board" aria-selected="true">Giao diện bàn chơi</button>
        <button type="button" role="tab" data-value="flag" aria-selected="false">Kiểu cờ đánh dấu</button>
      </div>
      <span class="shop-items-counter" id="shop-items-counter">07 giao diện · Mua một lần, dùng mãi mãi</span>
    </div>

    <!-- Product Grid -->
    <div class="shop-grid" id="shop-page-grid" aria-live="polite">
      <p class="empty">Đang tải danh mục trang phục…</p>
    </div>

    <!-- Footer Note (Image 2 Design) -->
    <footer class="shop-page-footer anim-fade-up">
      <p>Giao diện chỉ thay đổi diện mạo. Luật chơi và cơ hội chiến thắng luôn như nhau.</p>
    </footer>
  </main>

  @include('minefield.partials.scripts', ['pageScript' => 'shop.js'])
</body>
</html>
