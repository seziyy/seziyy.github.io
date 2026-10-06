'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

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
    title: 'Algorithm 101',
    date: '16 Oct',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'Prepared together with Yigit, this introductory session explored what algorithms are and why algorithmic thinking is an essential starting point for anyone beginning a technical career.',
    images: ['/ieee/algoritma101.jfif'],
  },
  {
    id: 2,
    title: 'Python 101',
    date: '6 Nov',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'After inviting our instructor to open the series, we held the first Python session as a strong foundation before continuing the program through peer-led learning.',
    images: ['/ieee/python101.jfif'],
  },
  {
    id: 3,
    title: 'Python 102',
    date: '3 Dec',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'A peer-led continuation of our Python series, focused on strengthening the basics through shared practice, examples, and collaborative learning.',
    images: ['/ieee/python101-2.jfif'],
  },
  {
    id: 4,
    title: 'Python 103',
    date: 'TBA',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'The third session of our Python learning series, carried forward with peer teaching to help participants build confidence through hands-on practice.',
    images: ['/ieee/python103.jfif'],
  },
  {
    id: 5,
    title: 'CS PEAK',
    date: '20 Dec',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'Organized as my first major event as CS Chair, CS PEAK brought together talks on software, informatics, blockchain, no-code tools, and artificial intelligence in a full-day conference at AKM Hall C with the IEEE MSKU team.',
    images: ['/ieee/cspeak1.jfif', '/ieee/cspeak2.jfif', '/ieee/cspeak3.jfif'],
  },
  {
    id: 6,
    title: 'Cyber 101',
    date: '2 Feb',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'Held during the school break, Cyber 101 was designed to keep our learning momentum alive through an introductory cybersecurity training focused on awareness, threats, and security-first thinking.',
    images: ['/ieee/siber.jfif'],
  },
  {
    id: 7,
    title: 'Graphic Design',
    date: '24 Feb',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'A creative and high-quality graphic design workshop led by a photographer friend I met through an event, where participants explored visual design and created impressive work of their own.',
    images: ['/ieee/grafik.jfif'],
  },
  {
    id: 8,
    title: 'Technopark Diaries',
    date: '6 Mar',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'A career-focused session featuring my friend Cem as the speaker, followed by my own reflections on a 9-month volunteer internship experience and the lessons I gained along the way.',
    images: ['/ieee/technodays.jfif'],
  },
  {
    id: 9,
    title: 'Meeting with President Gonca',
    date: '22 Apr',
    location: 'Mugla',
    track: 'Community',
    summary: 'Together with the MSKU Executive Board President and Vice President, we visited Mayor Gonca to share our upcoming technology and engineering initiatives and invite her to our event.',
    images: ['/ieee/gonca.jfif'],
  },
  {
    id: 10,
    title: 'Kariyer-In Mugla',
    date: '3-4 May',
    location: 'Mugla',
    track: 'Career',
    summary: 'We completed Kariyer-In Mugla, one of our signature events, as a two-day organization with valuable speakers, informative sessions at AKM on the first day, and a small team trip to Marmaris on the second.',
    images: ['/ieee/kariyerin25.jfif'],
  },
  {
    id: 11,
    title: 'CS Day',
    date: '21 May',
    location: 'Mugla',
    track: 'Head of Computer Society 24-25',
    summary: 'To thank my team for their dedication throughout the year, I organized a warm and joyful barbecue event where we celebrated our work, friendship, and team spirit.',
    images: ['/ieee/csday.jfif'],
  },
]

const coChairMemories = [
  '/ieee/memories/cochairs.jpg',
  '/ieee/kariyer-in-mugla-2026.jpg',
  ...Array.from({ length: 11 }, (_, index) =>
    `/ieee/memories/memory-${String(index + 1).padStart(2, '0')}.jpg`
  ),
]

type Memory = { src: string; alt: string; caption: string; summary?: string }

const albums: { id: string; chapter: string; title: string; role: string; description: string; memories: Memory[] }[] = [
  {
    id: 'co-chair', chapter: 'The community chapter · 25–26', title: 'Moments to remember',
    role: 'Co-Chair of IEEE MSKÜ 25–26',
    description: 'A few memories from my time as co-chair. The people, the teamwork, and the little moments we shared along the way.',
    memories: coChairMemories.map((src, index) => ({ src, alt: `IEEE MSKÜ co-chair memory ${index + 1}`, caption: 'Together' })),
  },
  {
    id: 'computer-society', chapter: 'The Computer Society chapter · 24–25', title: 'Learning together',
    role: 'Head of Computer Society 24–25',
    description: 'A chapter of shared learning, new ideas, and memories with the Computer Society team.',
    memories: [
      ...ieeeEvents.flatMap(event => event.images.map((src, index) => ({
        src, alt: `${event.title}, photograph ${index + 1}`, caption: event.title, summary: event.summary,
      }))),
      ...['chair', 'chair2', 'chair3', 'chair4'].map((name, index) => ({
        src: `/ieee/memories/${name}.jpg`,
        alt: `Computer Society chair memory ${index + 1}`,
        caption: 'Together',
      })),
    ],
  },
  {
    id: 'aegean-region', chapter: 'The regional chapter', title: 'Beyond the campus',
    role: 'Aegean Region Representative · IEEE CS TR SAC',
    description: 'My IEEE journey continues as Aegean Region Representative for IEEE CS TR SAC.',
    memories: ['cstr', ...Array.from({ length: 10 }, (_, index) => `cstr${index + 2}`)].map((name, index) => ({
      src: `/ieee/memories/${name}.jpg`,
      alt: `IEEE CS TR SAC memory ${index + 1}`,
      caption: 'Together',
    })),
  },
]
const allMemories = albums.flatMap(album => album.memories)

