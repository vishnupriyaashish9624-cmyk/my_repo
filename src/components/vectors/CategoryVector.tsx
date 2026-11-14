'use client'

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/**
 * Hand-drawn line vectors for each product category. Every icon draws itself in (strokes trace,
 * fills fade up) when its `VectorScene` enters the viewport, then loops a small ambient motion:
 * steam rising, a broom sweeping, a bag swinging. Loops live in globals.css under "Category vectors"
 * and pause off-screen (ambient-off) and under reduced motion.
 */

export type VectorKey =
  | 'tissue'
  | 'paper'
  | 'aluminium'
  | 'takeaway'
  | 'cups'
  | 'bags'
  | 'chemicals'
  | 'tools'
  | 'ppe'
  | 'foam'
  | 'bio'
  | 'film'
  | 'hygiene'
  | 'plastic'

const KRAFT = '#e7c99b'
const KRAFT_DEEP = '#d4ac72'
const FOIL = '#dfe6ee'
const FOIL_LIGHT = '#eef2f7'
const SKY = '#d6e4f7'

export const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties

/** Four-point sparkle that twinkles. */
export const Spark = ({ x, y, s = 1, delay = 0 }: { x: number; y: number; s?: number; delay?: number }) => (
  <path
    className="vx-twinkle fill-leaf"
    style={d(delay)}
    d={`M${x} ${y - 6 * s} Q${x + 1 * s} ${y - 1 * s} ${x + 6 * s} ${y} Q${x + 1 * s} ${y + 1 * s} ${x} ${y + 6 * s} Q${x - 1 * s} ${y + 1 * s} ${x - 6 * s} ${y} Q${x - 1 * s} ${y - 1 * s} ${x} ${y - 6 * s}Z`}
  />
)

export const Steam = ({ x, y }: { x: number; y: number }) => (
  <g className="text-slate" strokeWidth="2.2">
    {[-9, 0, 9].map((dx, i) => (
      <path key={dx} className="vx-steam" style={d(i * 0.55)} d={`M${x + dx} ${y} c-4 -5 4 -8 0 -13 c-3 -4 2 -7 0 -10`} />
    ))}
  </g>
)

export const Bubble = ({ x, y, r, delay }: { x: number; y: number; r: number; delay: number }) => (
  <circle className="vx-bubble fill-white/60 text-navy" style={d(delay)} cx={x} cy={y} r={r} strokeWidth="1.6" />
)

