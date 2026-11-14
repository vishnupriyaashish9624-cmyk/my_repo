'use client'

import { useRef, type CSSProperties } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react'
import { VectorScene } from './CategoryVector'
import { ItemVector, type ItemKey } from './ItemVectors'

export type DecorSpot = {
  icon: ItemKey
  /** Position/size classes, e.g. "start-[31%] top-[20%] w-24". */
  className: string
  /** Parallax strength: + rises as you scroll, − sinks. ~0.5–1.5. */
  speed?: number
  /** Degrees turned across the section's scroll. */
  spin?: number
  /** Show on a white disc (for dark sections). */
  disc?: boolean
}

function Spot({
  spot,
  progress,
  i,
}: {
  spot: DecorSpot
  progress: MotionValue<number>
  i: number
}) {
  const s = spot.speed ?? 1
  const y = useTransform(progress, [0, 1], [120 * s, -120 * s])
  const rotate = useTransform(progress, [0, 1], [-(spot.spin ?? 12), spot.spin ?? 12])
  const scale = useTransform(progress, [0, 0.25, 0.75, 1], [0.7, 1, 1, 0.85])
  return (
    <motion.div className={`absolute ${spot.className}`} style={{ y, rotate, scale }}>
      <div
        className="vx-drift"
        style={{ '--d': `${-i * 1.7}s`, '--dur': `${8 + (i % 3) * 2}s` } as CSSProperties}
      >
        <div
          className={
            spot.disc
              ? 'rounded-full bg-white p-1.5 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.5)]'
              : ''
          }
        >
          <VectorScene>
            <ItemVector name={spot.icon} delay={0.1 + i * 0.12} className="w-full" />
          </VectorScene>
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Decorative product vectors scattered into a section's empty space. Each draws in when it arrives,
 * drifts gently, and moves with scroll at its own speed and spin (parallax depth). Optional dashed
 * trail that draws itself as the section scrolls through. Large screens only; purely decorative.
 */
export default function ScrollDecor({
  spots,
  trail,
  className = '',
}: {
  spots: DecorSpot[]
  trail?: string
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const draw = useTransform(scrollYProgress, [0.1, 0.7], [0, 1])
  return (
    <div
      ref={root}
      aria-hidden
      className={`pointer-events-none absolute inset-0 hidden lg:block ${className}`}
    >
      {trail && (
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <motion.path
            d={trail}
            fill="none"
            stroke="var(--color-leaf)"
            strokeOpacity="0.45"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength: draw }}
          />
        </svg>
      )}
      {spots.map((s, i) => (
        <Spot key={s.icon + i} spot={s} progress={scrollYProgress} i={i} />
      ))}
    </div>
  )
}
