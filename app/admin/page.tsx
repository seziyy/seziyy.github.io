'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Pencil, LogOut, Upload } from 'lucide-react'
import { projects as initialProjectData } from '@/app/projects/projectsData'
import type { Project as PortfolioProject } from '@/app/projects/projectsData'

const ADMIN_PASSWORD = 'admin123'

type ProjectDraft = {
  slug: string
  label: string
  title: string
  shortDescription: string
  description: string
  technologies: string
  github: string
  demo: string
  image: string
  year: string
  role: string
  status: PortfolioProject['status']
  documents: string
  highlights: string
}

type Blog = {
  id: number
  title: string
  summary: string
  url: string
  date: string
}

type GalleryItem = {
  id: number
  title: string
  category: string
  image: string
}

type TabKey = 'projects' | 'blog' | 'gallery'
type GalleryCategory = 'drawings' | 'designs' | 'notes' | 'moments'
type GalleryAllResponse = { files?: { path: string; name: string }[] }

const initialProjects: PortfolioProject[] = initialProjectData

const initialBlogs: Blog[] = [
  {
    id: 1,
    title: 'August 2025 Newsletter',
    summary: 'AI innovations, productivity, and lessons from recent launches.',
    url: 'https://medium.com/@halesezin',
    date: '2025-08-25',
  },
]

const galleryCategoryLabel: Record<GalleryCategory, string> = {
  drawings: 'Drawings',
  designs: 'Designs',
  notes: 'Notes',
  moments: 'Moments',
}

const getGalleryCategoryFromPath = (filePath: string) => {
  const normalizedPath = filePath.toLowerCase()

  if (normalizedPath.startsWith('drawings/')) return 'Drawings'
  if (normalizedPath.startsWith('designs/')) return 'Designs'
  if (normalizedPath.startsWith('notes/')) return 'Notes'
  if (normalizedPath.startsWith('moments/')) return 'Moments'

  return 'Gallery'
}

const toFileTitle = (fileName: string) => {
  return fileName.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
}

const toImageSrc = (src?: string) => {
  return src ? encodeURI(src) : ''
}

