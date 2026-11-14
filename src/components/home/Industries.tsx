'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Home } from '@/payload-types'
import type { MediaIndex } from '@/lib/media'
import Media from '../Media'
import Tilt3D from '../vectors/Tilt3D'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import { UseVector, type UseKey } from '../vectors/TissueVectors'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Items = NonNullable<Home['industries']>

const clamp01 = gsap.utils.clamp(0, 1)
const EASE = [0.2, 0.7, 0.2, 1] as const

/** Per industry: the icon on its row and three products that float around its photo. */
const LOOK: Record<string, { icon: UseKey; items: ItemKey[] }> = {
  restaurant: { icon: 'kitchen', items: ['cat:aluminium', 'cat:takeaway', 'carry-bag'] },
  cafe: { icon: 'cafe', items: ['rippled', 'pet-glass', 'straws'] },
  bakery: { icon: 'table', items: ['paper-bag', 'sandwich', 'cling'] },
  hotel: { icon: 'catering', items: ['interfold', 'napkin', 'cat:chemicals'] },
  facility: { icon: 'floor', items: ['garbage', 'maxi', 'mop'] },
  salon: { icon: 'washroom', items: ['glove-nitrile', 'hairnet', 'cat:hygiene'] },
}
const look = (slug?: string | null) =>
  LOOK[slug ?? ''] ?? {
    icon: 'storeroom' as UseKey,
    items: ['stack', 'cat:bags', 'cat:chemicals'] as ItemKey[],
  }

/** Where the three product badges float around the photo frame. */
const BADGES = [
  { className: '-start-10 top-[12%] w-28', rotate: -8, d: '0s' },
  { className: '-end-8 top-[38%] w-24', rotate: 7, d: '-3s' },
  { className: 'end-[18%] -bottom-10 w-24', rotate: -5, d: '-6s' },
]
const wipe = gsap.parseEase('power3.inOut')

const orders = (text?: string | null) =>
  (text ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)

/** Soft bubbles rising behind the section (fixed positions so server and client match). */
const BUBBLES = [
  { x: '4%', s: 14, d: '0s', t: '14s' },
  { x: '12%', s: 8, d: '-6s', t: '11s' },
  { x: '23%', s: 18, d: '-3s', t: '17s' },
  { x: '36%', s: 10, d: '-9s', t: '13s' },
  { x: '47%', s: 6, d: '-2s', t: '10s' },
  { x: '58%', s: 16, d: '-11s', t: '16s' },
  { x: '69%', s: 9, d: '-5s', t: '12s' },
  { x: '78%', s: 20, d: '-8s', t: '18s' },
  { x: '88%', s: 7, d: '-1s', t: '11s' },
  { x: '95%', s: 12, d: '-7s', t: '15s' },
]

/**
 * Pinned full-width layout (desktop), three columns: the list of buyer types (animated icon per row, a
 * white pill sliding to the active one), the photo stage (each industry's photo wipes up over the last,
 * product vectors float around the frame, viewfinder corners breathe, a light sweep passes, a progress
 * ring counts), and a receipt-style card that ticks off what that industry usually orders. A flowing
 * connector line, rising bubbles, glows, a dot grid and a giant ghost number sit behind. Clicking a row
 * scrolls to it.
 * Smaller screens and reduced motion get the card grid with a clip reveal as each card enters.
 */
