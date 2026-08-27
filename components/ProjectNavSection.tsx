'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { projects as initialProjects, requiredProjectSlugs } from '@/app/projects/projectsData'
import type { Project } from '@/app/projects/projectsData'
import {
  PROJECTS_STORAGE_KEY,
  sanitizeStoredProjects,
} from '@/app/projects/projectClientUtils'

const builtInProjectSlugs = new Set(initialProjects.map((project) => project.slug))

type ProjectNavSectionProps = {
  currentSlug: string
}

const getProjectHref = (slug: string) => {
  return builtInProjectSlugs.has(slug)
    ? `/projects/${slug}`
    : `/projects/custom?slug=${encodeURIComponent(slug)}`
}

export default function ProjectNavSection({ currentSlug }: ProjectNavSectionProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  useEffect(() => {
    const storedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (!storedProjects) return

    try {
      const parsedProjects = JSON.parse(storedProjects) as Project[]
      if (Array.isArray(parsedProjects) && parsedProjects.length > 1) {
        const { projects: sanitizedProjects, changed } = sanitizeStoredProjects(parsedProjects, {
          fallbackProjects: initialProjects,
          ensureSlugs: requiredProjectSlugs,
        })

        setProjects(sanitizedProjects)

        if (changed) {
          window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(sanitizedProjects))
        }
      }
    } catch {
      window.localStorage.removeItem(PROJECTS_STORAGE_KEY)
    }
  }, [])

  const { previousProject, nextProject } = useMemo(() => {
    const fallback = {
      previousProject: initialProjects[0],
      nextProject: initialProjects[0],
    }

    if (projects.length === 0) return fallback

    const currentProjectIndex = projects.findIndex((item) => item.slug === currentSlug)
    if (currentProjectIndex === -1) {
      return {
        previousProject: projects[projects.length - 1],
        nextProject: projects[0],
      }
    }

    return {
      previousProject:
        currentProjectIndex > 0 ? projects[currentProjectIndex - 1] : projects[projects.length - 1],
      nextProject:
        currentProjectIndex < projects.length - 1 ? projects[currentProjectIndex + 1] : projects[0],
    }
  }, [currentSlug, projects])

  return (
    <section className="mt-8 grid sm:grid-cols-2 gap-4">
      <Link
        href={getProjectHref(previousProject.slug)}
        className="card p-5 flex items-center justify-between hover:bg-[color:var(--accent-soft)] transition-colors"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-1">Previous Project</p>
          <p className="font-medium">{previousProject.title}</p>
        </div>
        <ArrowLeft size={18} />
      </Link>

      <Link
        href={getProjectHref(nextProject.slug)}
        className="card p-5 flex items-center justify-between hover:bg-[color:var(--accent-soft)] transition-colors"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--muted)] mb-1">Next Project</p>
          <p className="font-medium">{nextProject.title}</p>
        </div>
        <ArrowRight size={18} />
      </Link>
    </section>
  )
}
