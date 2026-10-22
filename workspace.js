/**
 * ETHEREAL DOCKED WORKSPACE ENGINE
 * Tiling modal interface displaying live interactive simulators on the left
 * and terminal-rendered READMEs (glow markdown) on the right.
 */

class EtherealWorkspace {
  constructor() {
    this.modal = document.getElementById('workspace-modal');
    this.currentSystem = null;
    this.init();
  }

  init() {
    // Monastir Live Clock
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);

    // Close button & backdrop handlers
    const closeBtn = document.getElementById('ws-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (window.observatory) window.observatory.undock();
        else this.close();
      });
    }

    // Tab buttons inside workspace top bar
    document.querySelectorAll('.ws-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sysId = e.currentTarget.getAttribute('data-sys');
        this.openSystem(sysId);
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    // Constellation bottom/top quick jump pills
    document.querySelectorAll('.constellation-jump').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sysId = e.currentTarget.getAttribute('data-sys');
        if (window.observatory) {
          const targetNode = window.observatory.nodes.find(n => n.userData.id === sysId);
          if (targetNode) window.observatory.dockToNode(targetNode);
          else this.openSystem(sysId);
        } else {
          this.openSystem(sysId);
        }
      });
    });

    // Wire live mini-arbitrage calculator inside eSIM tab
    this.initMiniArbitrageCalc();

    // Wire ZizkaDB Tamper Simulation Test
    this.initZizkaDBTamperTest();

    // Wire Conceptionist Manifesto Controls
    this.initManifestoControls();

    // Wire ManimGX Geometry Studio
    this.initManimLab();
  }

  updateClock() {
    const clockEl = document.getElementById('ws-clock');
    if (!clockEl) return;
    const now = new Date();
    // Tunisia time (UTC+1)
    const options = { timeZone: 'Africa/Tunis', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    clockEl.textContent = now.toLocaleTimeString('en-GB', options) + ' · Monastir (UTC+1)';
  }

  openSystem(systemId) {
    this.currentSystem = systemId;
    if (!this.modal) return;

    this.modal.classList.add('active');

    // Update active tab button
    document.querySelectorAll('.ws-tab-btn').forEach(b => {
      if (b.getAttribute('data-sys') === systemId) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Update breadcrumb
    const bc = document.getElementById('ws-breadcrumb');
    if (bc) bc.textContent = `YB://observatory/nodes/${systemId}`;

    // Switch visible system view
    document.querySelectorAll('.system-view').forEach(view => {
      if (view.id === `view-${systemId}`) view.classList.add('active');
      else view.classList.remove('active');
    });
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }

  initMiniArbitrageCalc() {
    const selDest = document.getElementById('mini-dest');
    const rngDays = document.getElementById('mini-days');
    const lblDays = document.getElementById('mini-days-val');
    const selCcy = document.getElementById('mini-ccy');
    const txtVerdict = document.getElementById('mini-verdict');

    if (!selDest || !rngDays || !selCcy || !txtVerdict) return;

    // Spot rates vs 1 EUR
    const spots = { USD: 1.085, EUR: 1.0, HKD: 8.44, CAD: 1.49, COP: 4680, ILS: 4.02 };
    // Base prices per destination for 7d
    const base7d = { USA: 27.9, JPN: 24.5, KEN: 34.0, DOM: 31.0, TUN: 29.5, FRA: 22.0 };

    const recalc = () => {
      const dest = selDest.value;
      const days = parseInt(rngDays.value, 10);
      if (lblDays) lblDays.textContent = `${days} Days`;
      const userCcy = selCcy.value;

      const baseEur = (base7d[dest] || 25) * (days / 7) * (days > 15 ? 0.75 : 1);
      const userAmt = baseEur * (spots[userCcy] || 1);
      const userUsdEquiv = (userAmt / (spots[userCcy] || 1)) * spots.USD;

      // Arbitrage in HKD
      const hkdAmt = baseEur * 0.78 * spots.HKD;
      const hkdUsdEquiv = (hkdAmt / spots.HKD) * spots.USD;
      const savingsUsd = Math.max(0, userUsdEquiv - hkdUsdEquiv);
      const pct = userUsdEquiv > 0 ? ((savingsUsd / userUsdEquiv) * 100).toFixed(1) : 0;

      txtVerdict.innerHTML = `<strong>Arbitrage Discovery:</strong> Paying in <strong>${userCcy}</strong> costs ~<strong>$${userUsdEquiv.toFixed(2)} USD</strong>. Switching checkout currency to <strong>HKD</strong> (${Math.round(hkdAmt)} HKD) saves you <strong>$${savingsUsd.toFixed(2)} USD (${pct}% off)</strong> instantly.`;
    };

    selDest.addEventListener('change', recalc);
    rngDays.addEventListener('input', recalc);
    selCcy.addEventListener('change', recalc);

    // Quick glitch presets
    document.querySelectorAll('.btn-glitch-preset').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const dest = e.currentTarget.getAttribute('data-dest');
        const days = e.currentTarget.getAttribute('data-days');
        const ccy = e.currentTarget.getAttribute('data-ccy');
        if (dest) selDest.value = dest;
        if (days) rngDays.value = days;
        if (ccy) selCcy.value = ccy;
        recalc();
        if (window.soundEngine) window.soundEngine.playChime(1);
      });
    });

    recalc();
  }

  async computeSHA256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const buf = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  initZizkaDBTamperTest() {
    const btnTamper = document.getElementById('btn-tamper-test');
    const btnAppend = document.getElementById('btn-zizka-append');
    const inputPayload = document.getElementById('zizka-custom-payload');
    const logOutput = document.getElementById('zizka-tamper-log');

    if (btnTamper && logOutput) {
      btnTamper.addEventListener('click', async () => {
        const originalPayload = 'agent_goal="Rebalance Portfolio" tool="execute_trade" amount=50000 currency="USDT"';
        const tamperedPayload = 'agent_goal="Rebalance Portfolio" tool="execute_trade" amount=9999999 recipient="0xAttacker"';

        const originalHash = await this.computeSHA256(originalPayload);
        const tamperedHash = await this.computeSHA256(tamperedPayload);

        logOutput.innerHTML = `
          <div style="color:#ef4444; font-weight:700;">[SECURITY ALERT: EU AI ACT ARTICLE 12 INTEGRITY DRIFT DETECTED]</div>
          <div style="color:#94a3b8; margin:0.35rem 0;">Block #41209 payload modified post-genesis.</div>
          <div style="color:#f59e0b;">Expected Hash: <code>sha256:${originalHash.slice(0, 24)}...</code></div>
          <div style="color:#ef4444;">Computed Hash: <code>sha256:${tamperedHash.slice(0, 24)}...</code></div>
          <div style="color:#10b981; margin-top:0.35rem;">✓ Deterministic Merkle Replay engaged. Audit trail immutable. Rollback verified.</div>
        `;
        if (window.soundEngine) window.soundEngine.playAlert();
      });
    }

    if (btnAppend && inputPayload && logOutput) {
      btnAppend.addEventListener('click', async () => {
        const text = inputPayload.value.trim() || 'agent_action: inspect_ecb_fx_rates()';
        const blockNum = Math.floor(41210 + Math.random() * 50);
        const hash = await this.computeSHA256(text);
        const newEntry = document.createElement('div');
        newEntry.style.marginTop = '0.5rem';
        newEntry.style.borderLeft = '2px solid var(--aurora-cyan)';
        newEntry.style.paddingLeft = '0.5rem';
        newEntry.innerHTML = `
          <div style="color:#38bdf8; font-weight:600;">Block #${blockNum}: ${text}</div>
          <div style="color:#64748b; font-size:0.75rem;">sha256:${hash.slice(0, 32)}... [VERIFIED IMMUTABLE]</div>
        `;
        logOutput.prepend(newEntry);
        inputPayload.value = '';
        if (window.soundEngine) window.soundEngine.playChime(1);
      });
    }
  }

  initManifestoControls() {
    const rangeSigma = document.getElementById('range-sigma');
    const rangeRho = document.getElementById('range-rho');
    const rangeBeta = document.getElementById('range-beta');
    const valSigma = document.getElementById('val-sigma');
    const valRho = document.getElementById('val-rho');
    const valBeta = document.getElementById('val-beta');
    const btnMutate = document.getElementById('btn-mutate-manifold');

    if (!rangeSigma || !rangeRho || !rangeBeta) return;

    const updateVals = () => {
      if (valSigma) valSigma.textContent = parseFloat(rangeSigma.value).toFixed(1);
      if (valRho) valRho.textContent = parseFloat(rangeRho.value).toFixed(1);
      if (valBeta) valBeta.textContent = parseFloat(rangeBeta.value).toFixed(2);
    };

    rangeSigma.addEventListener('input', updateVals);
    rangeRho.addEventListener('input', updateVals);
    rangeBeta.addEventListener('input', updateVals);

    if (btnMutate) {
      btnMutate.addEventListener('click', () => {
        const s = parseFloat(rangeSigma.value);
        const r = parseFloat(rangeRho.value);
        const b = parseFloat(rangeBeta.value);
        if (window.observatory) {
          window.observatory.recomputeLorenz(s, r, b);
        }
        if (window.soundEngine) {
          window.soundEngine.playManifesto();
        }
      });
    }
  }

  initManimLab() {
    const canvas = document.getElementById('manim-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;
    let mode = 'hopf';

    document.querySelectorAll('.btn-manim-mode').forEach(btn => {
      btn.addEventListener('click', (e) => {
        mode = e.currentTarget.getAttribute('data-mode') || 'hopf';
        document.querySelectorAll('.btn-manim-mode').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        if (window.soundEngine) window.soundEngine.playChime(2);
      });
    });

    const renderLoop = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.22)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      t += 0.02;

      if (mode === 'hopf') {
        const numCircles = 16;
        for (let i = 0; i < numCircles; i++) {
          const theta = (i / numCircles) * Math.PI + t * 0.2;
          ctx.beginPath();
          const rX = 85 + Math.sin(t + i) * 15;
          const rY = 45 + Math.cos(t * 0.7 + i) * 10;
          ctx.ellipse(cx + Math.cos(theta) * 45, cy + Math.sin(theta) * 25, rX, rY, theta, 0, Math.PI * 2);
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(168, 85, 247, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      } else if (mode === 'epicycle') {
        let x = cx;
        let y = cy;
        const freqs = [1, 3, 5, 7];
        freqs.forEach((f) => {
          const prevX = x;
          const prevY = y;
          const radius = 60 / f;
          x += radius * Math.cos(f * t);
          y += radius * Math.sin(f * t);

          ctx.beginPath();
          ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.6)';
          ctx.stroke();
        });

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--aurora-rose)';
        ctx.fill();
      } else {
        ctx.beginPath();
        let lx = 0.1, ly = 0.0, lz = 0.0;
        const dt = 0.01;
        for (let k = 0; k < 600; k++) {
          const dx = 10 * (ly - lx) * dt;
          const dy = (lx * (28 - lz) - ly) * dt;
          const dz = (lx * ly - (8/3) * lz) * dt;
          lx += dx; ly += dy; lz += dz;
          const px = cx + lx * 7.5;
          const py = cy + 110 - lz * 5.0;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      requestAnimationFrame(renderLoop);
    };

    renderLoop();
  }
}

window.workspaceEngine = new EtherealWorkspace();
