'use client'

import { useRef, useState, type CSSProperties } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'

const EASE = [0.2, 0.7, 0.2, 1] as const

type Layer = { n: string; tag: string; title: string; text: string; icon: ItemKey }

const LEFT: Layer[] = [
  {
    n: '01',
    tag: 'Carry',
    title: 'Kraft bags',
    text: 'Choose a bag that fits your packed containers and leaves room to grip the handles.',
    icon: 'carry-bag',
  },
  {
    n: '02',
    tag: 'Cover',
    title: 'Clear PET lids',
    text: 'Match the lid to the cup’s rim size. Choose a dome when toppings need extra room.',
    icon: 'dome-lid',
  },
  {
    n: '03',
    tag: 'Pack',
    title: 'Food containers',
    text: 'Pick a round or rectangular container to suit the dish and portion size.',
    icon: 'rect-box',
  },
]
const RIGHT: Layer[] = [
  {
    n: '04',
    tag: 'Wrap',
    title: 'Foil & burger paper',
    text: 'Choose foil for wrapped portions or burger paper for sandwiches and handheld meals.',
    icon: 'burger-wrap',
  },
  {
    n: '05',
    tag: 'Serve',
    title: 'Napkins & cutlery',
    text: 'Pair rice dishes with a spoon and salads with a fork. Add napkins for both.',
    icon: 'cutlery',
  },
]

const STEPS = LEFT.length + RIGHT.length

/** Drifting product vectors in the empty space either side of the heading (wide screens only). */
const FLOATS: { icon: ItemKey; className: string }[] = [
  { icon: 'pet-glass', className: 'start-[6%] top-[4%] w-20' },
  { icon: 'clear-bowl', className: 'start-[21%] top-[19%] w-16' },
  { icon: 'paper-bag', className: 'end-[7%] top-[3%] w-20' },
  { icon: 'foil-roll', className: 'end-[21%] top-[20%] w-16' },
]

/* ── Infinity ribbon geometry (700×400 box, centred on 350,200) ── */
const CX = 350
const CY = 200
const A = 235
/** Lemniscate of Bernoulli, stretched vertically so the loops read as an infinity sign. */
const at = (t: number) => {
  const d = 1 + Math.sin(t) ** 2
  return {
    x: CX + (A * Math.cos(t)) / d,
    y: CY + (1.55 * A * Math.sin(t) * Math.cos(t)) / d,
  }
}
const RIBBON =
  Array.from({ length: 121 }, (_, i) => {
    const p = at((i / 120) * Math.PI * 2)
    return `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`
  }).join(' ') + ' Z'

/** Where each item's connector meets the ribbon, and the height of the item it comes from. */
const LINKS = [
  { side: -1, y: 50, p: at(Math.PI - 0.62) },
  { side: -1, y: 200, p: at(Math.PI) },
  { side: -1, y: 350, p: at(Math.PI + 0.62) },
  { side: 1, y: 100, p: at(-0.5) },
  { side: 1, y: 300, p: at(0.5) },
]
const linkPath = ({ side, y, p }: (typeof LINKS)[number]) => {
  const edge = side < 0 ? 0 : 700
  const knee = side < 0 ? 70 : 630
  return `M${edge} ${y} H${knee} C${(knee + p.x) / 2} ${y} ${p.x} ${(y + p.y) / 2} ${p.x} ${p.y}`
}

function Item({
  l,
  side,
  i,
  state,
}: {
  l: Layer
  side: 'left' | 'right'
  i: number
  /** 'on' = the step the scroll is on, 'done' = already passed, 'next' = still to come. */
  state: 'on' | 'done' | 'next'
}) {
  return (
    <motion.li
      initial={{ opacity: 0, x: side === 'left' ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, delay: 0.5 + i * 0.12, ease: EASE }}
    >
      <div
        className={`flex items-center gap-4 transition duration-500 ${side === 'left' ? 'origin-left' : 'origin-right'} ${state === 'next' ? 'xl:opacity-35' : ''} ${state === 'on' ? 'xl:scale-105' : ''}`}
      >
        <span
          className={`grid size-20 shrink-0 place-items-center rounded-full bg-leaf-soft transition duration-500 xl:size-24 ${state === 'on' ? 'xl:shadow-[0_0_0_4px_var(--color-leaf),0_18px_40px_-14px_rgba(47,138,32,0.7)]' : ''}`}
        >
          <VectorScene drawn className="w-14 xl:w-16">
            <ItemVector name={l.icon} delay={0.6 + i * 0.12} className="w-full" />
          </VectorScene>
        </span>
        <span className="min-w-0">
          <span className="block font-mono text-xs font-semibold uppercase tracking-[0.14em] text-leaf-deep">
            {l.n} · {l.tag}
          </span>
          <span className="mt-1 block font-display text-xl font-bold leading-tight tracking-[-0.02em] xl:text-2xl">
            {l.title}
          </span>
          <span className="mt-1 block max-w-xs text-sm text-slate">{l.text}</span>
        </span>
      </div>
    </motion.li>
  )
}

/**
 * "Takeaway packaging guide" (light): the five parts of a takeaway order around an infinity
 * ribbon. The ribbon draws itself in, connectors reach out to each item, and a soft light keeps
 * travelling round the loop.
 */
