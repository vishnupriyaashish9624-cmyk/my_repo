'use client'

import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { UseVector } from '../vectors/TissueVectors'
import { ItemVector } from '../vectors/ItemVectors'
import { look } from '../home/Industries'
import { EASE, Icon, Section, SectionHead, Tick, type AnyIcon } from './ui'

/* ───────────────────────── 02 · Our purpose ───────────────────────── */

const ERRANDS: { label: string; icon: AnyIcon; from: string; tilt: number }[] = [
  { label: 'A lid', icon: 'dome-lid', from: 'Packaging supplier', tilt: -5 },
  { label: 'A carry bag', icon: 'carry-bag', from: 'Bag wholesaler', tilt: 4 },
  { label: 'A fresh roll of foil', icon: 'foil-roll', from: 'Cash & carry run', tilt: -3 },
]

/** Stage geometry (viewBox 1200 × 440): three supply cards → the Klen Plus hub → your kitchen. */
const ROW_Y = [70, 220, 370]
const IN_PATHS = ROW_Y.map((y) => `M232 ${y} C380 ${y} 360 220 470 220`)
const OUT_PATH = 'M730 220 L968 220'
/** Scroll story beats, in units of `s` (0 → END): each item flows in, then the van drives. */
const END = 6.5
const STEPS = ['A lid', 'A carry bag', 'Foil', 'Delivery']
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/**
 * Navy panel driven by a story value `s` (0 → END). On desktop `s` follows the scroll while the panel
 * is pinned; elsewhere it sits at the end. Beats: 1–2 the lid flows into the hub, 2–3 the carry bag,
 * 3–4 the foil, 4–5 the van drives the one delivery to the kitchen, 5+ the quote and tally land.
 */
