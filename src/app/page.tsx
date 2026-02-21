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
    <div
      className="min-h-screen"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Desktop: CardNav only - white background */}
      <div className="hidden md:block">
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
      <div className="md:hidden">
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

      <main>
        {/* Hero: Hero-section-bg + RotatingText + CountUp */}
        <section
          id="hero"
          ref={heroRef}
          className="snap-start snap-always min-h-screen flex flex-col items-center justify-center px-2 sm:px-4 md:px-6 py-24 overflow-hidden relative"
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
                amplitude={0.5}
                blend={0.5}
              />
            )}
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center mt-[45vh]">
          
            <p className="text-xl md:text-2xl font-medium min-h-[2.5rem] flex items-center justify-center flex-nowrap gap-2">
                <span
                className="inline-flex items-center px-5 py-2 rounded-full whitespace-nowrap"
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
            <div className="flex flex-col items-center justify-center gap-2 mt-6">
            <p className="text-sm md:text-base opacity-80" style={{ color: colors.darkBackground }}>Your Complete Spatial Intelligence Partner</p>
            </div>
               </div>
        </section>
        
        <section
          id="fluidglass"
          ref={fluidGlassRef}
          className="snap-start snap-always relative z-10 min-h-[100vh] h-[100vh] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <div className="absolute inset-0 w-full h-full">
            {showFluidGlass ? <FluidGlass /> : <div className="w-full h-full bg-white" />}
          </div>
        </section>

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
        <section id="services" className="snap-start snap-always min-h-[150vh] h-[150vh]">
          <FlowingMenu
            items={flowingMenuItems}
            textColor={colors.primary}
            bgColor="#FFFFFF"
            marqueeBgColor={colors.primary}
            marqueeTextColor={colors.textLight}
            borderColor={colors.primary}
          />
        </section>

        {/* Solutions: MagicBento */}
        <section
          id="solutions"
          className="snap-start snap-always py-24 px-6"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f5f9ff 100%)',
          }}
        >
          <h2
            className="text-3xl font-bold mb-12 text-center"
            style={{ color: colors.primary }}
          >
            Solutions
          </h2>
          <div className="max-w-6xl mx-auto">
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
        </section>
      </main>
    </div>
  );
}
