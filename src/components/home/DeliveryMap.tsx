'use client'

import { motion } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import ScrollDecor from '../vectors/ScrollDecor'
import { Icon, type AnyIcon } from '../about/ui'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Map coordinates (viewBox 1000×600) for the six star points around the warehouse. */
const STOPS: { x: number; y: number }[] = [
  { x: 170, y: 130 },
  { x: 830, y: 120 },
  { x: 120, y: 420 },
  { x: 880, y: 430 },
  { x: 330, y: 490 },
  { x: 680, y: 495 },
]
const HUB = { x: 500, y: 300 }

/** What every account gets, one per star point (upper left → lower right). */
const DETAILS: { name: string; icon: AnyIcon }[] = [
  { name: 'Personal list review', icon: 'bill-roll' },
  { name: 'Clear pack prices', icon: 'bundle' },
  { name: 'Confirmed delivery dates', icon: 'calendar' },
  { name: 'Easy reordering', icon: 'cartons' },
  { name: 'Familiar brands', icon: 'product-box' },
  { name: 'One supply account', icon: 'use:counter' },
]

/** A gently curved road from the hub to a stop. */
const road = (x: number, y: number) => {
  const mx = (HUB.x + x) / 2 + (y - HUB.y) * 0.25
  const my = (HUB.y + y) / 2 - (x - HUB.x) * 0.12
  return `M${HUB.x} ${HUB.y} Q${mx} ${my} ${x} ${y}`
}

/** Hub → stop → hub along the same curve, for the travelling "+" marks. */
const roundTrip = (x: number, y: number) => {
  const mx = (HUB.x + x) / 2 + (y - HUB.y) * 0.25
  const my = (HUB.y + y) / 2 - (x - HUB.x) * 0.12
  return `${road(x, y)} Q${mx} ${my} ${HUB.x} ${HUB.y}`
}

const STEPS = [
  {
    n: '01',
    t: 'A clear quote',
    d: 'We review your list and quote each item by the carton or bundle.',
  },
  {
    n: '02',
    t: 'A confirmed delivery day',
    d: 'We confirm stock, pricing and the delivery day with you before dispatch.',
  },
  {
    n: '03',
    t: 'A simpler reorder',
    d: 'Your list stays on file. Just tell us what to add, remove or restock.',
  },
]

/**
 * "From our shelves to your back door": a stylised city map. Roads curve out from the warehouse to
 * six things every account gets, Klen Plus "+" marks travel them on a loop, the stops pulse, and a dotted
 * city grid sits underneath. Three steps sit beside the map.
 */
