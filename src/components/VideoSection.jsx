'use client';

import { useRef, useEffect } from 'react';

// Desktop: 16:9 (e.g. 1920×1080). Mobile: 9:16 shorts — use 1080×1920 px.
const VIDEO_DESKTOP = '/sharecrop.mp4';
const VIDEO_MOBILE = '/sharecrop-mobile.mp4'; // 1080×1920 px (9:16)

function usePlayWhenVisible(ref, sectionRef) {
  useEffect(() => {
    const section = sectionRef.current;
    const video = ref?.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        try {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        } catch (_) {}
      },
      { rootMargin: '0px', threshold: 0.25 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [ref, sectionRef]);
}

export default function VideoSection() {
  const sectionRef = useRef(null);
  const desktopRef = useRef(null);
  const mobileRef = useRef(null);

  usePlayWhenVisible(desktopRef, sectionRef);
  usePlayWhenVisible(mobileRef, sectionRef);

  return (
    <section
      ref={sectionRef}
      className="video-section relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-white"
      aria-label="Video"
    >
      {/* Desktop: 16:9 video — hidden on mobile */}
      <video
        ref={desktopRef}
        src={VIDEO_DESKTOP}
        className="absolute inset-0 w-full h-full object-contain hidden md:block"
        playsInline
        muted
        loop
        preload="metadata"
        aria-hidden
      />
      {/* Mobile: 9:16 video (1080×1920) — visible only on small screens */}
      <video
        ref={mobileRef}
        src={VIDEO_MOBILE}
        className="absolute inset-0 w-full h-full object-contain md:hidden"
        playsInline
        muted
        loop
        preload="metadata"
        aria-hidden
      />
    </section>
  );
}
