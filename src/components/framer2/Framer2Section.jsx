'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { BgPaths, springConfig } from './framer2-data';
import './framer2.css';

const CLOUD_1 =
  'https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/starry-sky/images/cloud.png';
const CLOUD_2 =
  'https://raw.githubusercontent.com/SochavaAG/example-mycode/master/pens/starry-sky/images/cloud-2.png';

function useParallax(value, n, invert = 0) {
  return useTransform(value, (v) => `${(v - invert) * n}vh`);
}

function SceneBackground({ scrollYProgress }) {
  const baseY = useSpring(scrollYProgress, springConfig);
  const y = useTransform(baseY, [0, 1], ['0vh', '-200vh']);
  const yStars1 = useTransform(baseY, [0, 1], ['10vh', '-70vh']);
  const opacityStars = useTransform(baseY, [0, 0.5], [0.5, 0]);
  const xClouds1 = useTransform(baseY, [0, 1], ['-20vw', '0vw']);
  const xClouds2 = useTransform(baseY, [0, 1], ['20vw', '0vw']);
  const yFgA = useParallax(baseY, 70, 0.85);
  const yFgB = useParallax(baseY, -25, 1);
  const yFgC = useParallax(baseY, -75, 1);
  const yFgD = useParallax(baseY, -150, 1);

  return (
    <motion.div
      id="scene-bg"
      className="framer2-scene-bg"
      style={{
        y,
        backgroundImage: `
          linear-gradient(70deg, #112 0%, #0000 0%),
          linear-gradient(#000 30%, #112 45%, #323 55%, #844, #f95, #f90 90%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 2, ease: 'easeIn' } }}
    >
      <h1>Scroll Down</h1>
      <motion.div
        id="stars-1"
        className="stars"
        style={{ y: yStars1, opacity: opacityStars }}
      />
      <motion.div id="stars-2" className="stars" />

      <div className="clouds">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 250"
          height="100%"
          width="100%"
          style={{ overflow: 'visible' }}
        >
          <motion.g id="clouds-1" style={{ x: xClouds1 }}>
            <image
              width="80%"
              height="100%"
              preserveAspectRatio="none"
              transform="translate(500 0)"
              href={CLOUD_1}
            />
          </motion.g>
          <motion.g id="clouds-2" style={{ x: xClouds2 }}>
            <image
              width="100%"
              height="150%"
              preserveAspectRatio="none"
              transform="translate(-250 -40) rotate(5)"
              href={CLOUD_2}
            />
          </motion.g>
        </svg>
      </div>

      <div className="mountains">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 4000 2000"
          preserveAspectRatio="xMinYMin slice"
          height="100%"
          width="100%"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient
              id="framer2-mtn-grad1"
              x1="2000"
              y1="600"
              x2="2000"
              y2="2000"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.01" stopColor="#ffc0bd" />
              <stop offset="1" stopColor="#914d6488" />
            </linearGradient>
            <linearGradient id="framer2-mtn-grad2" x1="0" y1="1" x2="1" y2="1">
              <stop offset="0" stopColor="#70375a" />
              <stop offset="0.96" stopColor="#8a6e95" />
            </linearGradient>
            <linearGradient
              id="framer2-mtn-grad3"
              x1="2000"
              x2="2000"
              y1="600"
              y2="1000"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0.2" stopColor="#433d6c" />
              <stop offset="1" stopColor="#17142c" />
            </linearGradient>
            <linearGradient
              id="framer2-mtn-grad4"
              x1="2000"
              x2="1970"
              y1="700"
              y2="1000"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#0e0a1a" />
              <stop offset="0.3" stopColor="#100d1f" />
              <stop offset="0.64" stopColor="#17142c" />
              <stop offset="0.95" stopColor="#201f3f" />
            </linearGradient>
          </defs>
          <motion.g id="bg-mtns" style={{ y: yFgA }}>
            <path d={BgPaths.layer1[0]} fill="url(#framer2-mtn-grad1)" />
            <path d={BgPaths.layer1[1]} fill="url(#framer2-mtn-grad2)" />
          </motion.g>
          <motion.path
            id="bg-trees"
            style={{ y: yFgB }}
            d={BgPaths.layer3}
            fill="url(#framer2-mtn-grad3)"
          />
          <motion.path
            id="terrain"
            style={{ y: yFgC }}
            d={BgPaths.layer4}
            fill="url(#framer2-mtn-grad4)"
          />
          <motion.g id="foreground" style={{ y: yFgD }}>
            <rect y={990} fill="#000" height="100%" width="100%" />
            <path d={BgPaths.layer5} fill="#000" />
          </motion.g>
        </svg>
      </div>
    </motion.div>
  );
}

export default function Framer2Section() {
  const sectionRef = useRef(null);
  // Progress 0 = section first enters (top at bottom of viewport), 1 = section has left (bottom at top of viewport)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section
      id="framer2"
      ref={sectionRef}
      className="framer2-section relative snap-start snap-always min-h-[100dvh]"
      style={{ minHeight: '300vh' }}
    >
      <div className="framer2-sticky-wrap sticky top-0 left-0 w-full h-screen overflow-hidden">
        <SceneBackground scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
}
