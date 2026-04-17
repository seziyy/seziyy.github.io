'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Github, ExternalLink, Code2 } from 'lucide-react'
import { projects as initialProjects } from '@/app/projects/projectsData'
import type { Project } from '@/app/projects/projectsData'

const PROJECTS_STORAGE_KEY = 'admin-projects'
const builtInProjectSlugs = new Set(initialProjects.map((project) => project.slug))

const normalizeImagePath = (value: string) => {
  const normalized = value.trim().replace(/\\/g, '/').replace(/^\/?public\//i, '/')

  if (!normalized) return ''
  if (normalized.startsWith('/')) return normalized
  return `/${normalized}`
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  useEffect(() => {
    const storedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (!storedProjects) return

    try {
      const parsedProjects = JSON.parse(storedProjects) as Project[]
      if (Array.isArray(parsedProjects) && parsedProjects.length > 0) {
        setProjects(
          parsedProjects.map((project) => ({
            ...project,
            image: normalizeImagePath(project.image),
          }))
        )
      }
    } catch {
      window.localStorage.removeItem(PROJECTS_STORAGE_KEY)
    }
  }, [])

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
              onClick={
                builtInProjectSlugs.has(project.slug)
                  ? () => router.push(`/projects/${project.slug}`)
                  : undefined
              }
              onKeyDown={
                builtInProjectSlugs.has(project.slug)
                  ? (event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        router.push(`/projects/${project.slug}`)
                      }
                    }
                  : undefined
              }
              role={builtInProjectSlugs.has(project.slug) ? 'button' : undefined}
              tabIndex={builtInProjectSlugs.has(project.slug) ? 0 : undefined}
              className={`card overflow-hidden ${
                builtInProjectSlugs.has(project.slug) ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {/* Project Image */}
              <div className="aspect-[16/9] bg-[color:var(--accent-soft)] flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={normalizeImagePath(project.image)}
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

                  {builtInProjectSlugs.has(project.slug) ? (
                    <Link
                      href={`/projects/${project.slug}`}
                      onClick={(event) => event.stopPropagation()}
                      className="flex items-center gap-2 rounded-full border border-[color:var(--stroke)] px-4 py-2 text-sm text-[color:var(--ink)] hover:bg-[color:var(--accent-soft)] transition-colors"
                    >
                      <Code2 size={16} />
                      Details
                    </Link>
                  ) : (
                    <span className="flex items-center gap-2 rounded-full border border-[color:var(--stroke)] px-4 py-2 text-sm text-[color:var(--muted)]">
                      <Code2 size={16} />
                      Details unavailable
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
