'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { UseVector, type UseKey } from '../vectors/TissueVectors'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

/* Isometric projection of ground units (0–1000 on x and y, z up) into a 1200×720 SVG. */
const K = 0.55
const iso = (x: number, y: number, z = 0) =>
  [(x - y) * 0.866 * K + 600, (x + y) * 0.5 * K + 110 - z * K] as const
/** Cropped view of the drawing: just the ground slab, buildings and roof icons, no empty margin. */
const VB = { x: 110, y: 20, w: 980, h: 670 }
const pts = (...p: (readonly [number, number])[]) =>
  p.map(([a, b]) => `${a.toFixed(1)},${b.toFixed(1)}`).join(' ')

type Building = {
  x: number
  y: number
  w: number
  d: number
  h: number
  top: string
  left: string
  right: string
  icon: UseKey
  name: string
  main?: boolean
}

const BUILDINGS: Building[] = [
  {
    x: 400,
    y: 400,
    w: 200,
    d: 170,
    h: 120,
    top: '#f2dcb3',
    left: '#e2bd84',
    right: '#c99c5c',
    icon: 'storeroom',
    name: 'Klen Plus warehouse',
    main: true,
  },
  {
    x: 110,
    y: 120,
    w: 130,
    d: 120,
    h: 95,
    top: '#f5f7fa',
    left: '#dae1ec',
    right: '#b9c4d8',
    icon: 'kitchen',
    name: 'Restaurant',
  },
  {
    x: 700,
    y: 110,
    w: 120,
    d: 110,
    h: 75,
    top: '#e3f2dc',
    left: '#bfe3b2',
    right: '#97cf85',
    icon: 'cafe',
    name: 'Café',
  },
  {
    x: 760,
    y: 520,
    w: 130,
    d: 120,
    h: 250,
    top: '#d6e4f7',
    left: '#a9c2e6',
    right: '#7f9fd0',
    icon: 'catering',
    name: 'Hotel',
  },
  {
    x: 120,
    y: 640,
    w: 120,
    d: 110,
    h: 85,
    top: '#fbe9d6',
    left: '#f1cfa8',
    right: '#dfb17f',
    icon: 'table',
    name: 'Bakery',
  },
  {
    x: 470,
    y: 770,
    w: 140,
    d: 120,
    h: 180,
    top: '#e7edf5',
    left: '#c4cfe0',
    right: '#9eadc8',
    icon: 'floor',
    name: 'Office block',
  },
  {
    x: 800,
    y: 820,
    w: 110,
    d: 100,
    h: 80,
    top: '#f6d3dc',
    left: '#eab3c2',
    right: '#d690a4',
    icon: 'washroom',
    name: 'Salon & clinic',
  },
]
const WAREHOUSE = BUILDINGS[0]
const DOOR = { x: WAREHOUSE.x + WAREHOUSE.w / 2, y: WAREHOUSE.y + WAREHOUSE.d / 2 }

/** An L-shaped street route from the warehouse to a building's front, as projected points. */
const route = (b: Building) => {
  const tx = b.x + b.w / 2
  const ty = b.y + b.d + 30
  return [iso(DOOR.x, DOOR.y), iso(DOOR.x, ty), iso(tx, ty), iso(tx, b.y + b.d)]
}
const routePath = (b: Building) => {
  const r = route(b)
  return `M${r.map(([a, c]) => `${a.toFixed(1)} ${c.toFixed(1)}`).join(' L')}`
}

/** Faces of an extruded box at height h. */
const faces = (b: Building, h: number) => {
  const { x, y, w, d } = b
  const A = iso(x, y, h),
    B = iso(x + w, y, h),
    C = iso(x + w, y + d, h),
    D = iso(x, y + d, h)
  const C0 = iso(x + w, y + d),
    D0 = iso(x, y + d),
    B0 = iso(x + w, y)
  return {
    top: pts(A, B, C, D),
    left: pts(D, C, C0, D0),
    right: pts(B, C, C0, B0),
  }
}

/** Staggered rise for building i: the warehouse first, then each customer. */
const riseRange = (i: number): [number, number] => {
  if (i === 0) return [0, WARM]
  const start = stepStart(i - 1)
  return [start, start + STEP * 0.7]
}

/* Scroll story: the warehouse rises over the first WARM of progress, then each customer gets one
   STEP of scroll in which its route draws from the warehouse and its building grows. */
