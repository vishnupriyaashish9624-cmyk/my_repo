'use client'

import { motion } from 'motion/react'
import type { Item } from '@/lib/catalogue'
import { CategoryVector, VectorScene, type VectorKey } from '../vectors/CategoryVector'
import { ItemVector } from '../vectors/ItemVectors'
import { Arrow } from '../Header'

const EASE = [0.2, 0.7, 0.2, 1] as const

const ORBIT = [
  { className: 'start-[4%] top-[10%] w-28', d: '0s' },
  { className: 'end-[10%] top-[6%] w-24', d: '-3s' },
  { className: 'end-[2%] bottom-[30%] w-32', d: '-6s' },
  { className: 'start-[30%] top-[4%] w-20', d: '-8s' },
]

/**
 * Hero for a category without a scroll film: the category's vector large, drawn in, with its product
 * types drifting around it, the giant name and calls to action. Same footprint as the film heroes.
 */
export default function CategoryHero({
  icon,
  name,
  giant,
  text,
  count,
  items,
  image,
}: {
  icon: VectorKey
  name: string
  giant: string
  text: string
  count: number
  items: Item[]
  /** Optional still life; replaces the large vector. */
  image?: string
}) {
  return (
    <section
      id="top"
      className="relative flex min-h-svh items-end overflow-hidden bg-paper px-5 pb-16 pt-32 md:px-10"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute end-[6%] top-1/2 w-[min(46vw,560px)] -translate-y-1/2 max-md:end-1/2 max-md:top-[30%] max-md:w-[70vw] max-md:translate-x-1/2">
          {image ? (
            <motion.div
              className="overflow-hidden rounded-[32px] shadow-[0_40px_90px_-30px_rgba(28,42,92,0.45)]"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`${name}: still life`}
                className="kenburns aspect-[3/2] w-full object-cover"
              />
            </motion.div>
          ) : (
            <VectorScene>
              <CategoryVector name={icon} className="w-full" />
            </VectorScene>
          )}
        </div>
        {items.slice(0, ORBIT.length).map((it, i) => (
          <div key={it.label} className={`absolute hidden lg:block ${ORBIT[i].className}`}>
            <VectorScene>
              <div
                className="vx-drift"
                style={{ '--d': ORBIT[i].d, '--dur': '10s' } as React.CSSProperties}
              >
                <ItemVector name={it.icon} delay={0.6 + i * 0.2} className="w-full opacity-90" />
              </div>
            </VectorScene>
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(245_247_250/0.95)_0%,transparent_45%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1260px]">
        <motion.p
          className="label flex items-center gap-2.5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Category
          <span className="rounded-full bg-leaf-soft px-2 py-1 tracking-normal normal-case text-leaf-deep">
            {count ? `${count} products` : 'Sourced to order'}
          </span>
        </motion.p>
        <h1
          className="mt-3 overflow-hidden font-extrabold leading-[0.85] tracking-[-0.055em]"
          style={{
            fontSize: giant.length <= 6 ? 'clamp(4.5rem,15vw,14rem)' : 'clamp(3.2rem,10vw,10rem)',
          }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {giant}
            <span className="text-leaf">.</span>
          </motion.span>
        </h1>
        <motion.div
          className="mt-6 flex flex-wrap items-end justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        >
          <div className="max-w-xl">
            <p className="font-display text-xl font-bold">{name}</p>
            <p className="mt-1 text-lg text-slate">{text}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="#types"
              className="group flex items-center gap-2 rounded-xl bg-leaf px-5 py-3.5 font-semibold text-white transition hover:bg-leaf-deep"
            >
              See products <Arrow />
            </a>
            <a
              href="#quote"
              className="rounded-xl border border-line bg-white/70 px-5 py-3.5 font-semibold transition hover:bg-white"
            >
              Ask for a quote
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
