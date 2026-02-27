import type { Metadata } from 'next';
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

type PageParams = {
  id: string; // slug or numeric id
};

export function generateStaticParams() {
  return allProjects.map((project) => ({
    id: projectSlugFromTitle(project.title),
  }));
}

export async function generateMetadata(
  { params }: { params: Promise<PageParams> }
): Promise<Metadata> {
  const { id } = await params;
  const project = allProjects.find(
    (p) =>
      projectSlugFromTitle(p.title) === id ||
      String(p.id) === id
  );
  return {
    title: project ? `${project.title} | ByteSavy Project` : 'Project | ByteSavy',
    description: project?.description,
  };
}

export default async function ProjectDetailPage(
  { params }: { params: Promise<PageParams> }
) {
  const { id } = await params;
  const project = allProjects.find(
    (p) =>
      projectSlugFromTitle(p.title) === id ||
      String(p.id) === id
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-white px-4 py-24 text-center text-slate-700">
        <p className="text-sm uppercase tracking-[0.18em] text-slate-400 mb-2">Projects</p>
        <h1 className="text-2xl font-bold mb-3">Project not found</h1>
        <p className="text-sm text-slate-500">We couldn&apos;t find a project with that ID.</p>
      </div>
    );
  }

  const media = project.media || [];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
          Project
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
          {project.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mb-6">
          {project.description}
        </p>

        {project.skills_deliverables?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {project.skills_deliverables.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-700"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {media.length > 0 && (
          <section className="mb-10 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Screens &amp; demos
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {media.map((src) => {
                const isVideo = src.toLowerCase().endsWith('.mp4');
                return (
                  <div
                    key={src}
                    className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50"
                  >
                    {isVideo ? (
                      <video
                        src={src}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        controls
                        playsInline
                      />
                    ) : (
                      <img
                        src={src}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {project.extra_description && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
              Project story
            </h2>
            <p className="whitespace-pre-line text-sm sm:text-base text-slate-700">
              {project.extra_description}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

