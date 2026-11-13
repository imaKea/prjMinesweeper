<!doctype html>
<html lang="vi">
@include('minefield.partials.head', ['title' => 'Dò Mìn · Chọn chế độ'])
<body class="page-modes">
  <header class="app-header" id="app-header"></header>

  <main class="modes">
    <div class="modes-hero-wrap">
      <div class="modes-hero-text">
        <p class="eyebrow anim-fade-up">Chọn quy tắc tác chiến</p>
        <h1 class="hero anim-fade-up anim-d1">Dò sạch bãi mìn.<br><span class="hero-highlight">Phá vỡ kỷ lục.</span></h1>
        <p class="lead anim-fade-up anim-d2">Mỗi chế độ mở ra một ma trận láng giềng khác biệt. Chọn kiểu quét mìn, thiết lập cấp độ và bắt đầu hành trình sinh tồn.</p>
      </div>

      <div class="modes-hero-visual" aria-hidden="true">
        <div class="floating-mine-3d">
          <div class="tactical-reactor-mine">
            <!-- Ambient Orbit Rings (Rotating slowly) -->
            <svg class="mine-orbit-ring ring-outer" viewBox="0 0 220 220" width="220" height="220">
              <circle cx="110" cy="110" r="102" fill="none" stroke="var(--surface-border-hi)" stroke-width="1.2" stroke-dasharray="14 18"/>
              <circle cx="110" cy="110" r="94" fill="none" stroke="var(--ambient-orb-1)" stroke-width="1" stroke-dasharray="4 8"/>
              <path d="M110 4v8M110 208v8M4 110h8M208 110h8" stroke="var(--accent-400)" stroke-width="2" stroke-linecap="round"/>
              <circle cx="110" cy="8" r="3.2" fill="var(--accent-400)"/>
              <circle cx="212" cy="110" r="2.8" fill="var(--accent-300)"/>
            </svg>
            <svg class="mine-orbit-ring ring-inner" viewBox="0 0 170 170" width="170" height="170">
              <circle cx="85" cy="85" r="78" fill="none" stroke="var(--surface-border-hi)" stroke-width="1.5" stroke-dasharray="24 16 8 16"/>
              <circle cx="85" cy="7" r="3.5" fill="var(--accent-300)"/>
              <circle cx="85" cy="163" r="2.5" fill="var(--accent-400)"/>
            </svg>

            <!-- Main Tactical 3D Mine Body -->
            <svg class="tactical-mine-svg" viewBox="0 0 200 200" width="180" height="180">
              <defs>
                <radialGradient id="tacticalHullGrad" cx="38%" cy="32%" r="68%">
                  <stop offset="0%" style="stop-color: var(--cell-bg-1)"/>
                  <stop offset="35%" style="stop-color: var(--cell-bg-2)"/>
                  <stop offset="70%" style="stop-color: var(--bg-1)"/>
                  <stop offset="100%" style="stop-color: var(--bg-0)"/>
                </radialGradient>
                <linearGradient id="spikeGradGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color: var(--accent-200)"/>
                  <stop offset="40%" style="stop-color: var(--accent-400)"/>
                  <stop offset="85%" style="stop-color: var(--accent-600)"/>
                  <stop offset="100%" style="stop-color: var(--bg-0)"/>
                </linearGradient>
                <radialGradient id="reactorPlasma" cx="42%" cy="40%" r="60%">
                  <stop offset="0%" style="stop-color: var(--accent-100)"/>
                  <stop offset="30%" style="stop-color: var(--accent-300)"/>
                  <stop offset="70%" style="stop-color: var(--accent-500)"/>
                  <stop offset="100%" style="stop-color: var(--accent-600)"/>
                </radialGradient>
                <filter id="tacticalGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur"/>
                  <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                </filter>
              </defs>

              <!-- 8 Tactical Detonator Spikes -->
              <g class="detonator-spikes">
                <path d="M96 46 L100 18 L104 46 Z" fill="url(#spikeGradGold)"/>
                <circle cx="100" cy="18" r="3.2" fill="var(--accent-300)" filter="url(#tacticalGlow)"/>
                <path d="M96 154 L100 182 L104 154 Z" fill="url(#spikeGradGold)"/>
                <circle cx="100" cy="182" r="3.2" fill="var(--accent-300)" filter="url(#tacticalGlow)"/>
                <path d="M46 96 L18 100 L46 104 Z" fill="url(#spikeGradGold)"/>
                <circle cx="18" cy="100" r="3.2" fill="var(--accent-300)" filter="url(#tacticalGlow)"/>
                <path d="M154 96 L182 100 L154 104 Z" fill="url(#spikeGradGold)"/>
                <circle cx="182" cy="100" r="3.2" fill="var(--accent-300)" filter="url(#tacticalGlow)"/>
                <path d="M62 64 L42 44 L68 58 Z" fill="url(#spikeGradGold)"/>
                <circle cx="42" cy="44" r="2.8" fill="var(--accent-300)"/>
                <path d="M138 64 L158 44 L132 58 Z" fill="url(#spikeGradGold)"/>
                <circle cx="158" cy="44" r="2.8" fill="var(--accent-300)"/>
                <path d="M62 136 L42 156 L68 142 Z" fill="url(#spikeGradGold)"/>
                <circle cx="42" cy="156" r="2.8" fill="var(--accent-300)"/>
                <path d="M138 136 L158 156 L132 142 Z" fill="url(#spikeGradGold)"/>
                <circle cx="158" cy="156" r="2.8" fill="var(--accent-300)"/>
              </g>

              <!-- Main Titanium Hull -->
              <circle cx="100" cy="100" r="54" fill="url(#tacticalHullGrad)" stroke="var(--surface-border-hi)" stroke-width="2.5"/>
              <circle cx="100" cy="100" r="46" fill="none" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.2" stroke-dasharray="6 8"/>
              <circle cx="100" cy="50" r="2.2" fill="var(--accent-400)"/>
              <circle cx="100" cy="150" r="2.2" fill="var(--accent-400)"/>
              <circle cx="50" cy="100" r="2.2" fill="var(--accent-400)"/>
              <circle cx="150" cy="100" r="2.2" fill="var(--accent-400)"/>

              <!-- Inner Reactor Core Housing -->
              <circle cx="100" cy="100" r="28" fill="var(--inset-dark)" stroke="var(--accent-400)" stroke-width="2"/>
              <!-- Pulsing Plasma Reactor Beacon -->
              <circle cx="100" cy="100" r="16" fill="url(#reactorPlasma)" class="beacon-pulse-core" filter="url(#tacticalGlow)"/>
              <circle cx="100" cy="100" r="5" fill="#ffffff" opacity="0.95"/>
              <path d="M100 86v5M100 109v5M86 100h5M109 100h5" stroke="var(--accent-300)" stroke-width="1.5" stroke-linecap="round"/>
            </svg>

            <!-- Ground Shadow -->
            <div class="reactor-mine-shadow"></div>
          </div>
        </div>
      </div>
    </div>

    <section class="step anim-fade-up anim-d3" aria-labelledby="step-mode">
      <div class="step__head">
        <h2 id="step-mode"><span class="step__no">01</span>Chế độ quét mìn</h2>
        <button type="button" class="link" id="open-neighbors">Ô nào được tính là láng giềng?</button>
      </div>
      <div class="mode-grid" id="mode-grid" role="radiogroup" aria-labelledby="step-mode"></div>
    </section>

    <section class="step anim-fade-up anim-d4" aria-labelledby="step-diff">
      <div class="step__head">
        <h2 id="step-diff"><span class="step__no">02</span>Cấp độ thử thách</h2>
        <a href="{{ route('minefield.shop') }}" class="link" id="open-shop">
          <svg class="btn-coin-icon" viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#92400e" stroke-width="1.5"/><text x="12" y="16" text-anchor="middle" font-size="10" font-weight="bold" fill="#92400e" font-family="sans-serif">$</text></svg>
          Cửa hàng trang phục
        </a>
      </div>
      <div class="play-row">
        <div class="seg seg--fill" id="diff-seg"></div>
        <button type="button" class="toptime" id="toptime">
          <span class="toptime__rank" aria-hidden="true">01</span>
          <span class="toptime__text">
            <span class="toptime__label" id="toptime-label">Kỷ lục</span>
            <span class="toptime__value" id="toptime-value">--:--</span>
          </span>
          <span class="toptime__arrow" aria-hidden="true">→</span>
        </button>
        <button type="button" class="btn btn--primary play" id="play">Chơi ngay →</button>
      </div>
    </section>
  </main>

  @include('minefield.partials.scripts', ['pageScript' => 'modes.js'])
</body>
</html>
