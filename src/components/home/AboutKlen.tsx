'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'
import { CATALOGUE, categoryHref } from '@/lib/catalogue'
import { VectorScene, type VectorKey } from '../vectors/CategoryVector'
import { UseVector, type UseKey } from '../vectors/TissueVectors'
import Tilt3D, { Depth } from '../vectors/Tilt3D'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** The four places in the fanned 3D stack, back to front: rotation, offset and depth. */
const FAN: { key: VectorKey; rot: number; x: number; y: number; z: number }[] = [
  { key: 'chemicals', rot: -12, x: -34, y: 10, z: -60 },
  { key: 'cups', rot: -4, x: -10, y: -6, z: -20 },
  { key: 'aluminium', rot: 5, x: 14, y: 4, z: 20 },
  { key: 'bags', rot: 13, x: 36, y: 16, z: 60 },
]

/** Real product photos; cards without one show a plain cream face. */
const PHOTOS: Partial<Record<VectorKey, string>> = {
  chemicals: '/media/about/chemicals-photo.webp',
  cups: '/media/about/cups-photo.webp',
  aluminium: '/media/about/aluminium-photo.webp',
  bags: '/media/about/bags-photo.webp',
}

/** How long the front card stays on top before it is shuffled to the back (ms). */
const SHUFFLE_MS = 3400
/** How long the front card spends lifting off before it drops in at the back (ms). */
const LIFT_MS = 520

/** Same as the `pin:` variant in globals.css: wide and tall enough to hold the section on screen. */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 720px)'
/** The stack after `k` shuffles: each shuffle sends the front card to the back. */
const shuffled = (k: number) => {
  const o = FAN.map((_, i) => i)
  for (let j = 0; j < k; j++) o.unshift(o.pop()!)
  return o
}

const PILLARS: { icon: UseKey; title: string; text: string }[] = [
  {
    icon: 'storeroom',
    title: 'One supplier',
    text: 'Packaging, tissue, chemicals, tools and PPE on one account.',
  },
  {
    icon: 'counter',
    title: 'Priced by the carton',
    text: 'Carton and bundle packs on every product, so quotes match deliveries.',
  },
  {
    icon: 'delivery',
    title: 'Confirmed before it ships',
    text: 'Stock, carton price and delivery day agreed up front.',
  },
]

/**
 * "About Klen+": who Klen Plus is (the site tagline and statement from the CMS), three pillars with
 * animated icons, live figures, and a fanned stack of product photos dealt in 3D that tilts toward
 * the pointer. Shuffling sends the front photo off to the side and in at the back as the others step
 * forward. Large screens: the section pins and each stretch of scroll is one shuffle, until every
 * photo has had its turn; then the page moves on. Elsewhere the stack shuffles on a timer while in
 * view (hovering pauses it).
 */
