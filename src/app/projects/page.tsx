import Link from 'next/link';
import projectsData from '@/../public/company-projects.json';
import { projectSlugFromTitle } from '@/lib/slug';

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

const rawProjectsData: any = projectsData as any;
const allProjects: Project[] =
  (rawProjectsData.projects as Project[]) ||
  (rawProjectsData.default?.projects as Project[]) ||
  [];

export default function ProjectsIndexPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 space-y-10">
        <header className="space-y-3 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Projects
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Maps, dashboards, and spatial products we&apos;ve shipped.
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            A selection of {allProjects.length} projects across GeoAI, web maps, dashboards, and
            data products. Each card links to a deeper breakdown with stacks, screenshots, and
            video demos.
          </p>
        </header>

        <section className="grid gap-6 sm:gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {allProjects.map((project) => {
            const primaryMedia = project.media?.[0];
            const isVideo = primaryMedia ? primaryMedia.toLowerCase().endsWith('.mp4') : false;
            const rawText = project.extra_description || project.description || '';
            const cleanedText = rawText.replace(/^Project description\.\s*/i, '');
            const summary =
              cleanedText.length > 140 ? `${cleanedText.slice(0, 137)}…` : cleanedText;

            return (
              <Link
                key={project.id}
                href={`/projects/${projectSlugFromTitle(project.title)}`}
                className="group rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#185BCE]/70"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  {primaryMedia ? (
                    isVideo ? (
                      <video
                        src={primaryMedia}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={primaryMedia}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    )
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-400">
                      Media coming soon
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 space-y-2">
                  <h2 className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#185BCE] transition-colors">
                    {project.title}
                  </h2>
                  {summary && (
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{summary}</p>
                  )}
                  {project.skills_deliverables?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.skills_deliverables.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </main>
  );
}

