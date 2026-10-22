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

    this.init();
  }

  init() {
    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.015);

    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 4, 34);

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

    // 4. Build Core Celestial Elements
    this.buildCelestialCore();
    this.buildParticleManifold();
    this.buildInteractiveNodes();

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
  }

  switchTopology(mode) {
    this.currentTopology = mode;
    if (this.torusGroup) this.torusGroup.visible = (mode === 'torus');
    if (this.lorenzGroup) this.lorenzGroup.visible = (mode === 'lorenz');
    if (this.cliffordGroup) this.cliffordGroup.visible = (mode === 'clifford');

    const modeIdx = mode === 'torus' ? 0 : (mode === 'lorenz' ? 1 : 2);
    if (window.soundEngine) window.soundEngine.playTopologyMorph(modeIdx);

    const hudTopo = document.getElementById('hud-topology-name');
    if (hudTopo) {
      const labels = {
        torus: 'TORUS KNOT SOLITON (p=2, q=3)',
        lorenz: 'LORENZ ATTRACTOR (σ=10, ρ=28, β=8/3)',
        clifford: 'CLIFFORD ATTRACTOR (a=-1.4, b=1.6)'
      };
      hudTopo.textContent = labels[mode] || mode.toUpperCase();
    }

    document.querySelectorAll('.btn-topology').forEach(btn => {
      if (btn.getAttribute('data-topo') === mode) btn.classList.add('active');
      else btn.classList.remove('active');
    });
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

  buildInteractiveNodes() {
    // 6 Celestial Nodes representing Youssef's core systems & conceptionist doctrine
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

    // Wire up topology buttons
    document.querySelectorAll('.btn-topology').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const topo = e.currentTarget.getAttribute('data-topo');
        if (topo) this.switchTopology(topo);
      });
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

  animate() {
    this.time += 0.01;

    // 1. Core manifold rotations
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

    // 2. Rotate particle manifold
    if (this.particles) {
      this.particles.rotation.y = this.time * 0.06;
    }

    // 3. Float & pulse interactive nodes
    this.nodes.forEach((node, idx) => {
      const offset = idx * 1.3;
      node.position.y = node.userData.defaultPos.y + Math.sin(this.time * 1.5 + offset) * 0.6;
      node.userData.mesh.rotation.x = this.time * 0.4 + offset;
      node.userData.mesh.rotation.y = this.time * 0.6 + offset;
      node.userData.halo.rotation.z = -this.time * 0.5;

      // Pulse emissive
      const pulse = 0.4 + Math.sin(this.time * 2 + offset) * 0.25;
      node.userData.mesh.material.emissiveIntensity = pulse;
    });

    // 4. Raycasting when not docked
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

      // Camera Orbit Spherical Physics lerp
      this.spherical.theta += (this.targetSpherical.theta - this.spherical.theta) * 0.08;
      this.spherical.phi += (this.targetSpherical.phi - this.spherical.phi) * 0.08;
      this.spherical.radius += (this.targetSpherical.radius - this.spherical.radius) * 0.08;

      // Convert Spherical to Cartesian
      this.cameraTargetPos.x = this.spherical.radius * Math.sin(this.spherical.phi) * Math.sin(this.spherical.theta);
      this.cameraTargetPos.y = this.spherical.radius * Math.cos(this.spherical.phi);
      this.cameraTargetPos.z = this.spherical.radius * Math.sin(this.spherical.phi) * Math.cos(this.spherical.theta);
    }

    // Smooth camera damping
    this.camera.position.lerp(this.cameraTargetPos, 0.065);
    
    // LookAt lerp
    const currentLook = new THREE.Vector3(0, 0, 0);
    this.camera.getWorldDirection(currentLook);
    this.camera.lookAt(this.cameraLookTarget);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  window.observatory = new CelestialObservatory('celestial-scene');
});
