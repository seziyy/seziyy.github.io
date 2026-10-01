'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Experience', path: '/experiences' },
  { name: 'Projects', path: '/projects' },
  { name: 'Blockchain', path: '/blockchain' },
  { name: 'IEEE', path: '/ieee' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Blog', path: 'https://medium.com/@halesezin', external: true },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuButton.current?.getAttribute('aria-expanded') === 'true') {
        setIsMobileMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    const desktop = window.matchMedia('(min-width: 1024px)')
    const closeOnDesktop = () => {
      if (desktop.matches) setIsMobileMenuOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen ? 'bg-[color:var(--paper)]/90 backdrop-blur-md shadow-sm' : 'bg-[color:var(--paper)]/95 lg:bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex min-w-0 items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="max-w-[calc(100vw-6rem)] truncate text-lg font-semibold font-display sm:text-xl"
            >
              Hale Sezin Özorman
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 rounded-full text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--ink)] transition-colors"
                  >
                    {item.name}
                  </motion.div>
                </a>
              ) : (
                <Link key={item.path} href={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      pathname === item.path
                        ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]'
                        : 'text-[color:var(--muted)] hover:text-[color:var(--ink)]'
                    }`}
                  >
                    {item.name}
                  </motion.div>
                </Link>
              )
            ))}
            <a
              href="/#contact"
              className="ml-2 px-4 py-2 rounded-full text-sm font-semibold bg-[color:var(--accent)] text-white hover:bg-[color:var(--accent-strong)] transition-colors"
            >
              Contact
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              type="button"
              ref={menuButton}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color:var(--stroke)] text-[color:var(--muted)] transition-colors hover:text-[color:var(--ink)]"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          id="mobile-navigation"
          className="border-b border-[color:var(--stroke)] shadow-lg max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain bg-[color:var(--paper)]/95 backdrop-blur-md lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2 px-4 pb-5 pt-2">
            {navItems.map((item) => (
              item.external ? (
                <a
                  key={item.path}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className="block px-3 py-3 rounded-xl text-base font-medium text-[color:var(--muted)] hover:text-[color:var(--ink)]"
                  >
                    {item.name}
                  </div>
                </a>
              ) : (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className={`block px-3 py-3 rounded-xl text-base font-medium ${
                      pathname === item.path
                        ? 'bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]'
                        : 'text-[color:var(--muted)] hover:text-[color:var(--ink)]'
                    }`}
                  >
                    {item.name}
                  </div>
                </Link>
              )
            ))}
            <a
              href="/#contact"
              className="col-span-2 block px-3 py-3 text-center rounded-xl text-base font-semibold bg-[color:var(--accent)] text-white"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
