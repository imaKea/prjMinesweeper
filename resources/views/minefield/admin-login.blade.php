<!doctype html>
<html lang="vi">
@include('minefield.partials.head', ['title' => 'Dò Mìn · Đăng nhập quản trị'])
<body class="page-auth">
  <header class="app-header" id="app-header"></header>

  <main class="auth">
    <section class="card auth-card anim-fade-up">
      <p class="eyebrow">Quản trị</p>
      <h1>Đăng nhập quản trị</h1>
      <p class="muted">Đăng nhập bằng tài khoản quản trị viên.</p>

      <form id="admin-auth-form" novalidate>
        <div class="field">
          <label for="username">Tên đăng nhập</label>
          <input id="username" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" required>
        </div>
        <div class="field">
          <label for="password">Mật khẩu</label>
          <input id="password" name="password" type="password" autocomplete="current-password" required>
        </div>
        <p class="form-error" id="admin-form-error" role="alert" hidden></p>
        <button type="submit" class="btn btn--primary btn--block" id="admin-submit">Đăng nhập quản trị</button>
      </form>

      <a class="guest-link" href="{{ rtrim(request()->getBaseUrl(), '/') }}/">Quay về trang đăng nhập</a>
    </section>
  </main>

  @include('minefield.partials.scripts', ['pageScript' => 'admin-login.js'])
</body>
</html>
