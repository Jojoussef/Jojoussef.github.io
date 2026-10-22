/**
 * CELESTIAL REPL TERMINAL ENGINE
 * Interactive UNIX-style command line interface for direct system interrogation.
 */

class CelestialREPL {
  constructor() {
    this.modal = document.getElementById('repl-modal');
    this.output = document.getElementById('repl-output');
    this.input = document.getElementById('repl-input');
    this.closeBtn = document.getElementById('repl-close-btn');
    this.toggleBtn = document.getElementById('btn-repl-toggle');

    this.history = [];
    this.historyIdx = -1;

    this.commands = {
      help: () => `
Available Celestial Observatory Commands:
  help                    List all available terminal commands
  whoami                  Display identity, credentials, and engineering ethos
  manifesto               Print the foundational physical & ontological thesis
  zizkadb verify          Cryptographic SHA-256 genesis block & Article 12 audit
  arbitrage               Display top audited eSIM price discrimination spreads
  topology <mode>         Switch 3D manifold topology (torus | lorenz | clifford)
  coords                  Print astronomical ephemeris & Monastir coordinates
  skills                  List core systems, frameworks, and architecture stacks
  upwork                  Display verified Upwork metrics, earnings, and reviews
  dock <id>               Dock camera into node (esim | zizkadb | verifyid | etl | manim | manifesto | comms)
  undock                  Return to free celestial orbit
  sound <on|off>          Toggle the Web Audio 432 Hz harmonic engine
  clear                   Clear terminal screen
  exit                    Close this terminal session
`,
      whoami: () => `
Youssef Benatti · Senior AI & Data Systems Engineer
Higher Institute of Informatics and Mathematics of Monastir (ISIMM, 2022–2026)
Location: Monastir, Tunisia (35.76°N, 10.82°E)
Specializations: High-throughput streaming (15M+ events/day), EU AI Act Article 12 audit trails, algorithmic price discrimination systems, and computer vision intake.
Ethos: Conceptionist Maximalism — Software as living mathematical systems.
`,
      manifesto: () => `
[THE ONTOLOGICAL FIELD · SHADOWS OF THE UNSEEN JEWEL]

Picture a sea with no water in it: a field of ink-dark stillness running to every horizon without a single fixed grain, so evenly symmetric that every shift or turn leaves it unchanged and guards a conserved current, ∂_μ J^μ = 0, and so insistent on locality that if its phase is free to twist differently at every point, a new field must rise to absorb the difference, D_μ = ∂_μ − ieA_μ, and that field is light.

It shimmers faintly with the restless hum of a vacuum that is never quite empty, E₀ = Σ_k ½ħω_k. Across it drift pale-blue swells, (□ + m²)φ = 0, each a crest that can cross another untouched. Below them, every conceivable route fans out in slow-turning colour, each stamped with its own phase, e^{iS[x]/ħ}, until only one narrow thread, where δS = 0, burns in a single steady shade: the true path.

The pattern keeps its character at every scale only at the knife-edge T_c = 2J / (k_B ln(1+√2)), where correlations fall as r^{−1/4}. A twist travels along a silver chain of pendulums, φ_tt − φ_xx + sin φ = 0, in the shape φ = 4 arctan e^{γ(x−vt)}, and as it passes it becomes a lone bright particle, because its winding number is a charge, j^μ = (1/2π) ε^{μν} ∂_ν φ.

Farther out the ground curves away into a vast disk, ds² = 4(dx² + dy²) / (1 − x² − y²)², tiled by identical seven-sided cells, S ≤ k_B A / 4ℓ_P². Across the interior, threads of entanglement weave the cells into one fabric, S_A = Area(γ_A) / 4G, ER = EPR.

Beyond the rim even the stage goes: only a faceted crystal, Y = C·Z with C ∈ G₊(k,n), whose volume is the answer to a scattering: A_n = ⟨ij⟩⁴ / (⟨12⟩⟨23⟩⋯⟨n1⟩). It may be that the field, the paths, the scales and the tiles are all shadows cast by a shape that was never in space at all.
`,
      'zizkadb verify': async () => {
        const genesisPayload = "zizkadb:genesis:0x00:eu_ai_act:article_12:immutable";
        const encoder = new TextEncoder();
        const data = encoder.encode(genesisPayload);
        const hashBuf = await crypto.subtle.digest('SHA-256', data);
        const hashHex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
        return `
[ZIZKADB INTEGRITY SCAN]
Genesis Block:       #00000000
Protocol Standard:   EU AI Act Article 12 (High-Risk AI Systems)
Merkle Algorithm:    SHA-256 (Native Web Crypto API)
Payload:             "${genesisPayload}"
Cryptographic Hash:  sha256:${hashHex}
Verification Status: 100% IMMUTABLE · ZERO ANOMALIES DETECTED
`;
      },
      arbitrage: () => `
[eSIM PRICE DISCRIMINATION AUDIT — TOP 5 VOLATILITIES]
  DESTINATION       CURRENCY    CATALOGUE (USD)   ECB SPOT (USD)   SPREAD VERDICT
  -------------------------------------------------------------------------------
  Colombia (COP)    COP         $44.20            $24.78           +78.4% OVERCHARGED
  Israel (ILS)      ILS         $38.50            $27.10           +42.1% OVERCHARGED
  Hong Kong (HKD)   HKD         $21.40            $27.50           -22.2% ARBITRAGE SAVING
  Japan (JPY)       JPY         $29.10            $24.50           +18.8% INVERSION
  United Kingdom    GBP         $28.00            $28.20           -0.7% FAIR PEG
`,
      coords: () => {
        const date = new Date();
        const jd = (date.getTime() / 86400000.0) + 2440587.5;
        const d = jd - 2451545.0;
        let gmst = 18.697374558 + 24.06570982441908 * d;
        let lst = (gmst + 10.82 / 15.0) % 24;
        if (lst < 0) lst += 24;
        const lstH = Math.floor(lst).toString().padStart(2, '0');
        const lstM = Math.floor((lst % 1) * 60).toString().padStart(2, '0');
        const lstS = Math.floor(((lst * 60) % 1) * 60).toString().padStart(2, '0');
        return `
[ASTRONOMICAL CELESTIAL COORDINATES]
  Observatory Node:      Monastir, Tunisia
  Geodetic Coordinates: 35.7643° N, 10.8113° E
  Timezone:              UTC+1 (Central European Time)
  Julian Date:           ${jd.toFixed(4)}
  Local Sidereal Time:   LST ${lstH}:${lstM}:${lstS}
  Fundamental Resonance: 432 Hz Pythagorean
`;
      },
      skills: () => `
[TECHNICAL CAPABILITIES & ENGINEERING ARCHITECTURE]
  Languages:   Python, TypeScript, SQL (PostgreSQL), Rust, C++
  AI & Vision: PyTorch, OpenCV, Azure AI Vision, AWS Rekognition, LangChain, MCP
  Data & ETL:  Apache Airflow, Celery, Redis, dbt, DuckDB, RabbitMQ, ClickHouse
  Web & 3D:    Three.js, WebGL, Web Audio API, Next.js, Web Crypto API, Tailwind
  Compliance:  EU AI Act Article 12, HIPAA, Merkle Trees, Cryptographic Audit
`,
      upwork: () => `
[UPWORK VERIFIED FREELANCE PROFILE]
  Status:        Top-Rated AI & Data Engineer
  Hourly Rate:   $29.00 / hour
  Total Billed:  $10,000+ across 680+ verified hours
  Client Rating: 5.0 / 5.0 (100% 5-Star Reviews across 8 Contracts)
  Flagship Apps: VerifyID, Miranda AI, YuccaInfo GED, MedDash
  Profile URL:   https://www.upwork.com/freelancers/~01fc3acc8b53d058d2
`,
      clear: () => {
        if (this.output) this.output.innerHTML = '';
        return '';
      },
      exit: () => {
        this.close();
        return 'Session terminated. Returning to celestial canvas.';
      },
      undock: () => {
        if (window.observatory) window.observatory.undock();
        return 'Camera undocked. Constellation in free orbit.';
      }
    };

    this.init();
  }