function Art({ name, uid }: { name: VectorKey; uid: string }) {
  switch (name) {
    case 'tissue':
      return (
        <>
          <g className="vx-wave">
            <path className="vx-line fill-white" d="M47 70 C43 54 53 45 49 30 C57 35 66 28 72 33 C67 45 77 55 73 70 Z" />
            <path className="vx-line text-line" d="M55 40 C58 48 56 56 60 64" strokeWidth="1.6" />
          </g>
          <rect className="vx-line fill-white" x="26" y="62" width="68" height="32" rx="6" />
          <path className="vx-line" d="M45 70 h30" />
          <path className="vx-line text-leaf" d="M34 84 h12 M74 84 h12" />
          <Spark x={92} y={40} s={0.9} delay={0.4} />
          <Spark x={28} y={46} s={0.6} delay={1.3} />
        </>
      )
    case 'paper':
      return (
        <>
          <g className="vx-unroll">
            <path className="vx-line fill-white" d="M56 60 h30 v36 l-5 -3 -5 3 -5 -3 -5 3 -5 -3 -5 3 Z" />
            <path className="vx-line text-line" d="M62 72 h18 M62 80 h12" strokeWidth="1.6" />
          </g>
          <path className="vx-line fill-white" d="M36 30 h50 a9 16 0 0 1 0 32 h-50" />
          <ellipse className="vx-line fill-white" cx="36" cy="46" rx="9" ry="16" />
          <ellipse className="vx-line fill-mist" cx="36" cy="46" rx="3.5" ry="6.5" />
          <path className="vx-line text-leaf" d="M50 30 v32 M70 30 v32" strokeWidth="1.8" />
          <Spark x={24} y={78} s={0.8} delay={0.8} />
        </>
      )
    case 'aluminium':
      return (
        <>
          <g className="vx-hover">
            <path className="vx-line" fill={FOIL_LIGHT} d="M26 48 h68 l-7 -12 h-54 Z" />
            <path className="vx-line text-slate" d="M40 42 h40" strokeWidth="1.6" />
          </g>
          <path className="vx-line" fill={FOIL} d="M22 62 h76 l-9 32 h-58 Z" />
          <path className="vx-line" d="M17 62 h86" />
          <path className="vx-line text-slate" d="M38 70 l3 17 M50 70 l1.5 17 M62 70 v17 M74 70 l-1.5 17 M86 70 l-3 17" strokeWidth="1.4" />
          <path className="vx-shine text-white" d="M34 66 l-6 24" strokeWidth="5" />
          <Spark x={100} y={36} s={0.9} delay={0.2} />
        </>
      )
    case 'takeaway':
      return (
        <>
          <Steam x={60} y={34} />
          <g className="vx-flap-l">
            <path className="vx-line" fill={KRAFT_DEEP} d="M34 52 l7 -13 h19 v13 Z" />
          </g>
          <g className="vx-flap-r">
            <path className="vx-line" fill={KRAFT_DEEP} d="M60 52 v-13 h19 l7 13 Z" />
          </g>
          <path className="vx-line" fill={KRAFT} d="M34 52 h52 l-8 42 h-36 Z" />
          <path className="vx-line" d="M38 52 h44" />
          <circle className="vx-line fill-leaf" cx="60" cy="72" r="7" />
          <path className="vx-line text-white" d="M57 72 l2 2 l4 -4" strokeWidth="1.8" />
        </>
      )
    case 'cups':
      return (
        <>
          <Steam x={60} y={30} />
          <g className="vx-float">
            <path className="vx-line fill-white" d="M38 46 h44 l-6 48 h-32 Z" />
            <path className="vx-line" fill={KRAFT} d="M40 60 h40 l-1.8 16 h-36.4 Z" />
            <path className="vx-line fill-navy" d="M34 40 h52 v6 h-52 Z" />
            <path className="vx-line fill-navy" d="M39 40 l3 -6 h36 l3 6" />
            <circle className="vx-line fill-leaf" cx="60" cy="68" r="3.5" strokeWidth="0" />
          </g>
          <Spark x={94} y={58} s={0.8} delay={0.9} />
        </>
      )
    case 'bags':
      return (
        <g className="vx-sway">
          <path className="vx-line" d="M48 46 c0 -18 24 -18 24 0" strokeWidth="2.6" />
          <path className="vx-line" fill={KRAFT} d="M34 44 h52 l4 50 h-60 Z" />
          <path className="vx-line" fill={KRAFT_DEEP} d="M34 44 l6 6 h40 l6 -6 Z" />
          <path className="vx-line fill-leaf" d="M60 80 c-1 -10 6 -16 15 -16 c0 10 -6 16 -15 16 Z" strokeWidth="1.8" />
          <path className="vx-line" d="M60 80 c2 -5 6 -9 10 -11" strokeWidth="1.4" />
        </g>
      )
    case 'chemicals':
      return (
        <>
          <g className="text-leaf-deep">
            {[0, 0.4, 0.8].map((delay, i) => (
              <circle key={i} className="vx-puff fill-leaf-soft" style={d(delay)} cx={30 - i * 6} cy={34 + (i - 1) * 7} r={3 + i} strokeWidth="1.4" />
            ))}
          </g>
          <g className="vx-press">
            <path className="vx-line fill-navy" d="M46 26 h30 v12 h-30 Z" />
            <path className="vx-line fill-navy" d="M46 29 h-8 v6 h8" />
            <path className="vx-line" d="M58 38 l-7 14" strokeWidth="3" />
          </g>
          <path className="vx-line fill-white" d="M56 38 h12 v10 h-12 Z" />
          <rect className="vx-line fill-white" x="44" y="48" width="36" height="48" rx="9" />
          <rect className="vx-line fill-leaf" x="50" y="62" width="24" height="20" rx="3" />
          <path className="vx-line text-white" d="M54 72 q3 -3 6 0 t6 0 t6 0" strokeWidth="1.6" />
          <Bubble x={88} y={80} r={4} delay={0} />
          <Bubble x={94} y={70} r={2.6} delay={1.1} />
          <Bubble x={84} y={62} r={3.2} delay={2} />
        </>
      )
    case 'tools':
      return (
        <>
          <g className="vx-sweep">
            <path className="vx-line" d="M60 16 V72" strokeWidth="3.2" />
            <path className="vx-line" fill={KRAFT} d="M42 76 h36 l6 20 h-48 Z" />
            <rect className="vx-line fill-navy" x="44" y="70" width="32" height="7" rx="2" />
            <path className="vx-line" d="M45 82 l-2 13 M53 82 l-1 13 M61 82 v13 M69 82 l1 13 M77 82 l2 13" strokeWidth="1.4" />
          </g>
          <g className="text-slate">
            {[0, 0.5, 1].map((delay, i) => (
              <circle key={i} className="vx-dust fill-mist" style={d(delay)} cx={88 + i * 5} cy={92 - i * 4} r={2.4 - i * 0.4} strokeWidth="1.2" />
            ))}
          </g>
        </>
      )
    case 'ppe':
      return (
        <>
          <g className="text-slate" transform="rotate(18 86 60)">
            <path className="vx-line" d="M86 30 v18 M81 30 v13 M91 30 v13 M81 43 c0 7 10 7 10 0 M86 48 v44" strokeWidth="2.4" />
          </g>
          <g className="vx-hand">
            <path
              className="vx-line fill-white"
              d="M40 96 V76 C34 70 30 64 32 60 C34 57 38 58 41 62 L44 66 V38 C44 33 51 33 51 38 V44 V32 C51 27 58 27 58 32 V44 V34 C58 29 65 29 65 34 V46 V40 C65 35 72 35 72 40 V74 C72 82 68 88 66 90 V96 Z"
            />
            <rect className="vx-line fill-leaf" x="38" y="88" width="30" height="9" rx="2.5" />
          </g>
          <Spark x={24} y={36} s={0.8} delay={0.6} />
        </>
      )
    case 'foam':
      return (
        <>
          <path className="vx-line fill-leaf" d="M32 70 q28 -12 56 0 Z" />
          <path className="vx-line fill-white" d="M26 70 h68 l-6 22 h-56 Z" />
          <g className="vx-clam">
            <path className="vx-line fill-white" d="M26 70 c0 -16 8 -24 34 -24 c26 0 34 8 34 24 Z" />
            <path className="vx-line text-line" d="M40 60 h40" strokeWidth="1.6" />
          </g>
          <g className="fill-mist" stroke="none">
            <circle cx="40" cy="80" r="1.6" />
            <circle cx="52" cy="84" r="1.6" />
            <circle cx="66" cy="80" r="1.6" />
            <circle cx="78" cy="84" r="1.6" />
          </g>
          <Spark x={98} y={44} s={0.9} delay={0.3} />
        </>
      )
    case 'bio':
      return (
        <>
          <path className="vx-line text-leaf-deep" d="M60 72 V42" strokeWidth="2.6" />
          <g className="vx-grow-l">
            <path className="vx-line fill-leaf" d="M60 56 c-4 -12 -16 -15 -23 -12 c2 10 12 15 23 12 Z" strokeWidth="1.8" />
          </g>
          <g className="vx-grow-r">
            <path className="vx-line fill-leaf" d="M60 46 c4 -12 16 -16 24 -14 c-2 10 -14 16 -24 14 Z" strokeWidth="1.8" />
          </g>
          <path className="vx-line" fill={KRAFT} d="M28 70 h64 c0 16 -14 26 -32 26 c-18 0 -32 -10 -32 -26 Z" />
          <path className="vx-line" d="M24 70 h72" />
          <path className="vx-line text-leaf-deep" d="M50 84 a6 6 0 1 1 6 6 M56 90 l-3 -3 M56 90 l-3 3" strokeWidth="1.6" />
          <Spark x={92} y={30} s={0.8} delay={1} />
        </>
      )
    case 'film':
      return (
        <>
          <g className="vx-stretch">
            <path className="vx-line" fill={SKY} fillOpacity="0.85" d="M50 40 h28 l3 30 h-31 Z" strokeWidth="1.6" />
          </g>
          <path className="vx-line fill-white" d="M24 34 v46 a14 5 0 0 0 28 0 v-46" />
          <ellipse className="vx-line fill-white" cx="38" cy="34" rx="14" ry="5" />
          <ellipse className="vx-line fill-mist" cx="38" cy="34" rx="4" ry="1.6" strokeWidth="1.6" />
          <path className="vx-line text-line" d="M30 46 v28 M44 46 v28" strokeWidth="1.4" />
          <g className="vx-float" style={d(0.6)}>
            <path className="vx-line fill-navy" d="M78 60 c-4 8 -10 14 -10 24 c0 8 6 12 16 12 c10 0 16 -4 16 -12 c0 -10 -6 -16 -10 -24 Z" />
            <path className="vx-line" d="M78 60 l-4 -8 M90 60 l4 -8" />
            <path className="vx-line text-leaf" d="M77 60 h14" strokeWidth="3" />
          </g>
        </>
      )
    case 'hygiene':
      return (
        <>
          <g className="vx-press">
            <path className="vx-line fill-navy" d="M48 28 h24 v7 h-24 Z" />
            <path className="vx-line" d="M48 31 h-11 v5" />
            <path className="vx-line" d="M60 35 v8" strokeWidth="3" />
          </g>
          <path className="vx-drip fill-leaf" d="M37 40 c0 0 -4 5 -4 8 a4 4 0 0 0 8 0 c0 -3 -4 -8 -4 -8 Z" />
          <rect className="vx-line fill-white" x="44" y="42" width="32" height="52" rx="8" />
          <rect className="vx-line fill-leaf" fillOpacity="0.35" x="48" y="60" width="24" height="30" rx="4" strokeWidth="1.6" />
          <Bubble x={86} y={84} r={4} delay={0.3} />
          <Bubble x={92} y={72} r={2.4} delay={1.4} />
          <Spark x={90} y={40} s={0.8} delay={0.7} />
        </>
      )
    case 'plastic':
      return (
        <>
          <rect className="vx-line fill-white" x="22" y="66" width="38" height="28" rx="4" />
          <rect className="vx-line fill-leaf" x="20" y="59" width="42" height="8" rx="3" />
          <path className="vx-line text-line" d="M30 76 h22" strokeWidth="1.6" />
          <g className="vx-float" style={d(0.4)}>
            <defs>
              <clipPath id={uid}>
                <path d="M70 40 c0 -4 4 -8 10 -8 c6 0 10 4 10 8 v50 c0 3 -2 5 -5 5 h-10 c-3 0 -5 -2 -5 -5 Z" />
              </clipPath>
            </defs>
            <path className="vx-line fill-white" d="M70 40 c0 -4 4 -8 10 -8 c6 0 10 4 10 8 v50 c0 3 -2 5 -5 5 h-10 c-3 0 -5 -2 -5 -5 Z" />
            <g clipPath={`url(#${uid})`}>
              <path className="vx-slosh" fill={SKY} stroke="none" d="M50 62 q5 -4 10 0 t10 0 t10 0 t10 0 t10 0 t10 0 v40 h-60 Z" />
            </g>
            <path className="vx-line" fill="none" d="M70 40 c0 -4 4 -8 10 -8 c6 0 10 4 10 8 v50 c0 3 -2 5 -5 5 h-10 c-3 0 -5 -2 -5 -5 Z" />
            <rect className="vx-line fill-navy" x="75" y="22" width="10" height="10" rx="2" />
          </g>
          <Spark x={28} y={40} s={0.8} delay={0.5} />
        </>
      )
  }
}