export default function TakeawayLoop() {
  const root = useRef<HTMLElement>(null)
  // Wide screens: the section is pinned (sticky) for ~3 screens of scroll, and that scroll steps
  // through the five layers in order before the page moves on.
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) =>
    setActive(Math.min(STEPS - 1, Math.max(0, Math.floor(p * STEPS)))),
  )
  const stateOf = (i: number): 'on' | 'done' | 'next' =>
    i === active ? 'on' : i < active ? 'done' : 'next'

  return (
    <section
      ref={root}
      id="takeaway-loop"
      aria-labelledby="loop-title"
      className="theme-light relative overflow-clip px-5 py-14 md:px-10 md:py-16 xl:h-[300vh] xl:py-6"
    >
      <div className="relative mx-auto max-w-[1840px] xl:sticky xl:top-[88px]">
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden xl:block">
          {FLOATS.map((f, i) => (
            <motion.div
              key={f.icon}
              className={`absolute ${f.className}`}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: EASE }}
            >
              <div
                className="vx-drift"
                style={{ '--d': `${-i * 1.7}s`, '--dur': `${8 + (i % 3) * 2}s` } as CSSProperties}
              >
                <VectorScene drawn>
                  <ItemVector name={f.icon} delay={0.4 + i * 0.12} className="w-full" />
                </VectorScene>
              </div>
            </motion.div>
          ))}
        </div>

        <header className="mx-auto max-w-4xl text-center">
          <motion.p
            className="label !text-leaf-deep"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Takeaway packaging guide
          </motion.p>
          <motion.h2
            id="loop-title"
            className="mt-3 text-[clamp(2.2rem,4.4vw,4.4rem)] font-bold leading-[0.98] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Choose the right packaging <span className="text-leaf">for your menu.</span>
          </motion.h2>
          <p className="mt-4 text-lg text-slate">
            Start with what you serve and how your customers will carry it. Use this guide to
            choose supplies for each order.
          </p>
        </header>

        <div className="mt-12 grid items-center gap-10 xl:grid-cols-[1fr_700px_1fr] xl:gap-0">
          {/* Left: carry, cover, pack */}
          <ol className="order-2 grid gap-6 sm:grid-cols-2 xl:order-1 xl:flex xl:h-[400px] xl:flex-col xl:justify-between xl:gap-0">
            {LEFT.map((l, i) => (
              <Item key={l.n} l={l} side="left" i={i} state={stateOf(i)} />
            ))}
          </ol>

          {/* Centre: the infinity ribbon */}
          <div className="order-1 mx-auto w-full max-w-[700px] xl:order-2">
            <svg viewBox="0 0 700 400" className="block h-auto w-full" aria-hidden>
              <defs>
                <linearGradient id="loop-grad" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0" stopColor="#6ccf2f" />
                  <stop offset="0.22" stopColor="#3da629" />
                  <stop offset="0.5" stopColor="#1c2a5c" />
                  <stop offset="0.78" stopColor="#3da629" />
                  <stop offset="1" stopColor="#6ccf2f" />
                </linearGradient>
                <filter id="loop-shadow" x="-10%" y="-20%" width="120%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="14"
                    stdDeviation="12"
                    floodColor="#1c2a5c"
                    floodOpacity="0.18"
                  />
                </filter>
              </defs>

              {/* Ribbon: draws itself in, then a light keeps running round it */}
              <motion.path
                d={RIBBON}
                fill="none"
                stroke="url(#loop-grad)"
                strokeWidth="46"
                strokeLinejoin="round"
                filter="url(#loop-shadow)"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.8, ease: 'easeInOut' }}
              />
              <path
                d={RIBBON}
                fill="none"
                stroke="rgb(255 255 255 / 0.18)"
                strokeWidth="10"
                strokeLinejoin="round"
                transform="translate(0 -9)"
              />
              {[0, 1.6].map((delay) => (
                <path
                  key={delay}
                  d={RIBBON}
                  pathLength={1}
                  fill="none"
                  stroke="#d6ffc4"
                  strokeWidth="10"
                  strokeLinecap="round"
                  className="wave-flow"
                  style={{ animationDelay: `${-delay}s`, animationDuration: '4.5s' }}
                />
              ))}
              {/* Connectors (wide screens, where the items sit beside the ribbon) */}
              <g className="hidden xl:inline">
                {LINKS.map((k, i) => (
                  <g key={i}>
                    <motion.path
                      d={linkPath(k)}
                      fill="none"
                      stroke={i === active ? 'var(--color-leaf)' : 'var(--color-leaf-deep)'}
                      strokeWidth={i === active ? 3 : 1.6}
                      style={{ transition: 'stroke 0.4s, stroke-width 0.4s' }}
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.8, delay: 1 + i * 0.1, ease: EASE }}
                    />
                    <motion.circle
                      cx={k.p.x}
                      cy={k.p.y}
                      r="6"
                      fill={i <= active ? 'var(--color-leaf)' : '#fff'}
                      style={{ transition: 'fill 0.4s' }}
                      stroke="var(--color-leaf-deep)"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 18,
                        delay: 1.6 + i * 0.1,
                      }}
                    />
                  </g>
                ))}
              </g>
            </svg>
          </div>

          {/* Right: wrap, serve */}
          <ol className="order-3 grid gap-6 sm:grid-cols-2 xl:flex xl:h-[400px] xl:flex-col xl:justify-around xl:gap-0 xl:ps-6">
            {RIGHT.map((l, i) => (
              <Item key={l.n} l={l} side="right" i={i + 3} state={stateOf(i + 3)} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
