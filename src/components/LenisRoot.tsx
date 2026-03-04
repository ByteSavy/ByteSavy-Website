'use client';

import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

type LenisRootProps = {
  children: ReactNode;
};

export default function LenisRoot({ children }: LenisRootProps) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    let frameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

