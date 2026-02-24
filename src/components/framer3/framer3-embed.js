/**
 * Container-aware init for framer3 (WebGL grid). Call from React with section ref.
 * Expects container to contain .js-grid with .js-plane elements.
 */
export function initFramer3(container, { gsap, THREE }) {
  console.log('[Framer3 embed] initFramer3 called', { hasContainer: !!container, hasGsap: !!gsap, hasTHREE: !!THREE });
  if (!container || !gsap || !THREE) {
    console.log('[Framer3 embed] EARLY EXIT: missing container/gsap/THREE');
    return () => {};
  }

  // Use window size if container not yet laid out (avoids 0-size camera/renderer)
  let ww = container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1920);
  let wh = container.clientHeight || (typeof window !== 'undefined' ? window.innerHeight : 1080);
  if (ww <= 0 || wh <= 0) {
    ww = typeof window !== 'undefined' ? window.innerWidth : 1920;
    wh = typeof window !== 'undefined' ? window.innerHeight : 1080;
  }
  console.log('[Framer3 embed] container size', { ww, wh, clientW: container.clientWidth, clientH: container.clientHeight });

  const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
  const isWindows = navigator.appVersion.indexOf('Win') !== -1;
  const mouseMultiplier = 0.6;
  const firefoxMultiplier = 20;
  const multipliers = {
    mouse: isWindows ? mouseMultiplier * 2 : mouseMultiplier,
    firefox: isWindows ? firefoxMultiplier * 2 : firefoxMultiplier,
  };

  const gridEl = container.querySelector('.js-grid');
  if (!gridEl) {
    console.log('[Framer3 embed] EARLY EXIT: .js-grid not found in container');
    return () => {};
  }

  const planes = [...container.querySelectorAll('.js-plane')];
  console.log('[Framer3 embed] grid and planes found', { planesCount: planes.length });
  const loader = new THREE.TextureLoader();

  const vertexShader = `
precision mediump float;
uniform float u_diff;
varying vec2 vUv;
void main(){
  vec3 pos = position;
  pos.y *= 1. - u_diff;
  pos.x *= 1. - u_diff;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`;
  const fragmentShader = `
precision mediump float;
uniform vec2 u_res;
uniform vec2 u_size;
uniform sampler2D u_texture;
vec2 cover(vec2 screenSize, vec2 imageSize, vec2 uv) {
  float screenRatio = screenSize.x / screenSize.y;
  float imageRatio = imageSize.x / imageSize.y;
  vec2 newSize = screenRatio < imageRatio 
      ? vec2(imageSize.x * (screenSize.y / imageSize.y), screenSize.y)
      : vec2(screenSize.x, imageSize.y * (screenSize.x / imageSize.x));
  vec2 newOffset = (screenRatio < imageRatio 
      ? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
      : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
  return uv * screenSize / newSize + newOffset;
}
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  vec2 uvCover = cover(u_res, u_size, uv);
  vec4 texture = texture2D(u_texture, uvCover);
  gl_FragColor = texture;
}
`;
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const material = new THREE.ShaderMaterial({ fragmentShader, vertexShader });

  class Plane extends THREE.Object3D {
    init(el, i) {
      this.el = el;
      this.x = 0;
      this.y = 0;
      this.my = 1 - (i % 5) * 0.1;
      this.geometry = geometry;
      this.material = material.clone();
      this.material.uniforms = {
        u_texture: { value: null },
        u_res: { value: new THREE.Vector2(1, 1) },
        u_size: { value: new THREE.Vector2(1, 1) },
        u_diff: { value: 0 },
      };
      this.texture = loader.load(this.el.dataset.src, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        const { naturalWidth, naturalHeight } = texture.image;
        this.material.uniforms.u_texture.value = texture;
        this.material.uniforms.u_size.value.set(naturalWidth, naturalHeight);
      });
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      this.add(this.mesh);
      this.resize();
    }
    update = (x, y, max, diff) => {
      const { right, bottom } = this.rect;
      this.material.uniforms.u_diff.value = diff;
      this.y = gsap.utils.wrap(-(max.y - bottom), bottom, y * this.my) - this.yOffset;
      this.x = gsap.utils.wrap(-(max.x - right), right, x) - this.xOffset;
      this.position.x = this.x;
      this.position.y = this.y;
    };
    resize() {
      this.rect = this.el.getBoundingClientRect();
      const { left, top, width, height } = this.rect;
      const containerRect = container.getBoundingClientRect();
      this.xOffset = left + width / 2 - (containerRect.left + ww / 2);
      this.yOffset = top + height / 2 - (containerRect.top + wh / 2);
      this.position.x = this.xOffset;
      this.position.y = this.yOffset;
      this.material.uniforms.u_res.value.set(width, height);
      this.mesh.scale.set(width, height, 1);
    }
  }

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(ww / -2, ww / 2, wh / 2, wh / -2, 1, 1000);
  camera.position.z = 1;
  camera.lookAt(scene.position);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff, 1);
  renderer.setSize(ww, wh);
  renderer.setPixelRatio(gsap.utils.clamp(1, 1.5, Math.min(window.devicePixelRatio, 2)));
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.top = '0';
  renderer.domElement.style.left = '0';
  renderer.domElement.style.pointerEvents = 'none';
  container.appendChild(renderer.domElement);
  console.log('[Framer3 embed] renderer appended to container');

  let tx = 0, ty = 0, cx = 0, cy = 0, diff = 0;
  let wheel = { x: 0, y: 0 }, on = { x: 0, y: 0 }, max = { x: 0, y: 0 };
  let isDragging = false;

  const planeInstances = planes.map((el, i) => {
    const plane = new Plane();
    plane.init(el, i);
    scene.add(plane);
    return plane;
  });

  const tick = () => {
    const xDiff = tx - cx;
    const yDiff = ty - cy;
    cx += xDiff * 0.085;
    cx = Math.round(cx * 100) / 100;
    cy += yDiff * 0.085;
    cy = Math.round(cy * 100) / 100;
    diff = Math.max(Math.abs(yDiff * 0.0001), Math.abs(xDiff * 0.0001));
    planeInstances.forEach((p) => p.update(cx, cy, max, diff));
    renderer.render(scene, camera);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    tx = on.x + e.clientX * 2.5;
    ty = on.y - e.clientY * 2.5;
  };
  const onMouseDown = (e) => {
    if (isDragging) return;
    isDragging = true;
    on.x = tx - e.clientX * 2.5;
    on.y = ty + e.clientY * 2.5;
  };
  const onMouseUp = () => { isDragging = false; };
  const onWheel = (e) => {
    let dx = e.wheelDeltaX || e.deltaX * -1;
    let dy = e.wheelDeltaY || e.deltaY * -1;
    if (isFirefox && e.deltaMode === 1) { dx *= multipliers.firefox; dy *= multipliers.firefox; }
    dx *= multipliers.mouse;
    dy *= multipliers.mouse;
    tx += dx;
    ty -= dy;
  };

  const resize = () => {
    ww = container.clientWidth || window.innerWidth;
    wh = container.clientHeight || window.innerHeight;
    if (ww <= 0 || wh <= 0) return;
    const rect = gridEl.getBoundingClientRect();
    max.x = rect.right;
    max.y = rect.bottom;
    camera.left = ww / -2;
    camera.right = ww / 2;
    camera.top = wh / 2;
    camera.bottom = wh / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(ww, wh);
    planeInstances.forEach((p) => p.resize());
  };

  let tickActive = true;
  const pause = () => {
    if (!tickActive) return;
    tickActive = false;
    gsap.ticker.remove(tick);
    if (renderer.domElement.style) renderer.domElement.style.visibility = 'hidden';
  };
  const resume = () => {
    if (tickActive) return;
    tickActive = true;
    gsap.ticker.add(tick);
    if (renderer.domElement.style) renderer.domElement.style.visibility = 'visible';
  };

  gsap.ticker.add(tick);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('wheel', onWheel);
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(() => requestAnimationFrame(resize));

  let contextLost = false;
  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    contextLost = true;
  });

  function destroy() {
    gsap.ticker.remove(tick);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mouseup', onMouseUp);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('resize', resize);
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
    if (!contextLost && renderer.getContext && !renderer.getContext().isContextLost()) {
      try { renderer.dispose(); } catch (_) { /* ignore */ }
    }
  }

  return { destroy, pause, resume };
}
