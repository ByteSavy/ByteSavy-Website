'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { colors } from '@/lib/theme';
import { menuItems, socialItems, navItems } from '@/lib/nav-config';
import { company, branding, services, technicalCapabilities, contact } from '@/lib/company-data';

const CardNav = dynamic(() => import('@/components/navbar'), { ssr: false });
const StaggeredMenu = dynamic(() => import('@/components/mobile-navbar'), { ssr: false });
const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false });
const GridDistortion = dynamic(() => import('@/components/Hero-section-bg'), { ssr: false });
const RotatingText = dynamic(() => import('@/components/rotating-text'), { ssr: false });
const CountUp = dynamic(() => import('@/components/count-up'), { ssr: false });
const FlowingMenu = dynamic(() => import('@/components/services'), { ssr: false });
const MagicBento = dynamic(() => import('@/components/magicbento'), { ssr: false });
const FluidGlass = dynamic(() => import('@/components/FLuidglass'), { ssr: false });
const Framer1Section = dynamic(() => import('@/components/framer1/Framer1Section'), { ssr: false });
const Framer3Section = dynamic(() => import('@/components/framer3/Framer3Section'), { ssr: false });
const Framer4Section = dynamic(() => import('@/components/framer4/Framer4Section'), { ssr: false });
const Framer5Section = dynamic(() => import('@/components/framer5/Framer5Section'), { ssr: false });
const Framer6Section = dynamic(() => import('@/components/framer6/Framer6Section'), { ssr: false });
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });
const ROTATING_TEXTS = [
  ...(branding?.brand_personality?.slice(0, 3) || []),
];

const flowingMenuItems = (services?.primary_services || []).map((s, i) => ({
  link: '#services',
  text: s.name,
  image: `https://picsum.photos/200/140?random=${i + 1}`,
}));