export default function AdminPage() {
  const [isAuthed, setIsAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('projects')

  const [projects, setProjects] = useState<PortfolioProject[]>(initialProjects)
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>({
    slug: '',
    label: '',
    title: '',
    shortDescription: '',
    description: '',
    technologies: '',
    github: '',
    demo: '',
    image: '',
    year: '',
    role: '',
    status: 'In Progress',
    documents: '',
    highlights: '',
  })
  const [projectEditingId, setProjectEditingId] = useState<number | null>(null)

  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs)
  const [blogDraft, setBlogDraft] = useState<Omit<Blog, 'id'>>({
    title: '',
    summary: '',
    url: '',
    date: '',
  })
  const [blogEditingId, setBlogEditingId] = useState<number | null>(null)

  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [galleryDraft, setGalleryDraft] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: '',
    image: '',
  })
  const [galleryEditingId, setGalleryEditingId] = useState<number | null>(null)

  const [uploadingCategory, setUploadingCategory] = useState<GalleryCategory>('moments')
  const [uploading, setUploading] = useState(false)
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [deletingImagePath, setDeletingImagePath] = useState('')
  const [galleryError, setGalleryError] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    const stored = window.localStorage.getItem('admin-auth')
    if (stored === 'true') {
      setIsAuthed(true)
    }
  }, [])

  useEffect(() => {
    if (!isAuthed) return

    const loadGallery = async () => {
      setGalleryLoading(true)
      setGalleryError('')

      try {
        const response = await fetch('/api/gallery/all')

        if (!response.ok) {
          throw new Error('Galeri fotograflari yuklenemedi')
        }

        const payload = (await response.json()) as GalleryAllResponse
        const files = payload.files ?? []

        const nextGallery = files.map((entry, index) => ({
          id: index + 1,
          title: toFileTitle(entry.name) || `Photo ${index + 1}`,
          category: getGalleryCategoryFromPath(entry.path),
          image: `/gallery/${entry.path}`,
        }))

        setGallery(nextGallery)
      } catch (error) {
        setGalleryError(error instanceof Error ? error.message : 'Galeri yuklenemedi')
      } finally {
        setGalleryLoading(false)
      }
    }

    void loadGallery()
  }, [isAuthed])

  const stats = useMemo(() => {
    return [
      { label: 'Projects', value: projects.length },
      { label: 'Blog posts', value: blogs.length },
      { label: 'Gallery items', value: gallery.length },
    ]
  }, [projects.length, blogs.length, gallery.length])

  const handleLogin = () => {
    if (password.trim() === ADMIN_PASSWORD) {
      window.localStorage.setItem('admin-auth', 'true')
      setIsAuthed(true)
      setError('')
      setPassword('')
      return
    }
    setError('Sifre yanlis. Tekrar deneyin.')
  }

  const handleLogout = () => {
    window.localStorage.removeItem('admin-auth')
    setIsAuthed(false)
  }

  const resetProjectDraft = () => {
    setProjectDraft({
      slug: '',
      label: '',
      title: '',
      shortDescription: '',
      description: '',
      technologies: '',
      github: '',
      demo: '',
      image: '',
      year: '',
      role: '',
      status: 'In Progress',
      documents: '',
      highlights: '',
    })
    setProjectEditingId(null)
  }

  const resetBlogDraft = () => {
    setBlogDraft({ title: '', summary: '', url: '', date: '' })
    setBlogEditingId(null)
  }

  const resetGalleryDraft = () => {
    setGalleryDraft({ title: '', category: '', image: '' })
    setGalleryEditingId(null)
  }

  const handleGalleryUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', files[0])
      formData.append('category', uploadingCategory)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setGalleryDraft({
        title: files[0].name.split('.')[0],
        category: galleryCategoryLabel[uploadingCategory],
        image: data.path,
      })

      setGallery((prev) => {
        const alreadyExists = prev.some((item) => item.image === data.path)
        if (alreadyExists) return prev

        const nextId = prev.length ? Math.max(...prev.map((item) => item.id)) + 1 : 1
        return [
          {
            id: nextId,
            title: files[0].name.split('.')[0],
            category: galleryCategoryLabel[uploadingCategory],
            image: data.path,
          },
          ...prev,
        ]
      })
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const upsertProject = () => {
    if (!projectDraft.title.trim()) return

    const parsedDocuments = projectDraft.documents
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [titlePart, hrefPart] = line.split('|').map((part) => part.trim())
        return {
          title: titlePart || 'Project PDF',
          href: hrefPart || titlePart,
        }
      })
      .filter((item) => Boolean(item.href))

    const nextProject: PortfolioProject = {
      id: projectEditingId ?? (projects.length ? Math.max(...projects.map((item) => item.id)) + 1 : 1),
      slug: (projectDraft.slug || projectDraft.title)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, ''),
      label: projectDraft.label.trim() || 'Project',
      title: projectDraft.title.trim(),
      shortDescription: projectDraft.shortDescription.trim(),
      description: projectDraft.description.trim(),
      technologies: projectDraft.technologies
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
      github: projectDraft.github.trim(),
      demo: projectDraft.demo.trim(),
      image: projectDraft.image.trim(),
      year: projectDraft.year.trim(),
      role: projectDraft.role.trim(),
      status: projectDraft.status,
      documents: parsedDocuments,
      highlights: projectDraft.highlights
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
    }

    if (projectEditingId) {
      setProjects((prev) => prev.map((item) => (item.id === projectEditingId ? nextProject : item)))
    } else {
      setProjects((prev) => [...prev, nextProject])
    }
    resetProjectDraft()
  }

  const upsertBlog = () => {
    if (!blogDraft.title.trim()) return
    if (blogEditingId) {
      setBlogs((prev) =>
        prev.map((item) => (item.id === blogEditingId ? { ...item, ...blogDraft } : item))
      )
    } else {
      const nextId = blogs.length ? Math.max(...blogs.map((b) => b.id)) + 1 : 1
      setBlogs((prev) => [...prev, { id: nextId, ...blogDraft }])
    }
    resetBlogDraft()
  }

  const upsertGallery = () => {
    if (!galleryDraft.title.trim()) return
    if (!galleryDraft.image.trim()) return

    setGalleryError('')
    if (galleryEditingId) {
      setGallery((prev) =>
        prev.map((item) =>
          item.id === galleryEditingId ? { ...item, ...galleryDraft } : item
        )
      )
    } else {
      const nextId = gallery.length ? Math.max(...gallery.map((g) => g.id)) + 1 : 1
      setGallery((prev) => [...prev, { id: nextId, ...galleryDraft }])
    }
    resetGalleryDraft()
  }

  const deleteGalleryImage = async (item: GalleryItem) => {
    setDeletingImagePath(item.image)
    setGalleryError('')

    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagePath: item.image }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Fotograf silinemedi')
      }

      setGallery((prev) => prev.filter((entry) => entry.id !== item.id))

      if (galleryEditingId === item.id) {
        resetGalleryDraft()
      }
    } catch (error) {
      setGalleryError(error instanceof Error ? error.message : 'Fotograf silinemedi')
    } finally {
      setDeletingImagePath('')
    }
  }

  if (!isAuthed) {
    return (
      <div className="min-h-screen pt-28 px-6 pb-20">
        <div className="max-w-md mx-auto card p-8">
          <h1 className="text-3xl font-display">Admin Giris</h1>
          <p className="mt-2 text-[color:var(--muted)]">
            Demo paneli goruntulemek icin sifre girin.
          </p>
          <div className="mt-6 space-y-4">
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sifre"
              className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg text-[color:var(--ink)] placeholder-[color:var(--muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
            />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="button"
              onClick={handleLogin}
              className="w-full bg-[color:var(--accent)] text-white py-3 rounded-lg font-semibold hover:bg-[color:var(--accent-strong)] transition-colors"
            >
              Giris Yap
            </button>
            <p className="text-xs text-[color:var(--muted)]">Demo sifre: admin123</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Admin Panel</p>
            <h1 className="text-4xl font-display mt-3">Icerik yonetimi</h1>
            <p className="text-[color:var(--muted)] mt-2">
              Projeler, blog ve galeri verilerini hizlica guncelleyin.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[color:var(--stroke)] text-[color:var(--muted)] hover:text-[color:var(--ink)]"
          >
            <LogOut size={16} />
            Cikis
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label} className="card px-4 py-4">
              <p className="text-sm text-[color:var(--muted)]">{stat.label}</p>
              <p className="text-xl font-semibold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {(
            [
              { key: 'projects', label: 'Projeler' },
              { key: 'blog', label: 'Blog' },
              { key: 'gallery', label: 'Galeri' },
            ] as { key: TabKey; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2 rounded-full border transition-colors ${
                activeTab === tab.key
                  ? 'bg-[color:var(--accent)] text-white border-[color:var(--accent)]'
                  : 'border-[color:var(--stroke)] text-[color:var(--muted)] hover:text-[color:var(--ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'projects' && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,1.2fr]">
            <div className="card p-6">
              <h2 className="text-xl font-semibold">Proje ekle / duzenle</h2>
              <div className="mt-4 space-y-3">
                <input
                  value={projectDraft.slug}
                  onChange={(event) => setProjectDraft({ ...projectDraft, slug: event.target.value })}
                  placeholder="Slug"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={projectDraft.title}
                  onChange={(event) => setProjectDraft({ ...projectDraft, title: event.target.value })}
                  placeholder="Baslik"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={projectDraft.label}
                  onChange={(event) => setProjectDraft({ ...projectDraft, label: event.target.value })}
                  placeholder="Etiket (MCP Project / API Project)"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={projectDraft.shortDescription}
                  onChange={(event) =>
                    setProjectDraft({ ...projectDraft, shortDescription: event.target.value })
                  }
                  placeholder="Kisa aciklama"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <textarea
                  value={projectDraft.description}
                  onChange={(event) =>
                    setProjectDraft({ ...projectDraft, description: event.target.value })
                  }
                  placeholder="Detayli aciklama"
                  rows={5}
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={projectDraft.technologies}
                  onChange={(event) =>
                    setProjectDraft({ ...projectDraft, technologies: event.target.value })
                  }
                  placeholder="Teknolojiler (virgulle)"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={projectDraft.github}
                  onChange={(event) => setProjectDraft({ ...projectDraft, github: event.target.value })}
                  placeholder="GitHub linki"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={projectDraft.demo}
                  onChange={(event) => setProjectDraft({ ...projectDraft, demo: event.target.value })}
                  placeholder="Demo linki"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={projectDraft.image}
                  onChange={(event) => setProjectDraft({ ...projectDraft, image: event.target.value })}
                  placeholder="Gorsel yolu"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    value={projectDraft.year}
                    onChange={(event) => setProjectDraft({ ...projectDraft, year: event.target.value })}
                    placeholder="Yil"
                    className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                  />
                  <input
                    value={projectDraft.role}
                    onChange={(event) => setProjectDraft({ ...projectDraft, role: event.target.value })}
                    placeholder="Rol"
                    className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                  />
                  <select
                    value={projectDraft.status}
                    onChange={(event) =>
                      setProjectDraft({
                        ...projectDraft,
                        status: event.target.value as PortfolioProject['status'],
                      })
                    }
                    className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <textarea
                  value={projectDraft.documents}
                  onChange={(event) =>
                    setProjectDraft({ ...projectDraft, documents: event.target.value })
                  }
                  placeholder="Dokumanlar: Baslik | /projects/file.pdf\nHer satir bir dokuman"
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <textarea
                  value={projectDraft.highlights}
                  onChange={(event) =>
                    setProjectDraft({ ...projectDraft, highlights: event.target.value })
                  }
                  placeholder="One cikanlar, her satir bir madde"
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={upsertProject}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--accent)] text-white"
                  >
                    <Plus size={16} />
                    {projectEditingId ? 'Guncelle' : 'Ekle'}
                  </button>
                  {projectEditingId ? (
                    <button
                      type="button"
                      onClick={resetProjectDraft}
                      className="px-4 py-2 rounded-lg border border-[color:var(--stroke)]"
                    >
                      Iptal
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <p className="text-sm text-[color:var(--muted)] mt-1">{project.shortDescription}</p>
                      <p className="text-xs text-[color:var(--muted)] mt-2">
                        {project.technologies.join(', ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setProjectDraft({
                            slug: project.slug,
                            label: project.label,
                            title: project.title,
                            shortDescription: project.shortDescription,
                            description: project.description,
                            technologies: project.technologies.join(', '),
                            github: project.github ?? '',
                            demo: project.demo ?? '',
                            image: project.image,
                            year: project.year,
                            role: project.role,
                            status: project.status,
                            documents: (project.documents ?? [])
                              .map((item) => `${item.title} | ${item.href}`)
                              .join('\n'),
                            highlights: project.highlights.join('\n'),
                          })
                          setProjectEditingId(project.id)
                        }}
                        className="p-2 rounded-lg border border-[color:var(--stroke)]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setProjects((prev) => prev.filter((item) => item.id !== project.id))}
                        className="p-2 rounded-lg border border-[color:var(--stroke)] text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-[color:var(--muted)]">
                    <span>{project.year}</span>
                    <span>•</span>
                    <span>{project.role}</span>
                    <span>•</span>
                    <span>{project.status}</span>
                  </div>
                  {project.documents && project.documents.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {project.documents.map((document) => (
                        <a
                          key={document.href}
                          className="link text-sm inline-flex"
                          href={document.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {document.title}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'blog' && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,1.2fr]">
            <div className="card p-6">
              <h2 className="text-xl font-semibold">Blog yazisi ekle / duzenle</h2>
              <div className="mt-4 space-y-3">
                <input
                  value={blogDraft.title}
                  onChange={(event) => setBlogDraft({ ...blogDraft, title: event.target.value })}
                  placeholder="Baslik"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <textarea
                  value={blogDraft.summary}
                  onChange={(event) => setBlogDraft({ ...blogDraft, summary: event.target.value })}
                  placeholder="Ozet"
                  rows={3}
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={blogDraft.url}
                  onChange={(event) => setBlogDraft({ ...blogDraft, url: event.target.value })}
                  placeholder="URL"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <input
                  value={blogDraft.date}
                  onChange={(event) => setBlogDraft({ ...blogDraft, date: event.target.value })}
                  placeholder="Tarih (YYYY-MM-DD)"
                  className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={upsertBlog}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--accent)] text-white"
                  >
                    <Plus size={16} />
                    {blogEditingId ? 'Guncelle' : 'Ekle'}
                  </button>
                  {blogEditingId ? (
                    <button
                      type="button"
                      onClick={resetBlogDraft}
                      className="px-4 py-2 rounded-lg border border-[color:var(--stroke)]"
                    >
                      Iptal
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {blogs.map((post) => (
                <div key={post.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-sm text-[color:var(--muted)] mt-1">{post.summary}</p>
                      <p className="text-xs text-[color:var(--muted)] mt-2">{post.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setBlogDraft({
                            title: post.title,
                            summary: post.summary,
                            url: post.url,
                            date: post.date,
                          })
                          setBlogEditingId(post.id)
                        }}
                        className="p-2 rounded-lg border border-[color:var(--stroke)]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlogs((prev) => prev.filter((item) => item.id !== post.id))}
                        className="p-2 rounded-lg border border-[color:var(--stroke)] text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  {post.url ? (
                    <a className="link text-sm mt-3 inline-flex" href={post.url}>
                      {post.url}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'gallery' && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1fr,1.2fr]">
            <div className="card p-6 space-y-8">
              <div>
                <h2 className="text-xl font-semibold">Fotograf yukle</h2>
                <div className="mt-4 space-y-3">
                  {galleryLoading && <p className="text-sm text-[color:var(--muted)]">Galeri yukleniyor...</p>}
                  {galleryError && <p className="text-sm text-red-600">{galleryError}</p>}
                  <div>
                    <label className="block text-sm font-medium text-[color:var(--ink)] mb-2">Kategori sec</label>
                    <select
                      value={uploadingCategory}
                      onChange={(event) => setUploadingCategory(event.target.value as GalleryCategory)}
                      className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                    >
                      <option value="moments">Moments</option>
                      <option value="drawings">Drawings</option>
                      <option value="designs">Designs</option>
                      <option value="notes">Notes</option>
                    </select>
                  </div>
                  <div className="border-2 border-dashed border-[color:var(--stroke)] rounded-lg p-6 text-center hover:border-[color:var(--accent)] transition-colors cursor-pointer">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleGalleryUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <Upload size={24} className="text-[color:var(--muted)]" />
                        <p className="text-sm font-medium">Fotograf sec</p>
                        <p className="text-xs text-[color:var(--muted)]">JPG, PNG, WebP vb.</p>
                      </div>
                    </label>
                  </div>
                  {uploading && <p className="text-sm text-[color:var(--muted)]">Yuklemede...</p>}
                  {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
                  {galleryDraft.image && (
                    <div className="bg-[color:var(--accent-soft)] p-3 rounded-lg">
                      <p className="text-xs text-[color:var(--muted)] mb-1">Yuklenecek: {galleryDraft.image}</p>
                      <img src={toImageSrc(galleryDraft.image)} alt="preview" className="w-full max-h-48 object-cover rounded" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold">Galeri ogesi ekle / duzenle</h2>
                <div className="mt-4 space-y-3">
                  <input
                    value={galleryDraft.title}
                    onChange={(event) => setGalleryDraft({ ...galleryDraft, title: event.target.value })}
                    placeholder="Baslik"
                    className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                  />
                  <input
                    value={galleryDraft.category}
                    onChange={(event) => setGalleryDraft({ ...galleryDraft, category: event.target.value })}
                    placeholder="Drawing / Designs / Notes / Moments"
                    className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                  />
                  {!galleryDraft.image && (
                    <>
                      <p className="text-xs text-[color:var(--muted)]">
                        Alternatively, use an existing image path from public/gallery categories.
                      </p>
                      <input
                        value={galleryDraft.image}
                        onChange={(event) => setGalleryDraft({ ...galleryDraft, image: event.target.value })}
                        placeholder="Gorsel yolu (opsiyonel)"
                        className="w-full px-4 py-3 bg-white border border-[color:var(--stroke)] rounded-lg"
                      />
                    </>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={upsertGallery}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[color:var(--accent)] text-white"
                    >
                      <Plus size={16} />
                      {galleryEditingId ? 'Guncelle' : 'Ekle'}
                    </button>
                    {galleryEditingId ? (
                      <button
                        type="button"
                        onClick={resetGalleryDraft}
                        className="px-4 py-2 rounded-lg border border-[color:var(--stroke)]"
                      >
                        Iptal
                      </button>
                    ) : null}
                    {galleryDraft.image && !galleryEditingId && (
                      <button
                        type="button"
                        onClick={() => setGalleryDraft({ title: '', category: '', image: '' })}
                        className="px-4 py-2 rounded-lg border border-[color:var(--stroke)]"
                      >
                        Temizle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {gallery.map((item) => (
                <div key={item.id} className="card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-[color:var(--muted)] mt-1">{item.category}</p>
                      <p className="text-xs text-[color:var(--muted)] mt-2">{item.image}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setGalleryDraft({
                            title: item.title,
                            category: item.category,
                            image: item.image,
                          })
                          setGalleryEditingId(item.id)
                        }}
                        className="p-2 rounded-lg border border-[color:var(--stroke)]"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteGalleryImage(item)}
                        disabled={deletingImagePath === item.image}
                        className="p-2 rounded-lg border border-[color:var(--stroke)] text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {!galleryLoading && gallery.length === 0 && (
                <div className="card p-5 text-sm text-[color:var(--muted)]">Galeride henuz fotograf yok.</div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
