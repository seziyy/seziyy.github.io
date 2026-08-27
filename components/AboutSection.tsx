'use client'

import { motion } from 'framer-motion'

interface AboutSectionProps {
  className?: string
}

export default function AboutSection({ className = '' }: AboutSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={`card p-5 sm:p-8 ${className}`}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">About Me</p>
        <h2 className="text-3xl md:text-4xl font-display mt-3">Hale Sezin Özorman</h2>
        <div className="space-y-4 text-[color:var(--muted)] mt-5">
          <p className="text-base leading-relaxed">
            Co-Chairwoman of IEEE MSKU STUDENT BRANCH | IEEE CS TR SAC Aegean Region Manager
          </p>
          <p className="text-base leading-relaxed">
            I was born on February 8, 2003. I am from Antalya. I lived in Ankara
            for 7 years and in Adana for 10 years.
          </p>
          <p className="text-base leading-relaxed">
            My favorite activity is playing League of Legends (main: Neeko). I love singing and dancing.
            When I was a child, I wanted to be a fashion designer. Maybe I will be in the future, who knows?
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          {['C', 'C# ( .NET )', 'React', 'Flutter','Solidity', 'Python', 'Java', 'JavaScript', 'Html-css' , 'Move', 'Rust' , ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]"
            >
              {skill}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
