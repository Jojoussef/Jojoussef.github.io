/**
 * CELESTIAL OBSERVATORY 3D ENGINE (Three.js)
 * Interactive 3D constellation with cinematic camera docking,
 * glowing mathematical manifolds, and interactive celestial nodes.
 */

class CelestialObservatory {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-1000, -1000);
    this.rawMouse = { x: 0, y: 0 };

    this.nodes = [];
    this.hoveredNode = null;
    this.dockedNode = null;
    this.isDocked = false;

    // Camera orbit physics
    this.cameraTargetPos = new THREE.Vector3(0, 4, 34);
    this.cameraLookTarget = new THREE.Vector3(0, 0, 0);
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.spherical = { radius: 34, theta: 0, phi: Math.PI * 0.42 };
    this.targetSpherical = { radius: 34, theta: 0, phi: Math.PI * 0.42 };

    this.particles = null;
    this.time = 0;

    // Quantum Spacetime Vacuum & Scroll Continuum Spline
    this.scrollProgress = 0;
    this.targetScrollProgress = 0;
    this.virtualPairs = [];
    this.lastFluctuationSoundTime = 0;

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.015);

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 16, 38);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    this.scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x38bdf8, 3.5, 70);
    pointLightCyan.position.set(0, 10, 15);
    this.scene.add(pointLightCyan);

    const pointLightViolet = new THREE.PointLight(0xa855f7, 3.0, 70);
    pointLightViolet.position.set(0, -10, -15);
    this.scene.add(pointLightViolet);

    // 4. Build Core Celestial & Quantum Spacetime Elements
    this.buildCelestialCore();
    this.buildParticleManifold();
    this.buildQuantumVacuum();
    this.buildEntanglementTensorNetwork();
    this.buildWavefunctionClouds();
    this.buildInteractiveNodes();
    this.setupScrollSpline();

    // 5. Event Listeners
    this.setupEvents();

    // 6. Animation Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildCelestialCore() {
    this.currentTopology = 'torus';

    // 1. Torus Knot Soliton
    this.torusGroup = new THREE.Group();
    const knotGeom = new THREE.TorusKnotGeometry(3.5, 0.85, 128, 32, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    this.coreKnot = new THREE.Mesh(knotGeom, knotMat);
    this.torusGroup.add(this.coreKnot);

    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.25 });
    const ringGeom1 = new THREE.RingGeometry(6.5, 6.7, 64);
    this.ring1 = new THREE.Mesh(ringGeom1, ringMat1);
    this.ring1.rotation.x = Math.PI * 0.35;
    this.torusGroup.add(this.ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, wireframe: true, transparent: true, opacity: 0.2 });
    const ringGeom2 = new THREE.RingGeometry(8.2, 8.4, 64);
    this.ring2 = new THREE.Mesh(ringGeom2, ringMat2);
    this.ring2.rotation.y = Math.PI * 0.25;
    this.ring2.rotation.x = -Math.PI * 0.2;
    this.torusGroup.add(this.ring2);
    this.scene.add(this.torusGroup);

    // 2. Lorenz Strange Attractor (Numerical differential integration)
    this.lorenzGroup = new THREE.Group();
    const lorenzCount = 2800;
    const lorenzPositions = new Float32Array(lorenzCount * 3);
    const lorenzColors = new Float32Array(lorenzCount * 3);

    let lx = 0.1, ly = 0.0, lz = 0.0;
    const sigma = 10.0, rho = 28.0, beta = 8.0 / 3.0, dt = 0.009;
    const colCyan = new THREE.Color(0x38bdf8);
    const colViolet = new THREE.Color(0xa855f7);

    for (let i = 0; i < lorenzCount; i++) {
      const dx = sigma * (ly - lx) * dt;
      const dy = (lx * (rho - lz) - ly) * dt;
      const dz = (lx * ly - beta * lz) * dt;
      lx += dx; ly += dy; lz += dz;

      lorenzPositions[i * 3] = lx * 0.45;
      lorenzPositions[i * 3 + 1] = (lz - 25.0) * 0.45;
      lorenzPositions[i * 3 + 2] = ly * 0.45;

      const t = i / lorenzCount;
      const col = colCyan.clone().lerp(colViolet, t);
      lorenzColors[i * 3] = col.r;
      lorenzColors[i * 3 + 1] = col.g;
      lorenzColors[i * 3 + 2] = col.b;
    }

    const lorenzGeom = new THREE.BufferGeometry();
    lorenzGeom.setAttribute('position', new THREE.BufferAttribute(lorenzPositions, 3));
    lorenzGeom.setAttribute('color', new THREE.BufferAttribute(lorenzColors, 3));

    const lorenzLineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.lorenzMesh = new THREE.Line(lorenzGeom, lorenzLineMat);
    this.lorenzGroup.add(this.lorenzMesh);
    this.lorenzGroup.visible = false;
    this.scene.add(this.lorenzGroup);

    // 3. Clifford Strange Attractor Phase Manifold
    this.cliffordGroup = new THREE.Group();
    const cliffordCount = 3600;
    const cliffPositions = new Float32Array(cliffordCount * 3);
    const cliffColors = new Float32Array(cliffordCount * 3);

    let cx = 0.1, cy = 0.1;
    const ca = -1.4, cb = 1.6, cc = 1.0, cd = 0.7;
    const colTeal = new THREE.Color(0x2dd4bf);
    const colRose = new THREE.Color(0xf43f5e);

    for (let i = 0; i < cliffordCount; i++) {
      const nextX = Math.sin(ca * cy) + cc * Math.cos(ca * cx);
      const nextY = Math.sin(cb * cx) + cd * Math.cos(cb * cy);
      cx = nextX;
      cy = nextY;

      cliffPositions[i * 3] = cx * 4.2;
      cliffPositions[i * 3 + 1] = cy * 4.2;
      cliffPositions[i * 3 + 2] = Math.sin(i * 0.05) * 3.5;

      const t = (Math.sin(i * 0.02) + 1) * 0.5;
      const col = colTeal.clone().lerp(colRose, t);
      cliffColors[i * 3] = col.r;
      cliffColors[i * 3 + 1] = col.g;
      cliffColors[i * 3 + 2] = col.b;
    }

    const cliffGeom = new THREE.BufferGeometry();
    cliffGeom.setAttribute('position', new THREE.BufferAttribute(cliffPositions, 3));
    cliffGeom.setAttribute('color', new THREE.BufferAttribute(cliffColors, 3));

    const cliffMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    this.cliffordMesh = new THREE.Points(cliffGeom, cliffMat);
    this.cliffordGroup.add(this.cliffordMesh);
    this.cliffordGroup.visible = false;
    this.scene.add(this.cliffordGroup);

    // 4. Pre-Spacetime Positive Grassmannian Amplituhedron (Y = C·Z ∈ G+(k,n))
    this.amplituhedronGroup = new THREE.Group();
    this.buildAmplituhedron();
    this.amplituhedronGroup.visible = false;
    this.scene.add(this.amplituhedronGroup);

    // 5. Poincaré Hyperbolic Disk & Ryu-Takayanagi Bulk (ER = EPR)
    this.poincareGroup = new THREE.Group();
    this.buildPoincareBulk();
    this.poincareGroup.visible = false;
    this.scene.add(this.poincareGroup);

    // Deconstruction state vectors
    this.isDeconstructed = false;
    this.deconstructProgress = 0.0;
  }

  buildAmplituhedron() {
    // 4D Mom-Twistor Vertices projected into 3D (k=2, n=6)
    this.twistors4D = [];
    const n = 6;
    for (let i = 0; i < n; i++) {
      const theta = (2 * Math.PI * i) / n;
      const phi = (4 * Math.PI * i) / n;
      this.twistors4D.push({
        x: Math.cos(theta) * 5.2,
        y: Math.sin(theta) * 5.2,
        z: Math.cos(phi) * 4.8,
        w: Math.sin(phi) * 4.8
      });
    }

    // Geometry container
    this.amplGeom = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    this.amplGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    // Facet lines connecting twistors
    const indices = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        indices.push(i, j);
      }
    }
    this.amplGeom.setIndex(indices);

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    this.amplWire = new THREE.LineSegments(this.amplGeom, lineMat);
    this.amplituhedronGroup.add(this.amplWire);

    // Dual inner crystal facet mesh
    const innerGeom = new THREE.IcosahedronGeometry(3.6, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    this.amplInner = new THREE.Mesh(innerGeom, innerMat);
    this.amplituhedronGroup.add(this.amplInner);

    // Twistor vertex markers
    const vertexPointers = new THREE.Points(
      this.amplGeom,
      new THREE.PointsMaterial({
        size: 0.6,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      })
    );
    this.amplituhedronGroup.add(vertexPointers);
  }

  buildPoincareBulk() {
    // 1. Conformal Boundary Ring (Radius 8.8)
    const boundaryGeom = new THREE.RingGeometry(8.75, 8.85, 96);
    const boundaryMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    this.poincareBoundary = new THREE.Mesh(boundaryGeom, boundaryMat);
    this.poincareGroup.add(this.poincareBoundary);

    // 2. Hyperbolic Geodesic Circular Arcs
    const arcCount = 14;
    const arcGroup = new THREE.Group();
    for (let i = 0; i < arcCount; i++) {
      const angle = (2 * Math.PI * i) / arcCount;
      const arcGeom = new THREE.BufferGeometry();
      const points = [];
      const R = 8.8;
      // Hyperbolic geodesic curve inside unit disk
      for (let t = -Math.PI * 0.45; t <= Math.PI * 0.45; t += 0.08) {
        const rad = R * (0.3 + 0.68 * Math.cos(t));
        const px = Math.cos(angle + t * 0.5) * rad;
        const py = Math.sin(angle + t * 0.5) * rad;
        points.push(px, py, 0);
      }
      arcGeom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
      const arcLine = new THREE.Line(arcGeom, new THREE.LineBasicMaterial({
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      }));
      arcGroup.add(arcLine);
    }
    this.poincareGroup.add(arcGroup);

    // 3. Ryu-Takayanagi Entanglement Geodesic Bridge (Minimal Surface gamma_A)
    const rtGeom = new THREE.BufferGeometry();
    const rtPoints = [];
    for (let t = 0; t <= Math.PI; t += 0.05) {
      // Semicircle geodesic connecting boundary intervals
      const r = 5.8 * Math.sin(t);
      const px = -6.2 + 12.4 * (t / Math.PI);
      const py = r;
      rtPoints.push(px, py, 0.2);
    }
    rtGeom.setAttribute('position', new THREE.Float32BufferAttribute(rtPoints, 3));
    this.rtLine = new THREE.Line(rtGeom, new THREE.LineBasicMaterial({
      color: 0xa855f7,
      linewidth: 3,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    }));
    this.poincareGroup.add(this.rtLine);
  }

  switchTopology(mode) {
    this.currentTopology = mode;
    if (this.torusGroup) this.torusGroup.visible = (mode === 'torus');
    if (this.lorenzGroup) this.lorenzGroup.visible = (mode === 'lorenz');
    if (this.cliffordGroup) this.cliffordGroup.visible = (mode === 'clifford');
    if (this.amplituhedronGroup) this.amplituhedronGroup.visible = (mode === 'amplituhedron');
    if (this.poincareGroup) this.poincareGroup.visible = (mode === 'poincare');

    const modeIndices = { torus: 0, lorenz: 1, clifford: 2, amplituhedron: 3, poincare: 4 };
    if (window.soundEngine) window.soundEngine.playTopologyMorph(modeIndices[mode] || 0);

    const hudTopo = document.getElementById('hud-topology-name');
    if (hudTopo) {
      const labels = {
        torus: 'TORUS KNOT SOLITON (p=2, q=3)',
        lorenz: 'LORENZ ATTRACTOR (σ=10, ρ=28, β=8/3)',
        clifford: 'CLIFFORD ATTRACTOR (a=-1.4, b=1.6)',
        amplituhedron: 'AMPLITUHEDRON JEWEL (Y = C · Z ∈ G+(k,n))',
        poincare: 'POINCARÉ HYPERBOLIC BULK & RYU-TAKAYANAGI (ER = EPR)'
      };
      hudTopo.textContent = labels[mode] || mode.toUpperCase();
    }

    document.querySelectorAll('.btn-topology').forEach(btn => {
      if (btn.getAttribute('data-topo') === mode) btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }

  // Spacetime Deconstruction: Dissolves metric, repels nodes into Grassmannian dust
  deconstructSpacetime() {
    this.isDeconstructed = true;
    if (window.soundEngine) window.soundEngine.playDeconstruct();

    // Assign randomized non-Euclidean dispersion vectors
    this.nodes.forEach(node => {
      node.userData.deconstructTarget = new THREE.Vector3(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 55
      );
    });

    const overlay = document.getElementById('deconstruct-panel');
    if (overlay) overlay.classList.add('active');

    const deconstructBtn = document.getElementById('btn-deconstruct');
    if (deconstructBtn) deconstructBtn.classList.add('active');

    const hudEl = document.getElementById('hud-telemetry');
    if (hudEl) {
      hudEl.innerHTML = `<span class="hud-item" style="color:var(--aurora-rose);"><span class="hud-dot" style="background:var(--aurora-rose);"></span>METRIC DISSOLVED · G_μν = 0</span> · <span class="hud-item" style="color:var(--aurora-amber);">G+(k,n) PHASE UNBOUND</span>`;
    }
  }

  // Spacetime Reconstruction: Gravitational collapse back to resting harmonic orbit
  reconstructSpacetime() {
    this.isDeconstructed = false;
    if (window.soundEngine) window.soundEngine.playReconstruct();

    const overlay = document.getElementById('deconstruct-panel');
    if (overlay) overlay.classList.remove('active');

    const deconstructBtn = document.getElementById('btn-deconstruct');
    if (deconstructBtn) deconstructBtn.classList.remove('active');

    this.updateTelemetryHUD();
  }

  toggleDeconstruct() {
    if (this.isDeconstructed) this.reconstructSpacetime();
    else this.deconstructSpacetime();
  }

  recomputeLorenz(sigma = 10.0, rho = 28.0, beta = 2.67) {
    if (!this.lorenzMesh) return;
    const lorenzCount = 2800;
    const positions = this.lorenzMesh.geometry.attributes.position.array;
    let lx = 0.1, ly = 0.0, lz = 0.0;
    const dt = 0.009;

    for (let i = 0; i < lorenzCount; i++) {
      const dx = sigma * (ly - lx) * dt;
      const dy = (lx * (rho - lz) - ly) * dt;
      const dz = (lx * ly - beta * lz) * dt;
      lx += dx; ly += dy; lz += dz;

      positions[i * 3] = lx * 0.45;
      positions[i * 3 + 1] = (lz - 25.0) * 0.45;
      positions[i * 3 + 2] = ly * 0.45;
    }

    this.lorenzMesh.geometry.attributes.position.needsUpdate = true;
    this.switchTopology('lorenz');
  }

  buildParticleManifold() {
    const particleCount = 1800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorA = new THREE.Color(0x38bdf8); // Cyan
    const colorB = new THREE.Color(0xa855f7); // Violet
    const colorC = new THREE.Color(0x2dd4bf); // Teal

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 26;
      const y = (Math.random() - 0.5) * 22;

      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      const mixedColor = Math.random() < 0.4 ? colorA : (Math.random() < 0.7 ? colorB : colorC);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.22,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  buildQuantumVacuum() {
    this.vacuumCount = 2400;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(this.vacuumCount * 3);
    const colors = new Float32Array(this.vacuumCount * 3);
    this.vacuumBasePos = new Float32Array(this.vacuumCount * 3);
    this.vacuumPhases = new Float32Array(this.vacuumCount);
    this.vacuumFrequencies = new Float32Array(this.vacuumCount);

    const cCyan = new THREE.Color(0x38bdf8);
    const cViolet = new THREE.Color(0xa855f7);
    const cTeal = new THREE.Color(0x2dd4bf);
    const cAmber = new THREE.Color(0xf59e0b);

    for (let i = 0; i < this.vacuumCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 5.0 + Math.pow(Math.random(), 0.5) * 32.0;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      this.vacuumBasePos[i * 3] = x;
      this.vacuumBasePos[i * 3 + 1] = y;
      this.vacuumBasePos[i * 3 + 2] = z;

      this.vacuumPhases[i] = Math.random() * Math.PI * 2;
      this.vacuumFrequencies[i] = 1.0 + Math.random() * 3.5;

      const pick = Math.random();
      const col = pick < 0.4 ? cCyan : (pick < 0.7 ? cViolet : (pick < 0.9 ? cTeal : cAmber));
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.vacuumPoints = new THREE.Points(geom, mat);
    this.scene.add(this.vacuumPoints);

    // Virtual particle dipole pairs pool
    this.virtualPairs = [];
    const pairCount = 36;
    for (let p = 0; p < pairCount; p++) {
      const pairGroup = new THREE.Group();
      
      const particleMatPlus = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0 });
      const particleMatMinus = new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0 });
      const sphereGeom = new THREE.SphereGeometry(0.2, 8, 8);

      const pPlus = new THREE.Mesh(sphereGeom, particleMatPlus);
      const pMinus = new THREE.Mesh(sphereGeom, particleMatMinus);
      pairGroup.add(pPlus);
      pairGroup.add(pMinus);

      const lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const lineMat = new THREE.LineBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0 });
      const dipoleLine = new THREE.Line(lineGeom, lineMat);
      pairGroup.add(dipoleLine);

      this.scene.add(pairGroup);

      this.virtualPairs.push({
        group: pairGroup,
        pPlus: pPlus,
        pMinus: pMinus,
        line: dipoleLine,
        lineGeom: lineGeom,
        active: false,
        age: 0,
        lifespan: 1.0,
        center: new THREE.Vector3(),
        velocity: new THREE.Vector3()
      });
    }
  }

  buildEntanglementTensorNetwork() {
    this.tensorLineCount = 180;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(this.tensorLineCount * 2 * 3);
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });

    this.tensorLines = new THREE.LineSegments(geom, mat);
    this.scene.add(this.tensorLines);
  }

  buildWavefunctionClouds() {
    this.wavefunctionCount = 950;
    const geom = new THREE.BufferGeometry();
    const pos = new Float32Array(this.wavefunctionCount * 3);
    const colors = new Float32Array(this.wavefunctionCount * 3);
    const cViolet = new THREE.Color(0xa855f7);
    const cTeal = new THREE.Color(0x2dd4bf);

    let count = 0;
    while (count < this.wavefunctionCount) {
      const rx = (Math.random() - 0.5) * 14.0;
      const ry = (Math.random() - 0.5) * 14.0;
      const rz = (Math.random() - 0.5) * 14.0;
      const r = Math.hypot(rx, ry, rz);
      if (r < 0.2 || r > 7.0) continue;

      // 2p_z hydrogenic orbital rejection probability
      const prob = (rz * rz) * Math.exp(-r * 0.85);
      if (Math.random() < prob * 0.3) {
        pos[count * 3] = rx;
        pos[count * 3 + 1] = ry;
        pos[count * 3 + 2] = rz;

        const col = (rz > 0) ? cViolet : cTeal;
        colors[count * 3] = col.r;
        colors[count * 3 + 1] = col.g;
        colors[count * 3 + 2] = col.b;
        count++;
      }
    }

    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.32,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.wavefunctionCloud = new THREE.Points(geom, mat);
    this.wavefunctionCloud.position.set(0, 0, 0);
    this.scene.add(this.wavefunctionCloud);
  }

  setupScrollSpline() {
    // 13 Control Points matching the Continuum Stages
    this.splinePoints = [
      new THREE.Vector3(0, 16, 38),     // Stage 0: Classical Ingress
      new THREE.Vector3(0, 7, 28),      // Stage 1: Noether & Gauge
      new THREE.Vector3(-7, 3, 22),     // Stage 2: Quantum Vacuum & Uncertainty
      new THREE.Vector3(7, 4, 18),      // Stage 3: Feynman Path Integrals
      new THREE.Vector3(12, -3, 14),    // Stage 4: Ising Critical Conformal
      new THREE.Vector3(-10, -5, 12),   // Stage 5: Sine-Gordon Solitons
      new THREE.Vector3(-14, 3, 6),     // Stage 6: eSIM Arbitrage
      new THREE.Vector3(14, 5, -4),     // Stage 7: ZizkaDB EU AI Act
      new THREE.Vector3(10, -6, 11),    // Stage 8: 15M+ Pipeline
      new THREE.Vector3(-9, -7, -10),   // Stage 9: Multimodal Vision & Miranda
      new THREE.Vector3(0, 4, -12),     // Stage 10: Poincaré Bulk ER=EPR
      new THREE.Vector3(0, 1, 9),       // Stage 11: Amplituhedron Jewel
      new THREE.Vector3(0, -10, 8)      // Stage 12: Celestial Terminal & Ingress
    ];

    this.lookAtPoints = [
      new THREE.Vector3(0, 0, 0),       // 0
      new THREE.Vector3(0, 1, 0),       // 1
      new THREE.Vector3(-2, 0, 5),      // 2
      new THREE.Vector3(0, 1, 0),       // 3
      new THREE.Vector3(4, -1, 0),      // 4
      new THREE.Vector3(-3, -2, 0),     // 5
      new THREE.Vector3(-14, 3, 6),     // 6
      new THREE.Vector3(14, 5, -4),     // 7
      new THREE.Vector3(10, -6, 11),    // 8
      new THREE.Vector3(-9, -7, -10),   // 9
      new THREE.Vector3(0, 0, 0),       // 10
      new THREE.Vector3(0, 0, 0),       // 11
      new THREE.Vector3(0, -11, 4)      // 12
    ];

    this.splineCurve = new THREE.CatmullRomCurve3(this.splinePoints);
    this.lookAtCurve = new THREE.CatmullRomCurve3(this.lookAtPoints);
  }

  updateScrollProgress(progress) {
    this.targetScrollProgress = Math.max(0, Math.min(1, progress));

    // Dynamic topology shifts along the quantum continuum
    if (this.targetScrollProgress > 0.90) {
      if (this.currentTopology !== 'amplituhedron') this.switchTopology('amplituhedron');
    } else if (this.targetScrollProgress > 0.78 && this.targetScrollProgress <= 0.90) {
      if (this.currentTopology !== 'poincare') this.switchTopology('poincare');
    } else if (this.targetScrollProgress > 0.32 && this.targetScrollProgress <= 0.48) {
      if (this.currentTopology !== 'lorenz') this.switchTopology('lorenz');
    } else {
      if (!['torus', 'amplituhedron', 'poincare', 'lorenz'].includes(this.currentTopology)) {
        this.switchTopology('torus');
      }
    }

    if (window.soundEngine && typeof window.soundEngine.modulateScroll === 'function') {
      window.soundEngine.modulateScroll(this.targetScrollProgress);
    }
  }

  buildInteractiveNodes() {
    // 12 Celestial Nodes representing Youssef's core systems & conceptionist continuum
    const nodeDefs = [
      {
        id: 'esim',
        title: 'eSIM Arbitrage Optimizer',
        category: 'Spot FX & Price Inversions',
        position: new THREE.Vector3(-14, 3, 6),
        geometry: new THREE.OctahedronGeometry(2.0, 1),
        color: 0x38bdf8,
        emissive: 0x0284c7,
        soundIdx: 0
      },
      {
        id: 'zizkadb',
        title: 'ZizkaDB AI Audit Trail',
        category: 'EU AI Act Article 12 Compliance',
        position: new THREE.Vector3(14, 5, -4),
        geometry: new THREE.BoxGeometry(2.4, 3.6, 2.4),
        color: 0xa855f7,
        emissive: 0x7e22ce,
        soundIdx: 1
      },
      {
        id: 'verifyid',
        title: 'VerifyID & Miranda AI',
        category: 'Multimodal Vision & Clinical Intake',
        position: new THREE.Vector3(-9, -7, -10),
        geometry: new THREE.DodecahedronGeometry(2.1),
        color: 0x2dd4bf,
        emissive: 0x0f766e,
        soundIdx: 2
      },
      {
        id: 'etl',
        title: 'High-Scale ETL Pipeline',
        category: '15M+ Events/Day Architecture',
        position: new THREE.Vector3(10, -6, 11),
        geometry: new THREE.TorusGeometry(1.8, 0.6, 16, 48),
        color: 0xf59e0b,
        emissive: 0xb45309,
        soundIdx: 3
      },
      {
        id: 'feynman',
        title: 'Feynman Path Integrals',
        category: 'Phase Interference & Least Action',
        position: new THREE.Vector3(7, 4, 18),
        geometry: new THREE.TorusGeometry(1.9, 0.4, 16, 40),
        color: 0x38bdf8,
        emissive: 0x0284c7,
        soundIdx: 2
      },
      {
        id: 'ising',
        title: 'Conformal Ising Lattice',
        category: 'Scale Invariance & Criticality',
        position: new THREE.Vector3(12, -3, 14),
        geometry: new THREE.BoxGeometry(2.2, 2.2, 2.2),
        color: 0xf59e0b,
        emissive: 0xb45309,
        soundIdx: 3
      },
      {
        id: 'soliton',
        title: 'Sine-Gordon Solitons',
        category: 'Topological Charge & Pendulum Waves',
        position: new THREE.Vector3(-10, -5, 12),
        geometry: new THREE.CylinderGeometry(1.2, 1.2, 3.0, 16),
        color: 0x2dd4bf,
        emissive: 0x0f766e,
        soundIdx: 1
      },
      {
        id: 'poincare',
        title: 'Poincaré Hyperbolic Bulk',
        category: 'AdS/CFT & Ryu-Takayanagi ER=EPR',
        position: new THREE.Vector3(0, 4, -12),
        geometry: new THREE.RingGeometry(2.2, 2.7, 32),
        color: 0xa855f7,
        emissive: 0x7e22ce,
        soundIdx: 4
      },
      {
        id: 'amplituhedron',
        title: 'Positive Amplituhedron',
        category: 'Grassmannian Kinematics & Scattering',
        position: new THREE.Vector3(0, 1, 9),
        geometry: new THREE.IcosahedronGeometry(2.4, 1),
        color: 0xf43f5e,
        emissive: 0xbe123c,
        soundIdx: 0
      },
      {
        id: 'manifesto',
        title: 'Conceptionist Manifesto',
        category: 'Architectural Philosophy & Theory',
        position: new THREE.Vector3(0, 11, -8),
        geometry: new THREE.IcosahedronGeometry(2.3, 0),
        color: 0xf43f5e,
        emissive: 0xbe123c,
        soundIdx: 4
      },
      {
        id: 'manim',
        title: 'ManimGX Geometry Lab',
        category: 'Mathematical Manifolds & Hopf Fibration',
        position: new THREE.Vector3(13, -7, -11),
        geometry: new THREE.TorusKnotGeometry(1.6, 0.45, 64, 16, 2, 5),
        color: 0x38bdf8,
        emissive: 0x0284c7,
        soundIdx: 2
      },
      {
        id: 'communicator',
        title: 'Celestial Terminal',
        category: 'Upwork Top-Rated & Comms',
        position: new THREE.Vector3(0, -11, 4),
        geometry: new THREE.OctahedronGeometry(2.0, 0),
        color: 0x818cf8,
        emissive: 0x4f46e5,
        soundIdx: 5
      }
    ];

    nodeDefs.forEach((def, index) => {
      const group = new THREE.Group();
      group.position.copy(def.position);

      // Crystalline Mesh
      const mat = new THREE.MeshStandardMaterial({
        color: def.color,
        emissive: def.emissive,
        emissiveIntensity: 0.5,
        metalness: 0.2,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85
      });
      const mesh = new THREE.Mesh(def.geometry, mat);
      group.add(mesh);

      // Glowing Halo Ring around Node
      const haloGeom = new THREE.RingGeometry(2.8, 3.0, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: def.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.rotation.x = Math.PI * 0.5;
      group.add(halo);

      // Store metadata
      group.userData = {
        id: def.id,
        title: def.title,
        category: def.category,
        soundIdx: def.soundIdx,
        baseScale: 1.0,
        mesh: mesh,
        halo: halo,
        defaultPos: def.position.clone()
      };

      this.scene.add(group);
      this.nodes.push(group);
    });
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });

    // Pointer move for raycasting and custom cursor
    window.addEventListener('mousemove', (e) => {
      this.rawMouse.x = e.clientX;
      this.rawMouse.y = e.clientY;

      this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Camera Orbit Dragging
      if (this.isDragging && !this.isDocked) {
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;

        this.targetSpherical.theta -= deltaX * 0.006;
        this.targetSpherical.phi = Math.max(0.15, Math.min(Math.PI * 0.85, this.targetSpherical.phi - deltaY * 0.006));

        this.previousMousePosition = { x: e.clientX, y: e.clientY };
        
        // Modulate drone audio on rotation velocity
        if (window.soundEngine) {
          const vel = Math.hypot(deltaX, deltaY) * 0.04;
          window.soundEngine.modulateDrone(vel);
        }

        // Hide drag hint on interaction
        const hint = document.getElementById('drag-hint');
        if (hint) hint.classList.add('faded');
      }
    }, { passive: true });

    window.addEventListener('mousedown', (e) => {
      // Don't drag if clicking workspace modal or nav
      if (e.target.closest('#workspace-modal, .nav-pill, .index-pill, button')) return;

      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support for mobile
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0 && !this.isDocked) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - this.previousMousePosition.x;
        const deltaY = touch.clientY - this.previousMousePosition.y;

        this.targetSpherical.theta -= deltaX * 0.007;
        this.targetSpherical.phi = Math.max(0.15, Math.min(Math.PI * 0.85, this.targetSpherical.phi - deltaY * 0.007));

        this.previousMousePosition = { x: touch.clientX, y: touch.clientY };
      }
    }, { passive: true });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    }, { passive: true });

    // Zoom on wheel
    window.addEventListener('wheel', (e) => {
      if (this.isDocked) return;
      this.targetSpherical.radius = Math.max(16, Math.min(55, this.targetSpherical.radius + e.deltaY * 0.025));
    }, { passive: true });

    // Click to Dock onto Node
    window.addEventListener('click', (e) => {
      if (e.target.closest('#workspace-modal, .nav-pill, .index-pill, button, a')) return;

      if (this.hoveredNode && !this.isDocked) {
        this.dockToNode(this.hoveredNode);
      }
    });

    // Undock / Back to Orbit button
    const undockBtn = document.getElementById('btn-undock');
    if (undockBtn) {
      undockBtn.addEventListener('click', () => this.undock());
    }

    // Deconstruct Spacetime buttons
    const deconstructBtn = document.getElementById('btn-deconstruct');
    if (deconstructBtn) {
      deconstructBtn.addEventListener('click', () => this.toggleDeconstruct());
    }
    const reconstructBtn = document.getElementById('btn-reconstruct');
    if (reconstructBtn) {
      reconstructBtn.addEventListener('click', () => this.reconstructSpacetime());
    }

    // Wire up topology buttons
    document.querySelectorAll('.btn-topology').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topo = e.currentTarget.getAttribute('data-topo');
        if (topo) this.switchTopology(topo);
      });
    });

    // Keyboard Shortcuts: 1-5 for topologies, D for deconstruct, M for audio, Esc to undock
    window.addEventListener('keydown', (e) => {
      // Don't trigger shortcuts if typing inside inputs or REPL
      if (e.target.matches('input, textarea, select')) return;

      if (e.key === 'd' || e.key === 'D') {
        this.toggleDeconstruct();
      } else if (e.key === '1') {
        this.switchTopology('torus');
      } else if (e.key === '2') {
        this.switchTopology('lorenz');
      } else if (e.key === '3') {
        this.switchTopology('clifford');
      } else if (e.key === '4') {
        this.switchTopology('amplituhedron');
      } else if (e.key === '5') {
        this.switchTopology('poincare');
      } else if (e.key === 'm' || e.key === 'M') {
        if (window.soundEngine) window.soundEngine.toggle();
      } else if (e.key === 'Escape') {
        if (this.isDeconstructed) this.reconstructSpacetime();
        else if (this.isDocked) this.undock();
      }
    });
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  dockToNode(nodeGroup) {
    if (!nodeGroup) return;

    this.isDocked = true;
    this.dockedNode = nodeGroup;

    if (window.soundEngine) {
      window.soundEngine.playWarp();
    }

    // Camera target position: smooth offset in front of node
    const nodePos = nodeGroup.position.clone();
    const cameraOffset = nodePos.clone().normalize().multiplyScalar(7.5);
    cameraOffset.y += 1.5;

    this.cameraTargetPos.copy(nodePos).add(cameraOffset);
    this.cameraLookTarget.copy(nodePos);

    // Show undock button & open workspace
    const undockBtn = document.getElementById('btn-undock');
    if (undockBtn) undockBtn.removeAttribute('hidden');

    if (window.workspaceEngine) {
      window.workspaceEngine.openSystem(nodeGroup.userData.id);
    }
  }

  undock() {
    this.isDocked = false;
    this.dockedNode = null;

    if (window.soundEngine) {
      window.soundEngine.playClick();
    }

    // Reset camera target to orbit view
    this.cameraLookTarget.set(0, 0, 0);

    const undockBtn = document.getElementById('btn-undock');
    if (undockBtn) undockBtn.setAttribute('hidden', '');

    if (window.workspaceEngine) {
      window.workspaceEngine.close();
    }
  }

  updateTelemetryHUD() {
    const hudEl = document.getElementById('hud-telemetry');
    if (!hudEl) return;
    const date = new Date();
    const jd = (date.getTime() / 86400000.0) + 2440587.5;
    const d = jd - 2451545.0;
    const gmst = 18.697374558 + 24.06570982441908 * d;
    let lst = (gmst + 10.82 / 15.0) % 24;
    if (lst < 0) lst += 24;
    const lstH = Math.floor(lst).toString().padStart(2, '0');
    const lstM = Math.floor((lst % 1) * 60).toString().padStart(2, '0');
    const lstS = Math.floor(((lst * 60) % 1) * 60).toString().padStart(2, '0');
    hudEl.innerHTML = `<span class="hud-item"><span class="hud-dot"></span>MONASTIR 35.76°N, 10.82°E</span> · <span class="hud-item">LST ${lstH}:${lstM}:${lstS}</span> · <span class="hud-item">1,800 VERTICES</span> · <span class="hud-item" style="color:#10b981;">${this.currentFps || 120} FPS</span>`;
  }

  animateQuantumVacuum() {
    if (!this.vacuumPoints) return;

    const pos = this.vacuumPoints.geometry.attributes.position.array;
    const dt = this.time;

    // 1. Heisenberg uncertainty micro-displacements: Δx · Δp >= 1/2 ħ
    const jitterScale = 0.08 + (this.isDeconstructed ? 0.25 : 0.0);
    for (let i = 0; i < this.vacuumCount; i++) {
      const idx = i * 3;
      const bx = this.vacuumBasePos[idx];
      const by = this.vacuumBasePos[idx + 1];
      const bz = this.vacuumBasePos[idx + 2];
      const phase = this.vacuumPhases[i];
      const freq = this.vacuumFrequencies[i];

      // Harmonic zero-point jitter
      const dx = Math.sin(dt * freq + phase) * jitterScale;
      const dy = Math.cos(dt * (freq * 1.2) + phase) * jitterScale;
      const dz = Math.sin(dt * (freq * 0.8) + phase * 1.5) * jitterScale;

      pos[idx] = bx + dx;
      pos[idx + 1] = by + dy;
      pos[idx + 2] = bz + dz;
    }
    this.vacuumPoints.geometry.attributes.position.needsUpdate = true;
    this.vacuumPoints.rotation.y = this.time * 0.03;

    // 2. Wavefunction Orbital Cloud gentle rotation
    if (this.wavefunctionCloud) {
      this.wavefunctionCloud.rotation.z = this.time * 0.08;
      this.wavefunctionCloud.rotation.y = this.time * 0.05;
      const wfOpacity = 0.5 + Math.sin(this.time * 2.0) * 0.2;
      this.wavefunctionCloud.material.opacity = wfOpacity;
    }

    // 3. Virtual particle-antiparticle creation & annihilation
    const now = performance.now();
    this.virtualPairs.forEach(pair => {
      if (!pair.active) {
        // Spawn chance per frame
        if (Math.random() < 0.025) {
          pair.active = true;
          pair.age = 0;
          pair.lifespan = 0.8 + Math.random() * 0.9;
          
          // Random point in bulk
          const theta = Math.random() * Math.PI * 2;
          const r = 4.0 + Math.random() * 16.0;
          pair.center.set(Math.cos(theta) * r, (Math.random() - 0.5) * 12.0, Math.sin(theta) * r);
          pair.velocity.set((Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8, (Math.random() - 0.5) * 1.8);

          // Audio pop trigger (throttled)
          if (now - this.lastFluctuationSoundTime > 650 && window.soundEngine && typeof window.soundEngine.playQuantumFluctuation === 'function') {
            this.lastFluctuationSoundTime = now;
            window.soundEngine.playQuantumFluctuation();
          }
        }
      } else {
        pair.age += 0.016;
        const progress = pair.age / pair.lifespan;

        if (progress >= 1.0) {
          // Annihilation
          pair.active = false;
          pair.pPlus.material.opacity = 0;
          pair.pMinus.material.opacity = 0;
          pair.line.material.opacity = 0;
        } else {
          // Arc separation and recombination
          const separation = Math.sin(progress * Math.PI) * 1.4;
          const opacity = Math.sin(progress * Math.PI) * 0.85;

          const plusPos = pair.center.clone().addScaledVector(pair.velocity, separation);
          const minusPos = pair.center.clone().addScaledVector(pair.velocity, -separation);

          pair.pPlus.position.copy(plusPos);
          pair.pMinus.position.copy(minusPos);
          pair.pPlus.material.opacity = opacity;
          pair.pMinus.material.opacity = opacity;

          // Dipole connector line
          const linePos = pair.lineGeom.attributes.position.array;
          linePos[0] = plusPos.x;
          linePos[1] = plusPos.y;
          linePos[2] = plusPos.z;
          linePos[3] = minusPos.x;
          linePos[4] = minusPos.y;
          linePos[5] = minusPos.z;
          pair.lineGeom.attributes.position.needsUpdate = true;
          pair.line.material.opacity = opacity * 0.6;
        }
      }
    });

    // 4. Entanglement Tensor Network lines
    if (this.tensorLines && Math.floor(this.time * 60) % 3 === 0) {
      const linePos = this.tensorLines.geometry.attributes.position.array;
      let lineIdx = 0;
      const step = Math.floor(this.vacuumCount / this.tensorLineCount);

      for (let i = 0; i < this.tensorLineCount; i++) {
        const idxA = (i * step) * 3;
        const idxB = (((i + 1) * step) % this.vacuumCount) * 3;

        linePos[lineIdx++] = pos[idxA];
        linePos[lineIdx++] = pos[idxA + 1];
        linePos[lineIdx++] = pos[idxA + 2];

        linePos[lineIdx++] = pos[idxB];
        linePos[lineIdx++] = pos[idxB + 1];
        linePos[lineIdx++] = pos[idxB + 2];
      }
      this.tensorLines.geometry.attributes.position.needsUpdate = true;
      this.tensorLines.material.opacity = 0.2 + Math.sin(this.time * 3.0) * 0.12;
    }
  }

  animate() {
    this.time += 0.01;

    // 1. Quantum Spacetime Vacuum Simulation
    this.animateQuantumVacuum();

    // 2. Core manifold rotations
    if (this.coreKnot && this.torusGroup && this.torusGroup.visible) {
      this.coreKnot.rotation.y = this.time * 0.35;
      this.coreKnot.rotation.z = this.time * 0.2;
    }
    if (this.ring1 && this.torusGroup && this.torusGroup.visible) this.ring1.rotation.z = -this.time * 0.25;
    if (this.ring2 && this.torusGroup && this.torusGroup.visible) this.ring2.rotation.z = this.time * 0.18;

    if (this.lorenzGroup && this.lorenzGroup.visible) {
      this.lorenzGroup.rotation.y = this.time * 0.4;
      this.lorenzGroup.rotation.z = Math.sin(this.time * 0.3) * 0.15;
    }
    if (this.cliffordGroup && this.cliffordGroup.visible) {
      this.cliffordGroup.rotation.x = this.time * 0.3;
      this.cliffordGroup.rotation.y = this.time * 0.5;
    }

    // 4D Amplituhedron Rotation & Projection to 3D
    if (this.amplituhedronGroup && this.amplituhedronGroup.visible && this.twistors4D) {
      const posAttr = this.amplGeom.attributes.position;
      const d = 12.0;
      for (let i = 0; i < this.twistors4D.length; i++) {
        const v = this.twistors4D[i];
        const x1 = v.x * Math.cos(this.time * 0.35) - v.w * Math.sin(this.time * 0.35);
        const w1 = v.x * Math.sin(this.time * 0.35) + v.w * Math.cos(this.time * 0.35);
        const y1 = v.y * Math.cos(this.time * 0.25) - v.z * Math.sin(this.time * 0.25);
        const z1 = v.y * Math.sin(this.time * 0.25) + v.z * Math.cos(this.time * 0.25);
        const scale = d / (d - w1);
        posAttr.setXYZ(i, x1 * scale, y1 * scale, z1 * scale);
      }
      posAttr.needsUpdate = true;
      if (this.amplInner) {
        this.amplInner.rotation.x = this.time * 0.25;
        this.amplInner.rotation.y = this.time * 0.45;
      }
    }

    // Poincaré Hyperbolic Bulk rotation & entanglement pulse
    if (this.poincareGroup && this.poincareGroup.visible) {
      this.poincareGroup.rotation.z = this.time * 0.1;
      if (this.rtLine) {
        this.rtLine.material.opacity = 0.75 + Math.sin(this.time * 2.5) * 0.25;
      }
    }

    // Telemetry HUD updates
    if (!this.lastFrameTime) {
      this.lastFrameTime = performance.now();
      this.frameCount = 0;
      this.currentFps = 120;
    }
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFrameTime >= 500) {
      this.currentFps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime));
      this.frameCount = 0;
      this.lastFrameTime = now;
      this.updateTelemetryHUD();
    }

    // 3. Rotate particle manifold
    if (this.particles) {
      if (this.isDeconstructed) {
        this.particles.rotation.y = this.time * 0.2;
        this.particles.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.05);
      } else {
        this.particles.rotation.y = this.time * 0.06;
        this.particles.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);
      }
    }

    // 4. Float & pulse interactive nodes
    this.nodes.forEach((node, idx) => {
      const offset = idx * 1.3;
      if (this.isDeconstructed) {
        if (node.userData.deconstructTarget) {
          node.position.lerp(node.userData.deconstructTarget, 0.04);
        }
        node.userData.mesh.rotation.x += 0.04;
        node.userData.mesh.rotation.y += 0.06;
        node.userData.mesh.material.emissiveIntensity = 0.8 + Math.sin(this.time * 6 + offset) * 0.4;
      } else {
        const targetY = node.userData.defaultPos.y + Math.sin(this.time * 1.5 + offset) * 0.6;
        node.position.x += (node.userData.defaultPos.x - node.position.x) * 0.08;
        node.position.y += (targetY - node.position.y) * 0.08;
        node.position.z += (node.userData.defaultPos.z - node.position.z) * 0.08;

        node.userData.mesh.rotation.x = this.time * 0.4 + offset;
        node.userData.mesh.rotation.y = this.time * 0.6 + offset;
        node.userData.halo.rotation.z = -this.time * 0.5;

        // Pulse emissive
        const pulse = 0.4 + Math.sin(this.time * 2 + offset) * 0.25;
        node.userData.mesh.material.emissiveIntensity = pulse;
      }
    });

    // 5. Raycasting when not docked
    if (!this.isDocked) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshes = this.nodes.map(n => n.userData.mesh);
      const intersects = this.raycaster.intersectObjects(meshes);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const parentGroup = hitMesh.parent;

        if (this.hoveredNode !== parentGroup) {
          if (this.hoveredNode) {
            this.hoveredNode.scale.set(1, 1, 1);
          }
          this.hoveredNode = parentGroup;
          this.hoveredNode.scale.set(1.22, 1.22, 1.22);

          // Update Custom Cursor Label
          const cursorLabel = document.querySelector('.cursor-label');
          const cursorRing = document.querySelector('.cursor-ring');
          if (cursorLabel) {
            cursorLabel.textContent = `[ Dock: ${parentGroup.userData.title} ]`;
            cursorLabel.classList.add('visible');
          }
          if (cursorRing) cursorRing.classList.add('hovering');

          // Play 3D spatial crystal chime
          if (window.soundEngine) {
            const screenPos = parentGroup.position.clone().project(this.camera);
            window.soundEngine.playSpatialChime(parentGroup.userData.soundIdx, screenPos.x);
          }
        }
      } else {
        if (this.hoveredNode) {
          this.hoveredNode.scale.set(1, 1, 1);
          this.hoveredNode = null;

          const cursorLabel = document.querySelector('.cursor-label');
          const cursorRing = document.querySelector('.cursor-ring');
          if (cursorLabel) cursorLabel.classList.remove('visible');
          if (cursorRing) cursorRing.classList.remove('hovering');
        }
      }

      // Camera Catmull-Rom Spline driven by vertical scroll + mouse parallax
      if (this.splineCurve && this.lookAtCurve) {
        this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.06;
        const splinePoint = this.splineCurve.getPoint(this.scrollProgress);
        const lookTarget = this.lookAtCurve.getPoint(this.scrollProgress);

        const mouseOffsetX = (this.rawMouse.x / window.innerWidth - 0.5) * 3.2;
        const mouseOffsetY = -(this.rawMouse.y / window.innerHeight - 0.5) * 2.4;

        this.cameraTargetPos.set(splinePoint.x + mouseOffsetX, splinePoint.y + mouseOffsetY, splinePoint.z);
        this.cameraLookTarget.copy(lookTarget);
      } else {
        // Fallback spherical orbit
        this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.08;
        this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.08;
        this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.08;

        this.cameraTargetPos.x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
        this.cameraTargetPos.y = this.spherical.radius * Math.cos(this.spherical.phi);
        this.cameraTargetPos.z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);
      }
    }

    // Smooth camera damping
    this.camera.position.lerp(this.cameraTargetPos, 0.065);
    
    // LookAt lerp
    this.camera.lookAt(this.cameraLookTarget);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.observatory = new CelestialObservatory('celestial-scene');
});
