"use client"

import Image from 'next/image'
import { Briefcase, Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

export default function BlockchainPage() {
  return (
    <div className="min-h-screen pt-28 px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="uppercase tracking-[0.2em] text-xs text-[color:var(--muted)]">Experience</p>
          <h1 className="text-5xl font-display mt-4 mb-4">Blockchain</h1>
          <p className="text-[color:var(--muted)] text-lg">
            Blockchain and HALE 
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="card p-8 transition-transform duration-300 hover:scale-[1.01]"
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Turkish version only. Loading English version...wait for it.</h2>
            </div>

            <div className="flex flex-col space-y-1 mt-2 md:mt-0">
            </div>
          </div>

          <p className="text-[color:var(--muted)] mb-6">
            I have compiled this content with a clear yet impactful explanation of the relationship between cryptology, mathematical algorithms, and blockchain security. The visual card provides a quick preview, while the PDF that opens upon clicking contains more comprehensive explanations.
          </p>

          <div className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
            <a
              href="/blockchain/sen-20-yasinda-yapiyordun.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-[color:var(--stroke)] bg-white p-4 block"
            >
              <div className="relative rounded-xl overflow-hidden bg-[color:var(--accent-soft)] h-64 sm:h-72 md:h-80">
                <Image
                  src="/blockchain/kripto.jpeg"
                  alt="Kriptoloji nedir blockchain gorseli"
                  width={1080}
                  height={1080}
                  priority
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white border border-white/20">
                  PDF'i Ac
                </span>
              </div>
              <p className="mt-3 text-xs text-[color:var(--muted)]">
                Dosya: public/blockchain/sen-20-yasinda-yapiyordun.pdf
              </p>
            </a>

            <div className="rounded-2xl border border-[color:var(--stroke)] bg-white p-5">
              <h3 className="text-lg font-semibold mb-3">Experience Details</h3>
              <p className="text-[color:var(--muted)] leading-relaxed">
                Bu icerikte kriptoloji, matematiksel algoritmalar ve blokzincir guvenligi arasindaki
                iliskiyi sade ama etkili bir anlatimla derledim. Gorsel kart, hizli onizleme sunar;
                tiklama sonrasi acilan PDF ise daha kapsamli aciklamalari icerir.
              </p>
              <a
                href="/blockchain/sen-20-yasinda-yapiyordun.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex mt-5 px-4 py-2 rounded-full text-sm font-semibold bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] transition-colors"
              >
                PDF'i Yeni Sekmede Ac
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {['Cryptography', 'Blockchain', 'Security', 'Research', 'Presentation'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)] text-sm rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
