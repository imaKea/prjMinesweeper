<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Dò Mìn (Minesweeper) đa chế độ — Cổ điển, Dấu cộng, Góc chéo với bảng xếp hạng theo mili-giây, xu thưởng và cửa hàng trang phục.">
  <meta name="theme-color" content="#0b111c">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="vi_VN">
  <meta property="og:title" content="{{ $title }}">
  <meta property="og:description" content="Mở ô, cắm cờ, tranh hạng theo mili-giây và chinh phục bãi mìn theo cách của bạn.">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>{{ $title }}</title>
  <script>
    (function () {
      try {
        var t = localStorage.getItem('mf_pastel_theme');
        if (t && t !== 'gold') document.documentElement.setAttribute('data-theme', t);
      } catch (e) {}
    })();
  </script>
  @php
    $mfBase = rtrim(request()->getBaseUrl(), '/');
    $cssFile = public_path('minefield/css/ui-theme.css');
    $mfVer = file_exists($cssFile) ? (string) filemtime($cssFile) : '2.7.3';
  @endphp
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' rx='3' fill='%230e1620'/%3E%3Crect x='6' y='6' width='4' height='4' fill='%23e4a63b'/%3E%3C/svg%3E">
  <link rel="alternate icon" href="{{ $mfBase }}/favicon.ico">
  <link rel="dns-prefetch" href="https://fonts.googleapis.com">
  <link rel="dns-prefetch" href="https://fonts.gstatic.com">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{{ $mfBase }}/minefield/css/style.css?v={{ $mfVer }}">
  <link rel="stylesheet" href="{{ $mfBase }}/minefield/css/ui-theme.css?v={{ $mfVer }}">
</head>
