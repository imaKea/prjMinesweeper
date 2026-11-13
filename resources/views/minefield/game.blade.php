<!doctype html>
<html lang="vi">
@include('minefield.partials.head', ['title' => 'Dò Mìn'])
<body class="page-game">
  <header class="app-header" id="app-header"></header>

  <main class="game game-3col-layout">
    <div class="stage" id="game-stage">
      <!-- Top Bar (Image 3 Design) -->
      <div class="stage__bar game-topbar">
        <a class="back back-pill" href="{{ route('minefield.modes') }}">← Quay lại</a>
        <div class="stage__title game-title-group">
          <p class="eyebrow eyebrow--sm" id="eyebrow">Chế độ Cổ điển</p>
          <h1 id="title">Bãi mìn Trung bình</h1>
        </div>
        <div class="game-top-status">
          <span class="game-top-quote">Hít thở. Suy luận. Mở ô.</span>
          <span class="live-pill" id="live-pill" data-state="ready">
            <i class="live-dot" aria-hidden="true"></i>
            <span id="live-pill-label">Sẵn sàng</span>
          </span>
        </div>
      </div>

      <!-- 3-Column Tactical Console Layout (Image 3 Design) -->
      <div class="game-console-grid anim-fade-up">
        <!-- Left Sidebar: Modes, Difficulty, Record -->
        <aside class="game-sidebar-left">
          <!-- Card 1: Chế độ chơi -->
          <div class="tactical-card mode-picker-card">
            <h2 class="tactical-card__title">CHẾ ĐỘ CHƠI</h2>
            <div class="seg seg--vertical" id="mode-seg"></div>
          </div>

          <!-- Card 2: Độ khó -->
          <div class="tactical-card diff-picker-card">
            <h2 class="tactical-card__title">ĐỘ KHÓ</h2>
            <div class="seg seg--vertical-diff" id="diff-seg"></div>
            <p class="tactical-card__footnote">Đổi chế độ hoặc độ khó sẽ bắt đầu một ván mới.</p>
          </div>

          <!-- Card 3: Kỷ lục -->
          <div class="tactical-card record-card" id="game-record-card">
            <h2 class="tactical-card__title" id="record-card-title">KỶ LỤC / CỔ ĐIỂN - TRUNG BÌNH</h2>
            <div class="record-display-time" id="record-time-val">-- : --</div>
            <p class="record-display-note" id="record-footnote">Chưa có kỷ lục. Bắt đầu bằng một chiến thắng.</p>
            <button type="button" class="record-link-action" id="game-btn-lb">Bảng xếp hạng →</button>
          </div>
        </aside>

        <!-- Center Column: HUD, Board, Results -->
        <section class="game-center-board" id="game-panel" aria-label="Bàn chơi">
          <!-- HUD Panel (Counters & Center Reset Button) -->
          <div class="hud-top-console">
            <div class="hud-box hud-box--mines">
              <span class="hud-box__label">MÌN TRÊN BÀN</span>
              <output class="counter__value" id="mines" aria-label="Số mìn còn lại">000</output>
            </div>

            <div class="hud-center-action">
              <button type="button" class="tactical-restart-btn" id="status" data-state="ready" aria-label="Chơi lại" title="Chơi lại ván mới (Phím R)">
                <svg class="restart-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                  <path d="M4 12a8 8 0 0 1 14.93-4M20 12a8 8 0 0 1-14.93 4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                  <polyline points="20 4 20 8 16 8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                  <polyline points="4 20 4 16 8 16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                </svg>
                <span class="restart-label">Chơi lại</span>
              </button>
              <button type="button" class="tactical-hint-btn" id="game-btn-hint" aria-label="Gợi ý mìn (100 xu)" title="Sử dụng 100 xu để phát hiện và cắm cờ 1 quả mìn (Phím H)">
                <span class="hint-main-label">
                  <svg class="hint-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v3m0 14v3M2 12h3m14 0h3" stroke-linecap="round"/>
                    <circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/>
                  </svg>
                  <span class="hint-text">Gợi ý</span>
                </span>
                <span class="hint-cost-badge" aria-hidden="true">
                  <svg class="coin-svg" viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="10" fill="#f59e0b" stroke="#d97706" stroke-width="1.5"/><circle cx="12" cy="12" r="7" fill="none" stroke="#d97706" stroke-width="1" opacity=".4"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#78350f" font-family="sans-serif">$</text></svg>
                  <span>100 xu</span>
                </span>
              </button>
            </div>

            <div class="hud-box hud-box--time hud-box--right">
              <span class="hud-box__label" id="time-label">THỜI GIAN / GIÂY</span>
              <output class="counter__value" id="time" aria-label="Số giây đã trôi qua">000</output>
            </div>
          </div>

          <!-- Board Area -->
          <div class="board-frame">
            <div class="game-progress" aria-hidden="true">
              <div class="game-progress__fill" id="game-progress-fill"></div>
            </div>

            <div class="touch-tool-bar" id="touch-tool-bar" role="group" aria-label="Chế độ chạm trên bàn chơi">
              <div class="touch-tool-seg" id="touch-tool-seg">
                <button type="button" class="touch-tool-btn is-active" data-tool="reveal" aria-pressed="true">
                  <span aria-hidden="true">⛏️</span>
                  <span>Mở ô</span>
                </button>
                <button type="button" class="touch-tool-btn" data-tool="flag" aria-pressed="false">
                  <span aria-hidden="true">🚩</span>
                  <span>Cắm cờ</span>
                </button>
              </div>
              <span class="touch-tool-hint" id="touch-tool-hint">Chạm để mở ô · Nhấn giữ 0.4s để cắm/gỡ cờ</span>
            </div>

            <div class="board-wrap" id="board-wrap">
              <div class="board" id="board"></div>
              <div class="shockwave-ring" id="shockwave-ring" aria-hidden="true"></div>
            </div>

            <canvas class="confetti-canvas" id="confetti-canvas" aria-hidden="true"></canvas>

            <div class="result" id="result" role="status" hidden></div>

            <!-- Footer under board (Image 3 Design) -->
            <div class="board-foot-meta">
              <span class="board-flags-stat" id="board-flags-count">🚩 0 cờ đã đặt</span>
              <span class="board-matrix-stat" id="board-matrix-dim">12 × 12 / CỔ ĐIỂN</span>
            </div>
          </div>
        </section>

        <!-- Right Sidebar: Target reward, Controls guide, Skin preview -->
        <aside class="game-sidebar-right">
          <!-- Card 1: Mục tiêu ván này -->
          <div class="tactical-card target-reward-card">
            <h2 class="tactical-card__title">MỤC TIÊU VÁN NÀY</h2>
            <div class="target-reward-amount" id="target-reward-val">+75 xu</div>
            <p class="target-reward-desc" id="target-reward-desc">
              Thưởng <strong>+75 xu</strong> cơ bản khi thắng. Thưởng thêm tốc độ:<br>
              ⚡ &lt;30s: <strong>+100 xu</strong><br>
              ⚡ &lt;60s: <strong>+50 xu</strong><br>
              ⚡ &lt;100s: <strong>+25 xu</strong><br>
              ⏱️ &ge;100s: <strong>+0 xu</strong>
            </p>
          </div>

          <!-- Card 2: Chơi thật gọn (Controls guide) -->
          <div class="tactical-card guide-card" id="guide-card">
            <div class="guide-card__head">
              <h2 class="tactical-card__title">Chơi thật gọn.</h2>
              <span class="guide-device-badge" id="guide-device-badge">PC · Chuột</span>
            </div>
            <ul class="guide-list">
              <li class="guide-item">
                <span class="guide-icon-pill" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16"><path d="m4 4 7 17 3-6 6-3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>
                </span>
                <div class="guide-content">
                  <strong id="guide-reveal-title">Chuột trái</strong>
                  <p id="guide-reveal-desc">Mở một ô an toàn. Bấm vào ô số đã đủ cờ để mở nhanh xung quanh.</p>
                </div>
              </li>
              <li class="guide-item">
                <span class="guide-icon-pill" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16"><path d="M5 21V3l10 5-10 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
                <div class="guide-content">
                  <strong id="guide-flag-title">Chuột phải (hoặc phím F)</strong>
                  <p id="guide-flag-desc">Cắm cờ hoặc bỏ cờ đánh dấu.</p>
                </div>
              </li>
              <li class="guide-item">
                <span class="guide-icon-pill" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="2 2"/></svg>
                </span>
                <div class="guide-content">
                  <strong id="guide-hint-title">Gợi ý (Phím H)</strong>
                  <p id="guide-hint-desc">Dùng 100 xu để dò radar và cắm cờ 1 quả mìn.</p>
                </div>
              </li>
              <li class="guide-item">
                <span class="guide-icon-pill" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
                </span>
                <div class="guide-content">
                  <strong>Đọc những con số</strong>
                  <p id="game-rule-text">Mỗi số là tổng mìn trong 8 ô xung quanh.</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Card 3: Giao diện đang dùng (Skin Preview) -->
          <div class="tactical-card skin-preview-card">
            <div class="skin-mini-board-wrap" aria-hidden="true">
              <div class="skin-mini-board">
                <div class="sm-cell"></div><div class="sm-cell"></div><div class="sm-cell"></div><div class="sm-cell"></div><div class="sm-cell"></div>
                <div class="sm-cell"></div><div class="sm-cell"></div><div class="sm-cell n1">1</div><div class="sm-cell n1">1</div><div class="sm-cell n1">1</div>
                <div class="sm-cell"></div><div class="sm-cell n1">1</div><div class="sm-cell n2">2</div><div class="sm-cell is-flag">🚩</div><div class="sm-cell n1">1</div>
                <div class="sm-cell"></div><div class="sm-cell n1">1</div><div class="sm-cell"></div><div class="sm-cell n2">2</div><div class="sm-cell n1">1</div>
                <div class="sm-cell"></div><div class="sm-cell n1">1</div><div class="sm-cell n1">1</div><div class="sm-cell n1">1</div><div class="sm-cell"></div>
              </div>
            </div>
            <div class="skin-card-bottom">
              <div class="skin-card-info">
                <strong id="game-equipped-skin-name">Cổ Điển Trầm</strong>
                <small>Giao diện đang dùng</small>
              </div>
              <button type="button" class="skin-change-link" id="game-btn-shop">Đổi →</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>

  @include('minefield.partials.scripts', ['pageScript' => 'game.js'])
</body>
</html>