export default function IEEEPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isOpen = selectedIndex !== null
  const selectedImage = selectedIndex === null ? null : allMemories[selectedIndex]

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const moveImage = (direction: number) => {
    setSelectedIndex(current => current === null ? null : (current + direction + allMemories.length) % allMemories.length)
  }

  return (
    <div className="min-h-screen px-4 pb-12 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Experience</p>
          <h1 className="mt-3 mb-4 font-display text-4xl leading-tight sm:text-5xl">IEEE Activities</h1>
          <p className="text-lg text-[color:var(--muted)]">Leadership, shared experiences, and memories from my IEEE journey.</p>
        </motion.div>

        <div className="grid items-start gap-6 lg:grid-cols-3">
          {albums.map(album => (
            <section key={album.id} aria-labelledby={`${album.id}-heading`} className="min-w-0 rounded-[2rem] border border-[#d9c9b2] bg-[#eee4d4] px-5 py-8">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#76654f]">{album.chapter}</p>
              <h2 id={`${album.id}-heading`} className="mt-3 font-display text-3xl text-[#3e362d]">{album.title}</h2>
              <p className="mt-3 text-sm font-medium text-[#5c5144]">{album.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#76654f]">{album.description}</p>
              {album.memories.length > 0 && (
                <div className="columns-1 gap-5 px-2 py-8 sm:columns-2 lg:columns-1 xl:columns-2">
                  {album.memories.map((memory, index) => (
                    <div key={memory.src} className="mb-6 inline-block w-full break-inside-avoid">
                      <button
                        type="button"
                        onClick={() => setSelectedIndex(allMemories.indexOf(memory))}
                        className={`block w-full rounded-sm bg-[#fffdf8] p-2 pb-4 text-left shadow-[0_6px_20px_rgba(62,54,45,0.15)] transition-transform duration-300 hover:rotate-0 focus-visible:rotate-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#76654f] motion-reduce:transform-none ${index % 3 === 0 ? '-rotate-2' : index % 3 === 1 ? 'rotate-2' : '-rotate-1'}`}
                        aria-label={`Open ${memory.alt}`}
                      >
                        <img src={memory.src} alt={memory.alt} className="h-auto w-full" loading="lazy" />
                        <span className="mt-4 flex items-start justify-between gap-2 px-1 text-[10px] uppercase tracking-[0.1em] text-[#76654f]">
                          <span>{memory.caption}</span><span>{String(index + 1).padStart(2, '0')}</span>
                        </span>
                      </button>
                      {memory.summary && (
                        <details className="mt-3 px-1 text-xs leading-relaxed text-[#76654f]">
                          <summary className="cursor-pointer">The story behind it</summary>
                          <p className="mt-2">{memory.summary}</p>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-6 text-center font-display text-lg italic text-[#76654f]">
                {album.id === 'aegean-region' ? 'A new chapter in the same journey.' : 'A chapter made better by the people in it.'}
              </p>
            </section>
          ))}
        </div>
      </div>

      {selectedImage && (
        <dialog
          ref={dialogRef}
          aria-label="IEEE photo album"
          onCancel={() => setSelectedIndex(null)}
          onClick={event => { if (event.target === event.currentTarget) setSelectedIndex(null) }}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') { event.preventDefault(); moveImage(-1) }
            if (event.key === 'ArrowRight') { event.preventDefault(); moveImage(1) }
          }}
          className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none bg-black/95 p-4 text-white backdrop:bg-black/90"
        >
          <div className="mx-auto flex h-full max-w-6xl flex-col gap-4">
            <div className="flex justify-end">
              <button autoFocus type="button" onClick={() => setSelectedIndex(null)} aria-label="Close photo album" className="rounded-full border border-white/25 bg-white/15 p-3"><X size={20} /></button>
            </div>
            <img src={selectedImage.src} alt={selectedImage.alt} className="min-h-0 w-full flex-1 object-contain" />
            <div className="flex items-center justify-center gap-6 pb-2">
              <button type="button" onClick={() => moveImage(-1)} aria-label="Previous photo" className="rounded-full border border-white/25 bg-white/15 p-3"><ChevronLeft size={24} /></button>
              <p aria-live="polite" className="text-center text-sm">{selectedImage.caption}<span className="mt-1 block text-white/60">{(selectedIndex ?? 0) + 1} / {allMemories.length}</span></p>
              <button type="button" onClick={() => moveImage(1)} aria-label="Next photo" className="rounded-full border border-white/25 bg-white/15 p-3"><ChevronRight size={24} /></button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  )
}
