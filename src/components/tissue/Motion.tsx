'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/**
 * The page's <main>, plus one GSAP pass that drives every scroll effect from data attributes, so the
 * sections only mark what moves (Lenis, set up in SmoothScroll, keeps ScrollTrigger in step):
 *
 * - `data-sheet`     section rises from a card into a full-width sheet (scale + corner radius, scrubbed)
 * - `data-split`     heading words slide up out of masks; `data-split="load"` plays on page load
 * - `data-lines`     paragraph lines slide up out of masks
 * - `data-rise`      fades and rises (batched, so neighbours stagger)
 * - `data-stagger`   its children deal in one after another
 * - `data-reveal`    frame wipes open from its centre as it scrolls in (scrubbed)
 * - `data-parallax`  image drifts inside its frame (value = travel in %, scrubbed)
 * - `data-marquee`   row slides sideways with the scroll (value = direction, 1 or -1)
 * - `data-draw`      line grows from the start edge with the scroll
 * - `data-count`     number counts up from zero once
 * - `data-spin`      turns slowly with the scroll
 */
export default function TissueMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const q = gsap.utils.selector(el)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        q('[data-sheet]').forEach((s) =>
          gsap.fromTo(
            s,
            { scale: 0.94, borderTopLeftRadius: 80, borderTopRightRadius: 80 },
            {
              scale: 1,
              borderTopLeftRadius: 36,
              borderTopRightRadius: 36,
              ease: 'none',
              scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 25%', scrub: true },
            },
          ),
        )

        q('[data-split]').forEach((h) => {
          const split = SplitText.create(h, { type: 'words', mask: 'words' })
          const onLoad = h.dataset.split === 'load'
          gsap.from(split.words, {
            yPercent: 115,
            rotate: 4,
            duration: 1.2,
            stagger: 0.06,
            ease: 'expo.out',
            delay: onLoad ? 0.35 : 0,
            scrollTrigger: onLoad ? undefined : { trigger: h, start: 'top 85%', once: true },
          })
        })

        q('[data-lines]').forEach((p) => {
          const split = SplitText.create(p, { type: 'lines', mask: 'lines' })
          gsap.from(split.lines, {
            yPercent: 105,
            duration: 1.1,
            stagger: 0.08,
            ease: 'expo.out',
            scrollTrigger: { trigger: p, start: 'top 88%', once: true },
          })
        })

        const rising = q('[data-rise]')
        gsap.set(rising, { opacity: 0, y: 40 })
        ScrollTrigger.batch(rising, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', overwrite: true }),
        })

        q('[data-stagger]').forEach((g) =>
          gsap.from(g.children, {
            y: 70,
            opacity: 0,
            rotate: (i) => (i % 2 ? 2 : -2),
            duration: 1.2,
            stagger: 0.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: g, start: 'top 85%', once: true },
          }),
        )

        // Value = corner radius kept while it opens (default 28px; "50%" for circles).
        q('[data-reveal]').forEach((f) => {
          const r = f.dataset.reveal || '28px'
          gsap.fromTo(
            f,
            { clipPath: `inset(14% 12% 14% 12% round ${r})` },
            {
              clipPath: `inset(0% 0% 0% 0% round ${r})`,
              ease: 'none',
              scrollTrigger: { trigger: f, start: 'top 98%', end: 'top 50%', scrub: true },
            },
          )
        })

        q('[data-parallax]').forEach((img) => {
          const amt = Number(img.dataset.parallax) || 10
          gsap.fromTo(
            img,
            { yPercent: -amt, scale: 1 + amt / 40 },
            {
              yPercent: amt,
              ease: 'none',
              scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })

        q('[data-marquee]').forEach((row) => {
          const dir = Number(row.dataset.marquee) || 1
          gsap.fromTo(
            row,
            { xPercent: dir > 0 ? 0 : -25 },
            {
              xPercent: dir > 0 ? -25 : 0,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
            },
          )
        })

        q('[data-draw]').forEach((line) =>
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: { trigger: line.parentElement, start: 'top 80%', end: 'bottom 55%', scrub: 0.5 },
            },
          ),
        )

        q('[data-count]').forEach((n) => {
          const to = Number(n.dataset.count) || 0
          const c = { v: 0 }
          n.textContent = '0'
          gsap.to(c, {
            v: to,
            duration: 1.6,
            ease: 'power3.out',
            onUpdate: () => (n.textContent = String(Math.round(c.v)).padStart(n.dataset.pad ? 2 : 1, '0')),
            scrollTrigger: { trigger: n, start: 'top 90%', once: true },
          })
        })

        q('[data-spin]').forEach((s) =>
          gsap.to(s, {
            rotate: Number(s.dataset.spin) || 120,
            ease: 'none',
            scrollTrigger: { trigger: s, start: 'top bottom', end: 'bottom top', scrub: 1 },
          }),
        )
      })

      // Fonts and images change heights after the first pass; re-measure once everything has loaded.
      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      document.fonts?.ready.then(refresh)
      return () => {
        window.removeEventListener('load', refresh)
        mm.revert()
      }
    },
    { scope: root },
  )

  return (
    <main ref={root} className="relative z-10">
      {children}
    </main>
  )
}
