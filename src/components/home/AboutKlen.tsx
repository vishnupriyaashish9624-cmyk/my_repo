'use client'

import { motion } from 'motion/react'
import { CATALOGUE, categoryHref } from '@/lib/catalogue'
import { VectorScene, type VectorKey } from '../vectors/CategoryVector'
import { UseVector, type UseKey } from '../vectors/TissueVectors'
import Tilt3D, { Depth } from '../vectors/Tilt3D'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Stills dealt into a fanned 3D stack: rotation, offset and depth per card. */
const FAN: { key: VectorKey; rot: number; x: number; y: number; z: number }[] = [
  { key: 'chemicals', rot: -12, x: -34, y: 10, z: -60 },
  { key: 'cups', rot: -4, x: -10, y: -6, z: -20 },
  { key: 'aluminium', rot: 5, x: 14, y: 4, z: 20 },
  { key: 'bags', rot: 13, x: 36, y: 16, z: 60 },
]

/** Real product photos; cards without one show a plain cream face. */
const PHOTOS: Partial<Record<VectorKey, string>> = {
  chemicals: '/media/about/chemicals-photo.webp',
  cups: '/media/about/cups-photo.webp',
  aluminium: '/media/about/aluminium-photo.webp',
  bags: '/media/about/bags-photo.webp',
}

const PILLARS: { icon: UseKey; title: string; text: string }[] = [
  {
    icon: 'storeroom',
    title: 'One supplier',
    text: 'Packaging, tissue, chemicals, tools and PPE on one account.',
  },
  {
    icon: 'counter',
    title: 'Priced by the carton',
    text: 'Carton and bundle packs on every product, so quotes match deliveries.',
  },
  {
    icon: 'delivery',
    title: 'Confirmed before it ships',
    text: 'Stock, carton price and delivery day agreed up front.',
  },
]

/**
 * "About Klen+": who Klen Plus is (the site tagline and statement from the CMS), three pillars with
 * animated icons, live figures, and a fanned stack of category still lifes dealt in 3D that tilts
 * toward the pointer. Every line restates what the site already says.
 */
export default function AboutKlen({
  tagline,
  statement,
  totalActive,
  brands,
  industries,
}: {
  tagline?: string | null
  statement?: string | null
  totalActive: number
  brands: number
  industries: number
}) {
  const stats = [
    { v: totalActive, l: 'active products' },
    { v: CATALOGUE.length, l: 'categories' },
    { v: brands, l: 'brands on the shelf' },
    { v: industries, l: 'kinds of business served' },
  ]
  return (
    <section
      id="about-klen"
      aria-labelledby="about-title"
      className="theme-dark relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28"
    >
      <ScrollDecor
        spots={[
          {
            icon: 'cat:chemicals',
            className: 'start-[46%] top-[6%] w-16',
            speed: 1.2,
            spin: 14,
            disc: true,
          },
          {
            icon: 'napkin',
            className: 'start-[48%] bottom-[10%] w-14',
            speed: 0.7,
            spin: -10,
            disc: true,
          },
        ]}
      />
      <div className="relative mx-auto grid max-w-[1840px] items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.h2
            id="about-title"
            className="text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            The back-room supplier <span className="text-leaf">for kitchens and buildings.</span>
          </motion.h2>
          {(tagline || statement) && (
            <p className="mt-5 max-w-2xl text-lg text-white/80">
              {[tagline, statement].filter(Boolean).join(' ')}
            </p>
          )}

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {PILLARS.map((p, i) => (
              <motion.li
                key={p.title}
                className="vx-host group rounded-2xl border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-leaf hover:bg-white/[0.08]"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <VectorScene className="w-14 rounded-xl bg-white p-1">
                  <UseVector name={p.icon} delay={0.2 + i * 0.12} className="w-full" />
                </VectorScene>
                <p className="mt-2 font-display text-lg font-bold leading-tight">{p.title}</p>
                <p className="mt-1 text-sm text-white/65">{p.text}</p>
              </motion.li>
            ))}
          </ul>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.l}
                className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 text-white"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08, ease: EASE }}
              >
                <dd className="font-display text-3xl font-extrabold leading-none tracking-[-0.04em] text-leaf">
                  {s.v}
                </dd>
                <dt className="mt-1 text-xs text-white/70">{s.l}</dt>
              </motion.div>
            ))}
          </dl>
        </div>

        {/* Fanned 3D stack of still lifes */}
        <Tilt3D className="relative mx-auto aspect-[4/3] w-full max-w-[640px]" max={10} enter={16}>
          {FAN.map((f, i) => {
            const entry = CATALOGUE.find((c) => c.key === f.key)!
            return (
              <Depth key={f.key} z={f.z} className="absolute inset-[12%]">
                <motion.a
                  href={categoryHref(f.key)}
                  className="group absolute inset-0 block overflow-hidden rounded-[24px] bg-[#f6efdc] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)] ring-4 ring-white"
                  initial={{ opacity: 0, rotate: 0, x: 0, y: 80 }}
                  whileInView={{ opacity: 1, rotate: f.rot, x: `${f.x}%`, y: `${f.y}%` }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 16,
                    delay: 0.2 + i * 0.12,
                  }}
                >
                  {/* Real photos only; the other cards stay plain cream */}
                  {PHOTOS[f.key] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={PHOTOS[f.key]}
                      alt={`${entry.name}: product photo`}
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-3 start-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink opacity-0 transition group-hover:opacity-100">
                    {entry.short} →
                  </span>
                </motion.a>
              </Depth>
            )
          })}
          <Depth z={140} className="absolute -end-2 -top-4 w-24">
            <div className="orbit-bob rounded-full bg-white p-1.5 shadow-[0_20px_40px_-16px_rgba(28,42,92,0.5)] ring-4 ring-leaf/40">
              <VectorScene>
                <UseVector name="storeroom" className="w-full" />
              </VectorScene>
            </div>
          </Depth>
        </Tilt3D>
      </div>
    </section>
  )
}
