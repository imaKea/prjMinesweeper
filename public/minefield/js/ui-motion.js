/**
 * Tactical Gold Reactor — Motion & Sensory FX Controller (ui-motion.js)
 * Covers: Ambient Canvas, 3D Tilt, Glare, Progress Bar, Shockwave, Confetti, Ripple
 */
(function () {
  'use strict';

  const FX = {
    particles: true,
    grid: true,
    parallax: false,
    ripple: true,
    tilt: false,
    shake: true,
    confetti: true,
    shockwave: true,
    cursor: false,
    progress: true,
  };
  window.FX = FX;

  // --------------------------------------------------------------------------
  // 1. Ambient Scene Injection (3D Perspective Grid, Orbs, Canvas, Vignette)
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  function initAmbientScene() {
    if (document.querySelector('.ambient-scene')) return;

    const scene = document.createElement('div');
    scene.className = 'ambient-scene';
    scene.setAttribute('aria-hidden', 'true');
    scene.innerHTML =
      '<div class="ambient-grid"></div>' +
      '<div class="ambient-orb ambient-orb--gold"></div>' +
      '<div class="ambient-orb ambient-orb--blue"></div>' +
      '<canvas id="ambient-canvas"></canvas>' +
      '<div class="ambient-vignette"></div>';

    document.body.prepend(scene);

    if (FX.particles && !prefersReducedMotion) {
      initGoldParticles();
    }
  }

  // --------------------------------------------------------------------------
  // 2. Gold Dust Ambient Canvas (Upward Floating Mines, Flags, Embers & Dust)
  // --------------------------------------------------------------------------
  function initGoldParticles() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isMobile = window.innerWidth < 768;
    let dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
    let width = window.innerWidth;
    let height = window.innerHeight;

    function syncCanvasSize(force) {
      const nextWidth = window.innerWidth;
      const nextHeight = window.innerHeight;
      isMobile = nextWidth < 768;
      // Ignore small height changes caused by mobile browser address bars hiding/showing on scroll
      if (!force && isMobile && nextWidth === width && Math.abs(nextHeight - height) < 100) {
        return;
      }
      dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    syncCanvasSize(true);

    function getThemePalette() {
      const theme = document.documentElement.dataset.theme || localStorage.getItem('mf_pastel_theme') || 'gold';
      switch (theme) {
        case 'pink':
          return {
            dust: ['#ffd1dc', '#f497b0', '#fbcfe8', '#ffffff', '#e57399'],
            flag: '#f497b0',
            mine: '#f497b0',
            beacon: '#ffffff',
            pole: 'rgba(255, 255, 255, 0.5)',
            hull: 'rgba(12, 20, 36, 0.95)',
            line: 'rgba(244, 151, 176, 0.20)'
          };
        case 'red':
          return {
            dust: ['#ffc4bf', '#f87171', '#fca5a5', '#ffffff', '#ef4444'],
            flag: '#f87171',
            mine: '#f87171',
            beacon: '#ffffff',
            pole: 'rgba(255, 255, 255, 0.5)',
            hull: 'rgba(12, 20, 36, 0.95)',
            line: 'rgba(248, 113, 113, 0.20)'
          };
        case 'white':
          return {
            dust: ['#2563eb', '#3b82f6', '#60a5fa', '#818cf8', '#0ea5e9'],
            flag: '#2563eb',
            mine: '#3b82f6',
            beacon: '#1d4ed8',
            pole: 'rgba(30, 41, 59, 0.65)',
            hull: 'rgba(241, 245, 249, 0.92)',
            line: 'rgba(59, 130, 246, 0.25)'
          };
        case 'green':
          return {
            dust: ['#bbf7d0', '#86efac', '#a7f3d0', '#ffffff', '#4ade80'],
            flag: '#86efac',
            mine: '#86efac',
            beacon: '#ffffff',
            pole: 'rgba(255, 255, 255, 0.5)',
            hull: 'rgba(12, 20, 36, 0.95)',
            line: 'rgba(134, 239, 172, 0.20)'
          };
        case 'blue':
          return {
            dust: ['#bae6fd', '#7dd3fc', '#93c5fd', '#ffffff', '#38bdf8'],
            flag: '#7dd3fc',
            mine: '#7dd3fc',
            beacon: '#ffffff',
            pole: 'rgba(255, 255, 255, 0.5)',
            hull: 'rgba(12, 20, 36, 0.95)',
            line: 'rgba(125, 211, 252, 0.20)'
          };
        case 'purple':
          return {
            dust: ['#e9d5ff', '#c084fc', '#d8b4fe', '#ffffff', '#a855f7'],
            flag: '#c084fc',
            mine: '#c084fc',
            beacon: '#ffffff',
            pole: 'rgba(255, 255, 255, 0.5)',
            hull: 'rgba(12, 20, 36, 0.95)',
            line: 'rgba(192, 132, 252, 0.20)'
          };
        case 'gold':
        default:
          return {
            dust: ['#ffe08a', '#ffc83d', '#ffd166', '#ffffff', '#f5a623'],
            flag: '#ffc83d',
            mine: '#ffc83d',
            beacon: '#ffe08a',
            pole: 'rgba(255, 255, 255, 0.5)',
            hull: 'rgba(12, 20, 36, 0.95)',
            line: 'rgba(255, 200, 61, 0.20)'
          };
      }
    }

    let palette = getThemePalette();

    const isAuthPage = document.body.classList.contains('page-auth') || window.location.pathname === '/' || window.location.pathname.endsWith('/login');
    const flagCount = isAuthPage ? (isMobile ? 3 : 4) : (isMobile ? 2 : 3);
    const mineCount = isAuthPage ? (isMobile ? 2 : 3) : (isMobile ? 1 : 2);
    const orbCount = isAuthPage ? (isMobile ? 16 : 28) : (isMobile ? 12 : 20);

    const particles = [];

    // 1. Mini Floating Flags (with poles and fluttering cloth)
    for (let i = 0; i < flagCount; i++) {
      particles.push({
        kind: 'flag',
        x: Math.random() * width,
        y: Math.random() * height,
        scale: isMobile ? (0.65 + Math.random() * 0.35) : (0.8 + Math.random() * 0.5),
        baseAlpha: Math.random() * 0.25 + 0.45,
        speedY: -(Math.random() * 0.45 + 0.26),
        speedX: (Math.random() - 0.5) * 0.24,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayDist: Math.random() * 0.8 + 0.35,
        rotation: (Math.random() - 0.5) * 0.35,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        flutter: Math.random() * Math.PI * 2,
        flutterSpeed: 0.05 + Math.random() * 0.04
      });
    }

    // 2. Mini Floating Tactical Mines (with 8 spikes and pulsing reactor)
    for (let i = 0; i < mineCount; i++) {
      particles.push({
        kind: 'mine',
        x: Math.random() * width,
        y: Math.random() * height,
        scale: isMobile ? (0.65 + Math.random() * 0.35) : (0.75 + Math.random() * 0.45),
        baseAlpha: Math.random() * 0.25 + 0.45,
        speedY: -(Math.random() * 0.38 + 0.22),
        speedX: (Math.random() - 0.5) * 0.22,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.025 + Math.random() * 0.03,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayDist: Math.random() * 0.6 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.016
      });
    }

    // 3. Ambient Dust Particles & Glowing Embers
    for (let i = 0; i < orbCount; i++) {
      const isEmber = Math.random() < 0.3;
      const r = isEmber ? (Math.random() * 1.8 + 2.2) : (Math.random() * 1.4 + 1.0);
      particles.push({
        kind: 'orb',
        x: Math.random() * width,
        y: Math.random() * height,
        r: r,
        baseAlpha: isEmber ? (Math.random() * 0.35 + 0.5) : (Math.random() * 0.4 + 0.3),
        speedY: -(Math.random() * 0.65 + 0.25),
        speedX: (Math.random() - 0.5) * 0.35,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayDist: Math.random() * 0.6 + 0.2,
        color: palette.dust[Math.floor(Math.random() * palette.dust.length)],
        isEmber: isEmber
      });
    }

    window.addEventListener('mf_theme_change', () => {
      palette = getThemePalette();
      for (let i = 0; i < particles.length; i++) {
        if (particles[i].kind === 'orb') {
          particles[i].color = palette.dust[Math.floor(Math.random() * palette.dust.length)];
        }
      }
    });

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => syncCanvasSize(false), 140);
    }, { passive: true });

    function drawFlagParticle(ctx, p, alpha) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);
      ctx.globalAlpha = Math.min(0.85, alpha);

      // Flagpole
      ctx.strokeStyle = palette.pole || 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(0, -9);
      ctx.lineTo(0, 9);
      ctx.stroke();

      // Fluttering flag cloth (Clean vector rendering, no heavy blur)
      const wave = Math.sin(p.flutter) * 2.5;
      ctx.fillStyle = palette.flag;
      ctx.beginPath();
      ctx.moveTo(0, -8);
      ctx.quadraticCurveTo(7, -4 + wave, 12, -3);
      ctx.quadraticCurveTo(6, 2 - wave, 0, 1);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function drawMineParticle(ctx, p, alpha) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);
      ctx.globalAlpha = Math.min(0.8, alpha);

      // 8 Detonator spikes (Crisp strokes, no expensive blur)
      ctx.strokeStyle = palette.mine;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const x1 = Math.cos(angle) * 4;
        const y1 = Math.sin(angle) * 4;
        const x2 = Math.cos(angle) * 8.5;
        const y2 = Math.sin(angle) * 8.5;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Hull orb
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = palette.hull || 'rgba(12, 20, 36, 0.95)';
      ctx.strokeStyle = palette.mine;
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      // Pulsing beacon core
      const pulseSize = 1.6 + Math.sin(p.pulse) * 0.5;
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(1, pulseSize), 0, Math.PI * 2);
      ctx.fillStyle = palette.beacon;
      ctx.fill();

      ctx.restore();
    }

    let animId = null;
    let isRunning = true;
    let lastTime = performance.now();
    let lastRenderTime = 0;

    function render(currentTime) {
      if (!isRunning) return;

      const now = typeof currentTime === 'number' ? currentTime : performance.now();
      const targetInterval = isMobile ? (1000 / 24) : (1000 / 30);

      // Cap background canvas refresh rate (24fps mobile / 30fps desktop) to cut GPU/CPU overhead
      if (now - lastRenderTime < targetInterval - 1.5) {
        animId = requestAnimationFrame(render);
        return;
      }
      const elapsed = now - lastTime;
      lastTime = now;
      lastRenderTime = now;

      // Delta time normalized to 60fps (16.667ms per frame)
      const dt = Math.min(Math.max(elapsed / (1000 / 60), 0.1), 3.0);

      ctx.clearRect(0, 0, width, height);

      // Render Floating Mines, Flags, Embers & Dust (Fast linear passes)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.y += p.speedY * dt;
        p.x += (p.speedX + Math.sin(p.pulse) * p.swayDist) * dt;
        p.pulse += p.pulseSpeed * dt;
        if (p.rotationSpeed) p.rotation += p.rotationSpeed * dt;
        if (p.flutterSpeed) p.flutter += p.flutterSpeed * dt;

        if (p.y < -30) {
          p.y = height + 30;
          p.x = Math.random() * width;
          if (p.kind === 'orb') p.color = palette.dust[Math.floor(Math.random() * palette.dust.length)];
        }
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;

        const currentAlpha = Math.max(0.08, p.baseAlpha + Math.sin(p.pulse) * 0.2);

        if (p.kind === 'flag') {
          drawFlagParticle(ctx, p, currentAlpha);
        } else if (p.kind === 'mine') {
          drawMineParticle(ctx, p, currentAlpha);
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(0.85, currentAlpha);
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isRunning = false;
        if (animId) cancelAnimationFrame(animId);
      } else {
        if (!isRunning) {
          isRunning = true;
          lastTime = performance.now();
          animId = requestAnimationFrame(render);
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Tactile Card & Board (Modern Subtle 3D Perspective Tilt, Silky Smooth)
  // --------------------------------------------------------------------------
  function initTilt3D() {
    if (!FX.tilt) return;
    const boardFrame = document.querySelector('.board-frame');
    if (!boardFrame) return;

    let rafId = null;
    let targetRx = 2.2;
    let targetRy = 0;
    let currentRx = 2.2;
    let currentRy = 0;

    function renderTilt() {
      currentRx += (targetRx - currentRx) * 0.15;
      currentRy += (targetRy - currentRy) * 0.15;
      boardFrame.style.transform = 'perspective(1100px) rotateX(' + currentRx.toFixed(2) + 'deg) rotateY(' + currentRy.toFixed(2) + 'deg) translateZ(0)';
      if (Math.abs(targetRx - currentRx) > 0.02 || Math.abs(targetRy - currentRy) > 0.02) {
        rafId = requestAnimationFrame(renderTilt);
      } else {
        rafId = null;
      }
    }

    boardFrame.addEventListener('pointermove', (e) => {
      const rect = boardFrame.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRx = -(y * 3.5) + 2.0; // gentle pitch 0.25 to 3.75 deg
      targetRy = (x * 3.5);        // gentle roll -1.75 to +1.75 deg
      if (!rafId) rafId = requestAnimationFrame(renderTilt);
    }, { passive: true });

    boardFrame.addEventListener('pointerleave', () => {
      targetRx = 2.2;
      targetRy = 0;
      if (!rafId) rafId = requestAnimationFrame(renderTilt);
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 4. Tactile Ripple on Buttons
  // --------------------------------------------------------------------------
  function initButtonRipples() {
    if (!FX.ripple || isCoarsePointer || prefersReducedMotion) return;

    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('.btn, .play, .tactical-restart-btn, .tactical-hint-btn, .touch-tool-btn');
      if (!btn || btn.disabled) return;

      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      if (!btn.style.position) {
        btn.style.position = 'relative';
      }
      btn.style.overflow = 'hidden';

      circle.className = 'ripple-wave';
      circle.style.position = 'absolute';
      circle.style.borderRadius = '50%';
      circle.style.pointerEvents = 'none';
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.style.transform = 'scale(0)';
      circle.style.opacity = '0.5';
      circle.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 70%)';
      circle.style.transition = 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.45s ease-out';
      circle.style.zIndex = '1';

      const existing = btn.querySelector('.ripple-wave');
      if (existing) existing.remove();

      btn.appendChild(circle);

      requestAnimationFrame(() => {
        circle.style.transform = 'scale(2.2)';
        circle.style.opacity = '0';
      });

      setTimeout(() => {
        if (circle.parentNode === btn) {
          circle.remove();
        }
      }, 480);
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // 5. Game State Observer (Progress bar updates in game.js renderCounters())
  // --------------------------------------------------------------------------
  function initGameObservers() {
    const board = document.getElementById('board');
    const statusBtn = document.getElementById('status');
    const shockwave = document.getElementById('shockwave-ring');
    const confettiCanvas = document.getElementById('confetti-canvas');

    if (statusBtn) {
      let lastState = statusBtn.dataset.state;

      const statusObserver = new MutationObserver(() => {
        const state = statusBtn.dataset.state;
        if (state === lastState) return;
        lastState = state;

        if (state === 'ready') {
          stopBoardFx(confettiCanvas);
          if (shockwave) shockwave.classList.remove('is-active');
          return;
        }

        if (state === 'lost') {
          const boardWrap = document.getElementById('board-wrap');
          const boardFrame = document.querySelector('.board-frame');
          const explodedCell = board ? board.querySelector('.cell.is-exploded') : null;

          // 1. Violent Board Shake
          if (FX.shake && boardFrame) {
            boardFrame.classList.remove('is-shaking');
            void boardFrame.offsetWidth;
            boardFrame.classList.add('is-shaking');
            setTimeout(() => boardFrame.classList.remove('is-shaking'), 550);
          }

          // 2. Exact Centered Shockwave Blast & Sparks
          if (shockwave && boardWrap) {
            const wrapRect = boardWrap.getBoundingClientRect();
            let ringX = wrapRect.width / 2;
            let ringY = wrapRect.height / 2;

            if (explodedCell) {
              const cellRect = explodedCell.getBoundingClientRect();
              ringX = (cellRect.left + cellRect.width / 2) - wrapRect.left + boardWrap.scrollLeft;
              ringY = (cellRect.top + cellRect.height / 2) - wrapRect.top + boardWrap.scrollTop;
            }

            shockwave.style.left = `${ringX}px`;
            shockwave.style.top = `${ringY}px`;
            shockwave.classList.remove('is-active');
            void shockwave.offsetWidth;
            shockwave.classList.add('is-active');
            setTimeout(() => shockwave.classList.remove('is-active'), 800);

            // 3. Fire Sparks & Shrapnel Blast Canvas (aligned to confettiCanvas rect)
            if (confettiCanvas) {
              const canvasRect = confettiCanvas.getBoundingClientRect();
              let sparkX = canvasRect.width / 2;
              let sparkY = canvasRect.height / 2;
              if (explodedCell) {
                const cellRect = explodedCell.getBoundingClientRect();
                sparkX = (cellRect.left + cellRect.width / 2) - canvasRect.left;
                sparkY = (cellRect.top + cellRect.height / 2) - canvasRect.top;
              }
              triggerExplosionBurst(confettiCanvas, sparkX, sparkY);
            }
          }
        } else if (state === 'won') {
          // Trigger victory confetti burst
          if (FX.confetti && confettiCanvas) {
            triggerConfetti(confettiCanvas);
          }
        }
      });

      statusObserver.observe(statusBtn, { attributes: true, attributeFilter: ['data-state'] });
    }
  }

  let boardFxAnimId = null;

  function stopBoardFx(canvas) {
    if (boardFxAnimId != null) {
      cancelAnimationFrame(boardFxAnimId);
      boardFxAnimId = null;
    }
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function prepareBoardCanvas(canvas) {
    stopBoardFx(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const isSmallScreen = window.innerWidth < 768;
    const dpr = isSmallScreen ? 1 : Math.min(window.devicePixelRatio || 1, 1.25);
    const width = canvas.offsetWidth || canvas.parentElement?.clientWidth || 300;
    const height = canvas.offsetHeight || canvas.parentElement?.clientHeight || 300;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, width, height, isSmallScreen };
  }

  // --------------------------------------------------------------------------
  // 6. Mine Explosion Shrapnel & Spark Fireworks Engine (Canvas 2D)
  // --------------------------------------------------------------------------
  function triggerExplosionBurst(canvas, originX, originY) {
    const setup = prepareBoardCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height, isSmallScreen } = setup;

    const sparks = [];
    const colors = ['#ff4d5e', '#ff7830', '#ffc83d', '#ffe08a', '#ffffff'];
    const count = isSmallScreen ? 16 : 22;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.25;
      const speed = Math.random() * 5.2 + 1.8;
      sparks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.2 + 1.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.032 + 0.028,
        gravity: 0.14,
      });
    }

    let lastTime = performance.now();

    function update(currentTime) {
      const now = typeof currentTime === 'number' ? currentTime : performance.now();
      const elapsed = now - lastTime;
      lastTime = now;
      const dt = Math.min(Math.max(elapsed / (1000 / 60), 0.1), 3.0);

      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        s.vx *= Math.pow(0.93, dt);
        s.vy *= Math.pow(0.93, dt);
        s.vy += s.gravity * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.alpha -= s.decay * dt;

        if (s.alpha > 0) {
          alive = true;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = s.color;
          ctx.globalAlpha = Math.max(0, s.alpha);
          ctx.fill();
        }
      }

      if (alive) {
        boardFxAnimId = requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, width, height);
        boardFxAnimId = null;
      }
    }

    boardFxAnimId = requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // 7. Victory Confetti Fireworks Engine (Canvas 2D)
  // --------------------------------------------------------------------------
  function triggerConfetti(canvas) {
    const setup = prepareBoardCanvas(canvas);
    if (!setup) return;
    const { ctx, width, height, isSmallScreen } = setup;

    const confettiPieces = [];
    const colors = ['#ffc83d', '#ffe08a', '#2ee59d', '#4da3ff', '#f472b6', '#ffffff'];
    const count = isSmallScreen ? 28 : 40;

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: width / 2,
        y: height * 0.45,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.36,
        drag: 0.96,
        alpha: 1,
      });
    }

    let lastTime = performance.now();

    function update(currentTime) {
      const now = typeof currentTime === 'number' ? currentTime : performance.now();
      const elapsed = now - lastTime;
      lastTime = now;

      const dt = Math.min(Math.max(elapsed / (1000 / 60), 0.1), 3.0);

      ctx.clearRect(0, 0, width, height);
      let alive = false;

      for (let i = 0; i < confettiPieces.length; i++) {
        const p = confettiPieces[i];
        const dragFactor = Math.pow(p.drag, dt);
        p.vx *= dragFactor;
        p.vy *= dragFactor;
        p.vy += p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.rotation += p.rotationSpeed * dt;
        p.alpha -= 0.011 * dt;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          ctx.restore();
        }
      }

      if (alive) {
        boardFxAnimId = requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, width, height);
        boardFxAnimId = null;
      }
    }

    boardFxAnimId = requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // 7. Form Error Shake Observer
  // --------------------------------------------------------------------------
  function initErrorObserver() {
    if (!FX.shake) return;

    const errorEl = document.getElementById('form-error') || document.getElementById('admin-form-error');
    if (!errorEl) return;

    const observer = new MutationObserver(() => {
      if (!errorEl.hidden && errorEl.textContent.trim().length > 0) {
        const form = errorEl.closest('form');
        if (form) {
          form.classList.remove('shake');
          void form.offsetWidth;
          form.classList.add('shake');
          setTimeout(() => form.classList.remove('shake'), 450);
        }
      }
    });

    observer.observe(errorEl, { attributes: true, childList: true, characterData: true });
  }

  // --------------------------------------------------------------------------
  // 8. Interactive Tactical Board Preview on Homepage
  // --------------------------------------------------------------------------
  function initHeroIsometricBoard() {
    const isoWrap = document.querySelector('.isometric-board-wrap');
    if (!isoWrap) return;

    // Interactive Tactile Micro-Bounce on 5x5 Cells
    const cells = isoWrap.querySelectorAll('.iso-cell');
    cells.forEach((cell) => {
      cell.addEventListener('pointerdown', () => {
        cell.classList.remove('is-cell-popped');
        void cell.offsetWidth;
        cell.classList.add('is-cell-popped');
        setTimeout(() => cell.classList.remove('is-cell-popped'), 350);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Bootstrap on DOM ready
  // --------------------------------------------------------------------------
  function start() {
    initAmbientScene();
    initTilt3D();
    initHeroIsometricBoard();
    initButtonRipples();
    initGameObservers();
    initErrorObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
