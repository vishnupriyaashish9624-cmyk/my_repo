'use client'

import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { CategoryVector, VectorScene, type VectorKey } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import { UseVector, type UseKey } from '../vectors/TissueVectors'

export const EASE = [0.2, 0.7, 0.2, 1] as const

/** Any of the three vector families, by prefix: "use:kitchen", "cat:cups" or an item key. */
export type AnyIcon = `use:${UseKey}` | ItemKey
export function Icon({
  name,
  className = 'w-full',
  delay = 0,
}: {
  name: AnyIcon
  className?: string
  delay?: number
}) {
  if (name.startsWith('use:'))
    return <UseVector name={name.slice(4) as UseKey} className={className} delay={delay} />
  return <ItemVector name={name as ItemKey} className={className} delay={delay} />
}
export function CatIcon({ name, className = 'w-full' }: { name: VectorKey; className?: string }) {
  return (
    <VectorScene className={className}>
      <CategoryVector name={name} blob={false} className="w-full" />
    </VectorScene>
  )
}

/**
 * Section heading used across the About page: a small eyebrow, a title whose `highlight` part is
 * set in leaf green, and an intro paragraph. Each piece rises in as it scrolls into view.
 */
export function SectionHead({
  id,
  eyebrow,
  title,
  highlight,
  children,
  dark = false,
  className = '',
}: {
  id: string
  eyebrow: string
  title: string
  highlight?: string
  children?: ReactNode
  dark?: boolean
  className?: string
}) {
  const at = highlight ? title.lastIndexOf(highlight) : -1
  const before = at >= 0 ? title.slice(0, at) : title
  return (
    <div className={className}>
      <motion.p
        className={`font-mono text-xs uppercase tracking-[0.16em] ${dark ? 'text-leaf' : 'text-leaf-deep'}`}
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        id={id}
        className="mt-3 text-[clamp(2.2rem,4.4vw,4.4rem)] font-bold leading-[0.95] tracking-[-0.035em]"
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {before}
        {at >= 0 && <span className="text-leaf">{highlight}</span>}
      </motion.h2>
      {children && (
        <motion.div
          className={`mt-5 max-w-2xl text-lg leading-relaxed ${dark ? 'text-white/75' : 'text-slate'}`}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
        >
          {children}
        </motion.div>
      )}
    </div>
  )
}

/** Card that rises in, lifts on hover and draws a leaf underline. */
export function Card({
  children,
  i = 0,
  dark = false,
  className = '',
}: {
  children: ReactNode
  i?: number
  dark?: boolean
  className?: string
}) {
  return (
    <motion.li
      className={`vx-host group relative list-none overflow-hidden rounded-[24px] border p-6 transition duration-300 hover:-translate-y-1.5 ${
        dark
          ? 'border-white/10 bg-white/[0.05] backdrop-blur-sm hover:border-leaf/60'
          : 'border-line bg-white hover:border-leaf/60 hover:shadow-[0_24px_50px_-28px_rgba(28,42,92,0.4)]'
      } ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay: (i % 4) * 0.09, ease: EASE }}
    >
      {children}
      <span
        aria-hidden
        className="absolute inset-x-6 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-leaf transition duration-500 group-hover:scale-x-100"
      />
    </motion.li>
  )
}

/** Small pill tag. */
export function Chip({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${dark ? 'bg-white/10 text-white/85' : 'bg-leaf-soft text-leaf-deep'}`}
    >
      {children}
    </span>
  )
}

/** Shared section wrapper: theme, spacing and the centred max-width container. */
export function Section({
  id,
  labelledBy,
  dark = false,
  children,
  className = '',
  sectionRef,
}: {
  id: string
  labelledBy: string
  dark?: boolean
  children: ReactNode
  className?: string
  sectionRef?: React.Ref<HTMLElement>
}) {
  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={labelledBy}
      className={`${dark ? 'theme-dark' : 'theme-light'} relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28 ${className}`}
    >
      <div className="relative mx-auto max-w-[1840px]">{children}</div>
    </section>
  )
}

export function Tick({ on = true, className = 'size-4' }: { on?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <motion.path
        d="M3.5 8.5l3 3 6-7"
        initial={false}
        animate={{ pathLength: on ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      />
    </svg>
  )
}
