'use client';

import { useEffect, useState, type ComponentType } from 'react';
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
const FlowingMenu = dynamic(() => import('@/components/services'), { ssr: false });
const VideoSection = dynamic(() => import('@/components/VideoSection'), { ssr: false });
const Aurora = dynamic(() => import('@/components/Aurora'), { ssr: false });
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
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation (desktop + mobile) */}
      <header className="sticky top-0 z-[50] bg-white/80 backdrop-blur">
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
        {/* Hero: Aurora background only */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <Aurora color={colors.primary} className="w-full h-full opacity-60" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-24 sm:py-28 md:py-32">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-center">
              <div className="flex flex-col gap-6">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-700 shadow-sm w-max">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  GeoAI studio for product teams
                </p>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900">
                  Ship spatial products your users actually enjoy.
                </h1>

                <p className="text-sm sm:text-base md:text-lg text-slate-800 max-w-xl">
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
                      mainClassName="text-xs sm:text-sm font-medium text-slate-900"
                      elementLevelClassName="inline-block"
                    />
                  </div>
                </div>
              </div>

              {/* Hero proof: small projects rail */}
              <div className="hidden sm:block">
                <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                      Recent spatial launches
                    </span>
                  </div>
                  <div className="px-4 py-3 text-xs text-slate-600">
                    <p>Telecom coverage dashboards &middot; Environmental risk maps &middot; 3D city analytics</p>
                    <p className="mt-1">Mapbox · Leaflet · ArcGIS · React · Next.js</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services strip: equivalent to CARTO platform/solutions bar */}
        <section className="bg-slate-50 border-b border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  What we help teams ship
                </p>
                <h2 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
                  A single studio for maps, data, and product UX.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700">
                  GeoAI &amp; analytics
                </span>
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700">
                  Web dashboards
                </span>
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700">
                  Embedded maps
                </span>
                <span className="inline-flex items-center rounded-full bg-white border border-slate-200 px-3 py-1.5 text-[11px] font-medium text-slate-700">
                  Data products
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Services: carousel + GeoAI stack icons */}
        <section className="bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-10">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-3 max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Services
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  GeoAI, maps, and spatial UX in one place.
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  From raw satellite pixels to production dashboards, we design and ship the full
                  spatial story: data pipelines, GeoAI models, and interfaces that feel premium.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                  <li>• Automatic feature extraction from imagery (like buildings, roads, parcels)</li>
                  <li>• Clean, GIS-ready layers that plug into your existing tools</li>
                  <li>• Frontends that make complex spatial data simple to explore</li>
                </ul>
              </div>
              <FlowingMenu />
            </div>

            {/* GeoAI & web stack icon cloud */}
            <aside className="   p-5 sm:p-6 flex flex-col gap-4">
              
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

        {/* Capabilities: use Framer6 Section as a visual capabilities band, plus quick-reference tiles */}
        <section
          className="text-white"
          style={{
            backgroundImage: 'linear-gradient(135deg, #0A1A33 0%, #185BCE 50%, #1349A3 100%)',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 pb-10">
            <div className="flex flex-col gap-4 max-w-xl mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D7E5FF]">
                Capabilities
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                From 3D earth systems to retail store finders.
              </h2>
              <p className="text-sm sm:text-base text-[#E5EDFF]">
                We connect your data stack to rich, performant map experiences—whether that&apos;s
                a telecom admin dashboard, an e‑commerce store locator, or a climate risk atlas.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3 mb-10">
              <div className="rounded-2xl border border-white/15 bg-[#0F3F93]/85 px-4 py-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E5EDFF] mb-1">
                  Telecom &amp; utilities
                </p>
                <p className="text-[13px] text-[#E5EDFF]">
                  Coverage planning, serviceability maps, and admin tools your ops team will
                  actually use.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-[#0F3F93]/85 px-4 py-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E5EDFF] mb-1">
                  Retail &amp; e‑commerce
                </p>
                <p className="text-[13px] text-[#E5EDFF]">
                  Store finders, catchment analysis, and location-aware product experiences.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-[#0F3F93]/85 px-4 py-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#E5EDFF] mb-1">
                  Environment &amp; risk
                </p>
                <p className="text-[13px] text-[#E5EDFF]">
                  Water quality, noise, and climate overlays for regulators and communities.
                </p>
              </div>
            </div>
          </div>
        
        </section>

        {/* How we work: dedicated video section for process */}
        <section className="bg-white border-y border-slate-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)] items-center">
              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  How we work
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Opinionated about UX, flexible about stack.
                </h2>
                <p className="text-sm sm:text-base text-slate-600">
                  We drop into your context quickly, align on the map story, then iterate in short,
                  visual loops—so you see progress in the browser, not in slide decks.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Discovery on your data, user flows, and performance constraints</li>
                  <li>• Clickable prototypes before heavy engineering</li>
                  <li>• Production-ready implementation with a focus on observability</li>
                </ul>
              </div>
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
                <VideoSection />
              </div>
            </div>
          </div>
        </section>

        {/* Projects, powered by company-projects.json */}
        <ProjectsSection />

        {/* Simple CTA with animated text, reusing footer gradient */}
        <section
          className="py-18 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-10"
          style={{
            backgroundImage: 'linear-gradient(135deg, #0A1A33 0%, #185BCE 50%, #1349A3 100%)',
          }}
        >
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
            <AnimatedText
              text="Let’s ship your next spatial product."
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              style={{ color: '#FFFFFF' }}
              repeatWhenInView={true}
            />
            <p className="text-sm sm:text-base text-[#E5EDFF] max-w-xl">
              Bring us messy data, rough ideas, or half-built prototypes. We&apos;ll help you
              turn them into spatial experiences your users actually enjoy.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#185BCE] shadow-md hover:bg-slate-100 transition-colors"
            >
              Talk about a project
            </a>
          </div>

          
        </section>
        <Framer6Section />
      </main>

      <Footer />
    </div>
  );
}

