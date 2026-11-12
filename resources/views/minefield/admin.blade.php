<!doctype html>
<html lang="vi">
@include('minefield.partials.head', ['title' => 'Dò Mìn · Bảng điều khiển quản trị'])
<body class="page-admin">
  @php($basePath = rtrim(request()->getBaseUrl(), '/'))

  <!-- Standard Top Navigation Header with Logo, Pastel Theme Switcher & Admin Menu -->
  <header class="app-header app-header--bordered" id="app-header"></header>

  <main class="admin-page">
    <!-- Top Hero Deck -->
    <div class="admin-hero anim-fade-up">
      <div class="admin-hero__content">
        <p class="eyebrow"><span class="badge badge--gold">QUẢN TRỊ VIÊN</span> TRUNG TÂM TÁC CHIẾN HỆ THỐNG</p>
        <h1 class="hero">Phòng điều khiển <span class="hero-highlight">Dò Mìn Tactical</span></h1>
        <p class="lead">Quản lý người chơi, nạp/điều chỉnh xu linh hoạt, giám sát các kỷ lục thời gian và theo dõi tỉ lệ chiến thắng toàn hệ thống.</p>
      </div>
      <div class="admin-hero__actions">
        <a class="btn btn--ghost" href="{{ $basePath }}/modes">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Quay về trò chơi
        </a>
      </div>
    </div>

    <!-- Alert / Flash Messages -->
    @if (session('admin_success'))
      <div class="admin-alert admin-alert--success anim-fade-up" role="status">
        <span class="admin-alert__icon">✓</span>
        <span>{{ session('admin_success') }}</span>
      </div>
    @endif
    @if ($errors->any())
      <div class="admin-alert admin-alert--error anim-fade-up" role="alert">
        <span class="admin-alert__icon">✕</span>
        <span>{{ $errors->first() }}</span>
      </div>
    @endif

    <!-- 4 KPI Overview Metric Cards -->
    <section class="admin-stats-grid anim-fade-up anim-d1" aria-label="Tổng quan">
      <div class="admin-stat-card">
        <div class="admin-stat-card__head">
          <span class="admin-stat-card__lbl">TỔNG TÀI KHOẢN</span>
          <span class="admin-stat-card__icon">👥</span>
        </div>
        <div class="admin-stat-card__val">{{ number_format($userCount) }}</div>
        <div class="admin-stat-card__sub">Người chơi và quản trị viên</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-card__head">
          <span class="admin-stat-card__lbl">KỶ LỤC XẾP HẠNG</span>
          <span class="admin-stat-card__icon">🏆</span>
        </div>
        <div class="admin-stat-card__val">{{ number_format($recordCount) }}</div>
        <div class="admin-stat-card__sub">Bản ghi trên bảng vàng</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-card__head">
          <span class="admin-stat-card__lbl">TRẬN ĐÃ HOÀN THÀNH</span>
          <span class="admin-stat-card__icon">🎯</span>
        </div>
        <div class="admin-stat-card__val">{{ number_format($completedGames) }}</div>
        <div class="admin-stat-card__sub">Thắng hoặc kích nổ bãi mìn</div>
      </div>
      <div class="admin-stat-card">
        <div class="admin-stat-card__head">
          <span class="admin-stat-card__lbl">TỈ LỆ THẮNG CHUNG</span>
          <span class="admin-stat-card__icon">⚡</span>
        </div>
        <div class="admin-stat-card__val">{{ $overallWinRate }}%</div>
        <div class="admin-stat-card__sub">Tỉ lệ sinh tồn toàn máy chủ</div>
      </div>
    </section>

    <!-- Game Mode Win Rate Performance Cards -->
    <section class="admin-section anim-fade-up anim-d2" aria-labelledby="game-stats-title">
      <div class="admin-section-header">
        <div>
          <h2 id="game-stats-title" class="admin-section-title">
            Thống kê theo chế độ chơi
            <span hidden>Game statistics by mode</span>
          </h2>
          <p class="admin-section-desc">Hiệu suất và tỉ lệ sống sót của các kiểu quét láng giềng ma trận</p>
        </div>
      </div>

      <div class="admin-mode-grid">
        @foreach ($gameStats as $stat)
          <div class="admin-mode-card">
            <div class="admin-mode-card__top">
              <span class="admin-mode-badge">{{ $stat['name'] }}</span>
              <span class="admin-mode-total"><strong>{{ number_format($stat['completed']) }}</strong> trận đã hoàn thành</span>
            </div>
            <div class="admin-mode-card__progress">
              <div class="admin-mode-progress-bar" style="width: {{ $stat['winRate'] }}%"></div>
            </div>
            <div class="admin-mode-card__bottom">
              <span class="admin-mode-winrate">
                <strong class="text-accent">{{ $stat['winRate'] }}%</strong> tỉ lệ thắng
              </span>
              <span class="admin-mode-ratio">
                {{ $stat['wins'] }} thắng / {{ $stat['losses'] }} thua
                <span hidden>{{ $stat['wins'] }} wins / {{ $stat['losses'] }} losses · {{ $stat['winRate'] }}% win rate</span>
              </span>
            </div>
          </div>
        @endforeach
      </div>
    </section>

    <!-- Admin Navigation Tabs -->
    <div class="admin-tabs-bar anim-fade-up anim-d2">
      <button type="button" class="admin-tab-btn is-active" data-tab="users">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        <span>Tài khoản người chơi</span>
        <span class="admin-tab-count">{{ $users->total() }}</span>
      </button>
      <button type="button" class="admin-tab-btn" data-tab="records">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span>Kỷ lục bảng xếp hạng</span>
        <span class="admin-tab-count">{{ $records->total() }}</span>
        <span hidden>Leaderboard records</span>
      </button>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 1: TÀI KHOẢN NGƯỜI CHƠI -->
    <!-- ===================================================================== -->
    <div class="admin-tab-panel is-active anim-fade-up" id="tab-users">
      <!-- Filter and Action Bar -->
      <div class="admin-filter-bar">
        <div class="admin-search-wrap">
          <svg class="admin-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="user-search-input" class="admin-search-input" placeholder="Tìm kiếm theo tên đăng nhập hoặc tên hiển thị...">
        </div>
        <div class="admin-filter-group">
          <select id="user-role-filter" class="admin-filter-select">
            <option value="">Tất cả vai trò</option>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
          <select id="user-status-filter" class="admin-filter-select">
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>
          <button type="button" class="btn btn--primary btn--sm" data-toggle-collapse="drawer-create-user" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Thêm tài khoản
          </button>
        </div>
      </div>

      <!-- Collapsible Drawer: Tạo tài khoản mới -->
      <div id="drawer-create-user" class="admin-drawer" hidden>
        <div class="admin-drawer__card">
          <div class="admin-drawer__head">
            <h3>Tạo tài khoản người chơi mới</h3>
            <button type="button" class="btn-close-drawer" data-toggle-collapse="drawer-create-user" aria-label="Đóng">&times;</button>
          </div>
          <form class="admin-create-form" method="post" action="{{ $basePath }}/admin/users">
            @csrf
            <div class="admin-form-grid">
              <label class="admin-form-group">
                <span class="admin-form-label">Tên đăng nhập (3-20 ký tự)</span>
                <input class="admin-form-input" name="username" maxlength="20" placeholder="vd: phananh_99" required>
              </label>
              <label class="admin-form-group">
                <span class="admin-form-label">Tên hiển thị</span>
                <input class="admin-form-input" name="display_name" maxlength="24" placeholder="vd: Phan Anh" required>
              </label>
              <label class="admin-form-group">
                <span class="admin-form-label">Mật khẩu ban đầu</span>
                <input class="admin-form-input" name="password" type="password" minlength="6" placeholder="Tối thiểu 6 ký tự" required>
              </label>
              <label class="admin-form-group">
                <span class="admin-form-label">Vai trò</span>
                <select class="admin-form-select" name="role">
                  <option value="user">Người dùng</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </label>
            </div>
            <div class="admin-drawer__actions">
              <button type="button" class="btn btn--ghost btn--sm" data-toggle-collapse="drawer-create-user">Hủy</button>
              <button class="btn btn--gold btn--sm" type="submit">Xác nhận tạo tài khoản</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Users Table Wrap -->
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="min-width: 220px;">Người chơi</th>
              <th style="min-width: 140px;">Số xu</th>
              <th style="min-width: 160px;">Mật khẩu mới</th>
              <th style="min-width: 130px;">Vai trò</th>
              <th style="min-width: 110px;">Trạng thái</th>
              <th style="min-width: 240px; text-align: right;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            @forelse ($users as $user)
              @php($editForm = 'edit-user-'.$user->id)
              <tr class="user-table-row"
                  data-user-id="{{ $user->id }}"
                  data-username="{{ $user->username }}"
                  data-display-name="{{ $user->display_name }}"
                  data-role="{{ $user->role }}"
                  data-status="{{ $user->is_locked ? 'locked' : 'active' }}">
                <!-- Cột 1: Thông tin người chơi & Edit inputs -->
                <td>
                  <div class="user-cell">
                    <div class="user-avatar-circle" aria-hidden="true">
                      {{ strtoupper(mb_substr($user->display_name ?: $user->username, 0, 1)) }}
                    </div>
                    <div class="user-inputs">
                      <input form="{{ $editForm }}" class="admin-input-inline admin-input-name" name="display_name" value="{{ $user->display_name }}" maxlength="24" title="Tên hiển thị" placeholder="Tên hiển thị" required>
                      <input form="{{ $editForm }}" class="admin-input-inline admin-input-username" name="username" value="{{ $user->username }}" maxlength="20" title="Tên đăng nhập" placeholder="Tên đăng nhập" required>
                    </div>
                  </div>
                </td>

                <!-- Cột 2: Số xu & Nút +Xu Modal -->
                <td>
                  <div class="coins-cell">
                    <span class="user-coins-display" title="{{ number_format($user->coins) }} xu">
                      <span class="coin-icon">🪙</span>
                      <span>{{ number_format($user->coins) }}</span>
                      <span class="coin-unit">xu</span>
                    </span>
                    <input form="{{ $editForm }}" name="coins" type="hidden" value="{{ (int) $user->coins }}">
                    <button type="button" class="btn btn--gold-subtle btn--xs btn-add-coins"
                            data-user-id="{{ $user->id }}"
                            data-username="{{ $user->username }}"
                            data-current-coins="{{ (int) $user->coins }}"
                            title="Mở bảng cộng xu tùy chọn">
                      + Xu
                    </button>
                  </div>
                </td>

                <!-- Cột 3: Đổi mật khẩu -->
                <td>
                  <input form="{{ $editForm }}" class="admin-input-inline" name="password" type="password" minlength="6" placeholder="Để trống nếu giữ nguyên">
                </td>

                <!-- Cột 4: Vai trò -->
                <td>
                  <select form="{{ $editForm }}" class="admin-select-inline" name="role" @disabled($user->id === auth()->id())>
                    <option value="user" @selected($user->role === 'user')>Người dùng</option>
                    <option value="admin" @selected($user->role === 'admin')>Quản trị</option>
                  </select>
                  @if ($user->id === auth()->id())
                    <input form="{{ $editForm }}" type="hidden" name="role" value="admin">
                  @endif
                </td>

                <!-- Cột 5: Trạng thái (Live Badge) -->
                <td class="user-status-cell">
                  @if ($user->is_locked)
                    <span class="status-pill status-pill--locked"><span class="status-dot"></span> Bị khóa</span>
                  @else
                    <span class="status-pill status-pill--active"><span class="status-dot"></span> Hoạt động</span>
                  @endif
                </td>

                <!-- Cột 6: Thao tác -->
                <td style="text-align: right;">
                  <div class="admin-action-row">
                    <!-- Form Cập nhật -->
                    <form id="{{ $editForm }}" method="post" action="{{ $basePath }}/admin/users/{{ $user->id }}">
                      @csrf
                      @method('put')
                    </form>
                    <button class="btn btn--ghost btn--sm" type="submit" form="{{ $editForm }}" title="Lưu thay đổi dòng này">Lưu</button>

                    <!-- Nút +Xu (Fallback form for direct POST / testing) -->
                    <form class="inline-form" method="post" action="{{ $basePath }}/admin/users/{{ $user->id }}/give-coins">
                      @csrf
                      <button class="btn btn--gold btn--sm" type="submit" title="Cấp 999,999 xu" style="display:none;">+Xu</button>
                    </form>

                    <!-- Khóa / Mở khóa -->
                    @if ($user->role === 'user')
                      <form class="inline-form" method="post" action="{{ $basePath }}/admin/users/{{ $user->id }}/lock">
                        @csrf
                        <button class="btn btn--sm {{ $user->is_locked ? 'btn--success' : 'btn--warning' }} btn-lock-toggle" type="submit">
                          {{ $user->is_locked ? 'Mở khóa' : 'Khóa' }}
                        </button>
                      </form>
                    @endif

                    <!-- Xóa tài khoản -->
                    @if ($user->id !== auth()->id())
                      <form class="inline-form" method="post" action="{{ $basePath }}/admin/users/{{ $user->id }}" onsubmit="return confirm('Xóa tài khoản này cùng toàn bộ lịch sử chơi?')">
                        @csrf
                        @method('delete')
                        <button class="btn btn--danger-ghost btn--sm" type="submit">Xóa</button>
                      </form>
                    @endif
                  </div>
                </td>
              </tr>
            @empty
              <tr>
                <td colspan="6" class="admin-table-empty">Chưa có tài khoản người chơi nào.</td>
              </tr>
            @endforelse
            <tr id="user-empty-search-row" style="display: none;">
              <td colspan="6" class="admin-table-empty">Không tìm thấy tài khoản nào phù hợp với bộ lọc.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Links -->
      <div class="admin-pagination-wrap">
        {{ $users->links() }}
      </div>
    </div>

    <!-- ===================================================================== -->
    <!-- TAB 2: KỶ LỤC BẢNG XẾP HẠNG -->
    <!-- ===================================================================== -->
    <div class="admin-tab-panel anim-fade-up" id="tab-records" hidden>
      <!-- Filter and Action Bar -->
      <div class="admin-filter-bar">
        <div class="admin-search-wrap">
          <svg class="admin-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="record-search-input" class="admin-search-input" placeholder="Tìm theo tên người chơi...">
        </div>
        <div class="admin-filter-group">
          <select id="record-mode-filter" class="admin-filter-select">
            <option value="">Tất cả chế độ</option>
            @foreach ($modes as $mode)
              <option value="{{ $mode->name }}">{{ $mode->name }}</option>
            @endforeach
          </select>
          <select id="record-diff-filter" class="admin-filter-select">
            <option value="">Tất cả độ khó</option>
            @foreach ($difficulties as $difficulty)
              <option value="{{ $difficulty->name }}">{{ $difficulty->name }}</option>
            @endforeach
          </select>
          <button type="button" class="btn btn--primary btn--sm" data-toggle-collapse="drawer-create-record" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Thêm kỷ lục
          </button>
        </div>
      </div>

      <!-- Collapsible Drawer: Tạo kỷ lục mới -->
      <div id="drawer-create-record" class="admin-drawer" hidden>
        <div class="admin-drawer__card">
          <div class="admin-drawer__head">
            <h3>Thêm kỷ lục bảng xếp hạng thủ công</h3>
            <button type="button" class="btn-close-drawer" data-toggle-collapse="drawer-create-record" aria-label="Đóng">&times;</button>
          </div>
          <form class="admin-create-form" method="post" action="{{ $basePath }}/admin/records">
            @csrf
            <div class="admin-form-grid">
              <label class="admin-form-group">
                <span class="admin-form-label">Người chơi</span>
                <select class="admin-form-select" name="user_id" required>
                  @foreach ($accountOptions as $account)
                    <option value="{{ $account->id }}">{{ $account->username }}</option>
                  @endforeach
                </select>
              </label>
              <label class="admin-form-group">
                <span class="admin-form-label">Chế độ</span>
                <select class="admin-form-select" name="mode_id" required>
                  @foreach ($modes as $mode)
                    <option value="{{ $mode->id }}">{{ $mode->name }}</option>
                  @endforeach
                </select>
              </label>
              <label class="admin-form-group">
                <span class="admin-form-label">Độ khó</span>
                <select class="admin-form-select" name="difficulty_id" required>
                  @foreach ($difficulties as $difficulty)
                    <option value="{{ $difficulty->id }}">{{ $difficulty->name }}</option>
                  @endforeach
                </select>
              </label>
              <label class="admin-form-group">
                <span class="admin-form-label">Thời gian (mili-giây)</span>
                <input class="admin-form-input" name="best_time_ms" type="number" min="1" max="2147483647" placeholder="vd: 12500" required>
              </label>
              <label class="admin-form-group">
                <span class="admin-form-label">Thời điểm đạt kỷ lục</span>
                <input class="admin-form-input" name="achieved_at" type="datetime-local" value="{{ now()->format('Y-m-d\TH:i') }}" required>
              </label>
            </div>
            <div class="admin-drawer__actions">
              <button type="button" class="btn btn--ghost btn--sm" data-toggle-collapse="drawer-create-record">Hủy</button>
              <button class="btn btn--gold btn--sm" type="submit">Xác nhận thêm kỷ lục</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Records Table Wrap -->
      <div class="admin-table-wrap">
        <table class="admin-table">
          <thead>
            <tr>
              <th style="min-width: 170px;">Người chơi</th>
              <th style="min-width: 130px;">Chế độ</th>
              <th style="min-width: 120px;">Độ khó</th>
              <th style="min-width: 160px;">Thời gian tốt nhất (ms)</th>
              <th style="min-width: 190px;">Đạt lúc</th>
              <th style="min-width: 140px; text-align: right;">Hành động</th>
            </tr>
          </thead>
          <tbody>
            @forelse ($records as $record)
              @php($editRecordForm = 'edit-record-'.$record->record_id)
              <tr class="record-table-row"
                  data-record-id="{{ $record->record_id }}"
                  data-player="{{ $record->username }}"
                  data-mode="{{ $record->mode_name }}"
                  data-difficulty="{{ $record->difficulty_name }}">
                <td>
                  <strong class="user-display-name">{{ $record->username }}</strong>
                </td>
                <td><span class="mode-pill">{{ $record->mode_name }}</span></td>
                <td><span class="diff-pill">{{ $record->difficulty_name }}</span></td>
                <td>
                  <div class="time-input-wrap">
                    <input form="{{ $editRecordForm }}" class="admin-input-inline" name="best_time_ms" type="number" min="1" max="2147483647" value="{{ $record->best_time_ms }}" required>
                    <span class="time-formatted-sub">
                      {{ sprintf('%02d:%02d.%03d', floor($record->best_time_ms / 60000), floor(($record->best_time_ms % 60000) / 1000), $record->best_time_ms % 1000) }}
                    </span>
                  </div>
                </td>
                <td>
                  <input form="{{ $editRecordForm }}" class="admin-input-inline" name="achieved_at" type="datetime-local" value="{{ \Illuminate\Support\Carbon::parse($record->achieved_at)->format('Y-m-d\TH:i') }}" required>
                </td>
                <td style="text-align: right;">
                  <div class="admin-action-row">
                    <form id="{{ $editRecordForm }}" method="post" action="{{ $basePath }}/admin/records/{{ $record->record_id }}">
                      @csrf
                      @method('put')
                    </form>
                    <button class="btn btn--ghost btn--sm" type="submit" form="{{ $editRecordForm }}">Lưu</button>
                    <form class="inline-form" method="post" action="{{ $basePath }}/admin/records/{{ $record->record_id }}" onsubmit="return confirm('Xóa kỷ lục này khỏi bảng xếp hạng?')">
                      @csrf
                      @method('delete')
                      <button class="btn btn--danger-ghost btn--sm" type="submit">Xóa</button>
                    </form>
                  </div>
                </td>
              </tr>
            @empty
              <tr>
                <td colspan="6" class="admin-table-empty">Chưa có kỷ lục bảng xếp hạng nào.</td>
              </tr>
            @endforelse
            <tr id="record-empty-search-row" style="display: none;">
              <td colspan="6" class="admin-table-empty">Không tìm thấy kỷ lục nào phù hợp với bộ lọc.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Links -->
      <div class="admin-pagination-wrap">
        {{ $records->links() }}
      </div>
    </div>
  </main>

  <!-- ======================================================================= -->
  <!-- MODAL: CỘNG XU TÙY CHỌN & CHỌN MỨC NHANH (+XU) -->
  <!-- ======================================================================= -->
  <div id="add-coins-modal" class="admin-modal" hidden>
    <div class="modal-backdrop"></div>
    <div class="admin-modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-coins-heading">
      <div class="admin-modal-head">
        <div>
          <span class="admin-modal-eyebrow">ĐIỀU CHỈNH SỐ DƯ</span>
          <h3 id="modal-coins-heading" class="admin-modal-title">Cộng xu người chơi</h3>
        </div>
        <button type="button" class="modal-close-btn modal-close-trigger" aria-label="Đóng">&times;</button>
      </div>

      <div class="admin-modal-body">
        <div class="modal-user-summary">
          <div class="summary-coin-badge" aria-hidden="true">🪙</div>
          <div class="summary-details">
            <div class="summary-name" id="modal-coins-user">Người chơi</div>
            <div class="summary-balance">Số dư hiện tại: <strong id="modal-coins-balance">0 xu</strong></div>
          </div>
        </div>

        <form id="modal-coins-form" method="post" action="{{ $basePath }}/admin/users/0/give-coins">
          @csrf
          <input type="hidden" id="modal-coins-user-id" name="user_id" value="">

          <div class="admin-form-group">
            <label class="admin-form-label" for="modal-coins-amount">Số xu muốn cộng thêm:</label>
            <div class="modal-input-wrap">
              <span class="modal-input-prefix">+</span>
              <input type="number" id="modal-coins-amount" name="amount" min="1" max="2000000000" step="1" value="1000" placeholder="Nhập số xu..." required>
              <span class="modal-input-suffix">xu</span>
            </div>
          </div>

          <div class="modal-presets-label">Mức cộng nhanh:</div>
          <div class="coin-preset-grid">
            <button type="button" class="coin-preset-btn" data-amount="500">+500</button>
            <button type="button" class="coin-preset-btn" data-amount="1000">+1.000</button>
            <button type="button" class="coin-preset-btn" data-amount="5000">+5.000</button>
            <button type="button" class="coin-preset-btn" data-amount="20000">+20.000</button>
            <button type="button" class="coin-preset-btn" data-amount="100000">+100.000</button>
            <button type="button" class="coin-preset-btn" data-amount="999999">+999.999</button>
          </div>

          <div class="admin-modal-actions">
            <button type="button" class="btn btn--ghost modal-close-trigger">Hủy bỏ</button>
            <button type="submit" class="btn btn--gold">Xác nhận cộng xu</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Toast Notifications Container -->
  <div id="admin-toast-container" class="admin-toast-container"></div>

  <!-- Core Scripts & Admin Interactive Controller -->
  @include('minefield.partials.scripts', ['pageScript' => 'admin.js'])
</body>
</html>