export default function AboutKlen({
  tagline,
  statement,
  totalActive,
  brands,
  industries,
}: {
  tagline?: string | null
  statement?: string | null
  totalActive: number
  brands: number
  industries: number
}) {
  const stats = [
    { v: totalActive, l: 'active products' },
    { v: CATALOGUE.length, l: 'categories' },
    { v: brands, l: 'brands on the shelf' },
    { v: industries, l: 'kinds of business served' },
  ]

  // Shuffle: order[slot] is the card in that place (slot 3 is the front).
  const stack = useRef<HTMLDivElement>(null)
  const inView = useInView(stack, { amount: 0.35 })
  const reduce = useReducedMotion()
  const dealt = useInView(stack, { once: true, amount: 0.35 })
  const [rounds, setRounds] = useState(0)
  const [order, setOrder] = useState(() => FAN.map((_, i) => i))
  const [lifting, setLifting] = useState<number | null>(null)
  const [paused, setPaused] = useState(false)
  // The first deal staggers the cards in; after that they move together.
  const dealtDelay = (i: number) => (rounds === 0 && lifting === null ? 0.2 + i * 0.12 : 0)
  // Pinned mode: the scroll position through the section decides how many shuffles have happened.
  const root = useRef<HTMLElement>(null)
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY)
    const on = () => setPinned(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const step = useRef(0)
  const dropTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!pinned) return
    const k = Math.min(FAN.length - 1, Math.max(0, Math.floor(p * FAN.length)))
    if (k === step.current) return
    const forward = k === step.current + 1
    step.current = k
    clearTimeout(dropTimer.current)
    setRounds((r) => r + 1)
    if (forward && !reduce) {
      // Lift the front card off first, then send it to the back
      setLifting(shuffled(k - 1)[FAN.length - 1])
      dropTimer.current = setTimeout(() => {
        setOrder(shuffled(k))
        setLifting(null)
      }, LIFT_MS)
    } else {
      setLifting(null)
      setOrder(shuffled(k))
    }
  })

  useEffect(() => {
    if (pinned || !dealt || !inView || paused || reduce) return
    let drop: ReturnType<typeof setTimeout>
    const t = setTimeout(() => {
      setLifting(order[order.length - 1])
      drop = setTimeout(() => {
        setOrder((o) => [o[o.length - 1], ...o.slice(0, -1)])
        setLifting(null)
        setRounds((r) => r + 1)
      }, LIFT_MS)
    }, SHUFFLE_MS)
    return () => {
      clearTimeout(t)
      clearTimeout(drop)
    }
  }, [pinned, dealt, inView, paused, reduce, order])

  return (
    <section
      ref={root}
      id="about-klen"
      aria-labelledby="about-title"
      className="relative pin:h-[320svh]"
    >
      <div className="theme-dark relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28 pin:sticky pin:top-0 pin:flex pin:h-svh pin:items-center pin:py-0 pin:pt-16">
        <ScrollDecor
          spots={[
            {
              icon: 'cat:chemicals',
              className: 'start-[46%] top-[6%] w-16',
              speed: 1.2,
              spin: 14,
              disc: true,
            },
            {
              icon: 'napkin',
              className: 'start-[48%] bottom-[10%] w-14',
              speed: 0.7,
              spin: -10,
              disc: true,
            },
          ]}
        />
        <div className="relative mx-auto grid w-full max-w-[1840px] items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <motion.h2
              id="about-title"
              className="text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              The back-room supplier <span className="text-leaf">for kitchens and buildings.</span>
            </motion.h2>
            {(tagline || statement) && (
              <p className="mt-5 max-w-2xl text-lg text-white/80">
                {[tagline, statement].filter(Boolean).join(' ')}
              </p>
            )}

            <ul className="mt-8 grid gap-3 sm:grid-cols-3">
              {PILLARS.map((p, i) => (
                <motion.li
                  key={p.title}
                  className="vx-host group rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-leaf hover:bg-white/[0.08]"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                >
                  <VectorScene className="w-14 rounded-xl bg-white p-1">
                    <UseVector name={p.icon} delay={0.2 + i * 0.12} className="w-full" />
                  </VectorScene>
                  <p className="mt-2 font-display text-lg font-bold leading-tight">{p.title}</p>
                  <p className="mt-1 text-sm text-white/65">{p.text}</p>
                </motion.li>
              ))}
            </ul>

            <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.l}
                  className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE }}
                >
                  <dd className="font-display text-3xl font-extrabold leading-none tracking-[-0.04em] text-leaf">
                    {s.v}
                  </dd>
                  <dt className="mt-1 text-xs text-white/70">{s.l}</dt>
                </motion.div>
              ))}
            </dl>
          </div>

          {/* Fanned 3D stack of product photos that keeps shuffling */}
          <div
            ref={stack}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <Tilt3D
              className="relative mx-auto aspect-[4/3] w-full max-w-[640px]"
              max={10}
              enter={16}
            >
              {FAN.map((f, i) => {
                const entry = CATALOGUE.find((c) => c.key === f.key)!
                const place = FAN[order.indexOf(i)]
                const up = lifting === i
                return (
                  <motion.div
                    key={f.key}
                    className="absolute inset-[12%]"
                    style={{ transformStyle: 'preserve-3d' }}
                    initial={{ opacity: 0, rotate: 0, x: 0, y: 80, z: f.z }}
                    animate={
                      !dealt
                        ? { opacity: 0, rotate: 0, x: 0, y: 80, z: f.z }
                        : up
                          ? { opacity: 1, rotate: 24, x: '62%', y: '-22%', z: 220, scale: 1.04 }
                          : {
                              opacity: 1,
                              rotate: place.rot,
                              x: `${place.x}%`,
                              y: `${place.y}%`,
                              z: place.z,
                              scale: 1,
                            }
                    }
                    transition={
                      up
                        ? { duration: LIFT_MS / 1000, ease: EASE }
                        : { type: 'spring', stiffness: 120, damping: 16, delay: dealtDelay(i) }
                    }
                  >
                    <motion.a
                      href={categoryHref(f.key)}
                      className="group absolute inset-0 block overflow-hidden rounded-[24px] bg-[#f6efdc] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] ring-4 ring-white"
                      whileHover={{ scale: 1.04 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      {/* Real photos only; the other cards stay plain cream */}
                      {PHOTOS[f.key] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={PHOTOS[f.key]}
                          alt={`${entry.name}: product photo`}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <span className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink opacity-0 transition group-hover:opacity-100">
                        {entry.short} →
                      </span>
                    </motion.a>
                  </motion.div>
                )
              })}
              <Depth z={140} className="absolute -end-2 -top-4 w-24">
                <div className="orbit-bob rounded-full bg-white p-1.5 shadow-[0_20px_40px_-16px_rgba(28,42,92,0.5)] ring-4 ring-leaf/40">
                  <VectorScene>
                    <UseVector name="storeroom" className="w-full" />
                  </VectorScene>
                </div>
              </Depth>
            </Tilt3D>
          </div>
        </div>
      </div>
    </section>
  )
}
