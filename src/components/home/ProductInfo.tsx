'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import Tilt3D, { Depth } from '../vectors/Tilt3D'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

export type SampleProduct = {
  name: string
  category: string
  size?: string | null
  colour?: string | null
  packing?: string | null
  href: string
}

const POINTS: { icon: ItemKey; title: string; text: string }[] = [
  {
    icon: 'stack',
    title: 'Size, colour & pack on every item',
    text: 'Each listing shows its exact size, colour and carton or bundle pack.',
  },
  {
    icon: 'bill-roll',
    title: 'Codes you already order by',
    text: 'Product codes like RE24, M05 or 83185 are kept, so your list matches ours.',
  },
  {
    icon: 'clear-bowl',
    title: 'Searchable full lists',
    text: 'Every category page lists all its products, with search by name, size or pack.',
  },
  {
    icon: 'disinfect',
    title: 'Data sheets on request',
    text: 'Need the manufacturer’s sheet for a chemical or a contact-safe item? Ask with your quote.',
  },
]

/** One line of the spec sheet, typed in character by character. */
function Typed({ text, delay }: { text: string; delay: number }) {
  return (
    <span>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01, delay: delay + i * 0.018 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/**
 * "Product information & documentation": a spec sheet on a 3D tilt that cycles through real products
 * from the CMS, typing each field in (name, category, size, colour, pack) with a scanning barcode, plus
 * four points on what product information is available. Links into the catalogue.
 */
export default function ProductInfo({ samples }: { samples: SampleProduct[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (samples.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((v) => (v + 1) % samples.length), 4200)
    return () => clearInterval(t)
  }, [samples.length])
  const p = samples[i]
  const rows = p
    ? ([
        ['Product', p.name],
        ['Category', p.category],
        ['Size', p.size],
        ['Colour', p.colour],
        ['Pack', p.packing],
      ].filter(([, v]) => v) as [string, string][])
    : []

  return (
    <section
      id="product-info"
      aria-labelledby="info-title"
      className="theme-light relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28"
    >
      <ScrollDecor
        spots={[
          { icon: 'cat:paper', className: 'start-[47%] top-[4%] w-16', speed: 1.2, spin: 14 },
          { icon: 'sandwich', className: 'start-[45%] bottom-[8%] w-14', speed: 0.7, spin: -10 },
        ]}
      />
      <div className="relative mx-auto grid max-w-[1840px] items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.h2
            id="info-title"
            className="text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Every detail, <span className="text-leaf">before you order.</span>
          </motion.h2>
          <p className="mt-5 max-w-xl text-slate">
            The exact item, its pack and the paperwork your kitchen or facility needs, all from one
            place.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {POINTS.map((pt, k) => (
              <motion.li
                key={pt.title}
                className="vx-host flex gap-4 rounded-2xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-leaf"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: k * 0.08, ease: EASE }}
              >
                <VectorScene className="w-14 shrink-0">
                  <ItemVector name={pt.icon} delay={0.15 + k * 0.1} className="w-full" />
                </VectorScene>
                <div>
                  <p className="font-display text-lg font-bold leading-tight">{pt.title}</p>
                  <p className="mt-1 text-sm text-slate">{pt.text}</p>
                </div>
              </motion.li>
            ))}
          </ul>
          <a
            href="#catalogue"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-leaf px-5 py-3 font-semibold text-white transition hover:bg-leaf-deep"
          >
            Browse the full range{' '}
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        {/* Spec sheet */}
        <Tilt3D className="relative mx-auto w-full max-w-[560px]" max={9} enter={-14}>
          <div className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-[0_40px_80px_-30px_rgba(28,42,92,0.45)]">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-leaf-deep">
                Product sheet
              </p>
              <span className="flex gap-1">
                {samples.map((_, k) => (
                  <span
                    key={k}
                    className={`h-1.5 rounded-full transition-all duration-500 ${k === i ? 'w-6 bg-leaf' : 'w-1.5 bg-line'}`}
                  />
                ))}
              </span>
            </div>
            {p && (
              <div key={i}>
                <dl className="mt-5 flex flex-col divide-y divide-line">
                  {rows.map(([label, value], r) => (
                    <div key={label} className="grid grid-cols-[96px_1fr] gap-3 py-2.5">
                      <dt className="font-mono text-xs uppercase tracking-[0.08em] text-slate">
                        {label}
                      </dt>
                      <dd
                        className={`${r === 0 ? 'font-display text-lg font-bold leading-tight' : 'text-sm font-medium'} text-ink`}
                      >
                        <Typed text={value} delay={r * 0.25} />
                      </dd>
                    </div>
                  ))}
                </dl>
                {/* Barcode with a scanning line */}
                <div className="relative mt-5 flex h-14 items-end gap-[3px] overflow-hidden rounded-xl bg-paper px-4 py-2">
                  {Array.from({ length: 46 }).map((_, k) => (
                    <span
                      key={k}
                      className="bg-ink"
                      style={{
                        width: (k * 7) % 3 === 0 ? 3 : 1.5,
                        height: k % 9 === 0 ? '100%' : '82%',
                      }}
                    />
                  ))}
                  <span className="info-scan absolute inset-y-0 w-1 bg-leaf shadow-[0_0_16px_4px_rgba(61,166,41,0.6)]" />
                </div>
                <a
                  href={p.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-deep hover:underline"
                >
                  See all {p.category.toLowerCase()} →
                </a>
              </div>
            )}
          </div>
          <Depth z={100} className="absolute -start-10 -top-10 w-24">
            <div className="orbit-bob rounded-full bg-white p-1.5 shadow-[0_20px_40px_-16px_rgba(28,42,92,0.5)] ring-1 ring-line">
              <VectorScene>
                <ItemVector name="bill-roll" className="w-full" />
              </VectorScene>
            </div>
          </Depth>
        </Tilt3D>
      </div>
    </section>
  )
}
