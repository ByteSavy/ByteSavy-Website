'use client';

import type { ReactNode } from 'react';
import LenisRoot from '@/components/LenisRoot';

type SmoothScrollWrapperProps = {
  children: ReactNode;
};

export default function SmoothScrollWrapper({ children }: SmoothScrollWrapperProps) {
  return <LenisRoot>{children}</LenisRoot>;
}