const WARM = 0.1
const CUSTOMERS = 6
const STEP = (1 - WARM - 0.04) / CUSTOMERS
const stepStart = (k: number) => WARM + k * STEP
const stepOf = (p: number) => Math.min(CUSTOMERS - 1, Math.max(0, Math.floor((p - WARM) / STEP)))

/** What each customer usually orders (shown in the stop card as their step plays). */
const ORDERS: Record<string, string> = {
  Restaurant: 'Takeaway containers, foil and gloves',
  Café: 'Hot cups, lids, straws and napkins',
  Hotel: 'Tissue, garbage bags and cleaning chemicals',
  Bakery: 'Paper bags, cling film and foil',
  'Office block': 'Toilet rolls, hand wash and mops',
  'Salon & clinic': 'Gloves, aprons, hair nets and wipes',
}

/** The active customer's route, drawn by scroll from the warehouse door to their front. */
function RouteDraw({ b, p, k }: { b: Building; p: MotionValue<number>; k: number }) {
  const pathLength = useTransform(p, [stepStart(k), stepStart(k) + STEP * 0.6], [0, 1], {
    clamp: true,
  })
  return (
    <motion.path
      d={routePath(b)}
      fill="none"
      stroke="var(--color-leaf)"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity="0.85"
      style={{ pathLength }}
    />
  )
}

function Block({ b, p, i }: { b: Building; p: MotionValue<number>; i: number }) {
  const rise = useTransform(p, riseRange(i), [0, 1], { clamp: true })
  const top = useTransform(rise, (r) => faces(b, Math.max(1, b.h * r)).top)
  const left = useTransform(rise, (r) => faces(b, Math.max(1, b.h * r)).left)
  const right = useTransform(rise, (r) => faces(b, Math.max(1, b.h * r)).right)
  return (
    <g>
      <motion.polygon
        points={left}
        fill={b.left}
        stroke="#1c2a5c"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <motion.polygon
        points={right}
        fill={b.right}
        stroke="#1c2a5c"
        strokeOpacity="0.25"
        strokeWidth="1"
      />
      <motion.polygon
        points={top}
        fill={b.top}
        stroke="#1c2a5c"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
    </g>
  )
}

function Label({ b, p, i, on }: { b: Building; p: MotionValue<number>; i: number; on: boolean }) {
  const rise = useTransform(p, riseRange(i), [0, 1], { clamp: true })
  const [cx, cy] = iso(b.x + b.w / 2, b.y + b.d / 2, b.h)
  const opacity = useTransform(rise, [0.7, 1], [0, 1])
  const y = useTransform(rise, [0.7, 1], [16, 0])
  return (
    <motion.div
      className="absolute flex -translate-x-1/2 -translate-y-[115%] flex-col items-center"
      style={{
        left: `${((cx - VB.x) / VB.w) * 100}%`,
        top: `${((cy - VB.y) / VB.h) * 100}%`,
        opacity,
        y,
      }}
    >
      <div
        className={`orbit-bob rounded-full bg-white p-1 shadow-[0_14px_30px_-12px_rgba(28,42,92,0.5)] transition duration-500 ${b.main ? 'w-[clamp(52px,6vw,84px)] ring-4 ring-leaf/40' : 'w-[clamp(40px,4.4vw,60px)]'} ${on ? 'scale-125 ring-4 ring-leaf' : ''}`}
        style={{ animationDelay: `${-i * 0.6}s` }}
      >
        <VectorScene drawn>
          <UseVector name={b.icon} className="w-full" />
        </VectorScene>
      </div>
      <span
        className={`mt-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm transition duration-500 max-md:hidden ${b.main || on ? 'bg-leaf text-white' : 'bg-white/90 text-ink'} ${on ? 'translate-y-1.5' : ''}`}
      >
        {b.name}
      </span>
    </motion.div>
  )
}

/** Centre of the warehouse roof, where the cartons lift off. */
const ROOF = iso(WAREHOUSE.x + WAREHOUSE.w / 2, WAREHOUSE.y + WAREHOUSE.d / 2, WAREHOUSE.h)

/** Sparkles: [x, y, size] in view units, scattered around the customer buildings. */
const SPARKS: [number, number, number][] = [
  [360, 230, 1],
  [560, 170, 0.8],
  [880, 210, 1.1],
  [1010, 300, 0.7],
  [300, 420, 0.8],
  [760, 560, 0.9],
  [930, 470, 0.7],
]

