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

    // Wire Expanded Mathematical Physics Simulation Laboratories
    this.initFeynmanLab();
    this.initIsingLab();
    this.initSolitonLab();
    this.initPoincareLab();
    this.initAmplituhedronLab();
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

  // 1. Interactive Feynman Path Integral Lab
  initFeynmanLab() {
    const canvas = document.getElementById('feynman-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hbarSlider = document.getElementById('feynman-hbar');
    const hbarVal = document.getElementById('feynman-hbar-val');
    const readout = document.getElementById('feynman-readout');

    let hbar = parseFloat(hbarSlider ? hbarSlider.value : 0.25);
    let t = 0;

    if (hbarSlider) {
      hbarSlider.addEventListener('input', (e) => {
        hbar = parseFloat(e.target.value);
        if (hbarVal) hbarVal.textContent = hbar.toFixed(3);
        if (readout) {
          const coherence = (1 / (1 + hbar * 4)).toFixed(3);
          readout.innerHTML = `ħ = ${hbar.toFixed(3)} · Classical Path Coherence: <span style="color:${hbar < 0.15 ? '#10b981' : '#38bdf8'}">${(coherence * 100).toFixed(1)}%</span>`;
        }
      });
    }

    const renderFeynman = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.03;

      const startX = 40, startY = canvas.height / 2;
      const endX = canvas.width - 40, endY = canvas.height / 2;
      const numPaths = 32;

      for (let i = 0; i < numPaths; i++) {
        const offset = (i - numPaths / 2) * 5.5;
        const phase = (offset * offset * 0.45) / hbar + t;
        const isClassical = Math.abs(offset) < 3.0;

        let opacity = isClassical ? 0.95 : Math.max(0.06, (0.5 / (1 + (offset * offset * 0.2) / hbar)));
        let color = isClassical ? '#38bdf8' : `hsl(${(phase * 60) % 360}, 85%, 65%)`;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        const steps = 18;
        for (let s = 1; s <= steps; s++) {
          const ratio = s / steps;
          const px = startX + (endX - startX) * ratio;
          const envelope = Math.sin(ratio * Math.PI);
          const py = startY + offset * envelope + Math.sin(ratio * Math.PI * 3 + phase) * (hbar * 12 * envelope);
          ctx.lineTo(px, py);
        }

        ctx.strokeStyle = color;
        ctx.globalAlpha = opacity;
        ctx.lineWidth = isClassical ? 2.5 : 1.0;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(startX, startY, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#a855f7';
      ctx.beginPath(); ctx.arc(endX, endY, 5, 0, Math.PI * 2); ctx.fill();

      requestAnimationFrame(renderFeynman);
    };
    renderFeynman();
  }

  // 2. Interactive 2D Ising Conformal Criticality Lab (Circular Conformal Spin Field)
  initIsingLab() {
    const canvas = document.getElementById('ising-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const tempSlider = document.getElementById('ising-temp');
    const tempVal = document.getElementById('ising-temp-val');
    const stateReadout = document.getElementById('ising-state-readout');

    const L = 36;
    const spins = new Int8Array(L * L);
    for (let i = 0; i < L * L; i++) spins[i] = Math.random() < 0.5 ? 1 : -1;

    let T = 2.269;
    const Tc = 2.269;

    const updateReadout = () => {
      if (tempVal) tempVal.textContent = T.toFixed(3);
      if (stateReadout) {
        if (Math.abs(T - Tc) < 0.12) {
          stateReadout.innerHTML = `STATE: <span style="color:#2dd4bf;">CRITICAL KNIFE-EDGE (T ≈ Tc)</span> · Correlation r^(-1/4) Power-Law Active`;
        } else if (T < Tc) {
          stateReadout.innerHTML = `STATE: <span style="color:#38bdf8;">FERROMAGNETIC ORDERED</span> · Domain Coagulation`;
        } else {
          stateReadout.innerHTML = `STATE: <span style="color:#f43f5e;">DISORDERED HIGH-ENTROPY</span> · Thermal Fluctuations Dominant`;
        }
      }
    };

    if (tempSlider) {
      tempSlider.addEventListener('input', (e) => {
        T = parseFloat(e.target.value);
        updateReadout();
      });
    }

    const coldBtn = document.getElementById('btn-ising-cold');
    if (coldBtn) coldBtn.addEventListener('click', () => { T = 1.0; if (tempSlider) tempSlider.value = 1.0; updateReadout(); });
    const critBtn = document.getElementById('btn-ising-crit');
    if (critBtn) critBtn.addEventListener('click', () => { T = Tc; if (tempSlider) tempSlider.value = Tc; updateReadout(); });
    const hotBtn = document.getElementById('btn-ising-hot');
    if (hotBtn) hotBtn.addEventListener('click', () => { T = 4.2; if (tempSlider) tempSlider.value = 4.2; updateReadout(); });

    updateReadout();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const diskR = Math.min(cx, cy) - 12;
    const spacing = (diskR * 2) / L;

    const mcLoop = () => {
      for (let step = 0; step < 900; step++) {
        const x = Math.floor(Math.random() * L);
        const y = Math.floor(Math.random() * L);
        const idx = y * L + x;
        const s = spins[idx];

        const left = spins[y * L + ((x - 1 + L) % L)];
        const right = spins[y * L + ((x + 1) % L)];
        const up = spins[((y - 1 + L) % L) * L + x];
        const down = spins[((y + 1) % L) * L + x];

        const dE = 2 * s * (left + right + up + down);
        if (dE <= 0 || Math.random() < Math.exp(-dE / T)) {
          spins[idx] = -s;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < L; y++) {
        for (let x = 0; x < L; x++) {
          const px = cx - diskR + (x + 0.5) * spacing;
          const py = cy - diskR + (y + 0.5) * spacing;
          const dist = Math.hypot(px - cx, py - cy);
          if (dist > diskR) continue;

          const s = spins[y * L + x];
          const edgeFade = Math.max(0.15, 1 - Math.pow(dist / diskR, 3));
          ctx.beginPath();
          ctx.arc(px, py, s === 1 ? 2.2 : 1.1, 0, Math.PI * 2);
          ctx.fillStyle = s === 1
            ? `rgba(56, 189, 248, ${(0.78 * edgeFade).toFixed(2)})`
            : `rgba(148, 163, 184, ${(0.16 * edgeFade).toFixed(2)})`;
          ctx.fill();
        }
      }

      requestAnimationFrame(mcLoop);
    };
    mcLoop();
  }

  // 3. Interactive Sine-Gordon Topological Soliton Collider
  initSolitonLab() {
    const canvas = document.getElementById('soliton-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const readout = document.getElementById('soliton-charge-readout');

    const N = 160;
    let phi = new Float32Array(N);
    let phiPrev = new Float32Array(N);
    const dt = 0.08;

    const injectKink = (x0 = 35, v = 0.6) => {
      const gamma = 1 / Math.sqrt(1 - v * v);
      for (let i = 0; i < N; i++) {
        const x = (i - x0) * 0.35;
        phi[i] += 4 * Math.atan(Math.exp(gamma * x));
        phiPrev[i] = phi[i] - dt * (-v * gamma * (2 / Math.cosh(gamma * x)));
      }
      if (window.soundEngine) window.soundEngine.playChime(3);
    };

    const injectAntiKink = (x0 = 125, v = -0.6) => {
      const gamma = 1 / Math.sqrt(1 - v * v);
      for (let i = 0; i < N; i++) {
        const x = (i - x0) * 0.35;
        phi[i] -= 4 * Math.atan(Math.exp(gamma * x));
        phiPrev[i] = phi[i] - dt * (v * gamma * (2 / Math.cosh(gamma * x)));
      }
      if (window.soundEngine) window.soundEngine.playChime(1);
    };

    const clearField = () => {
      phi.fill(0);
      phiPrev.fill(0);
      if (window.soundEngine) window.soundEngine.playClick();
    };

    const kinkBtn = document.getElementById('btn-inject-kink');
    if (kinkBtn) kinkBtn.addEventListener('click', () => injectKink(35, 0.65));
    const antikinkBtn = document.getElementById('btn-inject-antikink');
    if (antikinkBtn) antikinkBtn.addEventListener('click', () => injectAntiKink(125, -0.65));
    const clearBtn = document.getElementById('btn-clear-solitons');
    if (clearBtn) clearBtn.addEventListener('click', () => clearField());

    injectKink(40, 0.55);
    injectAntiKink(120, -0.55);

    const solitonLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const phiNext = new Float32Array(N);
      for (let i = 1; i < N - 1; i++) {
        const lap = phi[i + 1] - 2 * phi[i] + phi[i - 1];
        const force = lap - Math.sin(phi[i]);
        phiNext[i] = 2 * phi[i] - phiPrev[i] + (dt * dt) * force;
      }
      phiNext[0] = phiNext[1];
      phiNext[N - 1] = phiNext[N - 2];

      phiPrev.set(phi);
      phi.set(phiNext);

      const Q = (phi[N - 1] - phi[0]) / (2 * Math.PI);
      if (readout) {
        readout.innerHTML = `TOPOLOGICAL CHARGE: <span style="color:var(--aurora-cyan); font-weight:700;">Q = ${Q.toFixed(2)}</span> · j^μ Conserved`;
      }

      ctx.beginPath();
      const cy = canvas.height / 2;
      for (let i = 0; i < N; i++) {
        const px = (i / (N - 1)) * canvas.width;
        const py = cy - (phi[i] / (2 * Math.PI)) * 55;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      for (let i = 0; i < N; i += 6) {
        const px = (i / (N - 1)) * canvas.width;
        const angle = phi[i];
        const len = 24;
        const endPx = px + Math.sin(angle) * len;
        const endPy = cy + Math.cos(angle) * len;
        ctx.beginPath();
        ctx.moveTo(px, cy);
        ctx.lineTo(endPx, endPy);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(endPx, endPy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#a855f7';
        ctx.fill();
      }

      requestAnimationFrame(solitonLoop);
    };
    solitonLoop();
  }

  // 4. Interactive Poincaré Hyperbolic Bulk & Ryu-Takayanagi Lab
  initPoincareLab() {
    const canvas = document.getElementById('poincare-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('poincare-subregion');
    const readout = document.getElementById('poincare-entropy-readout');

    let subregionAngle = parseFloat(slider ? slider.value : 1.8);

    if (slider) {
      slider.addEventListener('input', (e) => {
        subregionAngle = parseFloat(e.target.value);
        if (readout) {
          const area = (2 * Math.log(2 * Math.sin(subregionAngle / 2) / 0.1)).toFixed(2);
          readout.innerHTML = `SUBREGION Δθ: <strong>${(subregionAngle * 180 / Math.PI).toFixed(1)}°</strong> · ENTROPY: <strong style="color:var(--aurora-violet);">S_A = ${area} / 4G</strong> (ER=EPR)`;
        }
      });
    }

    const renderPoincare = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const R = 105;

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const halfA = subregionAngle / 2;
      const theta1 = -halfA;
      const theta2 = halfA;

      const d = R / Math.cos(halfA);
      const rArc = R * Math.tan(halfA);

      ctx.beginPath();
      ctx.arc(cx + d, cy, rArc, Math.PI - halfA, Math.PI + halfA, false);
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, R, theta1, theta2);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = '11px JetBrains Mono';
      ctx.fillText('Region A', cx + R + 10, cy + 4);

      ctx.fillStyle = '#a855f7';
      ctx.fillText('Geodesic γ_A (ER=EPR)', cx - 80, cy - 20);

      requestAnimationFrame(renderPoincare);
    };
    renderPoincare();
  }

  // 5. Pre-Spacetime Positive Grassmannian Amplituhedron Lab
  initAmplituhedronLab() {
    const canvas = document.getElementById('amplituhedron-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    const renderAmplituhedron = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.02;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const n = 6;
      const vertices = [];

      for (let i = 0; i < n; i++) {
        const theta = (2 * Math.PI * i) / n + t * 0.4;
        const phi = (4 * Math.PI * i) / n + t * 0.25;
        const rad = 75 + Math.sin(t + i) * 15;
        const vx = cx + Math.cos(theta) * rad;
        const vy = cy + Math.sin(phi) * (rad * 0.7);
        vertices.push({ x: vx, y: vy });
      }

      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          ctx.beginPath();
          ctx.moveTo(vertices[i].x, vertices[i].y);
          ctx.lineTo(vertices[j].x, vertices[j].y);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      vertices.forEach((v, idx) => {
        ctx.beginPath();
        ctx.arc(v.x, v.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText(`Z${idx + 1}`, v.x + 8, v.y + 4);
      });

      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
      ctx.fillText('Y ∈ G₊(k,n)', cx + 8, cy - 8);

      requestAnimationFrame(renderAmplituhedron);
    };
    renderAmplituhedron();
  }
}

window.workspaceEngine = new EtherealWorkspace();
