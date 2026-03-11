'use client';

import { useEffect, useState, useRef, useMemo, type ComponentType } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { colors } from '@/lib/theme';
import { navItems, menuItems, socialItems } from '@/lib/nav-config';
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

type Review = {
  client_username: string;
  country: string;
  rating: number;
  year_ago: number;
  category: string;
  duration: string;
  repeat_client: boolean;
  order_status: string;
  review: string;
};

type ReviewsJson = {
  reviews: Review[];
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

const REVIEW_AVATAR_USERNAMES = new Set<string>([
  'mattiatalo',
  'jackthompson4',
  'joeprice77',
  'santiagolest804',
  'dorian_53',
  'rahulamlekar',
  'ogeidius',
]);

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
    <section id="projects" className="bg-[#0A1A33] py-20 px-4 sm:px-5 lg:px-7">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 mb-10 max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#27E3FF]">
            Case studies
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#27E3FF]">
            <span className="text-white">Spatial products</span> that are live in the world.
          </h2>
          <p className="text-sm sm:text-base text-white/90">
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
                className="flex flex-col border border-white/20 rounded-3xl overflow-hidden bg-white/5 backdrop-blur shadow-sm hover:shadow-md transition-shadow duration-200"
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
                      <div className="h-full w-full flex items-center justify-center text-xs text-white/60">
                        Media coming soon
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex flex-col gap-3 px-4 sm:px-5 pt-4 pb-5">
                  <Link href={`/projects/${projectSlugFromTitle(project.title)}`} className="group">
                    <h3 className="text-lg sm:text-xl font-semibold text-white group-hover:text-[#185BCE] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-3 mt-1">
                      {project.description}
                    </p>
                  </Link>
                  {project.skills_deliverables?.length ? (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.skills_deliverables.slice(0, 5).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-medium text-white"
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
          <div className="mt-6 flex justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-full bg-[#185BCE] px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-colors"
            >
              See more of our work
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/projects/Reviews/Reviews.json')
      .then((res) => res.json())
      .then((data: ReviewsJson) => {
        if (cancelled) return;
        const all = data.reviews || [];
        const positive = all.filter(
          (r) => r.rating >= 4.5 && r.order_status === 'completed'
        );
        const byUser = new Map<string, Review>();
        positive.forEach((r) => {
          const existing = byUser.get(r.client_username);
          if (!existing || r.review.length > existing.review.length) {
            byUser.set(r.client_username, r);
          }
        });
        const selected = Array.from(byUser.values())
          .sort((a, b) => (b.repeat_client ? 1 : 0) - (a.repeat_client ? 1 : 0) || b.rating - a.rating)
          .slice(0, 6);
        setReviews(selected);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!reviews.length) return null;

  return (
    <section id="reviews" className="bg-white py-16 sm:py-20 px-4 sm:px-5 lg:px-7">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-start sm:items-center gap-3 mb-10 text-left sm:text-center">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#185BCE]">
            Testimonials
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Transformative client experiences.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Teams across GIS, product, and data science ship faster with ByteSavy in the loop.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
          {reviews.map((r) => {
            const hasAvatar = REVIEW_AVATAR_USERNAMES.has(r.client_username);
            const avatarSrc = hasAvatar
              ? `/projects/Reviews/${r.client_username}.webp`
              : null;
            return (
              <article
                key={`${r.client_username}-${r.category}-${r.duration}`}
                className="flex flex-col justify-between rounded-3xl bg-slate-50 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 sm:p-6"
              >
                <div className="flex-1 flex flex-col gap-4">
                  <div className="text-slate-300 text-4xl leading-none">“</div>
                  <p className="text-sm sm:text-base text-slate-800">
                    {r.review}
                  </p>
                </div>
                <div className="mt-5 flex items-center gap-3">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={r.client_username}
                      className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-slate-200"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold uppercase">
                      {r.client_username.slice(0, 2)}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                      @{r.client_username}
                    </span>
                    <span className="text-xs text-slate-500">
                      {r.country} · {r.category}
                    </span>
                  </div>
                  <div className="ml-auto flex flex-col items-end text-xs text-slate-500">
                    <span className="font-semibold text-[#185BCE]">
                      {r.rating.toFixed(1)} ★
                    </span>
                    {r.repeat_client && <span>Repeat client</span>}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const SECTION_NAV_ITEMS = [
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'capabilities', label: 'Capabilities', href: '#capabilities' },
  { id: 'projects', label: 'Case studies', href: '#projects' },
] as const;
type SectionNavId = (typeof SECTION_NAV_ITEMS)[number]['id'];

export default function CartoInspiredPage() {
  const [activeCapabilityIndex, setActiveCapabilityIndex] = useState(0);
  const [sectionNavActive, setSectionNavActive] = useState<SectionNavId>('services');
  const [showSectionNav, setShowSectionNav] = useState(false);

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

  useEffect(() => {
    const sectionIds: SectionNavId[] = ['services', 'capabilities', 'projects'];

    const handleScroll = () => {
      if (typeof window === 'undefined') return;

      // Update active tab based on scroll position
      const triggerLine = 120;
      let active: SectionNavId = 'services';
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= triggerLine) active = id;
      });
      setSectionNavActive(active);

      // Show bottom tab bar only while services/capabilities/projects band is in view
      const servicesEl = document.getElementById('services');
      const projectsEl = document.getElementById('projects');
      if (!servicesEl || !projectsEl) {
        setShowSectionNav(false);
        return;
      }

      const servicesRect = servicesEl.getBoundingClientRect();
      const projectsRect = projectsEl.getBoundingClientRect();
      const navbarBottom = 64; // height of top nav
      const firstSectionTrigger = navbarBottom + 16;

      const starts = servicesRect.top <= firstSectionTrigger;
      const notPastLast = projectsRect.bottom >= 120;
      setShowSectionNav(starts && notPastLast);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleSectionNavClick = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full min-w-0 max-w-[100vw] bg-[#0A1A33] text-white overflow-x-clip">
      <header className="sticky top-0 z-[80] bg-[#0A1A33]/95 backdrop-blur">
        <div className="hidden md:block">
          <CardNav
            logo="/main-logo.png"
            logoAlt={company.brand_name}
            items={navItems}
            baseColor="#0A1A33"
            menuColor="#ffffff"
            buttonBgColor="#27E3FF"
            buttonTextColor="#0A1A33"
          />
        </div>
        <div className="md:hidden">
          <StaggeredMenu
            position="right"
            colors={['#0A1A33', colors.accent2, colors.primary]}
            items={menuItems}
            socialItems={socialItems}
            displaySocials={socialItems.length > 0}
            displayItemNumbering={false}
            isFixed
            accentColor={colors.primary}
            logoUrl="/main-logo.png"
            menuButtonColor="#ffffff"
            openMenuButtonColor="#ffffff"
          />
        </div>
      </header>

      <main className="pt-[72px] md:pt-0">
        {/* Hero + services strip stacked as layers (services strip not included in initial full-height) */}
        <div className="relative">
        {/* Hero: desktop uses sticky layering, mobile is normal flow */}
        <section
          id="hero"
          className="relative flex overflow-hidden bg-[#0A1A33] md:min-h-[calc(100dvh-64px)] md:h-[calc(100dvh-64px)] md:max-h-[calc(100dvh-64px)] md:sticky md:top-[64px] z-[1]"
        >
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

          <div className="relative z-10 flex w-full max-w-7xl flex-1 items-center mx-auto px-4 sm:px-5 lg:px-7 py-10 md:py-14">
            <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center">
              <div className="flex flex-col gap-6">
               

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#27E3FF]">
                  Ship <span className="text-white">spatial products</span> your users actually enjoy.
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-white max-w-xl">
                  We help teams go from &ldquo;we should add a map&rdquo; to fully-fledged spatial
                  experiences: performant, on-brand, and deeply tied to business outcomes.
                </p>

                <div className="flex flex-wrap gap-3 items-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 shadow-sm border border-white/20">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      We&apos;ve built with
                    </span>
                    <RotatingText
                      texts={ROTATING_TEXTS}
                      rotationInterval={2200}
                      mainClassName="text-xs sm:text-sm  text-bold font-medium text-[#27E3FF]"
                      elementLevelClassName="inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Mobile: show the animated planet gif below the hero text instead of behind it */}
        <section className="md:hidden bg-[#0A1A33] px-4 pb-8 pt-2">
          <div className="max-w-7xl mx-auto">
            <img
              src="/projects/asset1.gif"
              alt="Planetary earth intelligence visual"
              className="w-full h-auto"
            />
          </div>
        </section>

        {/* Services strip: stacked over hero only on desktop, normal flow on mobile */}
        <section className="relative bg-[#0A1A33] md:sticky md:top-[64px] z-[2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-7 pb-4 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-2xl bg-white/5 border border-white/10 px-5 sm:px-7 py-6 sm:py-7">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27E3FF]">
                  What we help teams ship
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  A single studio for maps, data, and product UX.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white">
                  GeoAI &amp; analytics
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white">
                  Web dashboards
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white">
                  Embedded maps
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white">
                  Data products
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white">
                  3D mapping
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white">
                  CesiumJS experiences
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-[11px] font-medium text-white">
                  Spatial data platforms
                </span>
              </div>
            </div>
          </div>
        </section>
        </div>

        {/* How we work: centered copy, then full-width video */}
        <section id="how-we-work" className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-7 pt-8 sm:pt-10 pb-16 sm:pb-20 space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#185BCE]">
                How we work
              </p>
              <AnimatedText
                text="Opinionated about UX, flexible about stack."
                className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900"
                style={{ color: '#0f172a' }}
                repeatWhenInView={true}
              />
              <p className="text-sm sm:text-base text-slate-600">
                We drop into your context quickly, align on the map story, then iterate in short,
                visual loops—so you see progress in the browser, not in slide decks.
              </p>
            </div>
            <VideoSection />
          </div>
        </section>

        {/* STEP IN FUTURE with BYTESAVY - text above tab bar (not sticky) */}
        <section
          id="step-in-future"
          className="bg-white py-16 sm:py-20 md:py-24 flex flex-col items-center justify-center text-center"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-5 lg:px-7">
            <p
              className="text-xl sm:text-2xl md:text-3xl mb-2 md:mb-3 font-medium italic tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif", color: '#1F2E4C' }}
            >
              STEP IN
            </p>
            <div className="flex flex-wrap items-end justify-center gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-2">
              <h2
                className="uppercase font-normal tracking-tight leading-[0.9] text-[clamp(3.5rem,12vw,8rem)]"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  color: '#3B6BFF',
                  textShadow: '0 3px 12px rgba(59, 107, 255, 0.25)',
                }}
              >
                FUTURE
              </h2>
              <div className="flex flex-col items-start justify-end">
                <span
                  className="lowercase text-base sm:text-lg md:text-xl font-normal leading-tight"
                  style={{ fontFamily: "'Poppins', sans-serif", color: '#1F2E4C' }}
                >
                  with
                </span>
                <span
                  className="uppercase font-bold tracking-tight leading-tight"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", color: '#1F2E4C' }}
                >
                  BYTESAVY
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Wrapper so tab bar appears over sections below */}
        <div className="bg-white">
          {/* Top-center fixed tab bar – only visible between services and projects */}
          {showSectionNav && (
            <div className="pointer-events-none fixed inset-x-0 top-[80px] z-[60] flex justify-center">
              <nav
                className="pointer-events-auto inline-flex items-center justify-center rounded-full bg-white/90 border border-slate-200/70 shadow-md px-1.5 py-1 backdrop-blur-md"
                role="tablist"
              >
                {SECTION_NAV_ITEMS.map((item) => {
                  const isActive = sectionNavActive === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleSectionNavClick(item.href)}
                      className={`relative rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-[#0A1A33] text-white shadow-sm'
                          : 'text-slate-600/80 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          )}
          {/* Services, Capabilities, Projects – normal scroll (only tab bar is sticky) */}
          <div className="relative space-y-16">
            {/* Services: carousel + GeoAI stack icon cloud */}
            <section
              id="services"
              className="bg-[#0A1A33] py-16 sm:py-20 px-4 sm:px-5 lg:px-7"
            >
              <div className="max-w-7xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] items-start">
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-3 max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#27E3FF]">
                      Services
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#27E3FF]">
                      <TypingText
                        text="GeoAI, maps, and spatial UX in one place."
                        className="text-[#27E3FF]"
                        speed={45}
                      />
                    </h2>
                    <div className="text-sm sm:text-base font-medium">
                      <span className="text-white">We specialise in </span>
                      <RotatingText
                        texts={[
                          'automatic building footprints',
                          'coverage & serviceability maps',
                          'real-time spatial dashboards',
                        ]}
                        rotationInterval={2200}
                        mainClassName="inline text-[#27E3FF]"
                        elementLevelClassName="inline-block"
                      />
                    </div>
                    <p className="text-sm sm:text-base text-white/90 mt-2">
                      From raw satellite pixels to production-ready apps, we handle the GeoAI, the data
                      plumbing, and the interfaces—so your users just see a fast, beautiful map. The same
                      team that designs your experience also builds the stack, so there&apos;s no gap
                      between what you imagine and what ships.
                    </p>
                    <div className="mt-3">
                      <a
                        href="#contact-us"
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
 
            {/* Capabilities: white bg, blue text, Framer4 on the right */}
            <section
              id="capabilities"
              className="bg-white py-16 sm:py-20 px-4 sm:px-5 lg:px-7"
            >
              <div className="max-w-7xl mx-auto">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center">
                  <div className="space-y-4 max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#185BCE]">
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
       
            {/* Projects, powered by company-projects.json */}
            <ProjectsSection />
          </div>

        {/* Reviews / testimonials */}
        <ReviewsSection />

        {/* Simple CTA with animated text */}
        <section className="relative px-4 sm:px-5 lg:px-7 py-12 sm:py-16 bg-white">
          <div className="relative max-w-5xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/50 px-6 sm:px-10 py-8 sm:py-10 text-center flex flex-col items-center gap-6">
              <AnimatedText
                text="Let’s ship your next spatial product."
                className="text-3xl sm:text-4xl md:text-5xl font-bold"
                style={{ color: '#185BCE' }}
                repeatWhenInView={true}
              />
              <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                Bring us messy data, rough ideas, or half-built prototypes. We&apos;ll help you
                turn them into spatial experiences your users actually enjoy.
              </p>
              <a
                href="#contact-us"
                className="inline-flex items-center justify-center rounded-full bg-[#185BCE] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-colors"
              >
                Talk about a project
              </a>
            </div>
          </div>
        </section>

        <Framer6Section />
        </div>
      </main>

      <Footer />
    </div>
  );
}

