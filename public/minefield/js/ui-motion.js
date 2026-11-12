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

    if (FX.particles) {
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

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    function getThemePalette() {
      const theme = document.documentElement.dataset.theme || localStorage.getItem('mf_pastel_theme') || 'gold';
      switch (theme) {
        case 'pink':
          return {
            dust: ['#ffd1dc', '#f497b0', '#fbcfe8', '#ffffff', '#e57399'],
            flag: '#f497b0',
            mine: '#f497b0',
            beacon: '#ffffff',
            line: 'rgba(244, 151, 176, 0.20)'
          };
        case 'red':
          return {
            dust: ['#ffc4bf', '#f87171', '#fca5a5', '#ffffff', '#ef4444'],
            flag: '#f87171',
            mine: '#f87171',
            beacon: '#ffffff',
            line: 'rgba(248, 113, 113, 0.20)'
          };
        case 'white':
          return {
            dust: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#818cf8'],
            flag: '#3b82f6',
            mine: '#60a5fa',
            beacon: '#1d4ed8',
            line: 'rgba(59, 130, 246, 0.25)'
          };
        case 'green':
          return {
            dust: ['#bbf7d0', '#86efac', '#a7f3d0', '#ffffff', '#4ade80'],
            flag: '#86efac',
            mine: '#86efac',
            beacon: '#ffffff',
            line: 'rgba(134, 239, 172, 0.20)'
          };
        case 'blue':
          return {
            dust: ['#bae6fd', '#7dd3fc', '#93c5fd', '#ffffff', '#38bdf8'],
            flag: '#7dd3fc',
            mine: '#7dd3fc',
            beacon: '#ffffff',
            line: 'rgba(125, 211, 252, 0.20)'
          };
        case 'purple':
          return {
            dust: ['#e9d5ff', '#c084fc', '#d8b4fe', '#ffffff', '#a855f7'],
            flag: '#c084fc',
            mine: '#c084fc',
            beacon: '#ffffff',
            line: 'rgba(192, 132, 252, 0.20)'
          };
        case 'gold':
        default:
          return {
            dust: ['#ffe08a', '#ffc83d', '#ffd166', '#ffffff', '#f5a623'],
            flag: '#ffc83d',
            mine: '#ffc83d',
            beacon: '#ffe08a',
            line: 'rgba(255, 200, 61, 0.20)'
          };
      }
    }

    let palette = getThemePalette();

    const isMobile = width < 768;
    const isAuthPage = document.body.classList.contains('page-auth') || window.location.pathname === '/' || window.location.pathname.endsWith('/login');
    const flagCount = isAuthPage ? (isMobile ? 3 : 5) : (isMobile ? 2 : 3);
    const mineCount = isAuthPage ? (isMobile ? 2 : 4) : (isMobile ? 2 : 3);
    const orbCount = isMobile ? 12 : 22;

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
      const isEmber = Math.random() < 0.25;
      const r = isEmber ? (Math.random() * 1.8 + 2.0) : (Math.random() * 1.5 + 0.6);
      particles.push({
        kind: 'orb',
        x: Math.random() * width,
        y: Math.random() * height,
        r: r,
        baseAlpha: isEmber ? (Math.random() * 0.4 + 0.4) : (Math.random() * 0.45 + 0.2),
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

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    let rawMouseX = -1000;
    let rawMouseY = -1000;
    let hasMouse = false;

    window.addEventListener('mousemove', (e) => {
      hasMouse = true;
      rawMouseX = e.clientX;
      rawMouseY = e.clientY;
      if (FX.parallax) {
        const normX = (e.clientX / width - 0.5) * 2;
        const normY = (e.clientY / height - 0.5) * 2;
        targetX = normX * 12;
        targetY = normY * 12;
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      hasMouse = false;
      targetX = 0;
      targetY = 0;
    });

    function drawFlagParticle(ctx, p, alpha) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.scale(p.scale, p.scale);
      ctx.globalAlpha = Math.min(0.85, alpha);

      // Flagpole
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
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
      ctx.fillStyle = 'rgba(12, 20, 36, 0.95)';
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
    const TARGET_INTERVAL = 1000 / 60; // 60 FPS cap (prevents 240Hz monitor overload)

    function render(currentTime) {
      if (!isRunning) return;

      const now = typeof currentTime === 'number' ? currentTime : performance.now();

      // Throttle rendering on high-refresh screens (144Hz/240Hz) to save GPU fill rate
      if (now - lastRenderTime < TARGET_INTERVAL - 1.5) {
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
    if (!FX.ripple) return;

    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn || btn.disabled) return;

      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      // Ensure button contains absolute child properly without layout shift
      if (getComputedStyle(btn).position === 'static') {
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
      circle.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s ease-out';
      circle.style.zIndex = '1';

      const existing = btn.querySelector('.ripple-wave');
      if (existing) existing.remove();

      btn.appendChild(circle);

      requestAnimationFrame(() => {
        circle.style.transform = 'scale(2.4)';
        circle.style.opacity = '0';
      });

      setTimeout(() => {
        if (circle.parentNode === btn) {
          circle.remove();
        }
      }, 550);
    });
  }

  // --------------------------------------------------------------------------
  // 5. Game Progress Bar & State Mutation Observer
  // --------------------------------------------------------------------------
  function initGameObservers() {
    const board = document.getElementById('board');
    const progressBar = document.getElementById('game-progress-fill');
    const statusBtn = document.getElementById('status');
    const shockwave = document.getElementById('shockwave-ring');
    const confettiCanvas = document.getElementById('confetti-canvas');

    if (board && progressBar) {
      const updateProgress = () => {
        const cells = board.querySelectorAll('.cell');
        if (!cells.length) return;
        const total = cells.length;
        const revealed = board.querySelectorAll('.cell.is-open').length;
        const percent = Math.min(100, Math.round((revealed / total) * 100));
        progressBar.style.width = `${percent}%`;
      };

      const boardObserver = new MutationObserver(updateProgress);
      boardObserver.observe(board, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    if (statusBtn) {
      let lastState = statusBtn.dataset.state;

      const statusObserver = new MutationObserver(() => {
        const state = statusBtn.dataset.state;
        if (state === lastState) return;
        lastState = state;

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
            let originX = wrapRect.width / 2;
            let originY = wrapRect.height / 2;

            if (explodedCell) {
              const cellRect = explodedCell.getBoundingClientRect();
              originX = (cellRect.left + cellRect.width / 2) - wrapRect.left;
              originY = (cellRect.top + cellRect.height / 2) - wrapRect.top;
            }

            shockwave.style.left = `${originX}px`;
            shockwave.style.top = `${originY}px`;
            shockwave.classList.remove('is-active');
            void shockwave.offsetWidth;
            shockwave.classList.add('is-active');
            setTimeout(() => shockwave.classList.remove('is-active'), 800);

            // 3. Fire Sparks & Shrapnel Blast Canvas
            if (confettiCanvas) {
              triggerExplosionBurst(confettiCanvas, originX, originY);
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

  // --------------------------------------------------------------------------
  // 6. Mine Explosion Shrapnel & Spark Fireworks Engine (Canvas 2D - Compact Micro Burst)
  // --------------------------------------------------------------------------
  function triggerExplosionBurst(canvas, originX, originY) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const sparks = [];
    const colors = ['#ff4d5e', '#ff7830', '#ffc83d', '#ffe08a', '#ffffff'];

    // Compact localized micro-burst: 12 sparks, tight radius, fast decay, zero lag
    for (let i = 0; i < 12; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.5 + 1.5;
      sparks.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 1.8 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        decay: Math.random() * 0.05 + 0.04,
        gravity: 0.12,
      });
    }

    let animId = null;
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
        s.vx *= Math.pow(0.92, dt);
        s.vy *= Math.pow(0.92, dt);
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
        animId = requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(animId);
      }
    }

    animId = requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // 7. Victory Confetti Fireworks Engine (Canvas 2D)
  // --------------------------------------------------------------------------
  function triggerConfetti(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const confettiPieces = [];
    const colors = ['#ffc83d', '#ffe08a', '#2ee59d', '#4da3ff', '#ffffff'];

    for (let i = 0; i < 40; i++) {
      confettiPieces.push({
        x: width / 2,
        y: height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.8) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.38,
        drag: 0.96,
        alpha: 1,
      });
    }

    let animId = null;
    let lastTime = performance.now();

    function update(currentTime) {
      const now = typeof currentTime === 'number' ? currentTime : performance.now();
      const elapsed = now - lastTime;
      lastTime = now;

      // Delta time normalized to 60fps (16.667ms)
      // Clamped between 0.1 and 3.0 to handle high refresh rates (up to 240Hz+) and tab pauses
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
        p.alpha -= 0.012 * dt;

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
        animId = requestAnimationFrame(update);
      } else {
        ctx.clearRect(0, 0, width, height);
        cancelAnimationFrame(animId);
      }
    }

    animId = requestAnimationFrame(update);
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
