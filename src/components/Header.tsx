'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { CategoryWithCount } from '@/lib/cms'
import { chapterHash } from '@/lib/chapters'

/** `page` links are absolute; the rest are homepage sections. */
const LINKS = [
  { href: '#catalogue', label: 'Products' },
  { href: '/about', label: 'About', page: true },
  { href: '/who-we-are', label: 'Who we are', page: true },
  { href: chapterHash('Our industrial solutions'), label: 'Solutions' },
  { href: chapterHash('Frequently asked questions'), label: 'FAQ' },
  { href: '/contact', label: 'Contact', page: true },
]
const hrefFor = (l: (typeof LINKS)[number], home: string) => (l.page ? l.href : home + l.href)

export function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className="transition-transform group-hover:translate-x-0.5"
    >
      <path
        d="M3 8h10m-4-4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** `home` is set on inner pages ("/") so section links and the logo go back to the homepage. */
export default function Header({
  categories,
  home = '',
}: {
  categories: CategoryWithCount[]
  home?: string
}) {
  const [open, setOpen] = useState(false)
  // Glass gets a touch more frost once the page has scrolled under it.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* Full-width navy bar with the brand section's faint white dot grid; a soft shadow once the page scrolls under it. */}
      <div
        className={`pointer-events-auto border-b border-white/10 bg-ink bg-[radial-gradient(rgb(255_255_255/0.1)_1.4px,transparent_1.6px)] text-white transition-shadow duration-500 [background-size:24px_24px] ${
          scrolled ? 'shadow-[0_10px_40px_-18px_rgba(0,0,0,0.55)]' : 'shadow-none'
        }`}
      >
        <div className="mx-auto flex max-w-[1840px] items-center gap-5 px-5 py-2.5 md:px-10">
          {/* The logo is navy, so it sits on a small white tab on the navy bar */}
          <a href={home || '#top'} aria-label="Klen Plus home" className="shrink-0 rounded-lg bg-white px-2 py-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/klen-plus-logo.png"
              alt="Klen Plus"
              width={246}
              height={100}
              className="h-7 w-auto md:h-8"
            />
          </a>
          <nav
            aria-label="Main"
            className="ms-auto hidden gap-7 text-[15px] font-medium text-white/80 md:flex"
          >
            {LINKS.map((l) => (
              <a key={l.href} href={hrefFor(l, home)} className="transition hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href="#quote"
            className="group ms-auto hidden items-center gap-2 rounded-xl bg-leaf px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-leaf-deep md:ms-0 md:flex"
          >
            Request a quote <Arrow />
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="ms-auto rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold md:hidden"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="glass-bar pointer-events-auto mx-3 mt-2 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-24px_rgba(28,42,92,0.4)] md:hidden"
          >
            <ul className="flex flex-col gap-3 text-lg font-semibold">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={hrefFor(l, home)} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="rounded-full border border-line px-3 py-1.5 text-sm text-slate"
                >
                  {c.name} <span className="font-mono text-xs text-leaf-deep">{c.count}</span>
                </li>
              ))}
            </ul>
            <a
              href="#quote"
              onClick={() => setOpen(false)}
              className="mt-5 flex justify-center rounded-xl bg-leaf px-4 py-3 font-semibold text-white"
            >
              Request a quote
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