const magicBentoCards = (technicalCapabilities?.solution_types || []).map(s => ({
  color: colors.darkBackground,
  title: s,
  description: 'Enterprise-grade solutions for spatial intelligence',
  label: 'Solution',
}));

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const fluidGlassRef = useRef<HTMLElement>(null);
  const [showHeroEffects, setShowHeroEffects] = useState(false);
  const [showFluidGlass, setShowFluidGlass] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const obs = new IntersectionObserver(
      (entries) => setShowHeroEffects(entries[0]?.isIntersecting ?? false),
      { rootMargin: '-10% 0px -10% 0px', threshold: 0 }
    );
    const t = setTimeout(() => obs.observe(hero), 150);
    return () => {
      clearTimeout(t);
      obs.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = fluidGlassRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => setShowFluidGlass((prev) => prev || (entries[0]?.isIntersecting ?? false)),
      { rootMargin: '400px 0px 400px 0px', threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative isolate" style={{ backgroundColor: 'transparent' }}>
      {/* Desktop: CardNav – ensure on top */}
      <div className="hidden md:block relative z-[50]">
        <CardNav
          logo="/main-logo.png"
          logoAlt={company.brand_name}
          items={navItems}
          baseColor="#FFFFFF"
          menuColor={colors.darkBackground}
          buttonBgColor={colors.primary}
          buttonTextColor={colors.textLight}
        />
      </div>

      {/* Mobile: StaggeredMenu only */}
      <div className="md:hidden relative z-[50]">
        <StaggeredMenu
          position="right"
          colors={['#FFFFFF', colors.accent2, colors.primary]}
          items={menuItems}
          socialItems={socialItems}
          displaySocials={socialItems.length > 0}
          displayItemNumbering={false}
          isFixed
          accentColor={colors.primary}
          logoUrl="/main-logo.png"
          menuButtonColor={colors.primary}
          openMenuButtonColor={colors.primary}
        />
      </div>

      <main className="relative z-[20]">
        {/* Hero: Hero-section-bg + RotatingText + CountUp */}
        <section
          id="hero"
          ref={heroRef}
          className="min-h-[100dvh] flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 py-20 sm:py-24 overflow-hidden relative"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="absolute inset-0 z-0 bg-white" />
          <div className="absolute inset-0 z-[1]">
            {showHeroEffects && (
              <GridDistortion
                imageSrc="https://placehold.co/1920x1080/ffffff/185BCE/png?text=ByteSavy"
                grid={15}
                mouse={0.1}
                strength={0.15}
                relaxation={0.9}
                className="w-full h-full"
              />
            )}
          </div>
          <div className="absolute inset-0 z-[2] w-full h-full pointer-events-none opacity-90">
            {showHeroEffects && (
              <Aurora
                colorStops={[colors.primary, colors.accent1, colors.accent2]}
                amplitude={0.3}
                blend={0.3}
              />
            )}
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center mt-[35vh] sm:mt-[40vh] md:mt-[45vh] px-2">
            <p className="text-base sm:text-xl md:text-2xl font-medium min-h-[2.25rem] sm:min-h-[2.5rem] flex items-center justify-center flex-wrap sm:flex-nowrap gap-2">
              <span
                className="inline-flex items-center px-3 py-1.5 sm:px-5 sm:py-2 rounded-full max-w-[95vw] overflow-hidden text-ellipsis"
                style={{ backgroundColor: colors.primary, color: colors.textLight }}
              >
                <RotatingText
                  texts={ROTATING_TEXTS}
                  rotationInterval={2000}
                  mainClassName="inline"
                  elementLevelClassName="inline-block"
                />
              </span>
            </p>
            <div className="flex flex-col items-center justify-center gap-2 mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm md:text-base opacity-80" style={{ color: colors.darkBackground }}>
                Your Complete Spatial Intelligence Partner
              </p>
            </div>
          </div>
        </section>

        {/* 2. Framer1: animated links */}
        <Framer1Section
          links={[
            { href: '#services', label: 'GEoAI' },
  { href: '#solutions', label: 'Location Intel' },
  { href: '#fluidglass', label: '3D GIS' },
  { href: '#hero', label: 'Networking GIS' },
          ]}
        />

        {/* 3. Framer3: WebGL grid (drag / wheel) */}
        <Framer3Section />

        {/* 4. Framer4: WebGL horizontal slider */}
        <Framer4Section />

        {/* 5. Framer5: scroll effects (hero, horizontal rows) */}
        <Framer5Section />

        {/* 6. Framer6: smooth parallax scroll layout */}
        <Framer6Section />

        {/* 7. FluidGlass – hidden on mobile */}
        {/* <section
          id="fluidglass"
          ref={fluidGlassRef}
          className="hidden md:block relative z-10 min-h-[100dvh] h-[80vh] sm:h-[90vh] md:h-[100vh] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="absolute inset-0 w-full h-full">
            {showFluidGlass ? <FluidGlass /> : <div className="w-full h-full bg-white" />}
          </div>
        </section> */}

        {/* 7. Rest: one snap point, then free scroll */}
        <div id="after-fluidglass">

        {/* Stats: CountUp */}
        {/* <section
          id="stats"
          className="py-20 px-6"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: colors.primary }}>
                <CountUp to={company.founded_year} duration={2} />+
              </div>
              <div className="text-sm mt-1" style={{ color: colors.darkBackground }}>Est.</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: colors.primary }}>
                {company.company_size?.range || '11-50'}
              </div>
              <div className="text-sm mt-1" style={{ color: colors.darkBackground }}>Team</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: colors.primary }}>
                <CountUp to={company.business_model?.length || 3} duration={2} />
              </div>
              <div className="text-sm mt-1" style={{ color: colors.darkBackground }}>Focus</div>
            </div>
          </div>
        </section> */}

        {/* Services: FlowingMenu */}
        {/* <section id="services" className="min-h-[100dvh] h-[100dvh] sm:min-h-[130vh] sm:h-[130vh] md:min-h-[150vh] md:h-[150vh]">
          <FlowingMenu
            items={flowingMenuItems}
            textColor={colors.primary}
            bgColor="#FFFFFF"
            marqueeBgColor={colors.primary}
            marqueeTextColor={colors.textLight}
            borderColor={colors.primary}
          />
        </section> */}

        {/* Solutions: MagicBento */}
        {/* <section
          id="solutions"
          className="py-12 sm:py-16 md:py-24 px-3 sm:px-6"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%)',
          }}
        >
          <h2
            className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-center"
            style={{ color: colors.primary }}
          >
            Solutions
          </h2>
          <div className="max-w-6xl mx-auto w-full">
            <MagicBento
              cards={magicBentoCards}
              glowColor="24, 91, 206"
              enableStars
              enableSpotlight
              enableBorderGlow
              glassMode
              textColor={colors.primary}
            />
          </div>
        </section> */}
        </div>
        <Footer />
      </main>
    </div>
  );
}