  init() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    // Toggle on backtick (`) or ~ key
    window.addEventListener('keydown', (e) => {
      if (e.key === '`' || e.key === '~') {
        // Only toggle if not actively typing inside another input
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          this.toggle();
        }
      }
    });

    if (this.input) {
      this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));
    }

    // Print welcome banner
    this.print(`
╔═══════════════════════════════════════════════════════════════════════════╗
║   YB CELESTIAL OBSERVATORY CLI · REPL v2.4                                ║
║   Type "help" for active commands · Press "~" or Esc to dismiss           ║
╚═══════════════════════════════════════════════════════════════════════════╝
`, 'system');
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    if (this.input) {
      this.input.focus();
    }
    if (window.soundEngine) window.soundEngine.playKeyClick();
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }

  toggle() {
    if (this.modal && this.modal.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }

  async handleKeyDown(e) {
    if (window.soundEngine) window.soundEngine.playKeyClick();

    if (e.key === 'Enter') {
      const rawCmd = this.input.value.trim();
      if (!rawCmd) return;

      this.history.push(rawCmd);
      this.historyIdx = this.history.length;

      this.print(`youssef@observatory:~$ ${rawCmd}`, 'user');
      this.input.value = '';

      await this.executeCommand(rawCmd);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIdx > 0) {
        this.historyIdx--;
        this.input.value = this.history[this.historyIdx] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIdx < this.history.length - 1) {
        this.historyIdx++;
        this.input.value = this.history[this.historyIdx] || '';
      } else {
        this.historyIdx = this.history.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autoComplete();
    } else if (e.key === 'Escape') {
      this.close();
    }
  }

  autoComplete() {
    const val = this.input.value.trim();
    if (!val) return;
    const candidates = Object.keys(this.commands);
    const match = candidates.find(c => c.startsWith(val));
    if (match) {
      this.input.value = match;
    }
  }

  async executeCommand(cmdStr) {
    const parts = cmdStr.split(' ').filter(Boolean);
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    // Check compound commands
    const compound = `${cmd} ${arg}`.trim();
    if (this.commands[compound]) {
      const res = await this.commands[compound]();
      if (res) this.print(res);
      return;
    }

    if (cmd === 'topology') {
      if (['torus', 'lorenz', 'clifford'].includes(arg)) {
        if (window.observatory) window.observatory.switchTopology(arg);
        this.print(`[OK] Switched 3D celestial manifold topology to: ${arg.toUpperCase()}`);
      } else {
        this.print(`Usage: topology <torus | lorenz | clifford>`);
      }
      return;
    }

    if (cmd === 'dock') {
      const targetMap = {
        esim: 'esim',
        zizkadb: 'zizkadb',
        verifyid: 'verifyid',
        etl: 'etl',
        manim: 'manim',
        manifesto: 'manifesto',
        comms: 'communicator',
        communicator: 'communicator'
      };
      const sysId = targetMap[arg] || arg;
      if (window.observatory) {
        const node = window.observatory.nodes.find(n => n.userData.id === sysId);
        if (node) {
          window.observatory.dockToNode(node);
          this.close();
          this.print(`[OK] Docked camera into node: ${sysId}`);
          return;
        }
      }
      this.print(`Unknown node. Available: esim, zizkadb, verifyid, etl, manim, manifesto, comms`);
      return;
    }

    if (cmd === 'sound') {
      if (arg === 'on') {
        if (window.soundEngine) window.soundEngine.enable();
        this.print(`[OK] Web Audio 432 Hz synthesizer enabled.`);
      } else if (arg === 'off') {
        if (window.soundEngine) window.soundEngine.disable();
        this.print(`[OK] Sound engine suspended.`);
      } else {
        this.print(`Usage: sound <on | off>`);
      }
      return;
    }

    if (this.commands[cmd]) {
      const res = await this.commands[cmd]();
      if (res) this.print(res);
      return;
    }

    this.print(`Command not found: "${cmdStr}". Type "help" for a list of valid commands.`, 'error');
    if (window.soundEngine) window.soundEngine.playAlert();
  }

  print(text, type = 'output') {
    if (!this.output) return;
    const el = document.createElement('pre');
    el.className = `repl-line repl-${type}`;
    el.textContent = text;
    this.output.appendChild(el);
    this.output.scrollTop = this.output.scrollHeight;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.celestialRepl = new CelestialREPL();
});
