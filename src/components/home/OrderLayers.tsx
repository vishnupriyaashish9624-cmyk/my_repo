'use client'

import { useRef, useState } from 'react'
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Top to bottom: what one takeaway order is made of. Each layer is a product type in the catalogue. */
const LAYERS: {
  name: string
  kind: string
  text: string
  icon: ItemKey
  top: string
  left: string
  right: string
  href: string
}[] = [
  {
    kind: 'Carry',
    name: 'Kraft carry bag',
    text: 'Twist or flat handle, small to jumbo',
    icon: 'cat:bags',
    top: '#e2bd84',
    left: '#c99c5c',
    right: '#b0864a',
    href: '/categories/bags',
  },
  {
    kind: 'Seal',
    name: 'PET dome lid',
    text: 'Clear dome and flat lids, 84 & 92 mm',
    icon: 'dome-lid',
    top: '#d6e4f7',
    left: '#b4c9e6',
    right: '#9bb3d6',
    href: '/categories/cups',
  },
  {
    kind: 'Hold',
    name: 'Black-base container',
    text: 'Microwave-safe, rectangular and round',
    icon: 'rect-box',
    top: '#3a4c8f',
    left: '#283a7d',
    right: '#1c2a5c',
    href: '/categories/takeaway',
  },
  {
    kind: 'Wrap',
    name: 'Foil & burger wrap',
    text: 'Foil rolls, platters and wraps',
    icon: 'burger-wrap',
    top: '#eef2f7',
    left: '#cfd8e3',
    right: '#b7c2d0',
    href: '/categories/aluminium',
  },
  {
    kind: 'Serve',
    name: 'Napkins & cutlery',
    text: 'Napkins, spoons, forks and sets',
    icon: 'napkin',
    top: '#ffffff',
    left: '#e3e8f0',
    right: '#cdd5e1',
    href: '/categories/paper',
  },
]
const N = LAYERS.length

