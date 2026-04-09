'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const bioSlides = [
  {
    lang: 'EN',
    points: [
      'Curious, ambitious, and driven by a strong "why not?" mindset.',
      'Analytical while coding, bold while ideating, and balanced between discipline and creative chaos.',
      'Shows natural leadership instincts and takes initiative when direction is needed.',
      'Does not avoid difficult work and is energized by challenging problems.',
      'In one sentence: A builder who keeps leveling up with every problem solved.',
    ],
  },
  {
    lang: 'EN',
    points: [
      'Curious, ambitious, and driven by a constant "why not?".',
      'Analytical when coding, bold when creating ideas — disciplined with a touch of creative chaos.',
      'Has natural leadership instincts, doesn\'t fade into the crowd, and takes the wheel when needed.',
      'Doesn\'t avoid hard problems; actually prefers them a bit challenging.',
      'One-liner: Someone who upgrades their potential every time a problem shows up.',
    ],
  },
]

export default function AboutSlider() {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  // Automatic slide transition
  useEffect(() => {
    if (!autoplay) return

    const timer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % bioSlides.length)
    }, 8000)

    return () => clearTimeout(timer)
  }, [current, autoplay])

  const goToSlide = (index: number) => {
    setCurrent(index)
    setAutoplay(false)
    // Re-enable autoplay after 2 seconds
    const timer = setTimeout(() => setAutoplay(true), 2000)
    return () => clearTimeout(timer)
  }

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % bioSlides.length)
    setAutoplay(false)
    const timer = setTimeout(() => setAutoplay(true), 2000)
    return () => clearTimeout(timer)
  }

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + bioSlides.length) % bioSlides.length)
    setAutoplay(false)
    const timer = setTimeout(() => setAutoplay(true), 2000)
    return () => clearTimeout(timer)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Slider Container */}
      <div className="relative card p-6 min-h-[240px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Language Badge */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-xs rounded-full border border-[color:var(--stroke)] font-semibold">
                English
              </span>
            </div>

            {/* Bio Points */}
            <div className="space-y-3">
              {bioSlides[current].points.map((point, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="text-[color:var(--muted)] text-sm leading-relaxed"
                >
                  • {point}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goPrev}
            className="p-2 rounded-lg border border-[color:var(--stroke)] text-[color:var(--muted)] hover:text-[color:var(--ink)] transition-colors"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goNext}
            className="p-2 rounded-lg border border-[color:var(--stroke)] text-[color:var(--muted)] hover:text-[color:var(--ink)] transition-colors"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Dot Indicators */}
        <div className="flex items-center space-x-2">
          {bioSlides.map((_, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => goToSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === current
                  ? 'bg-[color:var(--accent)] w-6'
                  : 'bg-[color:var(--stroke)] hover:bg-[color:var(--accent-soft)]'
              }`}
            />
          ))}
        </div>

        {/* Autoplay Indicator */}
        <div className="text-xs text-[color:var(--muted)] flex items-center space-x-1">
          <motion.span
            animate={{ opacity: autoplay ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 1, repeat: autoplay ? Infinity : 0 }}
            className="w-2 h-2 rounded-full bg-[color:var(--accent)]"
          />
          <span>{autoplay ? 'Auto' : 'Manual'}</span>
        </div>
      </div>
    </div>
  )
}