export default function DeliveryMap() {
  const stops = DETAILS.map((d, i) => ({ ...STOPS[i], ...d }))

  return (
    <section
      id="delivery"
      aria-labelledby="delivery-title"
      className="theme-dark relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28 md:pt-10"
    >
      <ScrollDecor
        spots={[
          {
            icon: 'stack',
            className: 'start-[3%] bottom-[4%] w-16',
            speed: 1.2,
            spin: 12,
            disc: true,
          },
          {
            icon: 'zip-pouch',
            className: 'start-[17%] bottom-[2%] w-14',
            speed: 0.7,
            spin: -14,
            disc: true,
          },
          {
            icon: 'cat:aluminium',
            className: 'start-[32%] top-[6%] w-14',
            speed: 1.4,
            spin: 16,
            disc: true,
          },
        ]}
      />
      <div className="relative mx-auto grid max-w-[1840px] items-center gap-12 lg:grid-cols-[minmax(320px,0.8fr)_1.6fr]">
        <div>
          <motion.p
            className="label !text-leaf"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Our commitment to your business
          </motion.p>
          <motion.h2
            id="delivery-title"
            className="mt-3 text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            From your first order <span className="text-leaf">to your next restock.</span>
          </motion.h2>
          <ol className="mt-10 flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-leaf font-mono text-sm font-bold">
                  {s.n}
                </span>
                <div>
                  <p className="font-display text-lg font-bold">{s.t}</p>
                  <p className="text-sm text-white/65">{s.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* The map */}
        <motion.div
          className="relative aspect-[5/3] w-full overflow-hidden rounded-[32px] border border-white/10 bg-[#16224d] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: EASE }}
        >
          <svg viewBox="0 0 1000 600" className="absolute inset-0 h-full w-full" aria-hidden>
            {/* City blocks and a river */}
            <defs>
              <pattern id="map-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" fill="rgb(255 255 255 / 0.08)" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="url(#map-dots)" />
            {[
              [40, 40, 180, 60],
              [260, 30, 140, 90],
              [620, 40, 120, 70],
              [780, 220, 170, 90],
              [40, 250, 150, 100],
              [230, 400, 120, 80],
              [480, 450, 110, 70],
              [760, 470, 90, 90],
              [390, 140, 80, 60],
              [560, 170, 90, 50],
            ].map(([x, y, w, h], i) => (
              <rect
                key={i}
                x={x}
                y={y}
                width={w}
                height={h}
                rx="10"
                fill="rgb(255 255 255 / 0.04)"
                stroke="rgb(255 255 255 / 0.06)"
              />
            ))}
            <path
              d="M0 360 C180 330 260 380 420 350 C600 320 700 390 1000 340"
              fill="none"
              stroke="rgb(120 170 230 / 0.18)"
              strokeWidth="26"
              strokeLinecap="round"
            />
            {/* Roads */}
            {stops.map((s, i) => (
              <g key={i}>
                <path
                  d={road(s.x, s.y)}
                  fill="none"
                  stroke="rgb(255 255 255 / 0.12)"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
                <path
                  className="map-road"
                  d={road(s.x, s.y)}
                  fill="none"
                  stroke="var(--color-leaf)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ animationDelay: `${-i * 0.4}s` }}
                />
              </g>
            ))}
            {/* Klen Plus "+" marks travelling out and back on a loop (in place of vans) */}
            {stops.map((s, i) => {
              const dur = `${6 + (i % 3)}s`
              const begin = `${-i * 1.3}s`
              return (
                <g key={`plus-${i}`}>
                  <g>
                    <circle r="14" fill="#fff" />
                    <circle r="14" fill="none" stroke="var(--color-leaf)" strokeOpacity="0.5" strokeWidth="1.5" />
                    <image href="/media/brand/plus-mark.png" x="-10" y="-10" width="20" height="20" />
                    <animateMotion
                      dur={dur}
                      begin={begin}
                      repeatCount="indefinite"
                      keyPoints="0;0.5;0.5;1;1"
                      keyTimes="0;0.45;0.5;0.95;1"
                      calcMode="linear"
                      path={roundTrip(s.x, s.y)}
                    />
                  </g>
                </g>
              )
            })}
            {/* Drop-off pulses */}
            {stops.map((s, i) => (
              <circle
                key={`p-${i}`}
                className="map-pulse"
                cx={s.x}
                cy={s.y}
                r="34"
                fill="var(--color-leaf)"
                style={{ animationDelay: `${-i * 0.5}s`, transformOrigin: `${s.x}px ${s.y}px` }}
              />
            ))}
            <circle
              className="map-pulse"
              cx={HUB.x}
              cy={HUB.y}
              r="70"
              fill="var(--color-leaf)"
              style={{ transformOrigin: `${HUB.x}px ${HUB.y}px` }}
            />
          </svg>

          {/* Warehouse hub */}
          <div
            className="absolute w-[15%] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${HUB.x / 10}%`, top: `${HUB.y / 6}%` }}
          >
            <div className="grid aspect-square place-items-center rounded-[22%] bg-white p-[10%] shadow-[0_20px_50px_-12px_rgba(61,166,41,0.8)] ring-4 ring-leaf/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/klen-plus-logo.png" alt="Klen Plus" width={246} height={100} className="h-auto w-full" />
            </div>
          </div>

          {/* Drop-offs */}
          {stops.map((s, i) => (
            <motion.div
              key={s.name}
              className="absolute w-[9%] -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${s.x / 10}%`, top: `${s.y / 6}%` }}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 + i * 0.07 }}
            >
              <div
                className="orbit-bob rounded-full bg-white p-1 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)]"
                style={{ animationDelay: `${-i * 0.6}s` }}
              >
                <VectorScene>
                  <Icon name={s.icon} delay={0.2 + i * 0.07} className="w-full" />
                </VectorScene>
              </div>
              <p className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur max-md:hidden">
                {s.name}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
