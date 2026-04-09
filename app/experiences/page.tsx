'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Calendar, ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

type ExperienceImage = {
  src: string
  alt: string
}

type Experience = {
  id: number
  title: string
  company: string
  location: string
  period: string
  summary: string
  details: string
  technologies: string[]
  images: ExperienceImage[]
}

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Blockchain-Project Engineering Intern',
    company: 'BuilderMare',
    location: 'Ankara, Turkiye · Hybrid',
    period: 'December 2025 · now',
    summary: 'I contributed to frontend tasks, gaining hands-on experience with blockchain technologies and project engineering.',
    details:
      'I worked in a product-focused environment where I turned design requirements into reusable UI blocks, improved component consistency, and contributed to feature planning sessions. This role strengthened my practical knowledge of modern web workflows and blockchain project operations.',
    technologies: ['C#', '.NET', 'Teamwork', 'MCP ', 'API Development'],
    images: [
      { src: '/experiences/buildermare/aaa3.jpeg', alt: 'BuilderMare project workspace' },
      { src: '/experiences/buildermare/aa2.jpeg', alt: 'BuilderMare team collaboration' },
      { src: '/experiences/buildermare/aa1.jpeg', alt: 'BuilderMare engineering process' },
    ],
  },

  {
    id: 2,
    title: 'Engineering Intern',
    company: 'SAN TSG',
    location: 'Antalya, Turkiye · On-site',
    period: 'Aug 2025 - Sep 2025 · 2 months',
    summary: 'Actively participated in engineering processes and collaborated with technical teams on problem-solving focused tasks.',
    details:
      'During this internship, I followed end-to-end implementation tasks, participated in technical reviews, and improved communication across multidisciplinary teams. I gained confidence in transforming requirements into practical engineering outcomes.',
    technologies: ['C#', '.NET', 'Teamwork', 'MCP ', 'API Development'],
    images: [
      { src: '/experiences/san-tsg/xd2.jpeg', alt: 'SAN TSG office environment' },
      { src: '/experiences/san-tsg/xd3.jpeg', alt: 'SAN TSG engineering activity' },
      { src: '/experiences/san-tsg/xd4.jpeg', alt: 'SAN TSG internship moments' },
    ],
  },
  {
    id: 3,
    title: 'Intern',
    company: 'BusinessUp!',
    location: 'Mugla, Turkiye · Remote',
    period: 'Jan 2025 - Apr 2025 · 4 months',
    summary:
      'During my time at BusinessUp, I learned key Meta and SEO concepts, improved my R&D skills, broadened my design perspective, and gained deeper insight into company culture.',
    details:
      'I contributed to growth-oriented content and campaign workflows, supported research tasks, and observed how strategic planning impacts digital performance. This experience helped me connect technical production with business and user outcomes.',
    technologies: ['E-commerce', 'R&D', 'Meta Ads', 'SEO'],
    images: [ { src: '/experiences/businessup/bus.jpeg', alt: 'BusinessUp office environment'} ],
  },
  {
    id: 4,
    title: 'Volunteer Software Engineer',
    company: 'Egebarkod',
    location: 'Mugla, Turkiye · On-site',
    period: 'Mar 2024 - Dec 2024 · 10 months',
    summary:
      'At Egebarkod, with the support of my engineering mentors, I built a strong foundation in software development and delivered projects using C# (AspNetCore), HTML-CSS, and JavaScript.',
    details:
      'This role became my practical starting point as a full-stack developer. I learned by building real features, fixing bugs with mentors, and working with production-minded habits such as code structure, maintainability, and incremental improvements.',
    technologies: ['HTML5', 'C#', 'JavaScript', 'Asp.NetCore'],
    images: [{ src: '/experiences/egebarkod/xd.jpeg', alt: 'Egebarkod software development environment' }],
  },
]

export default function ExperiencesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(experiences[0]?.id ?? null)
  const [imageIndexes, setImageIndexes] = useState<Record<number, number>>({})

  const getActiveImageIndex = (experienceId: number, imageCount: number) => {
    const current = imageIndexes[experienceId] ?? 0
    if (imageCount === 0) return 0
    return ((current % imageCount) + imageCount) % imageCount
  }

  const goToPreviousImage = (experienceId: number, imageCount: number) => {
    if (imageCount === 0) return
    setImageIndexes((current) => {
      const currentIndex = current[experienceId] ?? 0
      return {
        ...current,
        [experienceId]: (currentIndex - 1 + imageCount) % imageCount,
      }
    })
  }

  const goToNextImage = (experienceId: number, imageCount: number) => {
    if (imageCount === 0) return
    setImageIndexes((current) => {
      const currentIndex = current[experienceId] ?? 0
      return {
        ...current,
        [experienceId]: (currentIndex + 1) % imageCount,
      }
    })
  }

  return (
    <div className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Experience</p>
          <h1 className="text-5xl font-display mt-4 mb-4">
            My Experience
          </h1>
          <p className="text-[color:var(--muted)] text-lg">
            Professional experiences and roles I have taken throughout my career
          </p>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, index) => {
            const visibleImages = exp.images.filter((image) => Boolean(image.src.trim()))
            const hasImages = visibleImages.length > 0
            const activeImage = hasImages
              ? visibleImages[getActiveImageIndex(exp.id, visibleImages.length)]
              : null

            return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setExpandedId((current) => (current === exp.id ? null : exp.id))}
              className="card p-8 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{exp.title}</h2>
                  <div className="flex items-center space-x-2 text-[color:var(--accent-strong)] mb-2">
                    <Briefcase size={18} />
                    <span className="font-medium">{exp.company}</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-1 mt-2 md:mt-0">
                  <div className="flex items-center space-x-2 text-[color:var(--muted)] text-sm">
                    <Calendar size={16} />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[color:var(--muted)] text-sm">
                    <MapPin size={16} />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-[color:var(--muted)] mb-4">{exp.summary}</p>

              {expandedId === exp.id && (
                <div
                  className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,1fr]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                    <div className="relative rounded-xl overflow-hidden bg-[color:var(--accent-soft)] h-64 sm:h-72 md:h-80">
                      {activeImage ? (
                        <img
                          src={activeImage.src}
                          alt={activeImage.alt ?? exp.title}
                          className="h-full w-full object-cover"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center px-6 text-center text-[color:var(--muted)]">
                          No image yet for this experience.
                        </div>
                      )}

                      {visibleImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => goToPreviousImage(exp.id, visibleImages.length)}
                          aria-label="Previous image"
                          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white border border-white/20"
                        >
                          <ChevronLeft size={18} />
                        </button>
                      )}

                      {visibleImages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => goToNextImage(exp.id, visibleImages.length)}
                          aria-label="Next image"
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white border border-white/20"
                        >
                          <ChevronRight size={18} />
                        </button>
                      )}

                      {visibleImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                          {visibleImages.map((image, imageIndex) => (
                            <button
                              key={image.src}
                              type="button"
                              aria-label={`Go to image ${imageIndex + 1}`}
                              onClick={() =>
                                setImageIndexes((current) => ({
                                  ...current,
                                  [exp.id]: imageIndex,
                                }))
                              }
                              className={`h-2.5 rounded-full transition-all ${
                                getActiveImageIndex(exp.id, visibleImages.length) === imageIndex
                                  ? 'w-6 bg-white'
                                  : 'w-2.5 bg-white/55'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-[color:var(--muted)]">
                      Add your images to: public/experiences/{exp.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-5">
                    <h3 className="text-lg font-semibold mb-3">Experience Details</h3>
                    <p className="text-[color:var(--muted)] leading-relaxed">{exp.details}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