export default function Industries({
  title,
  items,
  media,
}: {
  title?: string | null
  items: Items
  media: MediaIndex
}) {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const n = items.length

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        '(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)',
        () => {
          const el = root.current!
          const frames = gsap.utils.toArray<HTMLElement>('.ind-frame', el)
          const photos = gsap.utils.toArray<HTMLElement>('.ind-photo', el)
          const bars = gsap.utils.toArray<HTMLElement>('.ind-bar', el)
          let last = -1

          const update = (p: number) => {
            // Step i is on screen while p·n is in [i, i+1); each change starts a little before the boundary.
            const s = p * n
            for (let i = 0; i < n; i++) {
              const t = i === 0 ? 1 : wipe(clamp01((s - (i - 0.35)) / 0.55))
              const next = i === n - 1 ? 0 : wipe(clamp01((s - (i + 1 - 0.35)) / 0.55))
              frames[i].style.clipPath = `inset(${(1 - t) * 100}% 0 0 0)`
              // Settles from a zoom as it arrives, then drifts up a touch as the next one covers it.
              photos[i].style.transform = `scale(${1.18 - 0.18 * t}) translateY(${-6 * next}%)`
              bars[i].style.transform = `scaleX(${clamp01(s - i)})`
            }
            const idx = Math.min(n - 1, Math.floor(s))
            if (idx !== last) setActive((last = idx))
          }

          const st = ScrollTrigger.create({
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => update(self.progress),
            onRefresh: (self) => update(self.progress),
          })
          return () => st.kill()
        },
      )
    },
    { scope: root, dependencies: [n] },
  )

  const jump = (i: number) => {
    const el = root.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + range * ((i + 0.55) / n), behavior: 'smooth' })
  }

  return (
    <section
      id="industries"
      ref={root}
      className="relative bg-paper"
      style={{ '--steps': n } as React.CSSProperties}
    >
      {/* Desktop: pinned split with curtain reveals */}
      <div className="hidden pin:motion-safe:block pin:motion-safe:h-[calc(var(--steps)*70svh)]">
        <div className="sticky top-16 overflow-hidden px-10 pb-4 pt-8 2xl:px-14">
          {/* Backdrop: dot grid, a leaf glow that follows the active row, a navy glow, a giant ghost number */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(40_58_125/0.09)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute start-[8%] size-[460px] rounded-full bg-leaf/20 blur-[110px]"
            animate={{ top: `${10 + (active / Math.max(1, n - 1)) * 55}%` }}
            transition={{ duration: 1, ease: EASE }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -end-32 -top-32 size-[520px] rounded-full bg-navy/15 blur-[120px]"
          />
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={active}
              aria-hidden
              className="pointer-events-none absolute start-[22%] top-[52%] -translate-y-1/2 select-none font-display text-[clamp(14rem,24vw,24rem)] font-extrabold leading-none tracking-[-0.06em] text-mist"
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -80 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {String(active + 1).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>

          {/* Flowing connector across the whole width, and rising bubbles */}
          <svg
            aria-hidden
            viewBox="0 0 1600 200"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-1/2 h-48 w-full -translate-y-1/2"
          >
            <path
              className="ind-flow"
              d="M0 120 C200 60 380 160 560 110 C760 55 900 150 1080 100 C1260 50 1420 140 1600 90"
              fill="none"
              stroke="var(--color-leaf)"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {BUBBLES.map((b, i) => (
              <span
                key={i}
                className="ind-bubble absolute bottom-[-40px] rounded-full border border-navy/15 bg-white/50"
                style={
                  {
                    left: b.x,
                    width: b.s,
                    height: b.s,
                    animationDelay: b.d,
                    animationDuration: b.t,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          <div className="relative mx-auto grid w-full max-w-[1840px] grid-cols-[minmax(320px,0.95fr)_minmax(0,1.6fr)_minmax(280px,0.8fr)] items-center gap-12 2xl:gap-16">
            <div>
              <p className="label !text-leaf-deep">Who orders from us</p>
              <h2 className="mt-3 text-[clamp(2.2rem,3.3vw,3.8rem)] font-bold leading-[0.95] tracking-[-0.035em] short:text-5xl">
                {title}
              </h2>

              <ol className="mt-10 flex flex-col gap-1 short:mt-6">
                {items.map((it, i) => {
                  const on = active === i
                  return (
                    <li key={it.id ?? it.slug} data-industry={it.slug} className="relative">
                      {on && (
                        <motion.span
                          layoutId="ind-active"
                          className="absolute inset-0 rounded-2xl bg-white shadow-[0_18px_40px_-22px_rgba(28,42,92,0.45)] ring-1 ring-line"
                          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => jump(i)}
                        aria-current={on ? 'step' : undefined}
                        className="group relative flex w-full items-center gap-4 rounded-2xl px-3 py-2.5 text-start short:py-1.5"
                      >
                        <span
                          className={`grid size-11 shrink-0 place-items-center rounded-xl transition-colors duration-500 short:size-9 ${on ? 'bg-leaf-soft' : 'bg-white/60 group-hover:bg-white'}`}
                        >
                          <VectorScene
                            drawn
                            className={`w-9 transition-opacity duration-500 short:w-7 ${on ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'}`}
                          >
                            <UseVector name={look(it.slug).icon} className="w-full" />
                          </VectorScene>
                        </span>
                        <span
                          className={`flex-1 font-display text-[clamp(1.1rem,1.6vw,1.5rem)] font-bold tracking-[-0.02em] transition-[color,transform] duration-500 ${
                            on ? 'translate-x-1 text-ink' : 'text-slate/55 group-hover:text-slate'
                          }`}
                        >
                          {it.name}
                        </span>
                        <span
                          className={`font-mono text-xs tabular-nums transition-colors ${on ? 'text-leaf-deep' : 'text-slate/50'}`}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span className="ind-bar absolute inset-x-3 bottom-0 h-0.5 origin-left scale-x-0 rounded-full bg-leaf" />
                      </button>
                    </li>
                  )
                })}
              </ol>
            </div>

            {/* Centre: the photo stage, tilting in 3D with the badges floating in front */}
            <Tilt3D className="relative" max={7} enter={14}>
              {/* Product vectors floating around the frame, swapped per industry */}
              <AnimatePresence mode="popLayout" initial={false}>
                {look(items[active]?.slug).items.map((key, b) => (
                  <motion.div
                    key={`${active}-${key}`}
                    className={`pointer-events-none absolute z-30 ${BADGES[b].className}`}
                    style={{ z: 90 }}
                    initial={{ opacity: 0, scale: 0.4, rotate: BADGES[b].rotate * 3 }}
                    animate={{ opacity: 1, scale: 1, rotate: BADGES[b].rotate }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      delay: 0.25 + b * 0.1,
                    }}
                  >
                    <div
                      className="vx-drift rounded-[28px] bg-white/80 p-2 shadow-[0_24px_50px_-20px_rgba(28,42,92,0.45)] ring-1 ring-white backdrop-blur-md"
                      style={{ '--d': BADGES[b].d, '--dur': '9s' } as React.CSSProperties}
                    >
                      <VectorScene>
                        <ItemVector name={key} delay={0.35 + b * 0.12} className="w-full" />
                      </VectorScene>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="ind-stage relative aspect-[16/11] max-h-[70svh] w-full overflow-hidden rounded-[32px] bg-mist shadow-[0_40px_90px_-30px_rgba(28,42,92,0.45)] ring-1 ring-white/60">
                {items.map((it, i) => (
                  <div
                    key={it.id ?? it.slug}
                    className="ind-frame absolute inset-0 overflow-hidden will-change-[clip-path]"
                    style={{ zIndex: i + 1, clipPath: i === 0 ? undefined : 'inset(100% 0 0 0)' }}
                  >
                    <div className="ind-photo h-full w-full will-change-transform">
                      <Media
                        asset={media[`industries/${it.slug}`]}
                        slot={`industries/${it.slug}`}
                        alt={it.name}
                        eager={i < 2}
                      />
                    </div>
                  </div>
                ))}
                {/* Light sweep across the glass */}
                <span aria-hidden className="ind-sheen pointer-events-none absolute inset-0 z-20" />
                {/* Viewfinder corners that breathe */}
                <span aria-hidden className="pointer-events-none absolute inset-5 z-20">
                  {[
                    'start-0 top-0 border-s-2 border-t-2 rounded-tl-xl',
                    'end-0 top-0 border-e-2 border-t-2 rounded-tr-xl',
                    'start-0 bottom-0 border-s-2 border-b-2 rounded-bl-xl',
                    'end-0 bottom-0 border-e-2 border-b-2 rounded-br-xl',
                  ].map((c) => (
                    <span key={c} className={`ind-corner absolute size-8 border-white/90 ${c}`} />
                  ))}
                </span>

                {/* Progress ring with the count */}
                <div className="absolute end-6 top-6 z-20 flex items-center gap-2 rounded-full bg-white/80 py-1 pe-3 ps-1 font-mono text-xs tabular-nums shadow-sm backdrop-blur">
                  <svg viewBox="0 0 36 36" className="size-8 -rotate-90" aria-hidden>
                    <circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="var(--color-line)"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15"
                      fill="none"
                      stroke="var(--color-leaf)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={false}
                      animate={{ pathLength: (active + 1) / n }}
                      transition={{ duration: 0.8, ease: EASE }}
                    />
                  </svg>
                  {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                </div>

                {/* Name chip */}
                <>
                  <motion.div
                    key={active}
                    className="absolute bottom-6 start-6 z-20 flex items-center gap-3 rounded-2xl bg-white/85 py-2 pe-4 ps-2 shadow-[0_16px_40px_-20px_rgba(28,42,92,0.5)] backdrop-blur-xl"
                    initial={{ opacity: 0, y: 18, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <span className="grid size-10 place-items-center rounded-xl bg-leaf-soft">
                      <VectorScene className="w-8">
                        <UseVector name={look(items[active]?.slug).icon} className="w-full" />
                      </VectorScene>
                    </span>
                    <span className="font-display text-lg font-bold leading-tight text-ink">
                      {items[active]?.name}
                    </span>
                  </motion.div>
                </>
              </div>
            </Tilt3D>

            {/* Right: their usual list, ticked off line by line */}
            <Tilt3D className="relative" max={9} enter={-12}>
              <>
                <motion.div
                  key={active}
                  className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_30px_70px_-30px_rgba(28,42,92,0.45)] backdrop-blur-xl short:p-5"
                  initial={{ opacity: 0, x: 30, rotate: 2 }}
                  animate={{ opacity: 1, x: 0, rotate: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.55, ease: EASE }}
                >
                  {/* Torn-receipt edge at the top */}
                  <svg
                    aria-hidden
                    viewBox="0 0 200 8"
                    preserveAspectRatio="none"
                    className="absolute inset-x-0 top-0 h-2 w-full text-leaf"
                  >
                    <path
                      d="M0 0 H200 V3 L195 8 L190 3 L185 8 L180 3 L175 8 L170 3 L165 8 L160 3 L155 8 L150 3 L145 8 L140 3 L135 8 L130 3 L125 8 L120 3 L115 8 L110 3 L105 8 L100 3 L95 8 L90 3 L85 8 L80 3 L75 8 L70 3 L65 8 L60 3 L55 8 L50 3 L45 8 L40 3 L35 8 L30 3 L25 8 L20 3 L15 8 L10 3 L5 8 L0 3 Z"
                      fill="currentColor"
                    />
                  </svg>
                  <div className="flex items-center gap-4">
                    <div className="relative size-20 shrink-0 short:size-16">
                      <svg
                        aria-hidden
                        viewBox="0 0 100 100"
                        className="vx-orbit absolute inset-0 text-leaf"
                        style={{ '--dur': '14s' } as React.CSSProperties}
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="47"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="4 7"
                          strokeLinecap="round"
                        />
                        <circle cx="50" cy="3" r="4" fill="currentColor" />
                      </svg>
                      <div className="absolute inset-2 rounded-full bg-white shadow-sm">
                        <VectorScene>
                          <UseVector name={look(items[active]?.slug).icon} className="w-full" />
                        </VectorScene>
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-leaf-deep">
                        Their usual list
                      </p>
                      <p className="mt-1 font-display text-xl font-bold leading-tight text-ink">
                        {items[active]?.name}
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 flex flex-col gap-2 short:mt-4">
                    {orders(items[active]?.orders).map((o, j) => (
                      <motion.li
                        key={o}
                        className="flex items-center gap-3 rounded-xl bg-paper px-3 py-2.5 text-[15px] font-medium text-ink short:py-2"
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 + j * 0.1, ease: EASE }}
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf text-white">
                          <svg
                            viewBox="0 0 16 16"
                            className="size-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden
                          >
                            <motion.path
                              d="M3.5 8.5l3 3 6-7"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.35, delay: 0.45 + j * 0.1 }}
                            />
                          </svg>
                        </span>
                        {o}
                      </motion.li>
                    ))}
                  </ul>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-4 short:mt-4">
                    <span className="font-mono text-xs text-slate">
                      {orders(items[active]?.orders).length} lines · one delivery
                    </span>
                    <a
                      href="#quote"
                      className="group flex items-center gap-1.5 whitespace-nowrap rounded-full bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf-deep"
                    >
                      Send a list like this
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        →
                      </span>
                    </a>
                  </div>
                </motion.div>
              </>
            </Tilt3D>
          </div>
        </div>
      </div>

      {/* Small screens and reduced motion: cards with a clip reveal */}
      <div className="px-5 py-14 md:px-10 md:py-20 pin:motion-safe:hidden">
        <div className="mx-auto max-w-[1260px]">
          <p className="label !text-leaf-deep">Who orders from us</p>
          <h2 className="mt-3 text-[clamp(2.4rem,5.4vw,5rem)] font-bold leading-[0.95] tracking-[-0.035em]">
            {title}
          </h2>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it, i) => (
              <motion.article
                key={it.id ?? it.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.2, 0.7, 0.2, 1] }}
                className="overflow-hidden rounded-[22px] border border-line bg-white"
              >
                <motion.div
                  className="aspect-[16/10] overflow-hidden"
                  initial={{ clipPath: 'inset(0 0 100% 0)' }}
                  whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.65, 0, 0.35, 1] }}
                >
                  <Media
                    asset={media[`industries/${it.slug}`]}
                    slot={`industries/${it.slug}`}
                    alt={it.name}
                  />
                </motion.div>
                <div className="flex flex-col gap-2 px-5 pb-6 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-leaf-soft">
                      <VectorScene className="w-9">
                        <UseVector name={look(it.slug).icon} className="w-full" />
                      </VectorScene>
                    </span>
                    <h3 className="text-[22px] font-bold tracking-[-0.02em]">{it.name}</h3>
                  </div>
                  {it.orders && (
                    <p className="text-[15px] text-slate">
                      <b className="mb-0.5 block font-mono text-[11.5px] font-medium uppercase tracking-[0.06em] text-leaf-deep">
                        Usually orders
                      </b>
                      {it.orders}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
