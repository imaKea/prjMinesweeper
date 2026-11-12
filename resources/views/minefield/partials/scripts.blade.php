@php
  $basePath = rtrim(request()->getBaseUrl(), '/');
  $minefieldUser = auth()->user();
  $minefieldSession = $minefieldUser
      ? ['username' => $minefieldUser->username, 'displayName' => $minefieldUser->display_name, 'role' => $minefieldUser->role, 'guest' => false, 'coins' => (int) $minefieldUser->coins, 'equippedBoardSkin' => $minefieldUser->equipped_board_skin ?: 'classic', 'equippedFlagSkin' => $minefieldUser->equipped_flag_skin ?: 'classic']
      : (session('minefield.guest') ? ['username' => null, 'displayName' => 'Khách', 'role' => 'guest', 'guest' => true, 'coins' => 0, 'equippedBoardSkin' => 'classic', 'equippedFlagSkin' => 'classic'] : null);
@endphp
@if (count($minefieldGameOptions['modes']) === 0 || count($minefieldGameOptions['difficulties']) === 0)
  <p class="form-error" role="alert">Tùy chọn trò chơi hiện không khả dụng. Vui lòng chạy seeder cơ sở dữ liệu và tải lại. <span hidden>Game options are unavailable. Run the Minefield database seeders and reload.</span></p>
@endif
<div id="mf-bootstrap-data" hidden
  data-session='@json($minefieldSession)'
  data-game-options='@json($minefieldGameOptions)'
  data-api-base="{{ $basePath }}/api"
  data-home="{{ $basePath }}/"
  data-modes="{{ $basePath }}/modes"
  data-game="{{ $basePath }}/game"
  data-shop="{{ $basePath }}/shop"
  data-admin="{{ $basePath }}/admin"
  data-admin-login="{{ $basePath }}/admin/login"></div>
<script>
  const bootstrapData = document.getElementById('mf-bootstrap-data').dataset;
  window.MF_INITIAL_SESSION = JSON.parse(bootstrapData.session);
  window.MF_GAME_OPTIONS = JSON.parse(bootstrapData.gameOptions);
</script>
@php
  $verJs = function (string $relPath): string {
    $full = public_path($relPath);
    return file_exists($full) ? (string) filemtime($full) : '2.7.4';
  };
@endphp
<script src="{{ $basePath }}/minefield/js/config.js?v={{ $verJs('minefield/js/config.js') }}"></script>
<script>
  window.MF_CONFIG = Object.assign(window.MF_CONFIG || {}, {
    API_BASE: bootstrapData.apiBase,
    ROUTES: {
      home: bootstrapData.home,
      modes: bootstrapData.modes,
      game: bootstrapData.game,
      shop: bootstrapData.shop,
      admin: bootstrapData.admin,
      adminLogin: bootstrapData.adminLogin
    }
  });
</script>
<script src="{{ $basePath }}/minefield/js/engine.js?v={{ $verJs('minefield/js/engine.js') }}"></script>
<script src="{{ $basePath }}/minefield/js/skins.js?v={{ $verJs('minefield/js/skins.js') }}"></script>
<script src="{{ $basePath }}/minefield/js/api.js?v={{ $verJs('minefield/js/api.js') }}"></script>
<script src="{{ $basePath }}/minefield/js/ui.js?v={{ $verJs('minefield/js/ui.js') }}"></script>
<script src="{{ $basePath }}/minefield/js/{{ $pageScript }}?v={{ $verJs('minefield/js/' . $pageScript) }}"></script>
<script src="{{ $basePath }}/minefield/js/ui-motion.js?v={{ $verJs('minefield/js/ui-motion.js') }}"></script>
