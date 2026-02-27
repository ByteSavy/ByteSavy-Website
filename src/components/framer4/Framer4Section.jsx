'use client';

import { useEffect, useState } from 'react';
import './framer4-section.css';

const SLIDES = [
  '/projects/NetworkTopologyMapping.png', // Network Topology Mapping
  '/projects/ScalableGeodataInfrastructure.png', // Scalable Geodata Infrastructure
  '/projects/GeoAIIntelligence.png', // GeoAI Intelligence
  '/projects/DistributedSpatialPlatforms.png', // Distributed Spatial Platforms
  '/projects/3DEarthSystems.png', // 3D Earth Systems
];

const TITLES = [
  'Network Topology Mapping',
  'Scalable Geodata Infrastructure',
  'GeoAI Intelligence',
  'Distributed Spatial Platforms',
  '3D Earth Systems',
];

export default function Framer4Section() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Notify outer layout (capabilities text) when slide changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.dispatchEvent) return;
    try {
      window.dispatchEvent(
        new CustomEvent('framer4:activeSlide', {
          detail: { index: activeIndex },
        })
      );
    } catch {
      // ignore
    }
  }, [activeIndex]);

  // Allow external controls to set the active slide (e.g. from text badges)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (event) => {
      if (!event?.detail || typeof event.detail.index !== 'number') return;
      const idx = event.detail.index;
      if (idx >= 0 && idx < SLIDES.length) {
        setActiveIndex(idx);
      }
    };

    window.addEventListener('framer4:setActiveSlide', handler);
    return () => window.removeEventListener('framer4:setActiveSlide', handler);
  }, []);

  const next = () => setActiveIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setActiveIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section id="framer4" className="framer4-section bg-white">
      <div className="framer4-carousel">
        <div className="framer4-carousel-media">
          {SLIDES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={TITLES[i]}
              className={`framer4-image ${i === activeIndex ? 'is-active' : ''}`}
            />
          ))}
          <button
            type="button"
            className="framer4-nav framer4-nav--prev"
            onClick={prev}
            aria-label="Previous capability"
          >
            ‹
          </button>
          <button
            type="button"
            className="framer4-nav framer4-nav--next"
            onClick={next}
            aria-label="Next capability"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
