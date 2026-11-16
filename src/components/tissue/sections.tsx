'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useInView, useMotionValue } from 'motion/react'
import { Arrow } from '../Header'
import { APPLICATIONS, FAQ, GUIDE, INDUSTRIES, RANGE, SHEET, SPECS, TISSUE_IMG, WHY } from './content'

const EASE = [0.2, 0.7, 0.2, 1] as const
const EASE_OUT = [0.16, 1, 0.3, 1] as const

const H2 = 'text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[0.98] tracking-[-0.035em]'
const LEAF_ON_DARK = 'text-[#8fd67e]'

/** Headline text with one accent word in leaf green; TissueMotion splits it into rising words. */
export function Reveal({ text, accent, dark = false }: { text: string; accent?: string; dark?: boolean }) {
  if (!accent || !text.includes(accent)) return <>{text}</>
  const [before, after] = text.split(accent)
  return (
    <>
      {before}
      <span className={dark ? LEAF_ON_DARK : 'text-leaf'}>{accent}</span>
      {after}
    </>
  )
}

function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p data-rise className={`label flex items-center gap-2.5 ${dark ? `!text-[#8fd67e]` : '!text-leaf-deep'}`}>
      <span className={`h-px w-8 ${dark ? 'bg-[#8fd67e]' : 'bg-leaf'}`} />
      {children}
    </p>
  )
}

export function Photo({
  src,
  alt,
  className = '',
  zoom = false,
  parallax,
}: {
  src: string
  alt: string
  className?: string
  zoom?: boolean
  /** Travel in % for TissueMotion's scroll parallax. */
  parallax?: number
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      data-parallax={parallax}
      className={`h-full w-full object-cover ${zoom ? 'kenburns' : ''} ${className}`}
    />
  )
}

/** Big outlined words sliding sideways with the scroll, between a section's edge and its content. */
function Marquee({ words, dir = 1, dark = false }: { words: string[]; dir?: 1 | -1; dark?: boolean }) {
  const row = [...words, ...words, ...words]
  return (
    <div aria-hidden className="pointer-events-none overflow-hidden py-2">
      <div data-marquee={dir} className="flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-8">
            <span
              className={`font-display text-[clamp(3.5rem,9vw,8.5rem)] font-extrabold leading-none tracking-[-0.04em] ${
                i % 2 ? (dark ? 'text-white/[0.06]' : 'text-ink/[0.05]') : 'text-transparent'
              }`}
              style={i % 2 ? undefined : { WebkitTextStroke: dark ? '1.5px rgb(255 255 255 / 0.18)' : '1.5px rgb(28 42 92 / 0.14)' }}
            >
              {w}
            </span>
            <span className={`size-4 shrink-0 rounded-full ${dark ? 'bg-leaf/60' : 'bg-leaf/40'}`} />
          </span>
        ))}
      </div>
    </div>
  )
}

/* ───────────────────────── 2 · Product categories (dark) ───────────────────────── */

