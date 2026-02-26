'use client';

import { useRef, useEffect } from 'react';

const VIDEO_SRC = '/sharecrop.mp4';

export default function VideoSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
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
  }, []);

  return (
    <section
      ref={sectionRef}
      className="video-section relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden  bg-white"
      aria-label="Video"
    >
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        className="absolute inset-0 w-full h-full object-contain"
        playsInline
        muted
        loop
        preload="metadata"
        aria-hidden
      />
    </section>
  );
}
