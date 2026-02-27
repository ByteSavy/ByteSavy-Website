/**
 * Container-aware init for framer4 (horizontal WebGL slider).
 * Call after DOM is rendered. If container is passed, canvas and sizing are scoped to it.
 */
export function initFramer4(gsap, THREE, container = null, opts = {}) {
  if (!gsap || !THREE) return () => {};
  const scrollDistance = opts.scrollDistance ?? (typeof window !== 'undefined' ? window.innerHeight : 1080);
  const ScrollTriggerPlugin = opts.ScrollTrigger;

  const isScoped = container && typeof container.getBoundingClientRect === 'function';
  let cw = isScoped ? container.clientWidth : 0;
  let ch = isScoped ? container.clientHeight : 0;
  if (cw <= 0 || ch <= 0) {
    cw = typeof window !== 'undefined' ? window.innerWidth : 1920;
    ch = typeof window !== 'undefined' ? window.innerHeight : 1080;
  }
  const store = {
    ww: cw,
    wh: ch,
    isDevice:
      typeof navigator !== 'undefined' &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent),
  };

  const root = container || document;
  const sliderEl = root.querySelector('.js-slider');
  if (!sliderEl) return () => {};

  const backgroundCoverUv = `
  vec2 backgroundCoverUv(vec2 screenSize, vec2 imageSize, vec2 uv) {
	float screenRatio = screenSize.x / screenSize.y;
	float imageRatio = imageSize.x / imageSize.y;
	vec2 newSize = screenRatio < imageRatio 
		? vec2(imageSize.x * screenSize.y / imageSize.y, screenSize.y)
		: vec2(screenSize.x, imageSize.y * screenSize.x / imageSize.x);
	vec2 newOffset = (screenRatio < imageRatio 
		? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
		: vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
	return uv * screenSize / newSize + newOffset;
  }
  `;
  const vertexShader = `
  precision mediump float;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
  }
  `;
  const fragmentShader = `
  precision mediump float;
  ${backgroundCoverUv}
  uniform sampler2D uTexture;
  uniform vec2 uMeshSize;
  uniform vec2 uImageSize;
  varying vec2 vUv;
  void main() {
    vec2 texUv = backgroundCoverUv(uMeshSize, uImageSize, vUv);
    vec4 texColor = texture2D(uTexture, texUv);
    gl_FragColor = texColor;
  }
  `;

  const loader = new THREE.TextureLoader();
  loader.crossOrigin = 'anonymous';

  const canvasParent = isScoped ? container : document.body;

  class Gl {
    constructor() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.OrthographicCamera(
        store.ww / -2, store.ww / 2, store.wh / 2, store.wh / -2, 1, 10
      );
      this.camera.lookAt(this.scene.position);
      this.camera.position.z = 1;
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      this.renderer.setPixelRatio(1.5);
      this.renderer.setSize(store.ww, store.wh);
      this.renderer.setClearColor(0xffffff, 0);
      const domEl = this.renderer.domElement;
      domEl.classList.add('dom-gl');
      if (isScoped) {
        domEl.style.position = 'absolute';
        domEl.style.inset = '0';
        domEl.style.width = '100%';
        domEl.style.height = '100%';
        domEl.style.zIndex = '0';
        domEl.style.pointerEvents = 'none';
        canvasParent.insertBefore(domEl, canvasParent.firstChild);
      } else {
        canvasParent.appendChild(domEl);
      }
    }
    render() {
      this.renderer.render(this.scene, this.camera);
    }
  }

  class GlObject extends THREE.Object3D {
    init(el) {
      this.el = el;
      this.resize();
    }
    resize() {
      this.rect = this.el.getBoundingClientRect();
      const { left, top, width, height } = this.rect;
      const cx = containerRect ? containerRect.left + containerRect.width / 2 : store.ww / 2;
      const cy = containerRect ? containerRect.top + containerRect.height / 2 : store.wh / 2;
      this.pos = {
        x: left + width / 2 - cx,
        y: top + height / 2 - cy,
      };
      this.position.y = this.pos.y;
      this.position.x = this.pos.x;
      this.updateX();
    }
    updateX(current) {
      if (current != null) this.position.x = current + this.pos.x;
    }
  }

  const planeGeo = new THREE.PlaneGeometry(1, 1, 32, 32);
  const planeMat = new THREE.ShaderMaterial({
    transparent: true,
    fragmentShader,
    vertexShader,
  });

  class Plane extends GlObject {
    init(el) {
      super.init(el);
      this.geo = planeGeo;
      this.mat = planeMat.clone();
      this.mat.uniforms = {
        uTime: { value: 0 },
        uTexture: { value: null },
        uMeshSize: { value: new THREE.Vector2(this.rect.width, this.rect.height) },
        uImageSize: { value: new THREE.Vector2(0, 0) },
        uScale: { value: 0.75 },
        uVelo: { value: 0 },
      };
      this.img = this.el.querySelector('img');
      if (this.img) {
        this.texture = loader.load(this.img.src, (texture) => {
          texture.minFilter = THREE.LinearFilter;
          texture.generateMipmaps = false;
          this.mat.uniforms.uTexture.value = texture;
          this.mat.uniforms.uImageSize.value.set(this.img.naturalWidth, this.img.naturalHeight);
        });
      }
      this.mesh = new THREE.Mesh(this.geo, this.mat);
      this.mesh.scale.set(this.rect.width, this.rect.height, 1);
      this.add(this.mesh);
      gl.scene.add(this);
    }
  }

  const containerRect = isScoped ? container.getBoundingClientRect() : null;
  const gl = new Gl();

  class Slider {
    constructor(el, opts = {}) {
      this.el = el;
      this.opts = Object.assign({ speed: 2, threshold: 50, ease: 0.075 }, opts);
      const doc = container || document;
      this.ui = {
        items: this.el.querySelectorAll('.js-slide'),
        titles: doc.querySelectorAll('.js-title'),
        lines: doc.querySelectorAll('.js-progress-line'),
      };
      this.activeIndex = 0;
      this.state = {
        target: 0,
        current: 0,
        currentRounded: 0,
        on: { x: 0, y: 0 },
        off: 0,
        progress: 0,
        diff: 0,
        max: 0,
        min: 0,
        flags: { dragging: false },
      };
      this.items = [];
      this.events = {
        move: store.isDevice ? 'touchmove' : 'mousemove',
        up: store.isDevice ? 'touchend' : 'mouseup',
        down: store.isDevice ? 'touchstart' : 'mousedown',
      };
      this.setup();
      this.on();
    }
    setup() {
      const { ww } = store;
      const state = this.state;
      const { items, titles } = this.ui;
      const wrapRect = this.el.getBoundingClientRect();
      const wrapWidth = wrapRect.width || ww;
      const wrapDiff = wrapRect.left;
      const lastRect = items[items.length - 1].getBoundingClientRect();
      state.max = -(lastRect.right - wrapWidth - wrapDiff);
      state.min = 0;
      if (!Number.isFinite(state.max)) state.max = -100;
      this.tl = gsap
        .timeline({ paused: true, defaults: { duration: 1, ease: 'linear' } })
        .fromTo('.js-progress-line-2', { scaleX: 1 }, { scaleX: 0, duration: 0.5, ease: 'power3' }, 0)
        .fromTo('.js-titles', { yPercent: 0 }, { yPercent: -(100 - 100 / titles.length) }, 0)
        .fromTo('.js-progress-line', { scaleX: 0 }, { scaleX: 1 }, 0);
      for (let i = 0; i < items.length; i++) {
        const el = items[i];
        const { left, right, width } = el.getBoundingClientRect();
        const plane = new Plane();
        plane.init(el);
        const tl = gsap
          .timeline({ paused: true })
          .fromTo(plane.mat.uniforms.uScale, { value: 0.65 }, { value: 1, duration: 1, ease: 'linear' });
        this.items.push({
          el,
          plane,
          left,
          right,
          width,
          min: left < ww ? ww * 0.775 : -(ww * 0.225 - wrapWidth * 0.2),
          max: left > ww ? state.max - ww * 0.775 : state.max + (ww * 0.225 - wrapWidth * 0.2),
          tl,
          out: false,
        });
      }

      // Start with the first slide centered, no initial empty gap
      if (this.items.length > 0) {
        const first = this.items[0];
        const viewportCenter = ww / 2;
        const desiredTarget = viewportCenter - (first.left + first.width / 2);
        const clampedTarget = gsap.utils.clamp(state.max, state.min, desiredTarget);
        state.current = clampedTarget;
        state.target = clampedTarget;
        state.off = clampedTarget;
      }
    }
    calc() {
      const state = this.state;
      state.current += (state.target - state.current) * this.opts.ease;
      state.currentRounded = Math.round(state.current * 100) / 100;
      state.diff = (state.target - state.current) * 0.0005;
      const max = state.max !== 0 ? state.max : -1;
      state.progress = gsap.utils.wrap(0, 1, state.currentRounded / max);
      if (this.tl) this.tl.progress(state.progress);
    }
    transformItems() {
      let bestIndex = this.activeIndex;
      let bestDist = Infinity;
      const viewportCenter = store.ww / 2;

      for (let i = 0; i < this.items.length; i++) {
        const item = this.items[i];
        const translate = gsap.utils.wrap(item.min, item.max, this.state.currentRounded);
        const start = item.left + translate;
        const end = item.right + translate;
        const isVisible = start < this.opts.threshold + store.ww && end > -this.opts.threshold;
        const progress = gsap.utils.clamp(0, 1, 1 - (translate + item.left + item.width) / (store.ww + item.width));
        item.plane.updateX(translate);
        item.plane.mat.uniforms.uVelo.value = this.state.diff;
        if (!item.out && item.tl) item.tl.progress(progress);
        item.out = !isVisible;

        // Track which slide is closest to the center of the viewport
        const centerX = start + item.width / 2;
        const dist = Math.abs(centerX - viewportCenter);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }

      // Notify React about active slide changes
      if (bestIndex !== this.activeIndex) {
        this.activeIndex = bestIndex;
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          try {
            window.dispatchEvent(
              new CustomEvent('framer4:activeSlide', {
                detail: { index: bestIndex },
              })
            );
          } catch (_) {
            // ignore
          }
        }
      }
    }
    render() {
      this.calc();
      this.transformItems();
    }
    getPos(e) {
      const x = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
      const y = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
      return { x, y };
    }
    onDown = (e) => {
      const { x, y } = this.getPos(e);
      this.state.flags.dragging = true;
      this.state.on.x = x;
      this.state.on.y = y;
    };
    onUp = () => {
      this.state.flags.dragging = false;
      this.state.off = this.state.target;
    };
    onMove = (e) => {
      if (!this.state.flags.dragging) return;
      const { x } = this.getPos(e);
      const moveX = x - this.state.on.x;
      const moveY = (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - this.state.on.y;
      if (Math.abs(moveX) > Math.abs(moveY) && e.cancelable) {
        e.preventDefault();
      }
      this.state.target = this.state.off + moveX * this.opts.speed;
      this.state.target = gsap.utils.clamp(this.state.max, 0, this.state.target);
    };
    on() {
      window.addEventListener(this.events.down, this.onDown);
      window.addEventListener(this.events.move, this.onMove);
      window.addEventListener(this.events.up, this.onUp);
    }
    off() {
      window.removeEventListener(this.events.down, this.onDown);
      window.removeEventListener(this.events.move, this.onMove);
      window.removeEventListener(this.events.up, this.onUp);
    }
  }

  const slider = new Slider(sliderEl);

  let scrollTriggerInstance = null;
  if (opts.scrollDrive && ScrollTriggerPlugin && container && typeof ScrollTriggerPlugin.create === 'function') {
    gsap.registerPlugin(ScrollTriggerPlugin);
    const easeProgress = (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2);
    scrollTriggerInstance = ScrollTriggerPlugin.create({
      trigger: container,
      start: 'top top',
      end: `+=${scrollDistance}`,
      pin: true,
      onUpdate: (self) => {
        const raw = Math.max(0, Math.min(1, self.progress));
        const progress = easeProgress(raw);
        const max = slider.state.max;
        slider.state.target = progress * max;
        slider.state.off = slider.state.target;
      },
      onLeave: () => {
        requestAnimationFrame(() => ScrollTriggerPlugin.refresh());
      },
    });
  }

  let contextLost = false;
  gl.renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    contextLost = true;
  });

  const tick = () => {
    if (contextLost) return;
    gl.render();
    slider.render();
  };
  gsap.ticker.add(tick);

  return function destroy() {
    if (scrollTriggerInstance && scrollTriggerInstance.kill) scrollTriggerInstance.kill();
    gsap.ticker.remove(tick);
    slider.off();
    if (gl.renderer.domElement.parentNode) {
      gl.renderer.domElement.parentNode.removeChild(gl.renderer.domElement);
    }
    if (!contextLost && gl.renderer.getContext && !gl.renderer.getContext().isContextLost()) {
      try { gl.renderer.dispose(); } catch (_) { /* ignore */ }
    }
  };
}