function PurposePanel({ s, pinned }: { s: MotionValue<number>; pinned: boolean }) {
  const gid = useId()
  const reduce = useReducedMotion()
  const paths = useRef<(SVGPathElement | null)[]>([])
  const [step, setStep] = useState(() => Math.min(5, Math.floor(s.get())))
  const dots = [useMotionValue(-9999), useMotionValue(-9999), useMotionValue(-9999)]
  const dotsY = [useMotionValue(-9999), useMotionValue(-9999), useMotionValue(-9999)]
  const line = [
    useTransform(s, (v) => clamp01(v - 1)),
    useTransform(s, (v) => clamp01(v - 2)),
    useTransform(s, (v) => clamp01(v - 3)),
    useTransform(s, (v) => clamp01(v - 4)),
  ]
  const vanX = useTransform(s, (v) => `${61 + clamp01(v - 4) * 19}%`)
  const vanOn = useTransform(s, (v) => (v > 4 ? 1 : 0))
  const tail = useTransform(s, (v) => clamp01((v - 5) / 0.8))
  const tailY = useTransform(tail, (t) => 30 * (1 - t))

  const place = (v: number) => {
    setStep(Math.min(5, Math.floor(v)))
    for (let k = 0; k < 3; k++) {
      const el = paths.current[k]
      const t = v - (k + 1)
      if (!el || t <= 0 || t >= 1) {
        dots[k].set(-9999)
        dotsY[k].set(-9999)
        continue
      }
      const pt = el.getPointAtLength(el.getTotalLength() * t)
      dots[k].set(pt.x)
      dotsY[k].set(pt.y)
    }
  }
  useMotionValueEvent(s, 'change', place)

  const done = (i: number) => step > i
  const delivered = step >= 5

  return (
    <div
      className={`relative flex flex-col overflow-hidden bg-ink px-6 text-white md:px-12 2xl:px-[max(3.5rem,calc((100vw-1840px)/2))] ${
        pinned ? 'h-full py-8 short:py-5' : 'py-14 md:py-20'
      }`}
    >
      {/* Backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.04)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
      />
      <motion.span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf/20 blur-[120px]"
        animate={reduce ? undefined : { scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span aria-hidden className="pointer-events-none absolute -start-40 -top-40 size-[480px] rounded-full bg-navy blur-[100px]" />

      {/* Headline + step rail */}
      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-leaf">Our purpose</p>
          <h2
            id={pinned ? 'purpose-title' : 'purpose-title-static'}
            className={`mt-3 font-bold leading-[0.95] tracking-[-0.035em] ${pinned ? 'text-[clamp(2rem,3.4vw,3.4rem)] short:text-[2.2rem]' : 'text-[clamp(2.2rem,4.2vw,4.2rem)]'}`}
          >
            Make Everyday Ordering <span className="text-leaf">Simpler</span>
          </h2>
          <p className="mt-4 max-w-xl text-white/70 short:mt-2 short:text-sm">
            A kitchen can have every ingredient ready and still need a lid, a carry bag or a fresh
            roll of foil before an order can leave.
          </p>
        </div>
        {pinned && (
          <ol className="flex gap-2" aria-hidden>
            {STEPS.map((l, i) => {
              const on = step === i + 1
              const past = step > i + 1
              return (
                <li
                  key={l}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all duration-500 ${
                    on ? 'border-leaf bg-leaf text-white' : past ? 'border-leaf/50 text-leaf' : 'border-white/15 text-white/45'
                  }`}
                >
                  <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {l}
                </li>
              )
            })}
          </ol>
        )}
      </div>

      {/* Convergence stage (md+) */}
      <div className={`relative mt-10 hidden w-full md:block ${pinned ? 'flex-1 min-h-0 short:mt-6' : ''}`}>
        <div className={`relative mx-auto aspect-[1200/440] ${pinned ? 'h-full max-h-[440px] max-w-full' : 'w-full max-w-[1200px]'}`}>
          <svg viewBox="0 0 1200 440" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id={`${gid}-l`} x1="0" x2="1">
                <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
                <stop offset="1" stopColor="var(--color-leaf)" />
              </linearGradient>
            </defs>
            {[...IN_PATHS, OUT_PATH].map((d, k) => (
              <g key={k}>
                {/* Track */}
                <path
                  ref={k < 3 ? (el) => void (paths.current[k] = el) : undefined}
                  d={d}
                  fill="none"
                  stroke="#fff"
                  strokeOpacity="0.18"
                  strokeWidth="2"
                  strokeDasharray="3 10"
                  strokeLinecap="round"
                />
                {/* Lit part, drawn by the scroll */}
                <motion.path
                  d={d}
                  fill="none"
                  stroke={k === 3 ? 'var(--color-leaf)' : `url(#${gid}-l)`}
                  strokeWidth={k === 3 ? 4 : 3}
                  strokeLinecap="round"
                  style={{ pathLength: line[k] }}
                />
              </g>
            ))}
            {/* Travelling sparks */}
            {dots.map((x, k) => (
              <g key={k}>
                <motion.circle r="14" fill="var(--color-leaf)" opacity="0.25" cx={x} cy={dotsY[k]} />
                <motion.circle r="7" fill="var(--color-leaf)" cx={x} cy={dotsY[k]} />
              </g>
            ))}
          </svg>

          {/* Left: the three things that used to be three trips */}
          {ERRANDS.map((e, i) => (
            <div
              key={e.label}
              className={`vx-host absolute start-0 flex w-[19%] -translate-y-1/2 items-center gap-3 rounded-2xl bg-white p-2.5 pe-3 text-ink shadow-[0_24px_44px_-20px_rgba(5,10,35,0.8)] transition-all duration-500 ${
                done(i + 1) ? 'opacity-50 saturate-0' : step === i + 1 ? 'scale-105 ring-4 ring-leaf/50' : ''
              }`}
              style={{ top: `${(ROW_Y[i] / 440) * 100}%` }}
            >
              <span className="block w-14 shrink-0 rounded-xl bg-leaf-soft p-1">
                <VectorScene>
                  <Icon name={e.icon} delay={0.2 + i * 0.12} />
                </VectorScene>
              </span>
              <span className="min-w-0">
                <span className="block font-display text-[15px] font-bold leading-tight">{e.label}</span>
                <span
                  className={`mt-0.5 block font-mono text-[9.5px] uppercase leading-tight tracking-[0.1em] text-slate decoration-leaf decoration-2 ${done(i) ? 'line-through' : ''}`}
                >
                  {e.from}
                </span>
              </span>
            </div>
          ))}

          {/* Centre: the hub */}
          <div className="absolute left-1/2 top-1/2 w-[22%] -translate-x-1/2 -translate-y-1/2">
            {!reduce &&
              [0, 1].map((k) => (
                <motion.span
                  key={k}
                  aria-hidden
                  className="absolute inset-0 rounded-[28px] border-2 border-leaf"
                  animate={{ scale: [1, 1.25], opacity: [0.6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: k * 1.2, ease: 'easeOut' }}
                />
              ))}
            <div className="relative rounded-[28px] bg-white p-4 text-center text-ink shadow-[0_30px_70px_-20px_rgba(61,166,41,0.55)] ring-4 ring-leaf/30">
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-leaf text-white shadow-[0_0_0_6px_rgb(61_166_41/0.18)]">
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-leaf-deep">Klen Plus</p>
              <p className="font-display text-lg font-bold leading-tight">
                One order <span className="font-mono text-xs font-normal tabular-nums text-slate">{Math.min(3, Math.max(0, step - 1))}/3</span>
              </p>
              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {ERRANDS.map((e, i) => (
                  <span
                    key={e.label}
                    className={`relative grid aspect-square place-items-center rounded-xl transition-all duration-500 ${
                      done(i + 1) ? 'scale-100 bg-leaf-soft ring-2 ring-leaf' : 'scale-90 bg-paper ring-1 ring-line'
                    }`}
                  >
                    <span className={`block w-4/5 transition-opacity duration-500 ${done(i + 1) ? 'opacity-100' : 'opacity-20'}`}>
                      <VectorScene>
                        <Icon name={e.icon} />
                      </VectorScene>
                    </span>
                    <AnimatePresence>
                      {done(i + 1) && (
                        <motion.span
                          className="absolute -end-1 -top-1 grid size-4 place-items-center rounded-full bg-leaf text-white"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <Tick className="size-2.5" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* The one delivery van, driven by the scroll */}
          <motion.div
            aria-hidden
            className="absolute top-1/2 z-10 w-14 -translate-x-1/2 -translate-y-[60%]"
            style={{ left: vanX, opacity: vanOn }}
          >
            <svg viewBox="0 0 48 34" className="w-full drop-shadow-[0_8px_14px_rgba(61,166,41,0.5)]">
              <rect x="2" y="4" width="28" height="20" rx="4" fill="var(--color-leaf)" />
              <path d="M30 10h8l8 8v6H30z" fill="#fff" />
              <rect x="33" y="12" width="6" height="5" rx="1" fill="var(--color-ink)" />
              <circle cx="11" cy="26" r="4.5" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" />
              <circle cx="37" cy="26" r="4.5" fill="#fff" stroke="var(--color-ink)" strokeWidth="2" />
              <path d="M9 14h14M16 9v10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Right: the kitchen */}
          <div
            className={`vx-host absolute end-0 top-1/2 w-[19%] -translate-y-1/2 rounded-[24px] border p-4 text-center backdrop-blur-md transition-all duration-700 ${
              delivered ? 'scale-105 border-leaf bg-leaf/20 shadow-[0_0_60px_-10px_rgba(61,166,41,0.7)]' : 'border-white/15 bg-white/[0.06]'
            }`}
          >
            <span className="mx-auto block w-20 rounded-2xl bg-white p-1.5">
              <VectorScene>
                <Icon name="use:kitchen" />
              </VectorScene>
            </span>
            <p className="mt-3 font-display text-lg font-bold leading-tight">Your kitchen</p>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-leaf">{delivered ? 'Delivered ✓' : 'One delivery'}</p>
          </div>
        </div>
      </div>

      {/* Small screens: the same story as a stack */}
      <div className="relative mt-12 flex flex-col items-center gap-3 md:hidden">
        {ERRANDS.map((e) => (
          <div key={e.label} className="vx-host flex w-full max-w-sm items-center gap-3 rounded-2xl bg-white p-2.5 text-ink">
            <span className="block w-12 shrink-0 rounded-xl bg-leaf-soft p-1">
              <VectorScene>
                <Icon name={e.icon} />
              </VectorScene>
            </span>
            <span className="font-display font-bold">{e.label}</span>
            <span className="ms-auto font-mono text-[9px] uppercase tracking-[0.1em] text-slate line-through">{e.from}</span>
          </div>
        ))}
        <span aria-hidden className="text-2xl text-leaf">↓</span>
        <div className="w-full max-w-sm rounded-2xl bg-leaf p-4 text-center font-display text-lg font-bold">
          One Klen Plus order · one delivery
        </div>
      </div>

      {/* Quote + tally, landing at the end of the story */}
      <motion.div
        className={`relative grid items-center gap-6 border-t border-white/10 lg:grid-cols-[1.4fr_1fr] ${pinned ? 'mt-6 pt-6 short:mt-4 short:pt-4' : 'mt-16 pt-10'}`}
        style={pinned ? { opacity: tail, y: tailY } : undefined}
      >
        <blockquote className="border-s-4 border-leaf ps-6">
          <p className={`font-display font-semibold leading-snug ${pinned ? 'text-[clamp(1.2rem,1.8vw,1.6rem)]' : 'text-[clamp(1.4rem,2.3vw,2rem)]'}`}>
            Our purpose is to make those everyday supplies{' '}
            <span className="text-leaf">easier to find and order together.</span>
          </p>
        </blockquote>
        <ul className="grid grid-cols-3 gap-3">
          {[
            { v: '3', l: 'Suppliers', strike: true },
            { v: '1', l: 'Order' },
            { v: '1', l: 'Delivery' },
          ].map((x) => (
            <li
              key={x.l}
              className={`rounded-2xl text-center ${pinned ? 'p-3' : 'p-4'} ${x.strike ? 'border border-white/15 bg-white/[0.06]' : 'bg-white text-ink'}`}
            >
              <p className={`font-display font-extrabold ${pinned ? 'text-3xl' : 'text-4xl'} ${x.strike ? 'text-white/40 line-through decoration-leaf decoration-[3px]' : 'text-leaf'}`}>
                {x.v}
              </p>
              <p className={`mt-1 font-mono text-[10px] uppercase tracking-[0.16em] ${x.strike ? 'text-white/60' : 'text-slate'}`}>{x.l}</p>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  )
}

/**
 * Our purpose. On desktop the section pins: the navy panel locks into the screen (scaling up from
 * an inset card as it arrives) and the scroll plays the story beat by beat; the page moves on once the
 * delivery lands. Smaller screens and reduced motion get the finished panel, unpinned.
 */
export function Purpose() {
  const track = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const { scrollYProgress: arrive } = useScroll({ target: track, offset: ['start end', 'start start'] })
  const s = useTransform(scrollYProgress, [0.04, 0.96], [0, END])
  const lockScale = useTransform(arrive, [0.3, 1], [0.86, 1])
  const lockRadius = useTransform(arrive, [0.3, 1], [64, 0])
  const lockY = useTransform(arrive, [0.3, 1], [60, 0])
  const still = useMotionValue(END)
  const hint = useTransform(s, [0, 0.8], [1, 0])

  return (
    <section id="purpose" aria-labelledby="purpose-title" className="theme-light relative overflow-clip">
      {/* Desktop: pinned, scroll-driven */}
      <div ref={track} className="hidden h-[460svh] pin:motion-safe:block">
        <div className="sticky top-16 h-[calc(100svh-4rem)]">
          <motion.div className="h-full overflow-hidden" style={{ scale: lockScale, borderRadius: lockRadius, y: lockY }}>
            <PurposePanel s={s} pinned />
          </motion.div>
          {/* Scroll hint */}
          <motion.p
            aria-hidden
            className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50"
            style={{ opacity: hint }}
          >
            Scroll to build the order ↓
          </motion.p>
        </div>
      </div>

      {/* Other screens: the finished story */}
      <div className="pin:motion-safe:hidden">
        <div className="w-full">
          <PurposePanel s={still} pinned={false} />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── 05 · Who we serve ───────────────────────── */

/**
 * The businesses from the CMS as an expanding photo gallery: six tall panels side by side, the open one
 * widens to show its photo, floating product vectors, its usual orders and a progress bar; the others
 * show their name running up the side. Auto-advances, hover or click to open (stacked cards on mobile).
 */
function ServeGallery({
  items,
  images,
}: {
  items: { slug: string; name: string; orders: string[] }[]
  images: Record<string, string | undefined>
}) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(0)
  const [hold, setHold] = useState(false)
  const n = items.length
  useEffect(() => {
    if (reduce || hold || n < 2) return
    const t = setInterval(() => setOpen((v) => (v + 1) % n), 5000)
    return () => clearInterval(t)
  }, [reduce, hold, n, open])

  return (
    <div className="mt-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-leaf-deep">Who orders from us</p>
        <p className="font-mono text-[11px] tabular-nums text-slate">
          <span className="text-ink">{String(open + 1).padStart(2, '0')}</span> / {String(n).padStart(2, '0')}
        </p>
      </div>
      <ul
        className="flex flex-col gap-3 lg:h-[clamp(480px,62svh,640px)] lg:flex-row"
        onMouseLeave={() => setHold(false)}
      >
        {items.map((it, i) => {
          const on = open === i
          const lk = look(it.slug)
          return (
            <motion.li
              key={it.slug}
              className={`group relative isolate min-h-[340px] overflow-hidden rounded-[28px] bg-ink text-white transition-[flex-grow,box-shadow] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] lg:min-h-0 lg:min-w-[84px] ${
                on ? 'lg:flex-[5] shadow-[0_40px_80px_-34px_rgba(28,42,92,0.75)]' : 'lg:flex-[1] lg:cursor-pointer'
              }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
              onMouseEnter={() => {
                setHold(true)
                setOpen(i)
              }}
              onClick={() => setOpen(i)}
            >
              {images[it.slug] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images[it.slug]}
                  alt=""
                  className={`absolute inset-0 -z-10 h-full w-full object-cover transition duration-[1.4s] ease-out ${on ? 'scale-100' : 'scale-125 lg:grayscale-[40%]'}`}
                />
              )}
              <div
                className={`absolute inset-0 -z-10 transition-opacity duration-700 ${
                  on ? 'bg-gradient-to-t from-ink via-ink/40 to-transparent' : 'bg-gradient-to-t from-ink via-ink/70 to-ink/40'
                }`}
              />
              <span aria-hidden className={`pointer-events-none absolute inset-0 rounded-[28px] ring-2 ring-inset transition duration-500 ${on ? 'ring-leaf/70' : 'ring-transparent'}`} />
              {on && <span aria-hidden className="ind-sheen pointer-events-none absolute inset-0 -z-10" />}

              {/* Collapsed: icon on top, name running up the side (desktop) */}
              <div className={`absolute inset-0 hidden flex-col items-center justify-between py-6 transition-opacity duration-300 lg:flex ${on ? 'pointer-events-none opacity-0' : 'opacity-100 delay-300'}`}>
                <span className="grid size-11 place-items-center rounded-2xl bg-white/90">
                  <VectorScene className="w-8">
                    <UseVector name={lk.icon} className="w-full" />
                  </VectorScene>
                </span>
                <span className="whitespace-nowrap font-display text-lg font-bold tracking-[-0.01em] [writing-mode:vertical-rl] rotate-180">
                  {it.name}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-white/60">{String(i + 1).padStart(2, '0')}</span>
              </div>

              {/* Open */}
              <div className={`relative flex h-full flex-col p-6 transition-opacity duration-500 md:p-8 ${on ? 'opacity-100 delay-300' : 'lg:pointer-events-none lg:opacity-0'}`}>
                <div className="flex items-start justify-between">
                  <span className="flex items-center gap-3 rounded-2xl bg-white/90 py-1.5 pe-4 ps-1.5 text-ink shadow-lg backdrop-blur">
                    <span className="grid size-10 place-items-center rounded-xl bg-leaf-soft">
                      <VectorScene className="w-8">
                        <UseVector name={lk.icon} className="w-full" />
                      </VectorScene>
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-leaf-deep">
                      {String(i + 1).padStart(2, '0')} · Who we serve
                    </span>
                  </span>
                </div>

                {/* Floating products */}
                <ul aria-hidden className="pointer-events-none absolute end-6 top-24 hidden flex-col items-end gap-3 sm:flex md:end-8">
                  {lk.items.map((key, b) => (
                    <li key={`${open}-${key}`} className={b === 1 ? 'me-12' : ''}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.4, rotate: b % 2 ? 20 : -20 }}
                        animate={on ? { opacity: 1, scale: 1, rotate: b % 2 ? 6 : -6 } : { opacity: 0, scale: 0.4 }}
                        transition={{ type: 'spring', stiffness: 220, damping: 15, delay: on ? 0.45 + b * 0.12 : 0 }}
                      >
                        <div
                          className="vx-drift w-20 rounded-[22px] bg-white/85 p-1.5 shadow-[0_20px_40px_-18px_rgba(5,10,35,0.8)] ring-1 ring-white backdrop-blur-md md:w-24"
                          style={{ '--d': `${-b * 2.3}s`, '--dur': `${8 + b}s` } as CSSProperties}
                        >
                          <VectorScene>
                            <ItemVector name={key} className="w-full" />
                          </VectorScene>
                        </div>
                      </motion.div>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto max-w-xl">
                  <h3 className="font-display text-[clamp(1.8rem,3vw,3rem)] font-bold leading-none tracking-[-0.03em]">{it.name}</h3>
                  {it.orders.length > 0 && (
                    <>
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-leaf">Usually orders</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {it.orders.map((o, j) => (
                          <motion.li
                            key={`${open}-${o}`}
                            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 py-1 pe-3 ps-1.5 text-sm text-white/90 backdrop-blur"
                            initial={false}
                            animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ duration: 0.4, delay: on ? 0.5 + j * 0.06 : 0, ease: EASE }}
                          >
                            <span className="grid size-4 place-items-center rounded-full bg-leaf text-white">
                              <Tick className="size-2.5" />
                            </span>
                            {o}
                          </motion.li>
                        ))}
                      </ul>
                    </>
                  )}
                  {/* Time left on this panel */}
                  <div className="mt-6 hidden h-1 overflow-hidden rounded-full bg-white/15 lg:block">
                    {on && (
                      <motion.span
                        key={`${open}-${hold}`}
                        className="block h-full origin-left rounded-full bg-leaf"
                        initial={{ scaleX: hold || reduce ? 1 : 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: hold || reduce ? 0.3 : 5, ease: 'linear' }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}

/** The six routines placed through a working day, morning to night. */
const DAY: { time: string; part: string; who: string; task: string; icon: AnyIcon }[] = [
  { time: '07:00', part: 'Morning rush', who: 'Cafés', task: 'Cups and lids for the morning rush', icon: 'use:cafe' },
  { time: '09:00', part: 'Doors open', who: 'Retailers', task: 'Bags and packing for the counter', icon: 'use:counter' },
  { time: '10:30', part: 'Mid-morning', who: 'Offices', task: 'Tissue and supplies for shared spaces', icon: 'use:storeroom' },
  { time: '12:00', part: 'Lunch service', who: 'Caterers', task: 'Trays and wraps for service', icon: 'use:catering' },
  { time: '15:00', part: 'Turnover', who: 'Hotels', task: 'Replenishing guest washrooms', icon: 'use:washroom' },
  { time: '20:00', part: 'After hours', who: 'Facilities teams', task: 'Cleaning shared spaces every day', icon: 'use:floor' },
]

/**
 * Light. A split heading (title left, intro right), then "a day of routines": six teams placed on a
 * timeline from 07:00 to 20:00, the Klen Plus "+" travelling along the line and lighting each card in turn
 * (click or hover to jump). Below, the businesses from the CMS as a bento grid of photo tiles.
 */
export function Serve({
  industries,
  images,
}: {
  industries: { slug: string; name: string; orders?: string | null }[]
  images: Record<string, string | undefined>
}) {
  const reduce = useReducedMotion()
  const [r, setR] = useState(0)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (reduce || hold) return
    const t = setInterval(() => setR((v) => (v + 1) % DAY.length), 2600)
    return () => clearInterval(t)
  }, [reduce, hold])
  const at = (r + 0.5) / DAY.length
  const split = (s?: string | null) =>
    (s ?? '')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)

  return (
    <Section id="serve" labelledBy="serve-title">
      {/* Split heading */}
      <div className="grid items-end gap-8 border-b border-line pb-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <SectionHead id="serve-title" eyebrow="Who we serve" title="Built Around How You Work" highlight="How You Work" />
        <motion.p
          className="max-w-xl text-lg text-slate lg:justify-self-end"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          A café needs cups and lids for its morning rush. A caterer needs trays and wraps for service.
          Hotels, retailers, offices and facilities teams have their own routines, from replenishing
          washrooms to cleaning shared spaces. Our range supports the people responsible for each of
          those tasks.
        </motion.p>
      </div>

      {/* A day of routines */}
      <div className="relative mt-10" onMouseLeave={() => setHold(false)}>
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em]">
          <span className="text-leaf-deep">A day of routines</span>
          <span className="tabular-nums text-slate">
            <motion.span key={r} className="inline-block text-ink" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              {DAY[r].time}
            </motion.span>{' '}
            · {DAY[r].part}
          </span>
        </div>

        {/* Track with the Klen Plus "+" marker (desktop) */}
        <div className="relative mt-8 hidden h-10 lg:block" aria-hidden>
          <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line" />
          <motion.div
            className="absolute start-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gradient-to-r from-[#f5b941] via-leaf to-navy"
            initial={false}
            animate={{ width: `${at * 100}%` }}
            transition={{ duration: 0.9, ease: EASE }}
          />
          {DAY.map((d, i) => (
            <span
              key={d.who}
              className={`absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white transition-colors duration-500 ${i <= r ? 'bg-leaf' : 'bg-line'}`}
              style={{ left: `${((i + 0.5) / DAY.length) * 100}%` }}
            />
          ))}
          <motion.div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            initial={false}
            animate={{ left: `${at * 100}%` }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <span className="relative grid size-10 place-items-center rounded-full bg-white shadow-[0_10px_24px_-10px_rgba(28,42,92,0.5)] ring-1 ring-line">
              {!reduce && (
                <motion.span
                  className="absolute inset-0 rounded-full border-2 border-leaf"
                  animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
              {/* Klen Plus "+" travelling along the day (in place of the sun) */}
              <motion.img
                src="/media/brand/plus-mark.png"
                alt=""
                className="size-7 object-contain"
                animate={reduce ? undefined : { scale: [1, 1.1, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </span>
          </motion.div>
        </div>

        {/* Routine cards */}
        <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-4 lg:grid-cols-6">
          {DAY.map((d, i) => {
            const on = r === i
            return (
              <motion.li
                key={d.who}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => setR(i)}
                  onMouseEnter={() => {
                    setHold(true)
                    setR(i)
                  }}
                  aria-pressed={on}
                  className={`vx-host relative flex h-full w-full flex-col overflow-hidden rounded-[22px] border p-4 text-start transition-all duration-500 ${
                    on
                      ? '-translate-y-2 border-leaf bg-white shadow-[0_28px_50px_-26px_rgba(61,166,41,0.65)]'
                      : 'border-line bg-white/70 hover:bg-white'
                  }`}
                >
                  <span aria-hidden className={`absolute inset-x-0 top-0 h-1 origin-left bg-leaf transition-transform duration-500 ${on ? 'scale-x-100' : 'scale-x-0'}`} />
                  <span className="flex items-center justify-between font-mono text-[11px] tabular-nums">
                    <span className={on ? 'text-leaf-deep' : 'text-slate/70'}>{d.time}</span>
                    <span className="uppercase tracking-[0.12em] text-slate/60">{d.part}</span>
                  </span>
                  <span
                    className={`mt-4 grid size-16 place-items-center rounded-2xl transition-all duration-500 ${on ? 'scale-110 bg-leaf-soft' : 'bg-paper'}`}
                  >
                    <VectorScene className="w-12">
                      <Icon name={d.icon} delay={0.2 + i * 0.08} />
                    </VectorScene>
                  </span>
                  <span className="mt-4 font-display text-lg font-bold leading-tight text-ink">{d.who}</span>
                  <span className="mt-1 text-sm leading-snug text-slate">{d.task}</span>
                </button>
              </motion.li>
            )
          })}
        </ol>
      </div>

      {industries.length > 0 && (
        <ServeGallery items={industries.map((it) => ({ slug: it.slug, name: it.name, orders: split(it.orders) }))} images={images} />
      )}
    </Section>
  )
}
