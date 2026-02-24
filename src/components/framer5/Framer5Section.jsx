'use client';

import { useRef, useEffect } from 'react';
import './framer5-section.css';

const SITENAME = 'Why Us?';
const BIG_LINES = ['CODE.', 'MAP.', 'INNOVATE.'];

const HORIZONTAL_ROWS = [
  [
    { filled: true, big: false, text: "We build spatial intelligence solutions. Want to see what we've done?", link: { text: 'Our work', href: '#framer3' } },
    { filled: true, big: false, text: 'Minimalism and clarity drive our UI: clear typography, purposeful color, and room to breathe.' },
    { filled: false, big: true, text: 'Spatial Intelligence' },
    { filled: true, big: false, text: 'GIS, AI, and software that turn location data into decisions.' },
    { filled: true, big: true, text: 'Ready to innovate?' },
    { filled: false, big: false, text: 'ByteSavy brings mapping and code together. One partner for your spatial needs.' },
  ],
  [
    { filled: false, big: true, text: 'Scroll. Explore.' },
    { filled: true, big: false, text: 'From maps to machine learning, we help organizations see the full picture.', link: { text: 'Solutions', href: '#solutions' } },
    { filled: true, big: false, text: 'Every link here takes you somewhere on this site.' },
    { filled: false, big: true, text: '# ByteSavy' },
    { filled: true, big: false, text: 'Tip: Use the menu to jump between sections.' },
    { filled: true, big: false, text: 'Thanks for scrolling. Reach out when you\'re ready to build.' },
  ],
];

export default function Framer5Section() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let gsap;
    let ScrollTrigger;
    const triggers = [];
    const scrollListeners = [];

    const setup = () => {
      const road = section.querySelector('.framer5-road');
      const horizontalWrapper = section.querySelector('.framer5-horizontal-wrapper');
      const horizontalContainer = section.querySelector('.framer5-horizontal-container');
      const horizontalScroller = section.querySelector('.framer5-horizontal-scroller');

      if (!horizontalScroller || !horizontalWrapper || !horizontalContainer) return;

      const onScroll = () => {
        if (!road) return;
        const rect = section.getBoundingClientRect();
        const wh = window.innerHeight;
        if (rect.top < wh) {
          const progress = Math.max(0, 1 - (wh - rect.top) / wh);
          road.style.height = `${100 - progress * 30}%`;
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      scrollListeners.push(() => window.removeEventListener('scroll', onScroll));

      const fadeins = section.querySelectorAll('.framer5-fadein');
      const onFadeScroll = () => {
        fadeins.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const mid = rect.top + rect.height / 2;
          if (mid >= 0 && mid <= window.innerHeight) {
            el.style.opacity = '1';
            el.classList.add('move-up');
          }
        });
      };
      window.addEventListener('scroll', onFadeScroll, { passive: true });
      scrollListeners.push(() => window.removeEventListener('scroll', onFadeScroll));

      const fullScrollWidth = Math.max(
        horizontalScroller.scrollWidth - document.documentElement.clientWidth,
        window.innerWidth * 2
      );
      const scrollDistance = Math.round(fullScrollWidth);
      horizontalWrapper.style.height = `${scrollDistance}px`;
      horizontalContainer.style.height = '100vh';
      gsap.to(horizontalScroller, {
        x: -scrollDistance,
        ease: 'none',
        scrollTrigger: {
          trigger: horizontalWrapper,
          start: 'top top',
          end: `+=${scrollDistance}`,
          pin: horizontalContainer,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      ScrollTrigger.refresh();
    };

    const init = async () => {
      try {
        const [gsapMod, stMod] = await Promise.all([
          import('gsap'),
          import('gsap/ScrollTrigger'),
        ]);
        gsap = gsapMod.default;
        ScrollTrigger = stMod.default;
        gsap.registerPlugin(ScrollTrigger);
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger && section.contains(st.trigger)) st.kill();
        });
        setup();
      } catch (err) {
        console.error('[Framer5] GSAP init failed', err);
      }
    };

    const t = setTimeout(() => {
      init();
    }, 400);

    return () => {
      clearTimeout(t);
      scrollListeners.forEach((fn) => fn());
      triggers.forEach((tr) => tr.kill());
      if (typeof ScrollTrigger !== 'undefined' && ScrollTrigger.getAll) {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger && section.contains(st.trigger)) st.kill();
        });
      }
    };
  }, []);

  return (
    <section id="framer5" ref={sectionRef} className="framer5-section framer5-section-wrap">
      <div className="framer5-section-inner">
      {/* <div className="framer5-hero">
        <div className="framer5-sun">
          <div className="framer5-semicircle" />
          <div className="framer5-line" />
        </div>
        <div className="framer5-road" />
      </div> */}

      <div className="framer5-part1">
        <p className="framer5-sitename">{SITENAME}</p>
        <div className="framer5-spacer" />
        <div className="framer5-big-text">
          {BIG_LINES.map((line, i) => (
            <p key={i} className="framer5-fadein">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="framer5-horizontal-container">
        <div className="framer5-horizontal-wrapper">
          <div className="framer5-horizontal-scroller">
            {HORIZONTAL_ROWS.map((row, ri) => (
              <div key={ri} className="framer5-row">
                {row.map((item, ii) => (
                  <div
                    key={ii}
                    className={`framer5-item ${item.filled ? 'filled' : ''} ${item.big ? 'big' : ''}`}
                  >
                    <p>{item.text}</p>
                    {item.link && (
                      <a className="framer5-item-link link" href={item.link.href}>
                        <span className="link-text" data-text={item.link.text}>
                          {item.link.text}
                        </span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