const TREES: [number, number][] = [
  [330, 140],
  [360, 300],
  [640, 330],
  [300, 560],
  [660, 660],
  [380, 900],
  [950, 380],
  [60, 400],
  [600, 950],
]

/**
 * "Every block, one warehouse": an isometric city. As the section scrolls in, the warehouse rises
 * first, then each customer building (restaurant, café, hotel, bakery, office, salon) grows out of
 * the ground and its icon pops onto the roof. Streets run from the warehouse door to every front,
 * dashes flow along them, and vans drive each route on a loop. Trees sway on the blocks.
 */
export default function IsoCity({
  totalActive,
  categories,
}: {
  totalActive: number
  categories: number
}) {
  const root = useRef<HTMLElement>(null)
  // Wide screens pin the section (sticky screen inside a tall box) and scrub the story with scroll;
  // smaller screens keep the plain scroll-in, so the city builds as it comes into view.
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setPinned(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  const pin = useScroll({ target: root, offset: ['start start', 'end end'] }).scrollYProgress
  const flow = useScroll({ target: root, offset: ['start 85%', 'center 45%'] }).scrollYProgress
  const scrollYProgress = pinned ? pin : flow
  const [step, setStep] = useState(0)
  useMotionValueEvent(pin, 'change', (p) => pinned && setStep(stepOf(p)))
  const stepBar = useTransform(pin, (p) =>
    Math.min(1, Math.max(0, (p - stepStart(stepOf(p))) / STEP)),
  )
  const stop = BUILDINGS[step + 1]
  const ground = pts(iso(0, 0), iso(1000, 0), iso(1000, 1000), iso(0, 1000))
  // Draw back-to-front so nearer blocks overlap farther ones.
  const order = BUILDINGS.map((b, i) => ({ b, i })).sort((a, c) => a.b.x + a.b.y - (c.b.x + c.b.y))

  return (
    <section
      ref={root}
      id="city"
      aria-labelledby="city-title"
      className="theme-light relative overflow-clip px-5 py-10 md:px-6 md:py-12 lg:h-[calc(7*80svh)] lg:py-0"
    >
      <div className="relative mx-auto grid max-w-[1840px] items-center gap-6 lg:sticky lg:top-0 lg:h-svh lg:grid-cols-2 lg:gap-4 lg:pb-2 lg:pt-8">
        <ScrollDecor
          spots={[
            { icon: 'cat:aluminium', className: 'start-[3%] top-[78%] w-20', speed: 1.1, spin: 12 },
            { icon: 'zip-pouch', className: 'start-[17%] top-[84%] w-16', speed: 0.6, spin: -10 },
            { icon: 'carry-bag', className: 'start-[30%] top-[6%] w-16', speed: 1.3, spin: 14 },
            { icon: 'cat:cups', className: 'start-[30%] top-[76%] w-14', speed: 0.8, spin: -12 },
            { icon: 'rect-box', className: 'start-[40%] top-[10%] w-14', speed: 0.5, spin: 10 },
            { icon: 'cat:tissue', className: 'end-[3%] top-[4%] w-16', speed: 1, spin: -14 },
          ]}
        />
        <div className="md:ps-2 lg:ps-2 xl:ps-4">
          <motion.p
            className="label !text-leaf-deep"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Across the city
          </motion.p>
          <motion.h2
            id="city-title"
            className="mt-3 text-[clamp(2.2rem,4.6vw,5.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Every block, <span className="text-leaf">one warehouse.</span>
          </motion.h2>
          <p className="mt-5 max-w-xl text-lg text-slate">
            Restaurants, cafés, hotels, bakeries, offices and salons, all restocked from the same
            shelves on one list.
          </p>
          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            {[
              { v: BUILDINGS.length - 1, l: 'kinds of business' },
              { v: categories, l: 'categories' },
              { v: totalActive, l: 'products' },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-line bg-white p-4">
                <dt className="sr-only">{s.l}</dt>
                <dd className="font-display text-4xl font-extrabold leading-none tracking-[-0.04em] text-ink">
                  {s.v}
                </dd>
                <dd className="mt-1 text-xs text-slate">{s.l}</dd>
              </div>
            ))}
          </dl>

          {/* The stop the scroll is on (pinned layout only) */}
          <div className="mt-6 hidden max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_44px_-28px_rgba(28,42,92,0.45)] lg:block">
            <div className="flex items-center gap-4 p-4">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-leaf-soft">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={stop.name}
                    className="block w-10"
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 30 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 20 }}
                  >
                    <VectorScene drawn>
                      <UseVector name={stop.icon} className="w-full" />
                    </VectorScene>
                  </motion.span>
                </AnimatePresence>
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-leaf-deep">
                  Stop {String(step + 1).padStart(2, '0')} / {String(CUSTOMERS).padStart(2, '0')}
                </p>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stop.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <p className="font-display text-xl font-bold leading-tight tracking-[-0.02em]">
                      {stop.name}
                    </p>
                    <p className="truncate text-sm text-slate">{ORDERS[stop.name]}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            {/* Step dots, then a bar that fills as this stop's scroll plays */}
            <div className="flex gap-1.5 px-4 pb-3">
              {BUILDINGS.slice(1).map((b, k) => (
                <span
                  key={b.name}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${k < step ? 'bg-leaf' : 'bg-line'}`}
                >
                  {k === step && (
                    <motion.span
                      className="block h-full origin-left rounded-full bg-leaf"
                      style={{ scaleX: stepBar }}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          // Wide screens: the city reaches back into the middle gap (15% of its column) and fills the
          // rest, capped so it always fits the pinned screen's height.
          className="relative w-full lg:-ms-[15%] lg:w-[115%]"
          style={{
            aspectRatio: `${VB.w} / ${VB.h}`,
            maxWidth: pinned ? `calc((100svh - 120px) * ${VB.w / VB.h})` : undefined,
          }}
        >
          <svg
            viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
            className="absolute inset-0 h-full w-full overflow-visible"
            aria-hidden
          >
            {/* Ground slab */}
            <polygon
              points={pts(iso(0, 1000), iso(1000, 1000), iso(1000, 1000, -40), iso(0, 1000, -40))}
              fill="#c4cfe0"
            />
            <polygon
              points={pts(iso(1000, 0), iso(1000, 1000), iso(1000, 1000, -40), iso(1000, 0, -40))}
              fill="#aebbd2"
            />
            <polygon points={ground} fill="#eef3f9" stroke="#c4cfe0" strokeWidth="1.5" />
            {Array.from({ length: 9 }).map((_, k) => {
              const v = (k + 1) * 100
              return (
                <g key={k} stroke="#dae1ec" strokeWidth="1">
                  <line
                    x1={iso(v, 0)[0]}
                    y1={iso(v, 0)[1]}
                    x2={iso(v, 1000)[0]}
                    y2={iso(v, 1000)[1]}
                  />
                  <line
                    x1={iso(0, v)[0]}
                    y1={iso(0, v)[1]}
                    x2={iso(1000, v)[0]}
                    y2={iso(1000, v)[1]}
                  />
                </g>
              )
            })}
            {/* Streets */}
            {BUILDINGS.slice(1).map((b) => (
              <g key={b.name}>
                <path
                  d={routePath(b)}
                  fill="none"
                  stroke="#c9d3e3"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  className="map-road"
                  d={routePath(b)}
                  fill="none"
                  stroke="var(--color-leaf)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
            {/* Trees */}
            {TREES.map(([x, y], k) => {
              const [tx, ty] = iso(x, y)
              return (
                <g
                  key={k}
                  className="iso-tree"
                  style={{ transformOrigin: `${tx}px ${ty}px`, animationDelay: `${-k * 0.5}s` }}
                >
                  <ellipse cx={tx} cy={ty + 2} rx="9" ry="4" fill="rgb(28 42 92 / 0.12)" />
                  <rect x={tx - 1.5} y={ty - 16} width="3" height="16" fill="#8a6a43" />
                  <circle cx={tx} cy={ty - 22} r="11" fill="var(--color-leaf)" />
                  <circle cx={tx - 4} cy={ty - 26} r="5" fill="#7ed36a" />
                </g>
              )
            })}
            {/* Signal rings pulsing out of the warehouse door */}
            {[0, 1, 2].map((k) => (
              <motion.ellipse
                key={`ring-${k}`}
                cx={iso(DOOR.x, DOOR.y)[0]}
                cy={iso(DOOR.x, DOOR.y)[1]}
                fill="none"
                stroke="var(--color-leaf)"
                strokeWidth="2"
                initial={{ rx: 10, ry: 6, opacity: 0.7 }}
                animate={{ rx: 150, ry: 87, opacity: 0 }}
                transition={{ duration: 3.6, repeat: Infinity, delay: k * 1.2, ease: 'easeOut' }}
              />
            ))}
            {/* A ping at each customer's front as the vans arrive */}
            {BUILDINGS.slice(1).map((b, k) => {
              const [px, py] = route(b)[3]
              return (
                <motion.circle
                  key={`ping-${b.name}`}
                  cx={px}
                  cy={py}
                  fill="var(--color-leaf)"
                  initial={{ r: 3, opacity: 0.8 }}
                  animate={{ r: [3, 16], opacity: [0.8, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    repeatDelay: 2.4 + (k % 3),
                    delay: k * 0.7,
                    ease: 'easeOut',
                  }}
                />
              )
            })}
            {/* Routes drawn by scroll, one customer per step (pinned layout) */}
            {pinned &&
              BUILDINGS.slice(1).map((b, k) => (
                <RouteDraw key={`draw-${b.name}`} b={b} p={pin} k={k} />
              ))}
            {/* Buildings, back to front */}
            {order.map(({ b, i }) => (
              <Block key={b.name} b={b} p={scrollYProgress} i={i} />
            ))}
            {/* Vans */}
            {BUILDINGS.slice(1).map((b, k) => (
              <g key={`van-${b.name}`}>
                <rect
                  x="-10"
                  y="-7"
                  width="20"
                  height="13"
                  rx="3"
                  fill="#fff"
                  stroke="#1c2a5c"
                  strokeWidth="1.5"
                />
                <rect x="-8" y="-3" width="9" height="3" rx="1" fill="var(--color-leaf)" />
                <animateMotion
                  dur={`${7 + (k % 3)}s`}
                  begin={`${-k * 1.2}s`}
                  repeatCount="indefinite"
                  keyPoints="0;1;1;0;0"
                  keyTimes="0;0.45;0.5;0.95;1"
                  calcMode="linear"
                  path={routePath(b)}
                />
              </g>
            ))}
            {/* Cartons lifting off the warehouse roof, one after another */}
            {[-46, 0, 46].map((dx, k) => (
              <motion.g
                key={`parcel-${k}`}
                initial={{ x: ROOF[0] + dx, y: ROOF[1] + 10, opacity: 0, scale: 0.6 }}
                animate={{
                  y: [ROOF[1] + 10, ROOF[1] - 40, ROOF[1] - 130],
                  opacity: [0, 1, 0],
                  scale: [0.6, 1, 0.8],
                }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  delay: k * 1.2,
                  ease: 'easeOut',
                  times: [0, 0.35, 1],
                }}
              >
                <motion.g
                  animate={{ rotate: [-6, 6, -6] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <polygon
                    points="-18,-12 0,-2 0,16 -18,6"
                    fill="#e2bd84"
                    stroke="#1c2a5c"
                    strokeOpacity="0.35"
                  />
                  <polygon
                    points="0,-2 18,-12 18,6 0,16"
                    fill="#c99c5c"
                    stroke="#1c2a5c"
                    strokeOpacity="0.35"
                  />
                  <polygon
                    points="0,-22 18,-12 0,-2 -18,-12"
                    fill="#f2dcb3"
                    stroke="#1c2a5c"
                    strokeOpacity="0.35"
                  />
                  <path
                    d="M-9 -17 L9 -7"
                    stroke="var(--color-leaf)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </motion.g>
              </motion.g>
            ))}
            {/* Sparkles twinkling over the customers' roofs */}
            {SPARKS.map(([sx, sy, s], k) => (
              <motion.path
                key={`spark-${k}`}
                d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z"
                fill={k % 2 ? 'var(--color-leaf)' : '#ffc93c'}
                initial={{ x: sx, y: sy, scale: 0, opacity: 0, rotate: 0 }}
                animate={{ scale: [0, s, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 1 + (k % 3) * 0.8,
                  delay: k * 0.45,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </svg>
          {/* Roof icons and names */}
          {BUILDINGS.map((b, i) => (
            <Label key={b.name} b={b} p={scrollYProgress} i={i} on={pinned && i === step + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
