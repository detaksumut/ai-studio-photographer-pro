'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'Fitur', href: '/#fitur' },
  { label: 'Cara Kerja', href: '/#cara-kerja' },
  { label: 'Paket', href: '/#paket' },
  { label: 'Studio', href: '/studio' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-white/[0.06] py-3 shadow-lg shadow-black/20'
          : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0" id="nav-logo">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-sm tracking-tight">AI</span>
          </div>
          <span
            className="font-bold text-white text-lg leading-none hidden sm:block"
            style={{ fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
          >
            Studio<span className="gradient-text">Pro</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm font-medium text-[#94a3b8] hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/studio"
            className="text-sm text-[#94a3b8] hover:text-white transition-colors px-3 py-2"
            id="nav-login"
          >
            Masuk
          </Link>
          <Link
            href="/studio"
            id="nav-cta"
            className="px-5 py-2.5 rounded-xl btn-primary text-sm font-bold inline-flex items-center gap-1.5"
          >
            ✨ Coba Gratis
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2 rounded-lg glass border border-white/10"
          aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
          id="nav-mobile-toggle"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileOpen && (
        <div
          className="md:hidden glass border-t border-white/[0.06] px-4 py-4 space-y-1 animate-fade-in"
          id="nav-mobile-menu"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/5 text-sm font-medium transition-all"
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/[0.06]">
            <Link
              href="/studio"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-5 py-3 rounded-xl btn-primary text-sm font-bold"
            >
              ✨ Coba Gratis Sekarang
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
