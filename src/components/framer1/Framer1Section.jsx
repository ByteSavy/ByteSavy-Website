'use client';

import { motion } from 'motion/react';
import './framer1.css';

const DEFAULT_LINKS = [
  { href: '#services', label: 'GEoAI' },
  { href: '#solutions', label: 'Location Intelligence' },
  { href: '#fluidglass', label: '3D GIS' },
  { href: '#hero', label: 'Networking GIS' },
];

function AnimatedLink({ href, children }) {
  return (
    <motion.a
      initial="initial"
      whileHover="hovered"
      href={href}
      className="relative block overflow-hidden whitespace-nowrap text-3xl font-black uppercase sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl touch-manipulation"
    >
      <motion.div
        variants={{
          initial: { y: 0 },
          hovered: { y: '-100%' },
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="absolute inset-0"
        variants={{
          initial: { y: '100%' },
          hovered: { y: 0 },
        }}
      >
        {children}
      </motion.div>
    </motion.a>
  );
}

export default function Framer1Section({ links = DEFAULT_LINKS }) {
  return (
    <section
      id="framer1"
      className="framer1-section grid place-content-center min-h-[100dvh] py-12 px-4 sm:py-24 sm:px-6 bg-white text-[#185BCE] overflow-hidden"
    >
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-4 max-w-[100vw]">
        {links.map((item) => (
          <AnimatedLink key={item.label} href={item.href}>
            {item.label}
          </AnimatedLink>
        ))}
      </div>
    </section>
  );
}
