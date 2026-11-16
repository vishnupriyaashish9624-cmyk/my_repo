'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { Arrow } from '../Header'
import { EASE, Icon, Section, Tick, type AnyIcon } from './ui'

/** The product photos in the "under one roof" mosaic. */
const MOSAIC = [
  { src: '/media/about/cups-photo.webp', label: 'Paper cups & food containers', cls: 'row-span-2' },
  { src: '/media/about/aluminium-photo.webp', label: 'Aluminium foil', cls: '' },
  { src: '/media/about/bags-photo.webp', label: 'Bags & films', cls: '' },
  { src: '/media/about/chemicals-photo.webp', label: 'Cleaning essentials', cls: 'col-span-2' },
]
const SERVED: { label: string; icon: AnyIcon }[] = [
  { label: 'Restaurants', icon: 'use:kitchen' },
  { label: 'Hotels', icon: 'use:washroom' },
  { label: 'Cafés', icon: 'use:cafe' },
  { label: 'Catering', icon: 'use:catering' },
  { label: 'Offices', icon: 'use:storeroom' },
  { label: 'Commercial facilities', icon: 'use:floor' },
]
const HELP: { title: string; icon: AnyIcon }[] = [
  { title: 'Explore suitable products', icon: 'cat:takeaway' },
  { title: 'Compare available options', icon: 'stack' },
  { title: 'Choose the right materials, sizes and quantities', icon: 'product-box' },
]
const TITLE: { w: string; leaf?: boolean }[] = [
  { w: 'Everyday' },
  { w: 'Essentials.' },
  { w: 'One', leaf: true },
  { w: 'Trusted', leaf: true },
  { w: 'Source.', leaf: true },
]

/** A block of the story that tells the photo stage to show its picture while it is mid-screen. */
function Beat({
  index,
  onShow,
  children,
  as = 'div',
  className = '',
}: {
  index: number
  onShow: (i: number) => void
  children: ReactNode
  as?: 'div' | 'li'
  className?: string
}) {
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null)
  const mid = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (mid) onShow(index)
  }, [mid, index, onShow])
  const Tag = as === 'li' ? motion.li : motion.div
  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: EASE }}
    >
      {children}
    </Tag>
  )
}

/**
 * "Who we are" (light), the opening of chapter 01 under the hero film.
 * Top: the headline rises word by word beside the opening line and a CTA. Middle: a large photo that
 * sticks beside the story; as the story, then each of the three ways we help (a vertical 01 → 02 → 03
 * timeline) reaches mid-screen, the next product family wipes up into the frame. The businesses we serve
 * follow as chips. Bottom: the goal as a full-width navy band with a sweeping sheen.
 */
