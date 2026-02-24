'use client';

import { useRef, useEffect } from 'react';
import './framer6-section.css';

const INTRO_TITLE = 'Ready?';

const SLIDES = [
  { 
    id: 'f6-slide-1',
    title: 'Observe.',
    subtitle: 'Earth Intelligence',
    text: 'We transform the complexity of our planet into structured spatial insight. From terrain to infrastructure, every layer tells a story.',
    bg: 'white',
    img: '/projects/asset1.png'
  },
  { 
    id: 'f6-slide-2',
    title: 'Analyze.',
    subtitle: 'GeoAI Systems',
    text: 'Satellite imagery, machine learning, and geospatial engineering — converting raw earth data into measurable, decision-ready intelligence.',
    bg: 'white',
    img: '/projects/asset2.png'
  },
  { 
    id: 'f6-slide-3',
    title: 'Deploy.',
    subtitle: 'Spatial Applications',
    text: 'Interactive maps, intelligent dashboards, and automated detection models built to solve real-world operational challenges.',
    bg: 'white',
    img: '/projects/asset3.png'
  },
];

export default function Framer6Section() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let gsap;
    let ScrollTrigger;
    let ScrollToPlugin;
    const triggers = [];

    const init = async () => {
      try {
        const [gsapMod, stMod, scrollToMod] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
          import('gsap/ScrollToPlugin'),
        ]);
        gsap = gsapMod.default;
        ScrollTrigger = stMod.default;
        ScrollToPlugin = scrollToMod.default;
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger && section.contains(st.trigger)) st.kill();
        });

        const intro = section.querySelector('.framer6-intro');
        const introTitle = section.querySelector('.framer6-intro__title');
        const slides = section.querySelectorAll('.framer6-slide');
        const scrollLinks = section.querySelectorAll('.framer6-slide__scroll-link');

        gsap.set(section.querySelector('.framer6-stage'), { autoAlpha: 1 });

        if (intro && introTitle) {
          gsap.timeline({
            scrollTrigger: {
              trigger: intro,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          }).to(introTitle, { x: 200, ease: 'power2.in', duration: 1 }, 0);
        }

        slides.forEach((slide, i) => {
          const contentCol = slide.querySelector('.framer6-col__content');
          const titleEl = slide.querySelector('.framer6-col__content-title');
          const contentWrap = slide.querySelector('.framer6-col__content-wrap');
          const lineInners = slide.querySelectorAll('.framer6-line__inner');
          const scrollLink = slide.querySelector('.framer6-slide__scroll-link');
          const scrollLine = slide.querySelector('.framer6-slide__scroll-line');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: slide,
              start: '20% 70%',
              toggleActions: 'play none none none',
            },
          });
          if (titleEl) tl.from(titleEl, { y: '4vh', duration: 1, ease: 'power3.out' }, 0);
          if (lineInners.length) tl.from(lineInners, { y: 60, duration: 0.7, ease: 'power3.out', stagger: 0.05 }, 0);
          if (scrollLink) tl.from(scrollLink, { y: 40, duration: 0.6, ease: 'power3.out' }, 0.2);
          if (scrollLine) tl.to(scrollLine, { scaleY: 0.6, transformOrigin: 'bottom left', duration: 0.6, ease: 'back.out(1.2)' }, 0.4);

          if (contentCol && titleEl && contentWrap) {
            gsap.fromTo(
              titleEl,
              { y: 0 },
              {
                y: -40,
                ease: 'none',
                scrollTrigger: {
                  trigger: slide,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                },
              }
            );
            gsap.fromTo(
              contentWrap,
              { y: 0 },
              {
                y: -20,
                ease: 'none',
                scrollTrigger: {
                  trigger: slide,
                  start: 'top bottom',
                  end: 'bottom top',
                  scrub: 0.6,
                },
              }
            );
          }
        });

        scrollLinks.forEach((link, i) => {
          const line = link.querySelector('.framer6-slide__scroll-line');
          const targetId = SLIDES[i + 1]?.id;
          if (!targetId) return;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            gsap.to(window, { duration: 1.2, scrollTo: { y: `#${targetId}`, offsetY: 0 }, ease: 'power2.inOut' });
          });
          link.addEventListener('mouseenter', () => line && gsap.to(line, { y: 36, duration: 0.4, ease: 'power2.out' }));
          link.addEventListener('mouseleave', () => line && gsap.to(line, { y: 0, duration: 0.4, ease: 'power2.out' }));
        });

        ScrollTrigger.refresh();
      } catch (err) {
        console.error('[Framer6] GSAP init failed', err);
      }
    };

    const t = setTimeout(init, 300);
    return () => {
      clearTimeout(t);
      triggers.forEach((tr) => tr.kill());
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger && section.contains(st.trigger)) st.kill();
        });
      }
    };
  }, []);

  return (
    <section id="framer6" ref={sectionRef} className="framer6-section">
      <div className="framer6-stage">
        <div className="framer6-intro">
          <div className="framer6-intro__content">
            <h1 className="framer6-intro__title">{INTRO_TITLE}</h1>
          </div>
        </div>

        {SLIDES.map((slide, i) => (
          <div key={slide.id} className="framer6-slide" id={slide.id} style={{ '--slide-bg': slide.bg }}>
            <div className="framer6-col framer6-col--1">
              <div className="framer6-col__content">
                <h2 className="framer6-col__content-title">
                  <span className="framer6-line__inner">{slide.title}</span>
                  <br />
                  <span className="framer6-line__inner">{slide.subtitle}</span>
                </h2>
                <div className="framer6-col__content-wrap">
                  <p className="framer6-col__content-txt">{slide.text}</p>
                  <a href="#solutions" className="framer6-slide-link" aria-label="Go to Solutions">
                    <span className="framer6-slide-link__circ" />
                    <span className="framer6-slide-link__line" />
                  </a>
                </div>
              </div>
              {i < SLIDES.length - 1 && (
                <a href={`#${SLIDES[i + 1].id}`} className="framer6-slide__scroll-link" aria-label="Next">
                  <span className="framer6-slide__scroll-line" />
                </a>
              )}
            </div>
            <div className="framer6-col framer6-col--2">
              <div className="framer6-col__image-wrap">
                <img className="framer6-img" src={slide.img} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
