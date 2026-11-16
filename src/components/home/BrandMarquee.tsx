'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Brands on the shelf: a navy band with one row of brand names running as a loop.
 * GSAP drives the row as a seamless loop; scrolling speeds it up, then it eases back to
 * its cruising speed. The green "+" marks spin, the band eases in as it enters, and names light
 * up white on hover. Label and row share one left margin.
 */
export default function BrandMarquee({ brands }: { brands: string[] }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!brands.length) return
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Each row holds the list twice, so sliding by half its width loops seamlessly.
        const loops = q('.bm-row').map((row, i) => {
          const dir = i % 2 ? 1 : -1
          gsap.set(row, { xPercent: dir === 1 ? -50 : 0 })
          return gsap.to(row, {
            xPercent: dir === 1 ? 0 : -50,
            duration: 38 + i * 8,
            ease: 'none',
            repeat: -1,
          })
        })

        // Scroll velocity speeds the rows up, then they ease back to cruising speed.
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = 1 + gsap.utils.clamp(0, 6, Math.abs(self.getVelocity()) / 250)
            loops.forEach((t) => {
              gsap.killTweensOf(t)
              t.timeScale(boost)
              gsap.to(t, { timeScale: 1, duration: 1.2, ease: 'power2.out' })
            })
          },
        })

        // The dot grid drifts slowly sideways.
        const drift = gsap.fromTo(
          q('.bm-dots'),
          { backgroundPosition: '0px 0px' },
          { backgroundPosition: '-240px 0px', duration: 30, ease: 'none', repeat: -1 },
        )

        // The "+" marks spin slowly.
        const spin = gsap.to(q('.bm-plus'), { rotate: 360, duration: 6, ease: 'none', repeat: -1 })

        // Entrance: label slides in, rows rise and fade up.
        const intro = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'top 85%', once: true },
        })
        intro
          .from(q('.bm-label'), { x: -30, opacity: 0, duration: 0.6, ease: 'power3.out' })
          .from(
            q('.bm-track'),
            { y: 30, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'expo.out' },
            0.1,
          )

        return () => {
          st.kill()
          spin.kill()
          drift.kill()
          loops.forEach((t) => t.kill())
        }
      })
    },
    { scope: root, dependencies: [brands.length] },
  )

  if (!brands.length) return null

  return (
    <div
      ref={root}
      id="brands"
      aria-label="Brands we stock"
      className="theme-dark relative overflow-hidden border-y border-white/10 py-10"
    >
      {/* Faint white dot grid, as on the other navy panels */}
      <div
        aria-hidden
        className="bm-dots pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.1)_1.4px,transparent_1.6px)] [background-size:24px_24px]"
      />
      <p className="bm-label label relative mx-auto mb-6 max-w-[1840px] px-5 !text-leaf md:px-10">
        Brands on the shelf
      </p>
      <p className="sr-only">{brands.join(', ')}</p>

      {/* Rows sit inside the same margin as the label, so both start on one left edge */}
      <div className="mx-auto max-w-[1840px] px-5 md:px-10">
        <div
          aria-hidden
          className="relative flex flex-col gap-3 overflow-hidden [mask-image:linear-gradient(90deg,#000,#000_94%,transparent)]"
        >
          {[brands].map((list, r) => (
            <div key={r} className="bm-track">
              <div className="bm-row flex w-max">
                {[...list, ...list].map((b, i) => (
                  <span
                    key={i}
                    className={`group flex items-center gap-10 pe-10 font-display font-semibold tracking-[-0.02em] text-[clamp(1.25rem,2.2vw,1.9rem)] text-white/85`}
                  >
                    <span className="transition-colors duration-300 hover:text-white">{b}</span>
                    <span className="bm-plus inline-block font-bold text-leaf">+</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