/** One isometric slab (top face + two sides), with the layer's vector standing on it. */
function Slab({
  layer,
  i,
  gap,
  active,
  image,
}: {
  layer: (typeof LAYERS)[number]
  i: number
  gap: MotionValue<number>
  active: boolean
  image?: string
}) {
  const y = useTransform(gap, (g) => i * g)
  return (
    <motion.div className="absolute inset-x-0 top-0" style={{ y, zIndex: N - i }}>
      <div className="relative w-[min(440px,50%)]">
        <svg
          viewBox="0 0 400 180"
          className="block w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)]"
          aria-hidden
        >
          <polygon points="0,80 200,160 200,180 0,100" fill={layer.left} />
          <polygon points="200,160 400,80 400,100 200,180" fill={layer.right} />
          <polygon
            points="200,0 400,80 200,160 0,80"
            fill={layer.top}
            stroke={active ? 'var(--color-leaf)' : 'rgb(255 255 255 / 0.25)'}
            strokeWidth={active ? 4 : 1.5}
          />
        </svg>
        <div className="absolute left-1/2 top-[40%] w-[17%] -translate-x-1/2">
          <motion.div
            animate={{ y: active ? -16 : 0, scale: active ? 1.12 : 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <VectorScene drawn>
              <ItemVector
                name={layer.icon}
                className="w-full drop-shadow-[0_10px_12px_rgba(0,0,0,0.3)]"
              />
            </VectorScene>
          </motion.div>
        </div>
      </div>
      {/* Callout: line from the slab to its card */}
      <div className="absolute start-[min(440px,50%)] top-[48%] flex w-[calc(100%-min(440px,50%))] items-center gap-3 ps-2">
        <span className="relative h-px flex-1 bg-white/15">
          <motion.span
            className="absolute inset-0 origin-left bg-leaf"
            animate={{ scaleX: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          />
          <span
            className={`absolute -start-1 -top-1 size-2.5 rounded-full transition-colors ${active ? 'bg-leaf' : 'bg-white/30'}`}
          />
        </span>
        <a
          href={layer.href}
          className={`group/layer relative w-[min(300px,72%)] rounded-2xl border px-4 py-3 backdrop-blur transition duration-500 ${active ? 'border-leaf bg-white/[0.1] shadow-[0_18px_40px_-18px_rgba(61,166,41,0.6)]' : 'border-white/10 bg-white/[0.04]'}`}
        >
          <span
            className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] ${active ? 'text-leaf' : 'text-white/50'}`}
          >
            <span className="size-2 rounded-sm" style={{ background: layer.top }} />
            {String(i + 1).padStart(2, '0')} · {layer.kind}
          </span>
          <span className="mt-1 block font-display text-lg font-bold leading-tight text-white">
            {layer.name}
          </span>
          <span className="block text-xs text-white/60">{layer.text}</span>
          {/* Hover preview: the category's still life, popping out to the left of the card */}
          {image && (
            <span className="pointer-events-none absolute end-full top-1/2 me-4 w-56 -translate-y-1/2 translate-x-4 scale-90 overflow-hidden rounded-2xl bg-white opacity-0 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-2 ring-leaf transition duration-300 group-hover/layer:translate-x-0 group-hover/layer:scale-100 group-hover/layer:opacity-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" loading="lazy" className="aspect-[3/2] w-full object-cover" />
              <span className="block px-3 py-2 text-xs font-semibold text-ink">
                See {layer.name.toLowerCase()} →
              </span>
            </span>
          )}
        </a>
      </div>
    </motion.div>
  )
}

/**
 * "One order, layer by layer": an exploded isometric stack of a takeaway order (pinned on large
 * screens). Scrolling pulls the layers apart and lights each one in turn: its vector lifts, its
 * outline turns green, and the callout line draws out to its card. Elsewhere it shows fully exploded.
 */
export default function OrderLayers({
  images = {},
}: {
  images?: Record<string, string | undefined>
}) {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  const gap = useTransform(scrollYProgress, [0, 0.35], [26, 112])
  const [active, setActive] = useState(-1)
  useMotionValueEvent(scrollYProgress, 'change', (p) =>
    setActive(p < 0.12 ? -1 : Math.min(N - 1, Math.floor(((p - 0.12) / 0.8) * N))),
  )

  return (
    <section
      ref={root}
      id="layers"
      aria-labelledby="layers-title"
      className="relative bg-ink text-white pin:h-[240svh]"
    >
      <div className="theme-dark relative overflow-hidden px-5 py-20 md:px-10 pin:sticky pin:top-0 pin:flex pin:h-svh pin:items-center pin:py-0 pin:pt-16">
        <ScrollDecor
          spots={[
            {
              icon: 'cutlery',
              className: 'start-[4%] bottom-[10%] w-16',
              speed: 1.2,
              spin: 14,
              disc: true,
            },
            {
              icon: 'cat:cups',
              className: 'start-[22%] bottom-[22%] w-14',
              speed: 0.7,
              spin: -12,
              disc: true,
            },
          ]}
        />
        <div className="relative mx-auto grid w-full max-w-[1840px] items-center gap-10 lg:grid-cols-[minmax(300px,0.7fr)_1.6fr]">
          <div>
            <motion.p
              className="label !text-leaf"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              One order, layer by layer
            </motion.p>
            <motion.h2
              id="layers-title"
              className="mt-3 text-[clamp(2.2rem,4vw,4rem)] font-bold leading-[0.95] tracking-[-0.035em]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              Every takeaway, <span className="text-leaf">built from our shelves.</span>
            </motion.h2>
            <p className="mt-5 max-w-md text-white/70">
              A single order goes out in five layers: bag, lid, container, wrap and napkins. Each
              one is on the same list, priced by the carton.
            </p>
            <div className="mt-8 hidden items-center gap-3 font-mono text-xs tabular-nums text-white/60 pin:flex">
              <span className="text-white">{String(Math.max(0, active) + 1).padStart(2, '0')}</span>
              <span className="relative h-1 w-48 overflow-hidden rounded-full bg-white/15">
                <motion.span
                  className="absolute inset-0 origin-left rounded-full bg-leaf"
                  style={{ scaleX: scrollYProgress }}
                />
              </span>
              <span>{String(N).padStart(2, '0')}</span>
            </div>
          </div>

          <div className="relative h-[clamp(560px,72svh,680px)]">
            {LAYERS.map((l, i) => (
              <Slab
                key={l.name}
                layer={l}
                i={i}
                gap={gap}
                active={active === i}
                image={images[l.href.split('/').pop() ?? '']}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
