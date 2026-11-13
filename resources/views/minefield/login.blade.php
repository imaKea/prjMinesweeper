<!doctype html>
<html lang="vi">
@include('minefield.partials.head', ['title' => 'Dò Mìn · Đăng nhập'])
<body class="page-auth">
  <header class="app-header" id="app-header"></header>

  <main class="auth auth-split-container">
    <div class="auth-split-layout">
      <!-- Left Hero Column (Image 4 Design) -->
      <div class="auth-hero-col anim-fade-up">
        <div class="auth-hero-badge">
          <span class="badge-square" aria-hidden="true">■</span> CỔ ĐIỂN. NHƯNG KHÔNG CŨ.
        </div>
        <h1 class="auth-hero-title" id="auth-hero-title">
          Một ô nữa.<br>
          <span class="text-gold-gradient">Một kỷ lục mới.</span>
        </h1>
        <p class="auth-hero-lead" id="auth-hero-lead">
          Bài toán mở cho một cái đầu nhạy bén. Mở ô, cắm cờ và chinh phục bãi mìn theo cách của bạn.
        </p>

        <!-- 3D Perspective Isometric Board Preview Graphic -->
        <div class="auth-board-visual" aria-hidden="true">
          <div class="isometric-board-wrap">
            <div class="isometric-board">
              <div class="iso-row">
                <div class="iso-cell"></div>
                <div class="iso-cell"></div>
                <div class="iso-cell"></div>
                <div class="iso-cell n1">1</div>
                <div class="iso-cell is-flag">
                  <svg viewBox="0 0 16 16"><path d="M4 2v12" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round"/><path d="M4.5 2.5 13 6 4.5 9.5z" fill="#ffc83d"/></svg>
                </div>
              </div>
              <div class="iso-row">
                <div class="iso-cell"></div>
                <div class="iso-cell"></div>
                <div class="iso-cell n1">1</div>
                <div class="iso-cell n2">2</div>
                <div class="iso-cell n2">2</div>
              </div>
              <div class="iso-row">
                <div class="iso-cell"></div>
                <div class="iso-cell n1">1</div>
                <div class="iso-cell n2">2</div>
                <div class="iso-cell is-flag">
                  <svg viewBox="0 0 16 16"><path d="M4 2v12" stroke="#cbd5e1" stroke-width="1.8" stroke-linecap="round"/><path d="M4.5 2.5 13 6 4.5 9.5z" fill="#ffc83d"/></svg>
                </div>
                <div class="iso-cell n1">1</div>
              </div>
              <div class="iso-row">
                <div class="iso-cell"></div>
                <div class="iso-cell n1">1</div>
                <div class="iso-cell"></div>
                <div class="iso-cell n2">2</div>
                <div class="iso-cell n1">1</div>
              </div>
              <div class="iso-row">
                <div class="iso-cell"></div>
                <div class="iso-cell n1">1</div>
                <div class="iso-cell n1">1</div>
                <div class="iso-cell n1">1</div>
                <div class="iso-cell"></div>
              </div>
            </div>
            <div class="iso-shadow"></div>
            <div class="iso-radar-beam" aria-hidden="true"></div>
          </div>
        </div>

        <div class="auth-hero-foot">
          <span class="hero-foot-stat">03 chế độ / 03 cấp độ</span>
        </div>
      </div>

      <!-- Right Auth Card Column (Image 4 Design) -->
      <div class="auth-form-col anim-fade-up anim-d1">
        <section class="card auth-card" id="auth-card-tilt">
          <div class="auth-card-border-glow" aria-hidden="true"></div>
          <div class="auth-card-glare" aria-hidden="true"></div>

          <div class="auth-header-block">
            <p class="eyebrow eyebrow--gold" id="auth-eyebrow">CHÀO MỪNG TRỞ LẠI</p>
            <h2 class="auth-title-large" id="auth-title">Sẵn sàng dò mìn?</h2>
            <p class="muted auth-subtitle" id="auth-sub">Đăng nhập để tiếp tục chuỗi chiến thắng.</p>
          </div>

          <div class="seg seg--block" id="auth-tabs" role="tablist">
            <button type="button" role="tab" class="is-active" aria-selected="true" data-tab="login">Đăng nhập</button>
            <button type="button" role="tab" aria-selected="false" data-tab="signup">Đăng ký</button>
          </div>

          <form id="auth-form" novalidate>
            <div class="field" id="field-display" hidden>
              <label for="display">Tên hiển thị</label>
              <input id="display" name="display" maxlength="24" autocomplete="nickname" placeholder="Nhập tên trên bảng xếp hạng">
            </div>
            <div class="field">
              <label for="username">Tên đăng nhập</label>
              <input id="username" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="Nhập tên đăng nhập">
            </div>
            <div class="field">
              <label for="password">Mật khẩu</label>
              <div class="input-with-action">
                <input id="password" name="password" type="password" autocomplete="current-password" placeholder="••••••••">
                <button type="button" class="btn-toggle-pw" id="toggle-pw" aria-label="Hiện/ẩn mật khẩu" tabindex="-1">
                  <svg id="eye-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </button>
              </div>
            </div>
            <p class="form-error" id="form-error" role="alert" hidden></p>
            <div class="auth-submit-wrap">
              <button type="submit" class="btn btn--primary btn--block" id="submit">Vào bãi mìn →</button>
            </div>
          </form>

          <a class="guest-button-card" href="{{ route('minefield.modes') }}" id="guest">
            Chơi với tư cách khách <span aria-hidden="true">→</span>
          </a>

          <p class="auth-micro-sub" id="auth-micro-sub">Chơi ngay không cần tài khoản: Kỷ lục và xu không lưu lại</p>
        </section>
      </div>
    </div>
  </main>

  <a class="admin-link" href="{{ rtrim(request()->getBaseUrl(), '/') }}/admin/login" id="admin-link">Quản trị viên</a>
  @include('minefield.partials.scripts', ['pageScript' => 'login.js'])
</body>
</html>
