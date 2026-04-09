'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Code2 } from 'lucide-react'
import { projects } from '@/app/projects/projectsData'

export default function ProjectsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Projects</p>
          <h1 className="text-5xl font-display mt-4 mb-4">
            My Projects
          </h1>
          <p className="text-[color:var(--muted)] text-lg">
            I have built a variety of projects across different domains, including Web3, mobile applications, and full-stack web development. Here are some highlights of my projects:
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index: number) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => router.push(`/projects/${project.slug}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  router.push(`/projects/${project.slug}`)
                }
              }}
              role="button"
              tabIndex={0}
              className="card overflow-hidden cursor-pointer"
            >
              {/* Project Image */}
              <div className="aspect-[16/9] bg-[color:var(--accent-soft)] flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={project.image}
                  alt={`${project.title} cover`}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-6">
                <p className="uppercase tracking-[0.2em] text-[11px] text-[color:var(--muted)] mb-2">
                  {project.label}
                </p>
                <h2 className="text-2xl font-semibold mb-3">{project.title}</h2>
                <p className="text-[color:var(--muted)] mb-4">{project.shortDescription}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech: string) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-xs rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-4">
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="flex items-center space-x-2 text-[color:var(--muted)] hover:text-[color:var(--ink)] transition-colors"
                      >
                        <Github size={20} />
                        <span className="text-sm">GitHub</span>
                      </a>
                    ) : null}
                    {project.demo ? (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => event.stopPropagation()}
                        className="flex items-center space-x-2 text-[color:var(--accent-strong)] hover:text-[color:var(--accent)] transition-colors"
                      >
                        <ExternalLink size={20} />
                        <span className="text-sm">Demo</span>
                      </a>
                    ) : null}
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    onClick={(event) => event.stopPropagation()}
                    className="flex items-center gap-2 rounded-full border border-[color:var(--stroke)] px-4 py-2 text-sm text-[color:var(--ink)] hover:bg-[color:var(--accent-soft)] transition-colors"
                  >
                    <Code2 size={16} />
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
