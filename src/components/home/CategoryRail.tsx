'use client'

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import type { CategoryWithCount } from '@/lib/cms'
import type { MediaIndex } from '@/lib/media'
import Media from '../Media'
import { enter } from '@/lib/enter'
import { categoryHref, keyForCms } from '@/lib/catalogue'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const clamp01 = gsap.utils.clamp(0, 1)

/**
 * Category reel (desktop): the section pins and the track slides sideways. The card nearest the
 * centre comes into focus (full size, full colour, count ticking up) while the others recede; photos
 * drift against the track for parallax, the track leans with scroll speed, and a giant ghost of the
 * focused category's name slides behind. Cards deal in from the right as the section arrives.
 * Small screens get a swipeable snap rail with cards revealing as they enter.
 */
export default function CategoryRail({
  categories,
  media,
  totalActive,
  id = 'aisles',
  label = 'All categories',
  title,
  total,
}: {
  categories: CategoryWithCount[]
  media: MediaIndex
  totalActive: number
  /** Section id; change it when the reel is used more than once on a page. */
  id?: string
  label?: string
  /** Heading; defaults to "<n> aisles. One order." */
  title?: string
  /** Number the counter runs up to; defaults to the number of cards. */
  total?: number
}) {
  const root = useRef<HTMLElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const ghost = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const n = categories.length
  // Counter runs 01 → total with scroll progress (total can exceed the cards shown).
  const steps = total ?? n
  const [step, setStep] = useState(1)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        const el = root.current!
        const cards = gsap.utils.toArray<HTMLElement>('.rail-card', el)
        const deals = gsap.utils.toArray<HTMLElement>('.rail-deal', el)
        const photos = gsap.utils.toArray<HTMLElement>('.rail-photo', el)
        const texts = gsap.utils.toArray<HTMLElement>('.rail-text', el)
        const counts = gsap.utils.toArray<HTMLElement>('.rail-count', el)
        const shown = new Set<number>()
        const skew = gsap.quickTo(track.current, 'skewX', { duration: 0.5, ease: 'power3' })
        const dist = () => Math.max(0, track.current!.scrollWidth - viewport.current!.clientWidth)
        let last = -1

        // Heading rises word by word, cards deal in from the right, once.
        const split = SplitText.create(heading.current, { type: 'words', mask: 'words' })
        const intro = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top 70%', once: true },
        })
        enter(
          intro,
          split.words,
          { yPercent: 110 },
          { duration: 1.1, stagger: 0.06, ease: 'expo.out' },
          0,
        )
        enter(
          intro,
          deals.slice(0, 5),
          { xPercent: 60, opacity: 0, rotate: 3 },
          { duration: 1.1, stagger: 0.07, ease: 'expo.out' },
          0.15,
        )

        const focus = () => {
          const vw = window.innerWidth
          let best = 0
          let bestD = Infinity
          cards.forEach((card, i) => {
            const r = card.getBoundingClientRect()
            const d = r.left + r.width / 2 - vw / 2
            const f = 1 - clamp01(Math.abs(d) / (vw * 0.5))
            card.style.setProperty('--f', f.toFixed(3))
            photos[i].style.transform = `translateX(${(-d * 0.08).toFixed(1)}px) scale(1.18)`
            photos[i].style.filter = `saturate(${(0.35 + 0.65 * f).toFixed(2)})`
            texts[i].style.opacity = (0.45 + 0.55 * f).toFixed(2)
            if (Math.abs(d) < bestD) {
              bestD = Math.abs(d)
              best = i
            }
            // Tick the product count up the first time a card comes into focus.
            if (f > 0.6 && !shown.has(i)) {
              shown.add(i)
              const target = Number(counts[i].dataset.value)
              const o = { v: 0 }
              gsap.to(o, {
                v: target,
                duration: 1.2,
                ease: 'power3.out',
                onUpdate: () => (counts[i].textContent = String(Math.round(o.v))),
              })
            }
          })
          if (best !== last) {
            last = best
            setActive(best)
            gsap.fromTo(
              ghost.current,
              { yPercent: 12, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.6, ease: 'power3.out', overwrite: true },
            )
          }
        }

        gsap.to(track.current, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              skew(gsap.utils.clamp(-5, 5, self.getVelocity() / -400))
              if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
              setStep(Math.round(self.progress * (steps - 1)) + 1)
            },
          },
        })
        // Focus follows the (smoothed) track position, not the raw scroll.
        gsap.ticker.add(focus)
        focus()

        return () => {
          gsap.ticker.remove(focus)
          split.revert()
        }
      })
    },
    { scope: root, dependencies: [n, steps] },
  )

  const current = categories[active]

  return (
    <section id={id} ref={root} aria-label={label} className="theme-light relative overflow-hidden">
      {/* Ghost of the focused category's name, sliding behind the reel */}
      <div
        ref={ghost}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[6%] hidden select-none whitespace-nowrap px-10 font-display text-[clamp(7rem,17vw,16rem)] font-extrabold leading-none tracking-[-0.05em] text-mist min-[900px]:motion-safe:block"
      >
        {current?.name}
      </div>

      <div className="relative flex flex-col justify-center gap-10 py-20 min-[900px]:min-h-svh min-[900px]:py-24">
        <div className="mx-auto w-full max-w-[1840px] px-5 text-left md:px-10">
          <div>
            <p className="label !text-leaf-deep">{label}</p>
            <h2
              ref={heading}
              className="rail-title mt-3 text-[clamp(2.2rem,4.4vw,4.6rem)] font-bold leading-[0.95] tracking-[-0.035em] min-[900px]:whitespace-nowrap"
            >
              {title ?? `${n} aisles. One order.`}
            </h2>
          </div>
          <div className="mt-4 flex w-full max-w-sm flex-col items-start gap-3">
            <p className="font-mono text-sm text-slate">{totalActive} active products</p>
            <div className="hidden w-full items-center gap-3 font-mono text-xs tabular-nums text-slate min-[900px]:motion-safe:flex">
              <span className="text-ink">{String(step).padStart(2, '0')}</span>
              <div className="relative h-px flex-1 bg-line">
                <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-leaf" />
              </div>
              <span>{String(steps).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div
          ref={viewport}
          className="max-[899px]:snap-x max-[899px]:snap-mandatory max-[899px]:overflow-x-auto max-[899px]:pb-2"
        >
          <div
            ref={track}
            className="flex w-max gap-5 px-5 will-change-transform md:px-10 min-[900px]:gap-7 min-[900px]:px-[calc(50vw-clamp(125px,12vw,160px))]"
          >
            {categories.map((c, i) => (
              // Three layers so transforms never fight: GSAP deals in the article, Motion reveals the
              // middle layer on small screens, and the focus scale lives on the inner card.
              <article
                key={c.id}
                className="rail-deal w-[78vw] max-w-[320px] shrink-0 snap-start min-[900px]:w-[clamp(250px,24vw,320px)]"
              >
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  <div
                    data-slug={c.slug}
                    className="rail-card flex origin-bottom flex-col gap-3 min-[900px]:[transform:scale(calc(0.86+0.14*var(--f,1)))]"
                  >
                    <a
                      href={categoryHref(keyForCms(c.slug))}
                      className="group relative block aspect-[4/5] overflow-hidden rounded-[22px] shadow-[0_24px_60px_-28px_rgba(28,42,92,calc(0.45*var(--f,0)))]"
                    >
                      <div className="rail-photo absolute inset-0 will-change-transform">
                        <Media
                          asset={media[`categories/${c.slug}`]}
                          slot={`categories/${c.slug}`}
                          alt={`${c.name}: ${c.blurb ?? ''}`}
                          eager={i < 4}
                        />
                      </div>
                      <span className="absolute bottom-3 start-3 rounded-full bg-white/85 px-3 py-1.5 text-sm font-semibold opacity-0 backdrop-blur transition group-hover:opacity-100 group-focus-visible:opacity-100">
                        See products →
                      </span>
                    </a>
                    <div className="rail-text flex flex-col gap-1.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <h3 className="text-2xl font-bold tracking-[-0.02em]">{c.name}</h3>
                        <span className="font-mono text-sm tabular-nums text-leaf-deep">
                          <span className="rail-count" data-value={c.count}>
                            {c.count}
                          </span>
                        </span>
                      </div>
                      {c.blurb && <p className="text-[15px] leading-snug text-slate">{c.blurb}</p>}
                    </div>
                  </div>
                </motion.div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
