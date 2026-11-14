'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'

/**
 * 3D stage: tilts toward the pointer on a spring, and (with `enter`) swings in from an angle as it
 * scrolls into view. Children keep 3D (preserve-3d), so anything wrapped in <Depth z={…}> floats in
 * front of or behind the surface and shifts with parallax as it tilts. Flat under reduced motion.
 */
export default function Tilt3D({
  children,
  className = '',
  max = 7,
  enter = 10,
  perspective = 1400,
}: {
  children: ReactNode
  className?: string
  /** Max pointer tilt in degrees. */
  max?: number
  /** Degrees it swings in from as it scrolls into view (0 = none). */
  enter?: number
  perspective?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 140, damping: 18 })
  const sy = useSpring(py, { stiffness: 140, damping: 18 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const entry = useTransform(scrollYProgress, [0, 1], [enter, 0])
  const rotateX = useTransform([sy, entry], ([y, e]: number[]) => e - y * max)
  const rotateY = useTransform(sx, (x) => x * max)

  return (
    <div
      ref={ref}
      className={`motion-reduce:[perspective:none] ${className}`}
      style={{ perspective } as CSSProperties}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width - 0.5)
        py.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <motion.div
        className="relative h-full w-full motion-reduce:!transform-none"
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/** Lifts its content off the tilting surface by z pixels (positive = towards the viewer). */
export function Depth({
  z,
  className = '',
  children,
}: {
  z: number
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={className}
      style={{ transform: `translateZ(${z}px)`, transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}
