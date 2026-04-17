'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, MapPin } from 'lucide-react'

type IEEEEvent = {
  id: number
  title: string
  date: string
  location: string
  track: string
  summary: string
  images: string[]
}

const ieeeEvents: IEEEEvent[] = [
  {
    id: 1,
    title: 'CS - Algorithm 101',
    date: '16 Oct',
    location: 'Mugla',
    track: 'CS',
    summary: 'An introductory session focused on algorithmic thinking, problem decomposition, and practical examples for beginners.',
    images: ['/ieee/algoritma101.jfif'],
  },
  {
    id: 2,
    title: 'CS - Python 101',
    date: '6 Nov',
    location: 'Mugla',
    track: 'CS',
    summary: 'A fundamentals workshop covering Python syntax, control flow, and clean coding habits.',
    images: ['/ieee/python101.jfif'],
  },
  {
    id: 3,
    title: 'CS - Python 102',
    date: '3 Dec',
    location: 'Mugla',
    track: 'CS',
    summary: 'A continuation of Python 101 with deeper practice on functions, collections, and mini exercises.',
    images: ['/ieee/python101-2.jfif'],
  },
  {
    id: 4,
    title: 'CS - Python 103',
    date: 'TBA',
    location: 'Mugla',
    track: 'CS',
    summary: 'An advanced follow-up session that builds on Python 102 with more practice and stronger coding patterns.',
    images: ['/ieee/python103.jfif'],
  },
  {
    id: 5,
    title: 'CS - CS PEAK',
    date: '20 Dec',
    location: 'Mugla',
    track: 'CS',
    summary: 'A high-energy technical meetup bringing students together around CS topics and collaboration.',
    images: ['/ieee/cspeak1.jfif', '/ieee/cspeak2.jfif', '/ieee/cspeak3.jfif'],
  },
  {
    id: 6,
    title: 'CS - Cyber 101',
    date: '2 Feb',
    location: 'Mugla',
    track: 'CS',
    summary: 'An introduction to cybersecurity concepts, common threats, and security-first thinking.',
    images: ['/ieee/siber.jfif'],
  },
  {
    id: 7,
    title: 'CS - Graphic Design',
    date: '24 Feb',
    location: 'Mugla',
    track: 'CS',
    summary: 'A creative session on visual communication basics, layout principles, and digital design workflow.',
    images: ['/ieee/grafik.jfif'],
  },
  {
    id: 8,
    title: 'CS - Technopark Diaries',
    date: '6 Mar',
    location: 'Mugla',
    track: 'CS',
    summary: 'A conversational event sharing real-world experiences from startup and technopark environments.',
    images: ['/ieee/technodays.jfif'],
  },
  {
    id: 9,
    title: 'Meeting with President Gonca',
    date: '22 Apr',
    location: 'Mugla',
    track: 'Community',
    summary: 'A community-focused gathering to discuss goals, growth, and student engagement opportunities.',
    images: ['/ieee/gonca.jfif'],
  },
  {
    id: 10,
    title: 'Kariyer-In Mugla',
    date: '3-4 May',
    location: 'Mugla',
    track: 'Career',
    summary: 'A two-day career event connecting students with professionals and practical career insights.',
    images: ['/ieee/kariyerin25.jfif'],
  },
  {
    id: 11,
    title: 'CS Day',
    date: '21 May',
    location: 'Mugla',
    track: 'CS',
    summary: 'A celebratory CS event featuring talks, sharing sessions, and community networking moments.',
    images: ['/ieee/csday.jfif'],
  },
]

export default function IEEEPage() {
  const [expandedId, setExpandedId] = useState<number | null>(ieeeEvents[0]?.id ?? null)
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  return (
    <div className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Experience</p>
          <h1 className="text-5xl font-display mt-4 mb-4">IEEE Activities</h1>
          <p className="text-[color:var(--muted)] text-lg">
            Events and technical sessions I joined within IEEE.
          </p>
        </motion.div>

        <div className="space-y-6">
          {ieeeEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => setExpandedId((current) => (current === event.id ? null : event.id))}
              className="card p-6 cursor-pointer"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                  <span className="inline-flex px-3 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-sm rounded-full">
                    {event.track}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center space-x-2 text-[color:var(--muted)] text-sm">
                    <Calendar size={16} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[color:var(--muted)] text-sm">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              {expandedId === event.id && (
                <div
                  className="mt-6 grid gap-6 lg:grid-cols-[1.1fr,1fr]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-4">
                    <div className={`grid gap-3 ${event.images.length > 1 ? 'sm:grid-cols-3' : 'grid-cols-1'}`}>
                      {event.images.map((image, imageIndex) => (
                        <button
                          key={`${event.id}-${image}`}
                          type="button"
                          onClick={() => setSelectedImage({ src: image, alt: `${event.title} ${imageIndex + 1}` })}
                          className="relative overflow-hidden rounded-xl bg-[color:var(--accent-soft)] h-64 sm:h-72 md:h-80"
                          aria-label={`Open ${event.title} image ${imageIndex + 1}`}
                        >
                          <img
                            src={image}
                            alt={`${event.title} ${imageIndex + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                            onError={(ev) => {
                              ev.currentTarget.style.display = 'none'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-5">
                    <h3 className="text-lg font-semibold mb-3">Quick Summary</h3>
                    <p className="text-[color:var(--muted)] leading-relaxed">{event.summary}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 p-4 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white border border-white/25"
            >
              Close
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full max-h-[88vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}
