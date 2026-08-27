'use client'

import { motion } from 'framer-motion'
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying'
import GitHubActivity from '@/components/GitHubActivity'
import AboutSection from '@/components/AboutSection'
import AboutSlider from '@/components/AboutSlider'

const latestProject = {
  title: 'Go to GitHub profile',
  description: 'From idea to demo: a rapid prototype exploring AI-driven shopping flows.',
  link: 'https://github.com/seziyy',
}

const latestBlog = {
  title: 'Medium Profile',
  description: 'No AI, just write manually.',
  link: 'https://medium.com/@halesezin',
}

const prompts = [
  'Tell me about your next product idea',
  'Which stack fits my project?',
  'How can we ship faster?',
  'Let’s build a lean MVP together',
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="px-4 pb-12 pt-24 sm:px-6 sm:pb-16 sm:pt-28">
        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[1.2fr,0.8fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Software Engineer</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-display leading-[1.02] text-balance sm:text-5xl md:text-6xl lg:text-7xl">
              You can call me Hale or Meowseziyy?
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--muted)] sm:mt-6 sm:text-lg sm:leading-8">
              Full stack developer with hands-on experience in frontend, mobile, backend, and blockchain  actively building since 2nd year of university.
              <br />
              <br />
              🏆 Selected as one of 45 people from all of Turkey for Turkcell's Geleceği Yazanlar program
              <br />
              ⛓️ Competed at Sui Move Hackathon, Ankara Blitz, Istanbul Blitz, and Izmir Blitz hackathons
              <br />
              🚀 Built production-grade projects across Web3, mobile, MCP and REST APIs 
              <br />
              🌍 Based in Antalya, Turkey 
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="card p-5 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[color:var(--accent-soft)] text-lg text-[color:var(--accent-strong)] font-display sm:h-16 sm:w-16 sm:text-xl">
                HS
              </div>
              <div className="min-w-0">
                <p className="text-sm text-[color:var(--muted)]">Currently</p>
                <p className="text-base font-semibold leading-snug sm:text-lg">Building product-led experiences</p>
              </div>
            </div>
            <div className="mt-6">
              <p className="text-sm text-[color:var(--muted)]">About me</p>
              <p className="mt-2 text-[color:var(--ink)]">
                Curious, ambitious, and driven by a constant “why not?”
              </p>
            </div>
            <div className="mt-6">
              <AboutSlider />
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-6 lg:grid-cols-2">
          <div className="card p-5 sm:p-6">
            <h2 className="text-2xl font-display">Latest Project</h2>
            <p className="mt-3 text-[color:var(--muted)]">{latestProject.description}</p>
            <a href={latestProject.link} target="_blank" rel="noopener noreferrer" className="inline-flex mt-5 text-sm font-semibold link">
              {latestProject.title} →
            </a>
          </div>
          <div className="card p-5 sm:p-6">
            <h2 className="text-2xl font-display">Latest Blog</h2>
            <p className="mt-3 text-[color:var(--muted)]">{latestBlog.description}</p>
            <a
              href={latestBlog.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-5 text-sm font-semibold link"
            >
              {latestBlog.title} →
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="mx-auto grid max-w-6xl gap-4 sm:gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <AboutSection />
          <div className="space-y-4 sm:space-y-6">
            <SpotifyNowPlaying />
            <GitHubActivity />
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="card mx-auto max-w-6xl p-5 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-display sm:text-3xl">How can I help you?</h2>
              <p className="mt-2 text-[color:var(--muted)]">Quick prompts to start a conversation.</p>
            </div>
            <a
              href="/#contact"
              className="inline-flex w-full justify-center rounded-full bg-[color:var(--accent)] px-5 py-3 font-semibold text-white sm:w-auto"
            >
              Get in touch
            </a>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {prompts.map((prompt) => (
              <div key={prompt} className="rounded-2xl border border-[color:var(--stroke)] px-4 py-3 text-sm">
                {prompt}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[color:var(--muted)]">AI may make mistakes. Double-check important info.</p>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 px-4 pb-16 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Contact</p>
            <h2 className="mt-3 text-3xl font-display sm:text-4xl">Let's Connect</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="https://www.linkedin.com/in/hale-sezin-%C3%B6-1b5aa9254/"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 transition-colors hover:border-[color:var(--accent)] sm:p-6"
            >
              <p className="font-semibold">LinkedIn</p>
              <p className="text-sm text-[color:var(--muted)] mt-2">Connect professionally</p>
            </a>
            <a
              href="https://x.com/meowseziyy"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 transition-colors hover:border-[color:var(--accent)] sm:p-6"
            >
              <p className="font-semibold">X (Twitter)</p>
              <p className="text-sm text-[color:var(--muted)] mt-2">Follow my thoughts</p>
            </a>
            <a
              href="mailto:halesezin@gmail.com"
              className="card p-5 transition-colors hover:border-[color:var(--accent)] sm:p-6"
            >
              <p className="font-semibold">Email</p>
              <p className="text-sm text-[color:var(--muted)] mt-2">Direct message</p>
            </a>
            <a
              href="https://github.com/seziyy"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 transition-colors hover:border-[color:var(--accent)] sm:p-6"
            >
              <p className="font-semibold">GitHub</p>
              <p className="text-sm text-[color:var(--muted)] mt-2">Check my code</p>
            </a>
            <a
              href="https://medium.com/@halesezin"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 transition-colors hover:border-[color:var(--accent)] sm:p-6"
            >
              <p className="font-semibold">Medium</p>
              <p className="text-sm text-[color:var(--muted)] mt-2">Read my articles</p>
            </a>
            <a
              href="https://www.instagram.com/seziyy"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 transition-colors hover:border-[color:var(--accent)] sm:p-6"
            >
              <p className="font-semibold">Instagram</p>
              <p className="text-sm text-[color:var(--muted)] mt-2">Daily updates</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
