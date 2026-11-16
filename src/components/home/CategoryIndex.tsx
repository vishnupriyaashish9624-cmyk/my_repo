'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import type { CategoryWithCount } from '@/lib/cms'
import { CATALOGUE, categoryHref, itemsFor } from '@/lib/catalogue'
import { CategoryVector, VectorScene } from '../vectors/CategoryVector'
import { UseVector } from '../vectors/TissueVectors'
import { RANGES } from './rangeConfig'
import { Arrow } from '../Header'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Big number that counts up once it is on screen. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  useEffect(() => {
    const el = ref.current
    if (!inView || !el) return
    const show = (n: number) => (el.textContent = String(n).padStart(2, '0'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return void show(to)
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1400)
      show(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  // Server render shows the final number, so it reads correctly without JS.
  return <span ref={ref}>{String(to).padStart(2, '0')}</span>
}

/** Splits a heading into words that rise out of a mask when in view. */
function RiseWords({ text, className = '' }: { text: string; className?: string }) {
  return (
    <motion.span
      className={className}
      initial="hide"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: 0.07 }}
    >
      {text.split(' ').map((w, i) => (
        <span key={i} className="word-mask inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            variants={{ hide: { y: '110%' }, show: { y: 0 } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

const pad = (n: number) => String(n).padStart(2, '0')

/** One tile of the category grid: starts high above its slot, tilted and faded, and falls into place as `progress` goes 0 → 1. */
function FlyTile({
  progress,
  i,
  on,
  onPick,
}: {
  progress: MotionValue<number>
  i: number
  on: boolean
  onPick: (i: number) => void
}) {
  const c = CATALOGUE[i]
  const row = Math.floor(i / 7)
  // Fixed per-tile scatter (no randomness, so server and client render the same)
  const fromY = -(320 + ((i * 97) % 5) * 70 + row * 140)
  const fromX = (((i * 53) % 7) - 3) * 45
  const fromR = (((i * 37) % 9) - 4) * 9
  // Staggered window: the first row lands a little before the second
  const start = ((i * 3) % 7) * 0.05 + row * 0.12
  const end = Math.min(1, start + 0.5)
  const y = useTransform(progress, [start, end], [fromY, 0])
  const x = useTransform(progress, [start, end], [fromX, 0])
  const rotate = useTransform(progress, [start, end], [fromR, 0])
  const scale = useTransform(progress, [start, end], [0.6, 1])
  const opacity = useTransform(progress, [start, start + 0.15], [0, 1])

  return (
    <motion.button
      type="button"
      onClick={() => onPick(i)}
      aria-label={`Show ${c.short}`}
      aria-pressed={on}
      style={{ x, y, rotate, scale, opacity }}
      className={`group relative flex flex-col items-center gap-1.5 rounded-2xl px-1 py-2.5 text-center transition-colors ${
        on ? 'bg-leaf-soft' : 'hover:bg-paper'
      } ${i < 7 ? 'sm:border-b sm:border-ink/10' : ''}`}
    >
      <VectorScene drawn className="w-14 transition duration-300 group-hover:scale-110">
        <CategoryVector name={c.key} className="w-full" />
      </VectorScene>
      <span className="font-display text-[12px] font-bold leading-tight">{c.short}</span>
    </motion.button>
  )
}

/**
 * All 14 categories at a glance. While the grid scrolls up into view the icons fly down from above
 * and settle into their slots; clicking one switches the panel to that category.
 */
function FlyInGrid({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 0.55'] })
  const still = useMotionValue(1)
  const progress = reduce ? still : scrollYProgress

  return (
    <div
      ref={ref}
      className="relative mt-5 grid grid-cols-4 rounded-[24px] bg-white p-2 text-ink sm:grid-cols-7 short:hidden"
    >
      {CATALOGUE.map((c, i) => (
        <FlyTile key={c.key} progress={progress} i={i} on={i === active} onPick={onPick} />
      ))}
    </div>
  )
}

const N = CATALOGUE.length
/**
 * "What we supply": the 14 categories as buttons beside a panel. Clicking a button or an icon in the
 * grid (or arrowing through the buttons) switches the panel, which shows where the category is used,
 * all 14 categories at a glance and a "See products" card that opens the category's own page.
 */
export default function CategoryIndex({
  categories,
  images = {},
}: {
  categories: CategoryWithCount[]
  /** Still-life image per catalogue key (media/catalogue/<key>); categories without one get their vector. */
  images?: Record<string, string | undefined>
}) {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const ring = useTransform(scrollYProgress, [0, 1], [0, 220])
  const [active, setActive] = useState(0)

  const go = (i: number) => setActive(i)

  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const entry = CATALOGUE[active]
  const cms = entry.chapter ? bySlug.get(entry.chapter) : undefined
  const items = itemsFor(entry, bySlug)
  const uses = entry.uses ?? (entry.chapter ? RANGES[entry.chapter]?.uses : undefined) ?? []

  return (
    <section
      id="catalogue"
      ref={root}
      aria-labelledby="catalogue-title"
      className="relative overflow-x-clip bg-ink text-white"
    >
      <div className="theme-dark relative px-5 pb-20 pt-12 md:px-10 md:pb-28 md:pt-16">
        {/* Decorative dotted orbit ring */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <motion.svg
            style={{ rotate: ring }}
            viewBox="0 0 400 400"
            className="absolute -end-40 -top-40 hidden w-[620px] text-white/10 md:block"
          >
            <circle
              cx="200"
              cy="200"
              r="190"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 10"
              strokeLinecap="round"
            />
            <circle
              cx="200"
              cy="200"
              r="140"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="1 14"
              strokeLinecap="round"
            />
            <circle cx="200" cy="10" r="6" className="fill-leaf" />
            <circle cx="60" cy="200" r="4" className="fill-navy" />
          </motion.svg>
        </div>

        <div className="relative mx-auto grid max-w-[1840px] items-start gap-5 lg:items-stretch lg:grid-cols-[minmax(400px,32%)_1fr] lg:gap-8">
          {/* Left: heading, the 14 buttons and scroll progress */}
          <div className="flex min-w-0 flex-col">
            <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <motion.p
                  className="label !text-leaf"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  Contents · What we supply
                </motion.p>
                <h2
                  id="catalogue-title"
                  className="mt-2 text-[clamp(1.8rem,2.6vw,2.7rem)] font-bold leading-[0.98] tracking-[-0.03em]"
                >
                  <RiseWords text="Every aisle, in one catalogue." />
                </h2>
              </div>
              <div className="flex items-end gap-6">
                <div className="flex items-baseline gap-2 font-display">
                  <span className="text-[clamp(2.6rem,3.6vw,3.6rem)] font-extrabold leading-none tracking-[-0.05em] tabular-nums text-white">
                    <CountUp to={CATALOGUE.length} />
                  </span>
                  <span className="max-w-[9ch] font-mono text-xs uppercase leading-tight tracking-[0.12em] text-white/60">
                    product categories
                  </span>
                </div>
              </div>
            </header>
            {/* Showcase: the active category's photo in a rounded frame, crossfading with a slow zoom */}
            <div className="cat-showcase relative mt-4 aspect-[3/2] w-full overflow-hidden rounded-[24px] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.7)] ring-1 ring-white/10 short:hidden">
              <AnimatePresence initial={false}>
                <motion.div
                  key={entry.key}
                  className="absolute inset-0 bg-[#f6efdc]"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  {images[entry.key] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={images[entry.key]}
                      alt={`${entry.name}: still life`}
                      className="kenburns h-full w-full object-cover"
                    />
                  ) : (
                    // No still yet: the category's vector on the same cream watercolour wash
                    <div className="grid h-full w-full place-items-center bg-[radial-gradient(ellipse_at_28%_72%,#cfe0ef_0%,transparent_55%),radial-gradient(ellipse_at_76%_28%,#dbe9d3_0%,transparent_52%)]">
                      <VectorScene className="w-[min(46%,220px)]">
                        <CategoryVector name={entry.key} blob={false} className="w-full" />
                      </VectorScene>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {/* Blend: the photo's edges melt into the navy panel instead of stopping at the card's edge */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_70%_at_50%_45%,transparent_50%,rgb(28_42_92/0.35)_78%,rgb(28_42_92/0.75)_100%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent"
              />
              <span className="absolute start-3 top-3 rounded-full bg-white/80 px-2.5 py-1 font-mono text-[11px] tabular-nums text-ink backdrop-blur">
                {pad(active + 1)} / {pad(N)}
              </span>
              <>
                <motion.div
                  key={entry.key}
                  className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <div className="min-w-0">
                    <p className="font-display text-xl font-bold leading-tight text-white">
                      {entry.short}
                    </p>
                    <p className="text-xs text-white/75">
                      {itemsFor(entry, bySlug).length} product types
                    </p>
                  </div>
                  <a
                    href={categoryHref(entry.key)}
                    className="group flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-sm font-semibold text-ink transition hover:bg-leaf hover:text-white"
                  >
                    See products <Arrow />
                  </a>
                </motion.div>
              </>
            </div>
          </div>

          {/* Panel for the active category */}
          <div
            id="cat-panel"
            aria-live="polite"
            aria-label={entry.name}
            className="relative rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm md:p-8 short:p-6"
          >
            <>
              <motion.div
                key={entry.key}
                className="flex flex-col"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="max-w-xl">
                    <p className="label flex flex-wrap items-center gap-2.5 !text-leaf">
                      {pad(active + 1)} / {pad(CATALOGUE.length)} · Category
                      {cms && (
                        <span className="rounded-full bg-leaf/20 px-2 py-1 tracking-normal normal-case text-leaf">
                          {cms.count} products
                        </span>
                      )}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.8rem,2.8vw,2.8rem)] font-bold leading-[1] tracking-[-0.03em] short:mt-2 short:text-[1.8rem]">
                      Explore Our Product Range
                    </h3>
                    <p className="mt-3 text-white/70 short:mt-1.5 short:text-sm">
                      Browse all 14 categories, from food packaging and serving supplies to cleaning
                      products and washroom essentials. Select a category to explore the options for
                      your business.
                    </p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-3 sm:flex">
                    <VectorScene className="w-24 rounded-full bg-white p-1 short:w-16">
                      <CategoryVector name={entry.key} className="w-full" />
                    </VectorScene>
                    <span className="font-display text-6xl font-light tabular-nums text-white/20">
                      {pad(active + 1)}
                    </span>
                  </div>
                </div>

                {uses.length > 0 && (
                  <div className="mt-5 grid gap-3 md:grid-cols-3 short:hidden">
                    {uses.map((u, i) => (
                      <motion.div
                        key={u.name}
                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 pe-4"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.08, ease: EASE }}
                      >
                        <VectorScene className="w-12 shrink-0 rounded-xl bg-white p-0.5">
                          <UseVector name={u.key} delay={0.4 + i * 0.12} className="w-full" />
                        </VectorScene>
                        <div className="min-w-0">
                          <p className="font-display font-bold leading-tight">{u.name}</p>
                          <p className="text-xs text-white/60">{u.text}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* All 14 categories at a glance; clicking one switches the panel to it */}
                <FlyInGrid active={active} onPick={go} />

                {/* Bottom banner: open the category's own page */}
                <motion.div
                  className="vx-host group relative mt-6 flex flex-wrap items-center gap-5 overflow-hidden rounded-[24px] bg-leaf p-4 pe-5 text-white shadow-[0_24px_60px_-28px_rgba(61,166,41,0.9)] short:mt-4"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                >
                  {/* Moving light across the banner */}
                  <span aria-hidden className="ind-sheen pointer-events-none absolute inset-0" />
                  <VectorScene
                    drawn
                    className="pointer-events-none absolute -bottom-10 end-[22%] w-40 opacity-20 transition duration-700 group-hover:-translate-y-2 group-hover:opacity-35"
                  >
                    <CategoryVector
                      name={entry.key}
                      blob={false}
                      className="w-full [&_.text-ink]:text-white"
                    />
                  </VectorScene>
                  <a
                    href={categoryHref(entry.key)}
                    className="relative flex min-w-0 flex-1 items-center gap-4"
                  >
                    <span className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-[#f6efdc] ring-2 ring-white/40">
                      {images[entry.key] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={images[entry.key]}
                          alt=""
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <span className="grid h-full w-full place-items-center">
                          <VectorScene drawn className="w-4/5">
                            <CategoryVector name={entry.key} blob={false} className="w-full" />
                          </VectorScene>
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-white/75">
                        {cms ? `${cms.count} products` : 'Sourced to order'} · {items.length} types
                      </span>
                      <span className="mt-0.5 block font-display text-2xl font-bold leading-tight">
                        See {entry.short.toLowerCase()} products
                      </span>
                      <span className="block text-sm text-white/80">
                        Film, full product list &amp; specs
                      </span>
                    </span>
                  </a>
                  <div className="relative flex shrink-0 flex-wrap gap-2">
                    <a
                      href="#quote"
                      className="rounded-full border border-white/40 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                    >
                      Ask for a quote
                    </a>
                    <a
                      href={categoryHref(entry.key)}
                      className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-leaf-deep transition hover:bg-ink hover:text-white"
                    >
                      See products <Arrow />
                    </a>
                  </div>
                </motion.div>
              </motion.div>
            </>
          </div>
        </div>
      </div>
    </section>
  )
}