export function TissueRange() {
  return (
    <section id="range" data-sheet aria-labelledby="range-title" className={`${SHEET} theme-dark pb-24 pt-16 md:pb-32 md:pt-20`}>
      <Marquee words={['Facial tissues', 'Table napkins', 'Hand towels', 'Toilet rolls', 'Kitchen rolls']} dark />

      <div className="mx-auto mt-10 max-w-[1260px] px-5 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow dark>Product categories</Eyebrow>
            <h2 id="range-title" data-split className={`mt-4 max-w-[16ch] text-white ${H2}`}>
              <Reveal text="Find the right paper for each space" accent="space" dark />
            </h2>
          </div>
          <p data-rise className="max-w-sm text-[#c8d1ea]">
            Five formats, each matched to where it is used and how it is dispensed.
          </p>
        </div>

        <ul data-stagger className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {RANGE.map((r, i) => (
            <li key={r.key} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'}>
              <a
                href="#enquiry"
                className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white/[0.04] ring-1 ring-white/10 backdrop-blur transition duration-500 hover:-translate-y-1.5 hover:bg-white/[0.08] hover:ring-[#8fd67e]/50 hover:shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]"
              >
                <div data-reveal="22px" className={`relative m-2 overflow-hidden rounded-[22px] ${i < 2 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                  <div className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]">
                    <Photo src={r.image} alt={r.name} parallax={8} />
                  </div>
                  <span className="absolute start-4 top-4 rounded-full bg-white/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink backdrop-blur">
                    {r.tag}
                  </span>
                  <span className="absolute end-4 top-4 grid size-9 place-items-center rounded-full bg-ink/70 font-mono text-xs text-white backdrop-blur">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6 pt-4">
                  <h3 className="text-2xl font-bold tracking-[-0.02em] text-white">{r.name}</h3>
                  <p className="text-[#c8d1ea]">{r.text}</p>
                  <span className={`mt-auto flex items-center gap-2 pt-2 text-sm font-semibold ${LEAF_ON_DARK}`}>
                    Ask about this format
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ───────────────────────── 3 · Why choose Klen+ (light) ───────────────────────── */

export function TissueWhy() {
  return (
    <section data-sheet aria-labelledby="why-title" className={`${SHEET} theme-light px-5 py-24 md:px-10 md:py-32`}>
      <div aria-hidden className="pointer-events-none absolute -end-40 -top-40 size-[520px] rounded-full bg-leaf/20 blur-[120px]" />
      <div className="relative mx-auto grid max-w-[1260px] items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Eyebrow>Why choose Klen+</Eyebrow>
          <h2 id="why-title" data-split className={`mt-4 ${H2}`}>
            <Reveal text="Know what you’re getting in every carton" accent="carton" />
          </h2>
          <div className="relative mx-auto mt-12 hidden w-[78%] lg:block">
            <svg data-spin="180" aria-hidden viewBox="0 0 400 400" className="absolute inset-[-12%] text-navy/20">
              <circle cx="200" cy="200" r="190" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 10" strokeLinecap="round" />
              <circle cx="200" cy="10" r="7" className="fill-leaf" />
            </svg>
            <div className="rounded-full shadow-[0_40px_80px_-30px_rgba(28,42,92,0.5)] ring-8 ring-white">
              <div data-reveal="50%" className="aspect-square overflow-hidden rounded-full">
                <Photo src={TISSUE_IMG.jumbo} alt="Jumbo toilet roll" parallax={10} />
              </div>
            </div>
          </div>
        </div>

        <ol data-stagger className="grid gap-4 sm:grid-cols-2">
          {WHY.map((w, i) => (
            <li
              key={w.title}
              className="group relative overflow-hidden rounded-[24px] bg-white p-6 ring-1 ring-line transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(28,42,92,0.45)] hover:ring-leaf"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-full bg-leaf text-white transition-transform duration-500 group-hover:rotate-[360deg]">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5 10 17 19 7" />
                  </svg>
                </span>
                <span className="font-display text-4xl font-extrabold text-mist transition-colors group-hover:text-leaf-soft">
                  <span data-count={i + 1} data-pad>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </span>
              </div>
              <h3 className="mt-6 text-xl font-bold leading-tight">{w.title}</h3>
              <p className="mt-2 text-slate">{w.text}</p>
              <span aria-hidden className="absolute inset-x-6 bottom-0 h-1 origin-left scale-x-0 rounded-full bg-leaf transition-transform duration-500 group-hover:scale-x-100" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ───────────────────────── 4 · Industries (dark) ───────────────────────── */

export function TissueIndustries() {
  const [active, setActive] = useState(0)
  const ind = INDUSTRIES[active]
  return (
    <section data-sheet aria-labelledby="ind-title" className={`${SHEET} theme-dark px-5 py-24 md:px-10 md:py-32`}>
      <div className="mx-auto max-w-[1260px]">
        <Eyebrow dark>Industries served</Eyebrow>
        <h2 id="ind-title" data-split className={`mt-4 max-w-[18ch] text-white ${H2}`}>
          <Reveal text="Tissue supplies for the way your business runs" accent="runs" dark />
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div role="tablist" aria-label="Industries" data-stagger className="flex flex-col gap-2">
            {INDUSTRIES.map((it, i) => {
              const on = i === active
              return (
                <button
                  key={it.name}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`relative flex items-center gap-4 rounded-2xl px-5 py-4 text-start transition-colors ${on ? 'text-ink' : 'text-white/75 hover:bg-white/[0.05] hover:text-white'}`}
                >
                  {on && (
                    <motion.span
                      layoutId="ind-pill"
                      className="absolute inset-0 rounded-2xl bg-white shadow-[0_20px_40px_-20px_rgba(0,0,0,0.7)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <span className={`relative font-mono text-sm ${on ? 'text-leaf-deep' : 'text-white/40'}`}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="relative flex-1 font-display text-lg font-bold md:text-xl">{it.name}</span>
                  <span className={`relative transition-transform ${on ? 'translate-x-0 text-leaf' : '-translate-x-1 text-white/25'}`}>→</span>
                </button>
              )
            })}
          </div>

          <div data-reveal="32px" className="relative min-h-[460px] overflow-hidden rounded-[32px] bg-white/5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] ring-1 ring-white/10">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={ind.name}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Photo src={ind.image} alt="" zoom />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(28_42_92/0.92),transparent_60%)]" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                  <motion.p className={"label !text-[#8fd67e]"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    What to plan for
                  </motion.p>
                  <motion.p
                    className="mt-2 max-w-[46ch] text-lg leading-snug"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.22, duration: 0.6, ease: EASE }}
                  >
                    {ind.text}
                  </motion.p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {ind.uses.map((u, j) => (
                      <motion.span
                        key={u}
                        className="rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + j * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        {u}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 5 · Applications (light) ───────────────────────── */

function AppStep({ i, onActive, children }: { i: number; onActive: (i: number) => void; children: React.ReactNode }) {
  const ref = useRef<HTMLLIElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive(i)
  }, [inView, i, onActive])
  return (
    <li ref={ref} className="lg:flex lg:min-h-[62vh] lg:items-center">
      {children}
    </li>
  )
}

export function TissueApplications() {
  const [active, setActive] = useState(0)
  return (
    <section data-sheet aria-labelledby="apps-title" className={`${SHEET} bg-white px-5 py-24 md:px-10 md:py-32`}>
      <div className="mx-auto max-w-[1260px]">
        <Eyebrow>Applications</Eyebrow>
        <h2 id="apps-title" data-split className={`mt-4 ${H2}`}>
          <Reveal text="Where each product goes" accent="goes" />
        </h2>

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="hidden lg:block">
            <div className="sticky top-28 aspect-square overflow-hidden rounded-[36px] bg-mist shadow-[0_40px_80px_-40px_rgba(28,42,92,0.5)]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.08, clipPath: 'inset(100% 0 0 0)' }}
                  animate={{ opacity: 1, scale: 1, clipPath: 'inset(0% 0 0 0)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE_OUT }}
                >
                  <Photo src={APPLICATIONS[active].image} alt={APPLICATIONS[active].place} />
                </motion.div>
              </AnimatePresence>
              <span className="absolute start-5 top-5 rounded-full bg-white/85 px-3 py-1.5 font-mono text-xs backdrop-blur">
                {String(active + 1).padStart(2, '0')} / 04
              </span>
              <div className="absolute inset-x-5 bottom-5 flex gap-1.5">
                {APPLICATIONS.map((_, i) => (
                  <span key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/50">
                    <motion.span className="block h-full bg-leaf" animate={{ width: i <= active ? '100%' : '0%' }} transition={{ duration: 0.6, ease: EASE }} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <ol className="flex flex-col gap-10 lg:gap-0">
            {APPLICATIONS.map((a, i) => (
              <AppStep key={a.place} i={i} onActive={setActive}>
                <div data-rise>
                  <div
                    className="transition-all duration-700 lg:data-[off=true]:translate-x-4 lg:data-[off=true]:opacity-25"
                    data-off={i !== active}
                  >
                    <div className="mb-5 aspect-[4/3] overflow-hidden rounded-[24px] lg:hidden">
                      <Photo src={a.image} alt={a.place} />
                    </div>
                    <span className="font-mono text-sm text-leaf-deep">{String(i + 1).padStart(2, '0')} / 04</span>
                    <h3 className="mt-3 text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold leading-none tracking-[-0.03em]">{a.place}</h3>
                    <p className="mt-4 max-w-[44ch] text-lg text-slate">{a.text}</p>
                  </div>
                </div>
              </AppStep>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 6 + 7 · Brand & standards (dark) ───────────────────────── */

export function TissueBrandStandards() {
  return (
    <section data-sheet aria-label="The Klen+ range and product standards" className={`${SHEET} theme-dark px-5 py-24 md:px-10 md:py-32`}>
      <div data-stagger className="relative mx-auto grid max-w-[1260px] gap-5 lg:grid-cols-2">
        <article className="group relative flex flex-col overflow-hidden rounded-[32px] bg-leaf-soft p-7 text-ink md:p-10">
          <p className="label !text-leaf-deep">Brand name</p>
          <h2 data-split className="mt-3 text-[clamp(1.9rem,3.4vw,3rem)] font-bold leading-[1] tracking-[-0.03em]">
            The Klen<span className="text-leaf">+</span> tissue &amp; hygiene range
          </h2>
          <p data-lines className="mt-5 max-w-[48ch] text-ink/80">
            When an item works well for your team, the details matter on the next order. Send us the brand, product name or a
            photo of the pack you currently use. We’ll confirm the available Klen+ option and list its ply, dimensions and pack
            quantity so you can compare it with your current supply.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Ply', 'Dimensions', 'Pack quantity'].map((t) => (
              <span key={t} data-rise className="rounded-full bg-white px-3.5 py-2 font-mono text-xs uppercase tracking-[0.06em]">
                {t}
              </span>
            ))}
          </div>
          <a
            href="#enquiry"
            className="group/b relative z-10 mt-8 flex w-fit items-center gap-2 rounded-xl bg-ink px-5 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-navy"
          >
            Ask About a Product <Arrow />
          </a>
          <div aria-hidden className="pointer-events-none absolute -bottom-10 -end-10 w-[46%] max-md:hidden">
            <div className="vx-drift" style={{ '--dur': '10s' } as React.CSSProperties}>
              <div className="aspect-square overflow-hidden rounded-full shadow-[0_30px_60px_-30px_rgba(28,42,92,0.6)] transition-transform duration-700 group-hover:rotate-6 group-hover:scale-105">
                <Photo src={TISSUE_IMG.centre} alt="" />
              </div>
            </div>
          </div>
        </article>

        <article className="relative overflow-hidden rounded-[32px] bg-white/[0.04] p-7 text-white ring-1 ring-white/10 backdrop-blur md:p-10">
          <p className={"label !text-[#8fd67e]"}>Product standards &amp; certifications</p>
          <h2 data-split className="mt-3 text-[clamp(1.9rem,3.4vw,3rem)] font-bold leading-[1] tracking-[-0.03em] text-white">
            Check the specification before you approve an item
          </h2>
          <p data-lines className="mt-5 text-[#c8d1ea]">
            For procurement review, request the specification for the exact product you intend to order. Details to check
            include the following, depending on the format.
          </p>
          <ul data-stagger className="mt-6 grid grid-cols-2 gap-2">
            {SPECS.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-3.5 py-3 text-sm font-semibold ring-1 ring-white/10 transition hover:bg-white/[0.12]"
              >
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-[10px] text-white">✓</span>
                {s}
              </li>
            ))}
          </ul>
          <p data-lines className="mt-6 text-[#c8d1ea]">
            If your purchasing policy requires a particular certification, include its name in your enquiry. Our team will
            confirm whether supporting documentation is available for the selected item.
          </p>
          <a
            href="#enquiry"
            className="group mt-8 flex w-fit items-center gap-2 rounded-xl bg-leaf px-5 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-leaf-deep"
          >
            Request Product Specifications <Arrow />
          </a>
        </article>
      </div>
    </section>
  )
}

/* ───────────────────────── 8 · Selection guide (light) ───────────────────────── */

function AnimatedNumber({ value }: { value: number }) {
  const mv = useMotionValue(value)
  const [shown, setShown] = useState(value)
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: EASE, onUpdate: (v) => setShown(Math.round(v)) })
    return () => c.stop()
  }, [value, mv])
  return <>{shown}</>
}

function Calculator() {
  const [weekly, setWeekly] = useState(12)
  const [weeks, setWeeks] = useState(4)
  const [reserve, setReserve] = useState(0)
  const base = weekly * weeks
  const total = Math.ceil(base * (1 + reserve / 100))
  const id = useId()
  const input =
    'w-full rounded-xl border border-white/15 bg-white/10 px-3.5 py-3 text-lg font-semibold text-white outline-none focus:border-[#8fd67e]'
  return (
    <div data-reveal="32px" className="relative mt-14 grid gap-8 overflow-hidden rounded-[32px] bg-ink p-7 text-white md:grid-cols-[1.2fr_1fr] md:p-10">
      <div aria-hidden className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-leaf/25 blur-[100px]" />
      <div className="relative">
        <p className={"label !text-[#8fd67e]"}>Order estimator</p>
        <p className="mt-2 font-display text-2xl font-bold">Weekly usage × weeks between deliveries</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label htmlFor={`${id}-w`} className="flex flex-col gap-1.5 text-sm text-white/70">
            Average weekly usage (boxes, rolls or packs)
            <input id={`${id}-w`} type="number" min={0} value={weekly} onChange={(e) => setWeekly(Math.max(0, Number(e.target.value) || 0))} className={input} />
          </label>
          <label htmlFor={`${id}-k`} className="flex flex-col gap-1.5 text-sm text-white/70">
            Weeks between deliveries
            <input id={`${id}-k`} type="number" min={1} value={weeks} onChange={(e) => setWeeks(Math.max(1, Number(e.target.value) || 1))} className={input} />
          </label>
        </div>
        <label htmlFor={`${id}-r`} className="mt-5 flex flex-col gap-2 text-sm text-white/70">
          <span className="flex justify-between">
            Reserve for busy periods <span className="font-mono text-white">{reserve}%</span>
          </span>
          <input id={`${id}-r`} type="range" min={0} max={50} step={5} value={reserve} onChange={(e) => setReserve(Number(e.target.value))} className="accent-leaf" />
        </label>
      </div>
      <div className="relative flex flex-col justify-center rounded-[24px] bg-white/[0.06] p-6 ring-1 ring-white/10">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-white/60">Plan for</p>
        <p className={`mt-1 font-display text-[clamp(3.5rem,7vw,5.5rem)] font-extrabold leading-none tracking-[-0.04em] ${LEAF_ON_DARK}`} aria-live="polite">
          <AnimatedNumber value={total} />
        </p>
        <p className="mt-2 text-white/70">
          units per order · {weekly} × {weeks} = {base}
          {reserve ? ` + ${reserve}% reserve` : ''}
        </p>
        <a href="#enquiry" className="mt-6 w-fit rounded-xl bg-leaf px-5 py-3 font-semibold transition hover:bg-leaf-deep">
          Quote this quantity
        </a>
      </div>
    </div>
  )
}

export function TissueGuide() {
  return (
    <section data-sheet aria-labelledby="guide-title" className={`${SHEET} theme-light px-5 py-24 md:px-10 md:py-32`}>
      <div className="mx-auto max-w-[1260px]">
        <Eyebrow>Selection guide</Eyebrow>
        <h2 id="guide-title" data-split className={`mt-4 ${H2}`}>
          <Reveal text="Four checks before ordering in bulk" accent="bulk" />
        </h2>

        <div className="relative mt-14">
          <div aria-hidden className="absolute inset-x-0 top-6 hidden h-0.5 bg-line lg:block">
            <div data-draw className="h-full origin-left bg-leaf" />
          </div>
          <ol data-stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {GUIDE.map((g, i) => (
              <li key={g.title} className="group relative">
                <span className="relative grid size-12 place-items-center rounded-full bg-ink font-display text-lg font-bold text-white ring-8 ring-paper transition-colors duration-300 group-hover:bg-leaf">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">{g.title}</h3>
                <p className="mt-2 text-slate">{g.text}</p>
              </li>
            ))}
          </ol>
        </div>

        <Calculator />
      </div>
    </section>
  )
}

/* ───────────────────────── 9 · FAQ (dark) ───────────────────────── */

export function TissueFaq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section data-sheet aria-labelledby="faq-title" className={`${SHEET} theme-dark px-5 py-24 md:px-10 md:py-32`}>
      <div className="relative mx-auto grid max-w-[1260px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <Eyebrow dark>Frequently asked questions</Eyebrow>
          <h2 id="faq-title" data-split className={`mt-4 text-white ${H2}`}>
            <Reveal text="Good to know before you order" accent="order" dark />
          </h2>
          <div data-reveal className="relative mt-10 hidden w-60 overflow-hidden rounded-[28px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] lg:block">
            <div className="aspect-square">
              <Photo src={TISSUE_IMG.toilet} alt="" parallax={10} />
            </div>
          </div>
        </div>
        <ul data-stagger className="flex flex-col gap-3">
          {FAQ.map((f, i) => {
            const on = open === i
            return (
              <li
                key={f.q}
                className={`overflow-hidden rounded-[22px] ring-1 transition-colors duration-300 ${on ? 'bg-white/[0.09] ring-[#8fd67e]/60' : 'bg-white/[0.03] ring-white/10 hover:bg-white/[0.06]'}`}
              >
                <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : i)} className="flex w-full items-center gap-4 px-5 py-5 text-start md:px-6">
                  <span className="font-mono text-sm text-white/40">{String(i + 1).padStart(2, '0')}</span>
                  <span className="flex-1 font-display text-lg font-bold leading-snug text-white">{f.q}</span>
                  <motion.span
                    className={`grid size-9 shrink-0 place-items-center rounded-full text-xl ${on ? 'bg-leaf text-white' : 'bg-white/10 text-white'}`}
                    animate={{ rotate: on ? 45 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="px-5 pb-6 ps-14 text-[#c8d1ea] md:px-6 md:ps-[3.75rem]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
