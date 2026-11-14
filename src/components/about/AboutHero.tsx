'use client'

import { motion } from 'motion/react'
import { CatIcon, EASE } from './ui'
import type { VectorKey } from '../vectors/CategoryVector'

const ICONS: VectorKey[] = ['aluminium', 'cups', 'chemicals', 'tissue']

/**
 * Figures strip under the About hero film (dark): four live numbers, each with a category icon,
 * that rise in and count as a set.
 */
export default function AboutFigures({ figures }: { figures: { v: number | string; l: string }[] }) {
  return (
    <section aria-label="Klen Plus in numbers" className="theme-dark relative px-5 py-10 md:px-10 md:py-14">
      <dl className="mx-auto grid max-w-[1840px] grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 md:grid-cols-4">
        {figures.map((f, i) => (
          <motion.div
            key={f.l}
            className="flex items-center gap-4 bg-ink/85 p-5 md:p-7"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          >
            <span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-white sm:grid">
              <CatIcon name={ICONS[i % ICONS.length]} className="w-10" />
            </span>
            <span>
              <dd className="font-display text-[clamp(2rem,3.6vw,3.4rem)] font-extrabold leading-none tracking-[-0.04em] text-leaf">
                {f.v}
              </dd>
              <dt className="mt-2 text-sm text-white/70">{f.l}</dt>
            </span>
          </motion.div>
        ))}
      </dl>
    </section>
  )
}
