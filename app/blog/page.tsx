"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'

const MEDIUM_URL = 'https://medium.com/@halesezin'

export default function BlogPage() {
  useEffect(() => {
    // perform an immediate client-side redirect to Medium
    window.location.href = MEDIUM_URL
  }, [])

  return (
    <div className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Blog</p>
          <h1 className="text-4xl font-display mt-4 mb-4">My Articles</h1>
          <p className="text-[color:var(--muted)] mb-6">My blog posts are published on Medium. If the automatic redirect does not work, you can use the link below.</p>
          <a
            href={MEDIUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[color:var(--accent)] text-white rounded-full hover:bg-[color:var(--accent-strong)] transition-colors"
          >
            Read on Medium →
          </a>
        </motion.div>
      </div>
    </div>
  )
}
