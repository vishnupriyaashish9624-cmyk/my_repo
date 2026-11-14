'use client'

import { motion, useScroll, useTransform, useVelocity, useSpring } from 'motion/react'
import { useRef } from 'react'
import { CategoryVector, VectorScene } from '../vectors/CategoryVector'
import { CATALOGUE } from '@/lib/catalogue'

/**
 * Endless ribbon of every category vector with its name, looping sideways (CSS marquee, paused
 * off-screen). The ribbon leans with scroll speed so it feels tied to the page.
 */
export default function VectorRibbon() {
  const root = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()
  const v = useSpring(useVelocity(scrollY), { stiffness: 120, damping: 30 })
  const skew = useTransform(v, [-2000, 2000], [6, -6], { clamp: true })
  const items = [...CATALOGUE, ...CATALOGUE]

  return (
    <div ref={root} aria-hidden className="relative overflow-hidden border-y border-line bg-leaf-soft py-6">
      <motion.div style={{ skewX: skew }}>
        <div className="marquee flex w-max items-center gap-10 [animation-duration:60s]">
          {items.map((c, i) => (
            <VectorScene key={i} drawn className="flex shrink-0 items-center gap-3">
              <CategoryVector name={c.key} blob={false} className="w-16" />
              <span className="whitespace-nowrap font-display text-2xl font-bold tracking-[-0.02em] text-ink">
                {c.short}
              </span>
              <span className="ms-6 size-2 rounded-full bg-leaf" />
            </VectorScene>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
