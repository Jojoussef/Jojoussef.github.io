# youssef-benatti.me

Source for my personal website at [youssef-benatti.me](https://youssef-benatti.me), hosted on GitHub Pages.

## Layout

```
├── index.html   # Main entry page and interactive workspace markup
├── styles.css   # Layout and typography rules
├── scene.js     # Three.js WebGL background canvas (parametric surfaces and particle field)
├── sound.js     # Web Audio API synth for optional UI audio feedback
├── workspace.js # Interactive demos (SHA-256 hash chain verifier, 2D phase-space plots)
├── repl.js      # Keyboard-triggered (`~`) command prompt for navigation
├── esim/        # Static build output for /esim-arbitrage-calculator/
└── CNAME        # Custom domain configuration (youssef-benatti.me)
```

## Running locally

No build step is required for the root site. Serve the directory with any static file server:

```bash
python3 -m http.server 8000
```
