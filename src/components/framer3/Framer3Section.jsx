'use client';

import { useRef, useEffect, useState } from 'react';
import { register, unregister } from '@/lib/webgl-section-manager';
import './framer3-section.css';

const PROJECT_SOURCES = [
  '/projects/1.png',
  '/projects/2.png',
  '/projects/3.gif',
  '/projects/4.png',
  '/projects/5.png',
  '/projects/6.png',
];
const GRID_COLS = 5;
const GRID_ROWS = 4;
const GRID_IMAGES = Array.from(
  { length: GRID_COLS * GRID_ROWS },
  (_, i) => PROJECT_SOURCES[i % PROJECT_SOURCES.length]
);

const ID = 'framer3';

export default function Framer3Section() {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  const sectionApiRef = useRef(null);
  const hasInitedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initTimeoutId = null;
    let pauseTimeoutId = null;
    const PAUSE_DELAY_MS = 800;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (!visible) {
          if (initTimeoutId) {
            clearTimeout(initTimeoutId);
            initTimeoutId = null;
          }
          pauseTimeoutId = setTimeout(() => {
            pauseTimeoutId = null;
            sectionApiRef.current?.pause?.();
            setMounted(false);
          }, PAUSE_DELAY_MS);
          return;
        }
        if (pauseTimeoutId) {
          clearTimeout(pauseTimeoutId);
          pauseTimeoutId = null;
        }
        if (hasInitedRef.current) {
          sectionApiRef.current?.resume?.();
          setMounted(true);
          return;
        }
        initTimeoutId = setTimeout(() => {
          initTimeoutId = null;
          Promise.all([
            import('gsap'),
            import('three'),
            import('./framer3-embed.js'),
          ])
            .then(([gsapMod, threeMod, embedMod]) => {
              const gsap = gsapMod.default;
              const THREE = threeMod.default ?? threeMod;
              register(ID, () => {
                const api = embedMod.initFramer3(container, { gsap, THREE });
                sectionApiRef.current = api;
                hasInitedRef.current = true;
                setMounted(true);
                return typeof api.destroy === 'function' ? api.destroy : api;
              });
            })
            .catch((err) => console.warn('[Framer3] init failed', err));
        }, 50);
      },
      { rootMargin: '200px 0px 200px 0px', threshold: 0.15 }
    );
    obs.observe(container);

    return () => {
      if (initTimeoutId) clearTimeout(initTimeoutId);
      if (pauseTimeoutId) clearTimeout(pauseTimeoutId);
      obs.disconnect();
      unregister(ID);
    };
  }, []);

  return (
    <section
      id="framer3"
      ref={containerRef}
      className="framer3-section min-h-[150dvh] h-[150dvh] relative overflow-hidden bg-white"
      style={{ cursor: mounted ? 'grab' : 'default' }}
    >
      <div className="framer3-grid grid js-grid">
        {GRID_IMAGES.map((src, i) => (
          <div key={i}>
            <figure className="js-plane" data-src={src} />
          </div>
        ))}
      </div>
    </section>
  );
}
