'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { CATALOGUE, categoryHref } from '@/lib/catalogue'
import type { VectorKey } from '../vectors/CategoryVector'
import { VectorScene } from '../vectors/CategoryVector'
import { CatIcon, EASE, Icon, Section, SectionHead, Tick, type AnyIcon } from './ui'

/* ───────────────────────── 02 · Our purpose ───────────────────────── */

const ERRANDS: { label: string; icon: AnyIcon; from: string; tilt: number }[] = [
  { label: 'A lid', icon: 'dome-lid', from: 'Packaging supplier', tilt: -5 },
  { label: 'A carry bag', icon: 'carry-bag', from: 'Bag wholesaler', tilt: 4 },
  { label: 'A fresh roll of foil', icon: 'foil-roll', from: 'Cash & carry run', tilt: -3 },
]

/**
 * Light. The purpose statement beside a "separate errands → one order" stage: three supplies that
 * would each be their own trip fly, one by one as the section scrolls, into a single order.
 */
export function Purpose() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start 60%', 'end 80%'] })
  const [got, setGot] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) =>
    setGot(Math.min(ERRANDS.length, Math.floor(p * (ERRANDS.length + 0.8)))),
  )
  const done = got >= ERRANDS.length
  const orders = done ? 1 : ERRANDS.length - got + (got > 0 ? 1 : 0)
  const spring = { type: 'spring', stiffness: 170, damping: 22 } as const

  return (
    <Section id="purpose" labelledBy="purpose-title" sectionRef={root}>
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div>
          <SectionHead id="purpose-title" eyebrow="Our purpose" title="Make Everyday Ordering Simpler" highlight="Simpler">
            <p>
              A kitchen can have every ingredient ready and still need a lid, a carry bag or a fresh
              roll of foil before an order can leave.
            </p>
          </SectionHead>
          <motion.blockquote
            className="relative mt-12 max-w-xl rounded-[28px] bg-ink p-8 pt-10 text-white shadow-[0_40px_80px_-40px_rgba(28,42,92,0.7)]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <span aria-hidden className="absolute -top-6 start-7 font-display text-[96px] leading-none text-leaf">
              &ldquo;
            </span>
            <p className="font-display text-2xl font-semibold leading-snug">
              Our purpose is to make those everyday supplies{' '}
              <span className="text-leaf">easier to find and order together.</span>
            </p>
            <div className="mt-7 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.14em] text-white/60">
              <span className="tabular-nums">
                <motion.span key={orders} className="inline-block text-white" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  {orders}
                </motion.span>{' '}
                {orders === 1 ? 'order' : 'orders'}
              </span>
              <span className="h-px flex-1 bg-white/15">
                <motion.span
                  className="block h-full origin-left bg-leaf"
                  initial={false}
                  animate={{ scaleX: got / ERRANDS.length }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
              </span>
              <span className={`transition-colors ${done ? 'text-leaf' : ''}`}>One supplier</span>
            </div>
          </motion.blockquote>
        </div>

        <LayoutGroup>
          <div className="relative mx-auto w-full max-w-[560px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate">Three separate trips</p>
            <ul className="mt-3 grid grid-cols-3 gap-3">
              {ERRANDS.map((e, i) => {
                const moved = i < got
                return (
                  <li key={e.label} className="relative aspect-[4/5]">
                    <div className="absolute inset-0 grid place-items-center rounded-2xl border-2 border-dashed border-line">
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.14em] text-leaf-deep transition-opacity duration-500 ${moved ? 'opacity-100' : 'opacity-0'}`}
                      >
                        Added ↓
                      </span>
                    </div>
                    {!moved && (
                      <motion.div
                        layoutId={`errand-${i}`}
                        transition={spring}
                        initial={{ rotate: e.tilt }}
                        animate={{ rotate: e.tilt }}
                        className="vx-host absolute inset-0 flex flex-col rounded-2xl bg-white p-3 shadow-[0_20px_40px_-24px_rgba(28,42,92,0.5)] ring-1 ring-line"
                      >
                        <span className="font-mono text-[9px] uppercase leading-tight tracking-[0.12em] text-slate/80">
                          Trip {i + 1} · {e.from}
                        </span>
                        <span className="my-auto block w-3/4 self-center">
                          <VectorScene>
                            <Icon name={e.icon} />
                          </VectorScene>
                        </span>
                        <span className="font-display text-sm font-bold leading-tight">{e.label}</span>
                      </motion.div>
                    )}
                  </li>
                )
              })}
            </ul>

            <div aria-hidden className="my-4 flex justify-center text-leaf">
              <motion.svg
                viewBox="0 0 24 40"
                className="h-10 w-6"
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path d="M12 2v32M4 26l8 10 8-10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </div>

            <div className="relative overflow-hidden rounded-[28px] bg-white p-6 pb-16 shadow-[0_40px_80px_-34px_rgba(28,42,92,0.55)] ring-1 ring-line">
              <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-leaf via-leaf-deep to-navy" />
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
                <span className="text-leaf-deep">With Klen Plus</span>
                <span className="tabular-nums text-slate">
                  {got}/{ERRANDS.length} items
                </span>
              </div>
              <p className="mt-1 font-display text-2xl font-bold">One order, one delivery</p>
              <ul className="mt-5 grid grid-cols-3 gap-3">
                {ERRANDS.map((e, i) => (
                  <li key={e.label} className="relative aspect-square rounded-2xl bg-paper">
                    {i < got ? (
                      <motion.div
                        layoutId={`errand-${i}`}
                        transition={spring}
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 0 }}
                        className="vx-host absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-leaf-soft p-2 ring-2 ring-leaf"
                      >
                        <span className="block w-3/5">
                          <VectorScene>
                            <Icon name={e.icon} />
                          </VectorScene>
                        </span>
                        <span className="mt-1 text-center font-display text-xs font-bold leading-tight">{e.label}</span>
                        <span className="absolute end-2 top-2 grid size-5 place-items-center rounded-full bg-leaf text-white">
                          <Tick className="size-3" />
                        </span>
                      </motion.div>
                    ) : (
                      <span className="absolute inset-2 grid place-items-center rounded-xl border-2 border-dashed border-line font-mono text-[10px] uppercase tracking-[0.14em] text-slate/60">
                        Empty
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              <AnimatePresence>
                {done && (
                  <motion.div
                    className="pointer-events-none absolute bottom-4 end-5 rounded-lg border-[3px] border-leaf px-3 py-1 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-leaf"
                    initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
                    animate={{ opacity: 1, scale: 1, rotate: -6 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                  >
                    Ordered together
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </LayoutGroup>
      </div>
    </Section>
  )
}

/* ───────────────────────── 03 · Our product range ───────────────────────── */

const BY_USE: { title: string; icon: AnyIcon; keys: VectorKey[] }[] = [
  { title: 'Takeaway & delivery', icon: 'use:delivery', keys: ['takeaway', 'aluminium', 'bags', 'foam', 'bio'] },
  { title: 'Counter & café', icon: 'use:cafe', keys: ['cups', 'paper', 'plastic'] },
  { title: 'Kitchen & prep', icon: 'use:kitchen', keys: ['aluminium', 'film', 'ppe', 'paper'] },
  { title: 'Washroom & hygiene', icon: 'use:washroom', keys: ['tissue', 'hygiene', 'plastic'] },
  { title: 'Cleaning & housekeeping', icon: 'use:floor', keys: ['chemicals', 'tools', 'film'] },
]

/**
 * Dark. Fourteen category tiles that can be viewed by product type or grouped by use; every tile
 * links to its category page.
 */
export function Range() {
  const [mode, setMode] = useState<'type' | 'use'>('type')
  const entry = (k: VectorKey) => CATALOGUE.find((c) => c.key === k)!

  return (
    <Section id="range" labelledBy="range-title" dark>
      <div className="flex flex-wrap items-end justify-between gap-8">
        <SectionHead id="range-title" eyebrow="Our product range" title="One Catalogue, 14 Categories" highlight="14 Categories" dark>
          Explore 14 categories covering paper products, foil, takeaway containers, cups and lids,
          bags and films, cleaning chemicals, tools, personal hygiene products and more. Browse by
          product type when you know what you need, or by use when planning supplies for a new
          operation.
        </SectionHead>
        <div role="tablist" aria-label="Browse the catalogue" className="flex rounded-full border border-white/15 bg-white/[0.06] p-1">
          {(
            [
              ['type', 'By product type'],
              ['use', 'By use'],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              role="tab"
              aria-selected={mode === k}
              onClick={() => setMode(k)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition ${mode === k ? 'text-white' : 'text-white/60 hover:text-white'}`}
            >
              {mode === k && (
                <motion.span layoutId="range-pill" className="absolute inset-0 rounded-full bg-leaf" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />
              )}
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'type' ? (
          <motion.ul
            key="type"
            className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {CATALOGUE.map((c, i) => (
              <motion.li
                key={c.key}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 7) * 0.05, ease: EASE }}
              >
                <a
                  href={categoryHref(c.key)}
                  className="group flex h-full flex-col rounded-[20px] border border-white/10 bg-white/[0.05] p-4 transition duration-300 hover:-translate-y-1 hover:border-leaf hover:bg-white/[0.09]"
                >
                  <span className="grid aspect-square place-items-center rounded-2xl bg-white transition duration-500 group-hover:-rotate-3">
                    <CatIcon name={c.key as VectorKey} className="w-3/4" />
                  </span>
                  <span className="mt-3 font-mono text-[10px] text-leaf">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-[15px] font-bold leading-tight">{c.short}</span>
                  <span className="mt-auto pt-2 text-xs text-white/55 transition group-hover:text-leaf">View range →</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.ul
            key="use"
            className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {BY_USE.map((g, i) => (
              <motion.li
                key={g.title}
                className="vx-host rounded-[24px] border border-white/10 bg-white/[0.05] p-5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              >
                <span className="grid size-16 place-items-center rounded-2xl bg-white">
                  <VectorScene className="w-12">
                    <Icon name={g.icon} delay={0.1 + i * 0.08} />
                  </VectorScene>
                </span>
                <h3 className="mt-4 text-xl font-bold leading-tight">{g.title}</h3>
                <ul className="mt-4 flex flex-col gap-1.5">
                  {g.keys.map((k) => (
                    <li key={k}>
                      <a href={categoryHref(k)} className="group flex items-center gap-2.5 rounded-xl px-1 py-1 text-sm text-white/80 transition hover:bg-white/[0.06] hover:text-white">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/90">
                          <CatIcon name={k} className="w-6" />
                        </span>
                        {entry(k).short}
                        <span className="ms-auto text-leaf opacity-0 transition group-hover:opacity-100">→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </Section>
  )
}

/* ───────────────────────── 04 · Who we serve ───────────────────────── */

const ROUTINES: { who: string; task: string; icon: AnyIcon }[] = [
  { who: 'Cafés', task: 'Cups and lids for the morning rush', icon: 'use:cafe' },
  { who: 'Caterers', task: 'Trays and wraps for service', icon: 'use:catering' },
  { who: 'Hotels', task: 'Replenishing guest washrooms', icon: 'use:washroom' },
  { who: 'Retailers', task: 'Bags and packing for the counter', icon: 'use:counter' },
  { who: 'Offices', task: 'Tissue and supplies for shared spaces', icon: 'use:storeroom' },
  { who: 'Facilities teams', task: 'Cleaning shared spaces every day', icon: 'use:floor' },
]

/**
 * Light. Six routines (who → the task they run) as a ticker-style list of cards, then the businesses
 * from the CMS as photo cards with what they typically order.
 */
export function Serve({
  industries,
  images,
}: {
  industries: { slug: string; name: string; orders?: string | null }[]
  images: Record<string, string | undefined>
}) {
  return (
    <Section id="serve" labelledBy="serve-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <SectionHead id="serve-title" eyebrow="Who we serve" title="Built Around How You Work" highlight="How You Work">
          A café needs cups and lids for its morning rush. A caterer needs trays and wraps for
          service. Hotels, retailers, offices and facilities teams have their own routines, from
          replenishing washrooms to cleaning shared spaces. Our range supports the people
          responsible for each of those tasks.
        </SectionHead>
        <ul className="grid gap-3 sm:grid-cols-2">
          {ROUTINES.map((r, i) => (
            <motion.li
              key={r.who}
              className="vx-host group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-leaf"
              initial={{ opacity: 0, x: i % 2 ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-leaf-soft transition group-hover:-rotate-6">
                <VectorScene className="w-11">
                  <Icon name={r.icon} delay={0.1 + i * 0.06} />
                </VectorScene>
              </span>
              <span>
                <span className="block font-display text-lg font-bold leading-tight">{r.who}</span>
                <span className="block text-sm text-slate">{r.task}</span>
              </span>
            </motion.li>
          ))}
        </ul>
      </div>

      {industries.length > 0 && (
        <ul className="mt-14 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:thin] lg:grid lg:grid-cols-6 lg:overflow-visible">
          {industries.map((it, i) => (
            <motion.li
              key={it.slug}
              className="group relative aspect-[3/4] w-[70vw] max-w-[300px] shrink-0 snap-start overflow-hidden rounded-[24px] bg-ink lg:w-auto lg:max-w-none"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
            >
              {images[it.slug] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[it.slug]} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="font-display text-xl font-bold leading-tight">{it.name}</p>
                {it.orders && (
                  <p className="mt-2 max-h-24 overflow-hidden text-sm text-white/80 transition-all duration-500 lg:max-h-0 lg:group-hover:max-h-24">
                    {it.orders}
                  </p>
                )}
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </Section>
  )
}