export default function WhoWeAre({ productsHref }: { productsHref: string }) {
  const root = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const lift = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60])
  /** Which product family the photo stage shows: follows the story beat in the middle of the screen. */
  const [shot, setShot] = useState(0)

  return (
    <Section id="who-we-are" labelledBy="who-title" className="!pt-16 md:!pt-24" sectionRef={root}>
      <motion.div
        aria-hidden
        style={{ y: lift }}
        className="pointer-events-none absolute -end-40 top-20 size-[560px] rounded-full bg-leaf/15 blur-[120px]"
      />

      {/* ── Top: headline + opening line ── */}
      <div className="relative grid items-end gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <div>
          <motion.p
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-leaf-deep"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="h-px w-7 bg-leaf" />
            Who we are
          </motion.p>
          <h2 id="who-title" className="mt-3 text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[0.95] tracking-[-0.04em]">
            {TITLE.map((t, i) => (
              <span key={i} className="word-mask inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={`inline-block ${t.leaf ? 'text-leaf' : ''}`}
                  initial={{ y: '115%', rotate: 4 }}
                  whileInView={{ y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
                >
                  {t.w}
                  {i < TITLE.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </h2>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
        >
          <p className="text-xl leading-relaxed text-ink">
            At Klen Plus, we bring together packaging, hygiene, cleaning and everyday business supplies{' '}
            <strong className="font-semibold text-leaf-deep">under one roof.</strong>
          </p>
          <a
            href={productsHref}
            className="group/btn mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition hover:bg-leaf"
          >
            Explore Our Products
            <span className="transition-transform group-hover/btn:translate-x-1">
              <Arrow />
            </span>
          </a>
        </motion.div>
      </div>

      {/* ── Middle: a sticky photo that changes as the story scrolls past ── */}
      <div className="relative mt-16 grid items-start gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* Photo stage (sticks while the story beside it scrolls) */}
        <div className="relative lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-[#e8ecf3] shadow-[0_40px_80px_-40px_rgba(28,42,92,0.55)] sm:aspect-[5/4] lg:aspect-auto lg:h-[min(calc(100svh-9rem),760px)]">
            {MOSAIC.map((m, i) => (
              <motion.div
                key={m.src}
                className="absolute inset-0"
                initial={false}
                animate={{
                  clipPath: i <= shot ? 'inset(0% 0% 0% 0% round 0px)' : 'inset(100% 0% 0% 0% round 0px)',
                  scale: i === shot ? 1 : 1.08,
                }}
                transition={{ duration: 0.9, ease: EASE }}
                style={{ zIndex: i }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.src}
                  alt={m.label}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </motion.div>
            ))}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />

            {/* Caption + counter */}
            <div className="absolute inset-x-5 bottom-5 z-20 flex items-end justify-between gap-4">
              <motion.span
                key={shot}
                className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-ink shadow-sm backdrop-blur"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className="size-2 rounded-full bg-leaf" />
                {MOSAIC[shot].label}
              </motion.span>
              <span className="font-mono text-xs tabular-nums text-white/90">
                0{shot + 1} / 0{MOSAIC.length}
              </span>
            </div>

            {/* Thumbnails along the top: which family is showing */}
            <div className="absolute inset-x-5 top-5 z-20 flex gap-1.5">
              {MOSAIC.map((m, i) => (
                <span key={m.src} className="h-1 flex-1 overflow-hidden rounded-full bg-white/35">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-white"
                    initial={false}
                    animate={{ scaleX: i <= shot ? 1 : 0 }}
                    transition={{ duration: 0.6, ease: EASE }}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Seal, overlapping the corner */}
          <motion.div
            aria-hidden
            className="absolute -end-6 -top-6 z-30 size-32 md:size-36"
            initial={{ opacity: 0, scale: 0.4, rotate: -120 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 0.4 }}
          >
            <div className="relative size-full rounded-full bg-white shadow-[0_30px_60px_-20px_rgba(28,42,92,0.6)] ring-8 ring-white/50">
              <motion.svg
                viewBox="0 0 160 160"
                className="absolute inset-0 size-full"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <path id="wwa-ring" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
                </defs>
                <text className="fill-ink font-mono text-[11px] uppercase" letterSpacing="3.4">
                  <textPath href="#wwa-ring">Under one roof • One trusted source •</textPath>
                </text>
              </motion.svg>
              <span className="absolute inset-[33%] grid place-items-center rounded-full bg-leaf text-white shadow-[0_0_0_8px_rgb(61_166_41/0.18)]">
                <svg viewBox="0 0 24 24" className="size-7">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Story, then the three ways we help as a vertical timeline */}
        <div className="flex flex-col">
          <Beat index={0} onShow={setShot}>
            <div className="flex flex-col gap-4 text-lg leading-relaxed text-slate">
              <p>
                From food containers, aluminium foil and paper cups to tissues, cleaning essentials and personal
                hygiene products, our range supports the daily needs of restaurants, hotels, cafés, catering
                businesses, offices and commercial facilities.
              </p>
              <p>
                We understand that <span className="font-semibold text-ink">every business has different requirements.</span>{' '}
                That&apos;s why we focus on helping customers explore suitable products, compare available options
                and choose the right materials, sizes and quantities for their operations.
              </p>
            </div>
          </Beat>

          <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.16em] text-leaf-deep">How we help</p>
          <ol className="relative mt-6">
            {/* Rail that fills as each step is reached */}
            <span aria-hidden className="absolute bottom-8 start-[27px] top-8 w-0.5 bg-line">
              <motion.span
                className="absolute inset-x-0 top-0 origin-top bg-leaf"
                initial={false}
                animate={{ height: `${(Math.max(0, shot - 1) / (HELP.length - 1)) * 100}%` }}
                transition={{ duration: 0.7, ease: EASE }}
              />
            </span>
            {HELP.map((h, i) => {
              const reached = shot >= i + 1
              const on = shot === i + 1
              return (
                <Beat key={h.title} index={i + 1} onShow={setShot} as="li" className="relative flex gap-6 py-6">
                  <span
                    className={`relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-2 font-display text-lg font-extrabold transition-colors duration-500 ${
                      reached ? 'border-leaf bg-leaf text-white' : 'border-line bg-white text-slate'
                    }`}
                  >
                    {on && !reduce && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-leaf"
                        animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                    0{i + 1}
                  </span>
                  <div
                    className={`vx-host flex flex-1 items-center gap-4 rounded-2xl border bg-white p-4 transition-all duration-500 ${
                      on ? 'border-leaf shadow-[0_24px_40px_-24px_rgba(61,166,41,0.7)]' : 'border-line'
                    }`}
                  >
                    <span className="block w-14 shrink-0 rounded-xl bg-leaf-soft p-1">
                      <VectorScene>
                        <Icon name={h.icon} delay={0.2} />
                      </VectorScene>
                    </span>
                    <span className="font-display text-lg font-bold leading-tight">{h.title}</span>
                    {reached && <Tick className="ms-auto size-5 shrink-0 text-leaf" />}
                  </div>
                </Beat>
              )
            })}
          </ol>

          {/* Who it supports */}
          <div className="mt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-leaf-deep">Supporting the daily needs of</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SERVED.map((sv, i) => (
                <motion.li
                  key={sv.label}
                  className="vx-host flex items-center gap-2 rounded-full border border-line bg-white py-1 pe-3.5 ps-1 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-leaf"
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.2 + i * 0.06 }}
                >
                  <span className="grid size-8 place-items-center rounded-full bg-leaf-soft">
                    <VectorScene className="w-6">
                      <Icon name={sv.icon} delay={0.3 + i * 0.06} />
                    </VectorScene>
                  </span>
                  {sv.label}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom: the goal ── */}
      <motion.div
        className="relative mt-16 overflow-hidden rounded-[32px] bg-ink px-6 py-10 text-white shadow-[0_40px_80px_-40px_rgba(28,42,92,0.8)] md:px-12 md:py-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -end-16 -top-24 size-72 rounded-full bg-leaf/35 blur-3xl"
          animate={reduce ? undefined : { scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {!reduce && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/4 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ left: '-30%' }}
            animate={{ left: '130%' }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
          />
        )}
        <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr_auto] md:gap-10">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-leaf">Our goal</span>
          <p className="font-display text-[clamp(1.2rem,1.9vw,1.75rem)] font-semibold leading-snug">
            <span className="text-leaf">Simple:</span> to make everyday sourcing easier, with practical product
            choices, clear communication and a commitment to supporting your business needs.
          </p>
          <a
            href={productsHref}
            className="group/btn relative inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-leaf px-6 py-3.5 font-semibold text-white transition hover:bg-leaf-deep"
          >
            {!reduce && <span aria-hidden className="orbit-pulse absolute inset-0 rounded-full bg-leaf/50" />}
            <span className="relative">Explore Our Products</span>
            <span className="relative transition-transform group-hover/btn:translate-x-1">
              <Arrow />
            </span>
          </a>
        </div>
      </motion.div>
    </Section>
  )
}
