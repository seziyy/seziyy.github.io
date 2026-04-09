import type { Metadata } from 'next'
import { Playfair_Display, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Hale Sezin Özorman - Portfolio',
  description: 'Modern minimalist portfolio showcasing my work and experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${playfair.variable} antialiased`}>
        <div className="app-shell">
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="border-t border-[color:var(--stroke)] mt-24">
            <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-[color:var(--muted)]">© 2026 Hale Sezin Özorman</p>
                <p className="text-xs text-[color:var(--muted)]">Software engineer and product builder.</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <a className="link" href="https://github.com/seziyy" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a className="link" href="https://www.linkedin.com/in/hale-sezin-%C3%B6-1b5aa9254/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a className="link" href="mailto:halesezin@gmail.com">Email</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
