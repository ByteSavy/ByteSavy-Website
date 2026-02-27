'use client';

import { useEffect, useState, useRef, useMemo, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { colors } from '@/lib/theme';
import { menuItems, socialItems, navItems } from '@/lib/nav-config';
import { company, services, technicalCapabilities } from '@/lib/company-data';
import { projectSlugFromTitle } from '@/lib/slug';
import IconCloud from '@/components/icon-cloud';

type RotatingTextProps = {
  texts: string[];
  rotationInterval?: number;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
};

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  duration?: number;
  ease?: string;
  repeatWhenInView?: boolean;
};

type Project = {
  id: number;
  title: string;
  description: string;
  skills_deliverables: string[];
  extra_description?: string;
  media?: string[];
};

type ProjectsJson = {
  projects: Project[];
};

const CardNav = dynamic(() => import('@/components/navbar'), { ssr: false });
const StaggeredMenu = dynamic(
  () =>
    import('@/components/mobile-navbar').then((mod) => ({
      default: mod.StaggeredMenu as ComponentType<any>,
    })),
  { ssr: false }
);
const RotatingText = dynamic<RotatingTextProps>(
  () => import('@/components/rotating-text').then((mod) => mod.default as ComponentType<RotatingTextProps>),
  { ssr: false }
);

type TypingTextProps = {
  text: string;
  speed?: number;
  className?: string;
};

function TypingText({ text, speed = 40, className }: TypingTextProps) {
  const [displayed, setDisplayed] = useState('');
  const chars = useMemo(() => text.split(''), [text]);

  useEffect(() => {
    setDisplayed('');
    if (!chars.length) return;
    let index = 0;
    const id = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= chars.length) {
        window.clearInterval(id);
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [chars, speed, text]);

  return <span className={className}>{displayed}</span>;
}
const FlowingMenu = dynamic(() => import('@/components/services'), { ssr: false });
const VideoSection = dynamic(() => import('@/components/VideoSection'), { ssr: false });
const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false });
const Framer4Section = dynamic(() => import('@/components/framer4/Framer4Section'), { ssr: false });
const Framer6Section = dynamic(() => import('@/components/framer6/Framer6Section'), { ssr: false });
const AnimatedText = dynamic<AnimatedTextProps>(
  () => import('@/components/animated-text').then((mod) => mod.default as ComponentType<AnimatedTextProps>),
  { ssr: false }
);
const Footer = dynamic(() => import('@/components/footer'), { ssr: false });

const ROTATING_TEXTS = [
  ...(technicalCapabilities?.solution_types?.slice(0, 3) || []),
  ...(services?.primary_services?.slice(0, 2).map((s) => s.name) || []),
];

const CAPABILITIES_COPY = [
  {
    title: 'Scalable Geodata Infrastructure',
    body: 'Pipelines, tilesets and APIs designed to handle city- and country-scale data without grinding your product experience to a halt.',
  },
  {
    title: 'GeoAI Intelligence',
    body: 'Automatic detection of buildings, change and risk from imagery—so analysts start from insight-ready layers, not raw pixels.',
  },
  {
    title: 'Network Topology Mapping',
    body: 'End-to-end maps of fibre, towers or utilities that stay in sync with your source-of-truth, not a static diagram lost in a slide deck.',
  },
  {
    title: 'Distributed Spatial Platforms',
    body: 'Architectures that keep your GIS close to your cloud data warehouse, making governance and performance first-class citizens.',
  },
  {
    title: '3D Earth Systems',
    body: 'Multi-layer earth views that combine terrain, climate and infrastructure so your team can zoom from globe to street with context intact.',
  },
];

