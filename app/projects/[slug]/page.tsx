import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ExternalLink, Github } from 'lucide-react'
import { getProjectBySlug, projects } from '@/app/projects/projectsData'
import type { Project } from '@/app/projects/projectsData'

type ProjectDetailPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return projects.map((project: Project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const currentProjectIndex = projects.findIndex((item: Project) => item.slug === project.slug)
  const previousProject =
    currentProjectIndex > 0 ? projects[currentProjectIndex - 1] : projects[projects.length - 1]
  const nextProject =
    currentProjectIndex < projects.length - 1 ? projects[currentProjectIndex + 1] : projects[0]

  const relatedProjects = projects.filter((item: Project) => item.slug !== project.slug).slice(0, 2)

  return (
    <div className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] hover:text-[color:var(--ink)] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <section className="card mt-6 overflow-hidden">
          <div className="grid lg:grid-cols-2">
            <div className="bg-[color:var(--accent-soft)] min-h-[280px] lg:min-h-full p-6 flex items-center justify-center">
              <img
                src={project.image}
                alt={`${project.title} project image`}
                className="max-w-full max-h-[560px] w-auto h-auto object-contain"
              />
            </div>

            <div className="p-8 md:p-10">
              <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)] mb-3">{project.label}</p>
              <h1 className="text-4xl font-display mb-4">{project.title}</h1>
              <p className="text-[color:var(--muted)] whitespace-pre-line mb-8">{project.description}</p>

              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <div className="rounded-2xl border border-[color:var(--stroke)] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">Year</p>
                  <p className="font-medium">{project.year}</p>
                </div>
                <div className="rounded-2xl border border-[color:var(--stroke)] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">Role</p>
                  <p className="font-medium">{project.role}</p>
                </div>
                <div className="rounded-2xl border border-[color:var(--stroke)] bg-white/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-2">Status</p>
                  <p className="font-medium">{project.status}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mb-8">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--ink)] text-white px-5 py-2.5 text-sm hover:opacity-90 transition-opacity"
                  >
                    <Github size={16} />
                    View GitHub
                  </a>
                ) : null}

                {project.demo ? (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--stroke)] px-5 py-2.5 text-sm hover:bg-[color:var(--accent-soft)] transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                ) : null}
              </div>

              {project.documents && project.documents.length > 0 ? (
                <div className="mt-8 rounded-3xl border border-[color:var(--stroke)] bg-white/70 p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-3">Documents</p>
                  <div className="flex flex-wrap gap-3">
                    {project.documents.map((document) => (
                      <a
                        key={document.href}
                        href={document.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--stroke)] px-4 py-2 text-sm hover:bg-[color:var(--accent-soft)] transition-colors"
                      >
                        {document.title}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mt-10 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-7">
            <h2 className="text-2xl font-display mb-4">What I built</h2>
            <ul className="space-y-3 text-[color:var(--muted)]">
              {project.highlights.map((highlight: string) => (
                <li key={highlight} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[color:var(--accent)] shrink-0" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-7">
            <h2 className="text-xl font-display mb-4">More projects</h2>
            <div className="space-y-3">
              {relatedProjects.map((item: Project) => (
                <Link
                  key={item.slug}
                  href={`/projects/${item.slug}`}
                  className="block rounded-2xl border border-[color:var(--stroke)] bg-white/70 p-4 hover:bg-[color:var(--accent-soft)] transition-colors"
                >
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-sm text-[color:var(--muted)]">{item.shortDescription}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 gap-4">
          <Link
            href={`/projects/${previousProject.slug}`}
            className="card p-5 flex items-center justify-between hover:bg-[color:var(--accent-soft)] transition-colors"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-1">Previous Project</p>
              <p className="font-medium">{previousProject.title}</p>
            </div>
            <ArrowLeft size={18} />
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="card p-5 flex items-center justify-between hover:bg-[color:var(--accent-soft)] transition-colors"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-1">Next Project</p>
              <p className="font-medium">{nextProject.title}</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </section>
      </div>
    </div>
  )
}
