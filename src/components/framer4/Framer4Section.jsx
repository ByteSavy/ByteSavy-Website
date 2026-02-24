'use client';

import { useRef, useEffect, useState } from 'react';
import { register, unregister } from '@/lib/webgl-section-manager';
import './framer4-section.css';

const SLIDES = [
  '/projects/pic2.png',
  '/projects/pic1.png',
 
  '/projects/pic3.png',
  '/projects/pic4.png',
  '/projects/pic5.png',
  
  
  
];

const TITLES = ['3D Earth Systems','GeoAI Intelligence',  'Network Topology Mapping','Distributed Spatial Platforms','Scalable Geodata Infrastructure'];

const ID = 'framer4';

/** Set to false to disable Framer4 GSAP scroll/pin (to test if it causes Framer5 skip). */
const FRAMER4_GSAP_SCROLL_ENABLED = false;

export default function Framer4Section() {
  const containerRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initTimeoutId = null;
    let unregisterTimeoutId = null;
    const UNREGISTER_DELAY_MS = 450;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        console.log('[Framer4] IntersectionObserver', { visible, ratio: entries[0]?.intersectionRatio });
        if (!visible) {
          if (initTimeoutId) {
            clearTimeout(initTimeoutId);
            initTimeoutId = null;
          }
          unregisterTimeoutId = setTimeout(() => {
            unregisterTimeoutId = null;
            unregister(ID);
            setMounted(false);
          }, UNREGISTER_DELAY_MS);
          return;
        }
        if (unregisterTimeoutId) {
          clearTimeout(unregisterTimeoutId);
          unregisterTimeoutId = null;
        }
        initTimeoutId = setTimeout(() => {
          initTimeoutId = null;
          console.log('[Framer4] Visible, loading gsap/three/init...');
          Promise.all([
            import('gsap'),
            import('gsap/ScrollTrigger'),
            import('three'),
            import('./framer4-init.js'),
          ])
            .then(([gsapMod, stMod, threeMod, embedMod]) => {
              console.log('[Framer4] Imports OK, calling register');
              const gsap = gsapMod.default;
              const ScrollTrigger = stMod.default;
              gsap.registerPlugin(ScrollTrigger);
              const THREE = threeMod.default ?? threeMod;
              register(ID, () => {
                console.log('[Framer4] register initFn called');
                const destroy = embedMod.initFramer4(gsap, THREE, container, {
                  scrollDrive: FRAMER4_GSAP_SCROLL_ENABLED,
                  ScrollTrigger,
                  scrollDistance: typeof window !== 'undefined' ? window.innerHeight * 2.5 : 2700,
                });
                console.log('[Framer4] initFramer4 returned', typeof destroy);
                setMounted(true);
                return destroy;
              });
            })
            .catch((err) => console.warn('[Framer4] init failed', err));
        }, 150);
      },
      { rootMargin: '50px', threshold: 0.1 }
    );
    obs.observe(container);

    return () => {
      if (initTimeoutId) clearTimeout(initTimeoutId);
      if (unregisterTimeoutId) clearTimeout(unregisterTimeoutId);
      obs.disconnect();
      unregister(ID);
    };
  }, []);

  return (
    <section
      id="framer4"
      ref={containerRef}
      className="framer4-section min-h-[100dvh] h-[100dvh] relative overflow-hidden bg-white"
      style={{ cursor: mounted ? 'grab' : 'default' }}
    >
      <div className="framer4-slider js-drag-area">
        <div className="framer4-slider__inner js-slider">
          {SLIDES.map((src, i) => (
            <div
              key={i}
              className="framer4-slide js-slide"
              style={i === 0 ? {} : { left: `${i * 120}%` }}
            >
              <div className="framer4-slide__inner js-slide__inner">
                <img
                  className="js-slide__img"
                  src={src}
                  alt=""
                  crossOrigin="anonymous"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="framer4-titles">
        <div className="framer4-titles__title framer4-titles__title--proxy">
          {TITLES.reduce((a, b) => (a.length >= b.length ? a : b), '')}
        </div>
        <div className="framer4-titles__list js-titles">
          {Array.from({ length: SLIDES.length }).map((_, i) => (
            <div key={i} className="framer4-titles__title js-title">
              {TITLES[i % TITLES.length]}
            </div>
          ))}
        </div>
      </div>

      <div className="framer4-progress">
        <div className="framer4-progress__line js-progress-line" />
        <div className="framer4-progress__line js-progress-line-2" />
      </div>

      <div className="framer4-scroll-hint" aria-hidden="true">
        <span className="framer4-scroll-hint__arrow">←</span>
        <span className="framer4-scroll-hint__text">Drag to scroll</span>
        <span className="framer4-scroll-hint__arrow">→</span>
      </div>
    </section>
  );
}
