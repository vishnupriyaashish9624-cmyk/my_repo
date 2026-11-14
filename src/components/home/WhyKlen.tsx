'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import { UseVector, type UseKey } from '../vectors/TissueVectors'
import OrbitScene from '../vectors/OrbitScene'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

type Reason = {
  title: string
  text: string
  use?: UseKey
  item?: ItemKey
}

const REASONS: Reason[] = [
  {
    title: 'Everything Under One Roof',
    text: 'A comprehensive range of packaging, disposable, hygiene and cleaning products from one convenient supplier.',
    use: 'storeroom',
  },
  {
    title: 'Competitive Bulk Pricing',
    text: 'Business-friendly carton pricing and value-focused purchasing to help manage your supply costs.',
    use: 'counter',
  },
  {
    title: 'Quality You Can Rely On',
    text: 'Carefully selected products designed to meet the everyday demands of commercial kitchens and professional facilities.',
    item: 'disinfect',
  },
  {
    title: 'Convenient Delivery',
    text: 'Simplify procurement by bringing multiple business essentials together in fewer orders and deliveries.',
    use: 'delivery',
  },
  {
    title: 'Built for Business Needs',
    text: 'Solutions for restaurants, cafés, catering companies, offices, cleaning teams and commercial facilities.',
    use: 'kitchen',
  },
  {
    title: 'One Reliable Supply Partner',
    text: 'Build a simpler purchasing routine with one supplier for the essential products your business uses every day.',
    item: 'bill-roll',
  },
]

/**
 * "Why choose Klen+": six reasons, each a card with its own animated vector.
 */
export default function WhyKlen() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section
      id="why"
      ref={root}
      aria-labelledby="why-title"
      className="theme-light relative overflow-hidden px-5 pb-8 pt-10 md:px-10 md:pb-12 md:pt-12"
    >
      {/* Soft leaf and navy glows drifting behind */}
      <motion.div
        aria-hidden
        style={{ y: drift }}
        className="pointer-events-none absolute -end-40 -top-40 size-[520px] rounded-full bg-leaf/25 blur-[120px]"
      />
      <motion.div
        aria-hidden
        style={{ y: drift }}
        className="pointer-events-none absolute -bottom-48 -start-40 size-[520px] rounded-full bg-navy/10 blur-[120px]"
      />
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="vx-orbit pointer-events-none absolute -end-24 bottom-10 hidden w-[420px] text-navy/15 md:block"
        style={{ '--dur': '60s' } as React.CSSProperties}
      >
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="200" cy="10" r="6" className="fill-leaf" />
      </svg>

      <ScrollDecor
        spots={[
          {
            icon: 'cat:foam',
            className: 'start-[44%] top-[10%] w-16',
            speed: 1.2,
            spin: 14,
            disc: true,
          },
          {
            icon: 'pet-glass',
            className: 'start-[50%] top-[34%] w-14',
            speed: 0.7,
            spin: -10,
            disc: true,
          },
          {
            icon: 'cat:bio',
            className: 'end-[2%] top-[6%] w-14',
            speed: 1.5,
            spin: 18,
            disc: true,
          },
        ]}
      />
      <div className="relative mx-auto max-w-[1840px]">
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="max-w-3xl">
            <motion.h2
              id="why-title"
              className="text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.95] tracking-[-0.035em]"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              More than a supplier{' '}
              <span className="text-leaf">A partner your business can count on</span>
            </motion.h2>
            <motion.p
              className="mt-6 max-w-xl text-justify text-slate"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              At Klen+, we understand that running a business means having the right supplies at the
              right time. That&apos;s why we bring food packaging, hygiene, cleaning and facility
              essentials together in one place. With a wide product selection, competitive bulk
              pricing and dependable service, we make everyday purchasing simpler, smarter and more
              convenient.
            </motion.p>
          </div>
          {/* Every category streaming into one delivery */}
          <motion.div
            className="mx-auto hidden w-full max-w-[380px] lg:block"
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <OrbitScene
              tone="light"
              icons={['tissue', 'aluminium', 'cups', 'chemicals', 'tools', 'ppe', 'bags', 'film']}
              center={
                <VectorScene>
                  <UseVector name="delivery" className="w-full" />
                </VectorScene>
              }
            />
          </motion.div>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {REASONS.map((r, i) => (
            <motion.li
              key={r.title}
              className="vx-host group relative flex flex-col overflow-hidden rounded-[24px] border border-line bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-leaf/60 hover:shadow-[0_24px_50px_-28px_rgba(28,42,92,0.4)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: EASE }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-8 -end-8 w-40 opacity-[0.07] transition duration-700 group-hover:-translate-y-2 group-hover:opacity-[0.14]"
              >
                <div className="vx-drift" style={{ '--d': `${-i * 1.5}s` } as React.CSSProperties}>
                  <VectorScene drawn>
                    {r.use ? (
                      <UseVector name={r.use} className="w-full [&_*]:!stroke-navy" />
                    ) : (
                      <ItemVector name={r.item!} className="w-full [&_*]:!stroke-navy" />
                    )}
                  </VectorScene>
                </div>
              </div>
              {/* Big outlined number that fills with green, like the chapter marks */}
              <motion.span
                aria-hidden
                className="chapter-num absolute end-5 top-4 font-display text-6xl font-extrabold leading-none tracking-[-0.06em]"
                style={{ WebkitTextStroke: '1.5px var(--color-navy)' }}
                initial={{ backgroundSize: '100% 0%' }}
                whileInView={{ backgroundSize: '100% 100%' }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 1, delay: 0.2 + (i % 3) * 0.12, ease: EASE }}
              >
                {String(i + 1).padStart(2, '0')}
              </motion.span>
              <div className="flex items-center gap-4">
                <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-paper shadow-[0_14px_30px_-14px_rgba(28,42,92,0.35)] transition duration-500 group-hover:-rotate-6 group-hover:scale-105">
                  <VectorScene className="w-16">
                    {r.use ? (
                      <UseVector name={r.use} delay={0.1 + (i % 3) * 0.15} className="w-full" />
                    ) : (
                      <ItemVector name={r.item!} delay={0.1 + (i % 3) * 0.15} className="w-full" />
                    )}
                  </VectorScene>
                </div>
              </div>
              <h3 className="mt-6 text-2xl font-bold leading-tight tracking-[-0.02em]">
                {r.title}
              </h3>
              <p className="mt-2 text-slate">{r.text}</p>
              <span
                aria-hidden
                className="absolute inset-x-6 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-leaf transition duration-500 group-hover:scale-x-100"
              />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
