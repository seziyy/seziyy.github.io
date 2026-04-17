'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[color:var(--paper)]/90 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl font-semibold font-display"
            >
              Hale Sezin Özorman
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
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
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[color:var(--muted)] hover:text-[color:var(--ink)] p-2"
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
          className="md:hidden bg-[color:var(--paper)]/95 backdrop-blur-md"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
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
                    className="block px-3 py-2 rounded-md text-base font-medium text-[color:var(--muted)] hover:text-[color:var(--ink)]"
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
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
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
              className="block px-3 py-2 rounded-md text-base font-semibold bg-[color:var(--accent)] text-white"
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
