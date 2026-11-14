'use client'

import { useRef, type CSSProperties } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import type { Item, Use } from '@/lib/catalogue'
import { CategoryVector, VectorScene, type VectorKey } from '../vectors/CategoryVector'
import { ItemVector } from '../vectors/ItemVectors'
import { UseVector } from '../vectors/TissueVectors'

const EASE = [0.2, 0.7, 0.2, 1] as const

const RIBBON = 'M0 40 C240 38 520 44 760 42 C1000 40 1160 44 1240 30 C1290 20 1310 14 1340 26 C1370 38 1400 40 1440 38'

/** Card columns on large screens, by number of cards (literal classes so Tailwind sees them). */
const COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-3 xl:grid-cols-6',
}

/** A loose sheet of tissue drifting in the background. */
const Sheet = ({ className, d }: { className: string; d: string }) => (
  <svg viewBox="0 0 60 60" className={`vx-drift absolute ${className}`} style={{ '--d': d, '--dur': '11s' } as CSSProperties} aria-hidden>
    <path d="M8 14 C20 6 34 18 52 10 L50 48 C34 54 22 42 10 50 Z" fill="white" stroke="var(--color-line)" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M18 22 C26 18 34 26 42 22" fill="none" stroke="var(--color-line)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

const FLOATS = [
  { className: 'end-[8%] top-24 w-16 opacity-80', d: '0s' },
  { className: 'end-[28%] top-[42%] w-10 opacity-60', d: '-4s' },
  { className: 'start-[3%] bottom-24 w-12 opacity-70', d: '-7s' },
]

/**
 * A category's product types: a ribbon line draws across with scroll, then one card per product type
 * (its own animated vector, spec chips popping in) and three "where it's used" cards, ending in a
 * call to action. Used on each category's inner page, under the film hero.
 */
export default function CategoryRange({
  id,
  index,
  name,
  count,
  heading,
  text,
  items,
  uses,
  icon,
  cta,
}: {
  id: string
  index: number
  name: string
  count?: number
  heading: string
  text?: string
  items: Item[]
  uses: Use[]
  icon: VectorKey
  cta: { href: string; label: string }
}) {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start 90%', 'start 20%'] })
  const dot = useTransform(scrollYProgress, (v) => `${v * 100}%`)
  if (!items.length) return null
  const titleId = `${id}-title`

  return (
    <section id={id} ref={root} aria-labelledby={titleId} className="relative overflow-hidden bg-paper px-5 pb-20 pt-14 md:px-10 md:pb-28">
      {/* Ribbon: draws across the top as the section scrolls in */}
      <svg aria-hidden viewBox="0 0 1440 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full">
        <motion.path d={RIBBON} fill="none" stroke="var(--color-leaf)" strokeWidth="3" strokeLinecap="round" style={{ pathLength: scrollYProgress }} />
        <motion.circle r="7" fill="var(--color-leaf)" style={{ offsetPath: `path('${RIBBON}')`, offsetDistance: dot }} />
      </svg>

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {icon === 'tissue'
          ? FLOATS.map((f) => <Sheet key={f.d} className={f.className} d={f.d} />)
          : FLOATS.map((f) => (
              <VectorScene key={f.d} drawn className={`absolute ${f.className} !opacity-25`}>
                <div className="vx-drift" style={{ '--d': f.d, '--dur': '11s' } as CSSProperties}>
                  <CategoryVector name={icon} blob={false} className="w-full" />
                </div>
              </VectorScene>
            ))}
      </div>

      <div className="relative mx-auto max-w-[1260px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <motion.p
              className="label flex items-center gap-2.5 !text-leaf-deep"
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {String(index).padStart(2, '0')} · {name}
              {count !== undefined && <span className="rounded-full bg-leaf-soft px-2 py-1 tracking-normal normal-case">{count} products</span>}
            </motion.p>
            <motion.h2
              id={titleId}
              className="mt-3 text-[clamp(2rem,4.2vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.03em]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {heading}
            </motion.h2>
          </div>
          {text && (
            <motion.p
              className="max-w-md text-slate"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              {text}
            </motion.p>
          )}
        </div>

        {/* One card per product type */}
        <ol className={`mt-12 grid gap-4 sm:grid-cols-2 ${COLS[items.length] ?? 'lg:grid-cols-4'}`}>
          {items.map((it, i) => (
            <motion.li
              key={it.label}
              className="vx-host group flex flex-col rounded-[22px] border border-line bg-white p-5 transition duration-300 hover:-translate-y-1.5 hover:border-leaf hover:shadow-[0_24px_50px_-26px_rgba(28,42,92,0.45)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: (i % 6) * 0.09, ease: EASE }}
            >
              <span className="font-mono text-xs tabular-nums text-slate">{String(i + 1).padStart(2, '0')}</span>
              <VectorScene className="mx-auto my-2 w-[min(150px,80%)]">
                <ItemVector name={it.icon} delay={(i % 6) * 0.12} className="w-full transition duration-500 group-hover:scale-105" />
              </VectorScene>
              <h3 className="text-xl font-bold tracking-[-0.02em]">{it.label}</h3>
              {it.chips.length ? (
                <motion.ul
                  className="mt-3 flex flex-wrap gap-1.5"
                  initial="hide"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ staggerChildren: 0.08, delayChildren: 0.5 + (i % 6) * 0.09 }}
                >
                  {it.chips.map((chip) => (
                    <motion.li
                      key={chip}
                      className="rounded-full bg-paper px-2.5 py-1 font-mono text-[11px] text-ink transition group-hover:bg-leaf-soft"
                      variants={{ hide: { opacity: 0, scale: 0.6, y: 8 }, show: { opacity: 1, scale: 1, y: 0 } }}
                      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                    >
                      {chip}
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                it.text && <p className="mt-2 text-sm text-slate">{it.text}</p>
              )}
            </motion.li>
          ))}
        </ol>

        {/* Where it's used */}
        {uses.length > 0 && (
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {uses.map((u, i) => (
              <motion.div
                key={u.name}
                className="flex items-center gap-4 rounded-2xl border border-line bg-white/70 p-3 pe-5"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              >
                <VectorScene className="w-16 shrink-0">
                  <UseVector name={u.key} delay={0.2 + i * 0.15} className="w-full" />
                </VectorScene>
                <div>
                  <p className="font-display text-lg font-bold leading-tight">{u.name}</p>
                  <p className="text-sm text-slate">{u.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.a
          href={cta.href}
          className="group mt-10 inline-flex items-center gap-3 font-semibold text-ink"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span className="grid size-9 place-items-center rounded-full bg-leaf text-white transition group-hover:translate-y-1">
            <svg viewBox="0 0 16 16" className="size-4 animate-bounce" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M8 3v10M4 9l4 4 4-4" />
            </svg>
          </span>
          {cta.label}
        </motion.a>
      </div>
    </section>
  )
}