/** The shared frame every vector draws in: 120×120 line style, optional soft blob, draw delay. */
export function VectorSvg({
  children,
  className = '',
  blob = true,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  blob?: boolean
  delay?: number
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      style={{ '--vd': `${delay}s` } as CSSProperties}
      className={`vx ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {blob && <circle className="vx-blob fill-leaf-soft" stroke="none" cx="60" cy="64" r="46" />}
      <g className="text-ink">{children}</g>
    </svg>
  )
}

/** One category's vector. Put it inside a `VectorScene` to get the draw-in. */
export function CategoryVector({
  name,
  className = '',
  blob = true,
  delay = 0,
}: {
  name: VectorKey
  className?: string
  blob?: boolean
  /** Seconds before this icon starts drawing in (for staggering a group). */
  delay?: number
}) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg
      viewBox="0 0 120 120"
      style={{ '--vd': `${delay}s` } as CSSProperties}
      className={`vx ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {blob && <circle className="vx-blob fill-leaf-soft" stroke="none" cx="60" cy="64" r="46" />}
      <g className="text-ink">
        <Art name={name} uid={`vx-${uid}`} />
      </g>
    </svg>
  )
}

/**
 * Plays the draw-in for the vectors inside it the first time it scrolls into view.
 * `drawn` skips the draw-in (for repeated copies like the ribbon).
 */
export function VectorScene({
  children,
  className = '',
  drawn = false,
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  drawn?: boolean
  as?: 'div' | 'span'
}) {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(drawn)

  useEffect(() => {
    if (drawn) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [drawn])

  return (
    <Tag ref={ref as never} className={`vx-scene ${inView ? 'is-in' : ''} ${className}`}>
      {children}
    </Tag>
  )
}