function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/company-projects.json')
      .then((res) => res.json())
      .then((data: ProjectsJson) => {
        if (!cancelled) setProjects(data.projects || []);
      })
      .catch(() => {
        if (!cancelled) setProjects([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!projects.length) {
    return null;
  }

  const featuredIds = new Set<number>([16, 17, 12, 14, 15, 18]);
  const featured = projects.filter((p) => featuredIds.has(p.id));
  const rest = projects.filter((p) => !featuredIds.has(p.id));

  return (
    <section id="projects" className="bg-white py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 mb-10 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500">
            Case studies
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
            Spatial products that are live in the world.
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A few of the projects where we&apos;ve owned both the map and the product experience.
            GeoAI, dashboards, and real users on the other side.
          </p>
        </div>

        {/* Featured grid */}
        <div className="grid gap-10 sm:gap-8 md:gap-10 md:grid-cols-2 xl:grid-cols-3 mb-12">
          {featured.map((project) => {
            const primaryMedia = project.media?.[0];
            const isVideo = primaryMedia ? primaryMedia.toLowerCase().endsWith('.mp4') : false;

            return (
              <article
                key={project.id}
                className="flex flex-col border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <Link
                  href={`/projects/${projectSlugFromTitle(project.title)}`}
                  className="relative w-full bg-slate-100 block"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    {primaryMedia ? (
                      isVideo ? (
                        <video
                          src={primaryMedia}
                          className="h-full w-full object-cover"
                          muted
                          loop
                          playsInline
                          autoPlay
                        />
                      ) : (
                        <img
                          src={primaryMedia}
                          alt={project.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xs text-slate-400">
                        Media coming soon
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex flex-col gap-3 px-4 sm:px-5 pt-4 pb-5">
                  <Link href={`/projects/${projectSlugFromTitle(project.title)}`} className="group">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-1">
                      {project.description}
                    </p>
                  </Link>
                  {project.skills_deliverables?.length ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.skills_deliverables.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>

        {/* See more work CTA */}
        {rest.length > 0 && (
          <div className="mt-6">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              See more of our work
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default function CartoInspiredPage() {
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);

  useEffect(() => {
    const handler = (e: any) => {
      if (!e?.detail || typeof e.detail.index !== 'number') return;
      setActiveCapabilityIndex(e.detail.index);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('framer4:activeSlide', handler);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('framer4:activeSlide', handler);
      }
    };
  }, []);

  return (
    <div className="min-h-screen w-full min-w-0 max-w-[100vw] bg-white text-slate-900 overflow-x-hidden">
      {/* Navigation (desktop + mobile) */}
      <header className="bg-white w-full">
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
      </header>

      <main>
        {/* Hero: Aurora + planet image on the right */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <Aurora color={colors.primary} className="w-full h-full opacity-60" style={{}} />
          </div>
          {/* Planet / earth image from Framer6 as right-aligned background (desktop/tablet only) */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden hidden md:block">
            <img
              src="/projects/asset1.gif"
              alt="Planetary earth intelligence visual"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-[70%] w-auto max-w-none"
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28 md:py-32">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center">
              <div className="flex flex-col gap-6">
               

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#185BCE]">
                  Ship spatial products your users actually enjoy.
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-slate-800 max-w-xl bg-white">
                  We help teams go from &ldquo;we should add a map&rdquo; to fully-fledged spatial
                  experiences: performant, on-brand, and deeply tied to business outcomes.
                </p>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 shadow-sm">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
                      We&apos;ve built with
                    </span>
                    <RotatingText
                      texts={ROTATING_TEXTS}
                      rotationInterval={2200}
                      mainClassName="text-xs sm:text-sm  text-bold font-medium text-[#185BCE]"
                      elementLevelClassName="inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile: show the animated planet gif below the hero text instead of behind it */}
        <section className="md:hidden bg-white px-4 pb-6">
          <div className="max-w-6xl mx-auto">
            <img
              src="/projects/asset1.gif"
              alt="Planetary earth intelligence visual"
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Services strip: immersive blue glass section */}
        <section className="relative bg-white">
          <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
            <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-[#2F7BFF]/40 blur-3xl" />
            <div className="absolute -bottom-40 right-0 h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-3xl bg-white/5 border border-white/12 shadow-[0_24px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl px-5 sm:px-7 py-6 sm:py-7">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#185BCE]">
                  What we help teams ship
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-[#185BCE]">
                  A single studio for maps, data, and product UX.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-[#185BCE] shadow-[0_10px_40px_rgba(15,23,42,0.7)] backdrop-blur-md">
                  GeoAI &amp; analytics
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-[#185BCE] shadow-[0_10px_40px_rgba(15,23,42,0.7)] backdrop-blur-md">
                  Web dashboards
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-[#185BCE] shadow-[0_10px_40px_rgba(15,23,42,0.7)] backdrop-blur-md">
                  Embedded maps
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-[#185BCE] shadow-[0_10px_40px_rgba(15,23,42,0.7)] backdrop-blur-md">
                  Data products
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How we work: centered copy, then full-width video */}
        <section className="bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-8 sm:pt-10 pb-16 sm:pb-20 space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                How we work
              </p>
              <AnimatedText
                text="Opinionated about UX, flexible about stack."
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ color: '#0F172A' }}
                repeatWhenInView={true}
              />
              <p className="text-sm sm:text-base text-slate-600">
                We drop into your context quickly, align on the map story, then iterate in short,
                visual loops—so you see progress in the browser, not in slide decks.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
              <VideoSection />
            </div>
          </div>
        </section>
 
 
 
  {/* Capabilities: merged white bg, blue text, Framer4 on the right */}
  <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
              <div className="space-y-4 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Capabilities
                </p>
                {(() => {
                  const safeIndex =
                    ((activeCapabilityIndex % CAPABILITIES_COPY.length) + CAPABILITIES_COPY.length) %
                    CAPABILITIES_COPY.length;
                  const current = CAPABILITIES_COPY[safeIndex];
                  return (
                    <>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#185BCE]">
                        {current.title}
                      </h2>
                      <p className="text-base sm:text-lg text-slate-700">
                        {current.body}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {CAPABILITIES_COPY.map((item, index) => (
                          <button
                            key={item.title}
                            type="button"
                            onClick={() => {
                              if (typeof window !== 'undefined' && (window as any).dispatchEvent) {
                                try {
                                  window.dispatchEvent(
                                    new CustomEvent('framer4:setActiveSlide', {
                                      detail: { index },
                                    })
                                  );
                                } catch {
                                  // ignore
                                }
                              }
                            }}
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                              index === safeIndex
                                ? 'bg-[#185BCE] border-[#185BCE] text-white'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>
              <div className="relative min-w-0 overflow-hidden">
                <Framer4Section />
              </div>
            </div>
          </div>
        </section>
       
       
       
       
       
        {/* Services: carousel + GeoAI stack icon cloud */}
        <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] items-start">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Services
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#185BCE]">
                  <TypingText
                    text="GeoAI, maps, and spatial UX in one place."
                    className="text-[#185BCE]"
                    speed={45}
                  />
                </h2>
                <div className="text-sm sm:text-base font-medium">
                  <span className="text-slate-800">We specialise in </span>
                  <RotatingText
                    texts={[
                      'automatic building footprints',
                      'coverage & serviceability maps',
                      'real-time spatial dashboards',
                    ]}
                    rotationInterval={2200}
                    mainClassName="inline text-[#185BCE]"
                    elementLevelClassName="inline-block"
                  />
                </div>
                <p className="text-sm sm:text-base text-slate-600 mt-2">
                  From raw satellite pixels to production-ready apps, we handle the GeoAI, the data
                  plumbing, and the interfaces—so your users just see a fast, beautiful map. The same
                  team that designs your experience also builds the stack, so there&apos;s no gap
                  between what you imagine and what ships.
                </p>
                <div className="mt-3">
                  <a
                    href="#contact"
                    className="inline-flex items-center justify-center rounded-full bg-[#185BCE] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-[#1448a6] transition-colors"
                  >
                    Plan a map project
                  </a>
                </div>
              </div>
              <FlowingMenu />
            </div>

            {/* GeoAI & web stack icon cloud */}
            <aside className="p-5 sm:p-6 flex flex-col gap-4 lg:max-w-xl w-full">
              <div className="mt-1">
                <IconCloud
                  iconSlugs={[
                    'react',
                    'nextdotjs',
                    'tailwindcss',
                    'typescript',
                    'nodedotjs',
                    'amazonaws',
                    'googlecloud',
                    'microsoftazure',
                    'postgresql',
                    'mongodb',
                    'firebase',
                    'mapbox',
                    'openstreetmap',
                    'python',
                    'pytorch',
                    'tensorflow',
                  ]}
                />
              </div>
            </aside>
          </div>
        </section>

      

       

        {/* Projects, powered by company-projects.json */}
        <ProjectsSection />

        {/* Simple CTA with animated text, immersive glass panel */}
        <section className="relative px-4 sm:px-6 lg:px-10 py-12 sm:py-16 bg-white">
          <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
            <div className="absolute -top-24 -left-10 h-56 w-56 rounded-full bg-[#2F7BFF]/40 blur-3xl" />
            <div className="absolute bottom-[-60px] right-[-40px] h-72 w-72 rounded-full bg-cyan-400/30 blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="rounded-3xl border border-white/14 bg-white/6 shadow-[0_26px_90px_rgba(15,23,42,0.85)] backdrop-blur-2xl px-6 sm:px-10 py-8 sm:py-10 text-center flex flex-col items-center gap-6">
              <AnimatedText
                text="Let’s ship your next spatial product."
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
                style={{ color: '#185BCE' }}
                repeatWhenInView={true}
              />
              <p className="text-sm sm:text-base text-[#185BCE] max-w-xl">
                Bring us messy data, rough ideas, or half-built prototypes. We&apos;ll help you
                turn them into spatial experiences your users actually enjoy.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#185BCE] shadow-[0_16px_40px_rgba(15,23,42,0.6)] hover:bg-slate-100 transition-colors"
              >
                Talk about a project
              </a>
            </div>
          </div>
        </section>
        <Framer6Section />
      </main>

      <Footer />
    </div>
  );
}

