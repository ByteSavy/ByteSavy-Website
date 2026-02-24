/**
 * Tracks WebGL sections by id. Each section registers its own destroy;
 * multiple sections can be active so Framer3 stays visible when Framer4 loads.
 * initFn() is called and must return a destroy function.
 */
const sections = new Map();

export function register(id, initFn) {
  const existing = sections.get(id);
  if (existing) {
    try { existing(); } catch (e) { console.warn('[WebGL manager] destroy error', e); }
    sections.delete(id);
  }
  const ret = initFn();
  const destroy = typeof ret === 'function' ? ret : (ret && typeof ret.destroy === 'function' ? ret.destroy : null);
  sections.set(id, destroy);
}

export function unregister(id) {
  const destroy = sections.get(id);
  if (destroy) {
    try { destroy(); } catch (e) { console.warn('[WebGL manager] unregister destroy error', e); }
  }
  sections.delete(id);
}

export function getActiveId() {
  return sections.size ? [...sections.keys()][0] : null;
}
