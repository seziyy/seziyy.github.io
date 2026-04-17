import type { Project } from '@/app/projects/projectsData'

export const PROJECTS_STORAGE_KEY = 'admin-projects'

export const normalizeImagePath = (value: string) => {
  const normalized = value.trim().replace(/\\/g, '/').replace(/^\/?public\//i, '/')

  if (!normalized) return ''
  if (normalized.startsWith('/')) return normalized
  return `/${normalized}`
}

type SanitizeOptions = {
  fallbackProjects?: Project[]
  ensureSlugs?: string[]
}

export const sanitizeStoredProjects = (
  storedProjects: Project[],
  options: SanitizeOptions = {}
) => {
  const { fallbackProjects = [], ensureSlugs = [] } = options
  const seen = new Set<string>()
  const unique: Project[] = []

  for (const project of storedProjects) {
    const normalizedSlug = project.slug.trim().toLowerCase()
    if (!normalizedSlug || seen.has(normalizedSlug)) continue

    seen.add(normalizedSlug)
    unique.push({
      ...project,
      slug: normalizedSlug,
      image: normalizeImagePath(project.image),
    })
  }

  for (const slug of ensureSlugs) {
    const normalizedSlug = slug.trim().toLowerCase()
    if (!normalizedSlug || seen.has(normalizedSlug)) continue

    const fallbackProject = fallbackProjects.find((project) => project.slug === normalizedSlug)
    if (!fallbackProject) continue

    seen.add(normalizedSlug)
    unique.push({
      ...fallbackProject,
      image: normalizeImagePath(fallbackProject.image),
    })
  }

  const changed = JSON.stringify(storedProjects) !== JSON.stringify(unique)

  return { projects: unique, changed }
}
