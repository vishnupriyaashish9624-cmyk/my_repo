'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'
import type { CategoryWithCount } from '@/lib/cms'
import { catalogueEntry, categoryHref, keyForCms } from '@/lib/catalogue'
import { CategoryVector, VectorScene, type VectorKey } from '../vectors/CategoryVector'

const EASE = [0.2, 0.7, 0.2, 1] as const

const KRAFT = '#e7c99b'
const KRAFT_DEEP = '#d4ac72'

/** A kraft carton with a category vector printed on its face. */
function Carton({ icon, className = '' }: { icon: VectorKey; className?: string }) {
  return (
    <div className={`relative aspect-square ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <path
          d="M8 26 L50 8 L92 26 L92 82 L50 98 L8 82 Z"
          fill={KRAFT}
          stroke="#1c2a5c"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M8 26 L50 44 L92 26"
          fill="none"
          stroke="#1c2a5c"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M50 44 V98" stroke="#1c2a5c" strokeWidth="3" />
        <path d="M8 26 L50 44 L50 98 L8 82 Z" fill={KRAFT_DEEP} opacity="0.55" />
        <path d="M29 17 L71 35" stroke="var(--color-leaf)" strokeWidth="6" strokeLinecap="round" />
      </svg>
      <VectorScene drawn className="absolute end-[10%] top-[44%] w-[38%]">
        <CategoryVector name={icon} blob={false} className="w-full" />
      </VectorScene>
    </div>
  )
}

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  useEffect(() => {
    const el = ref.current
    if (!inView || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200)
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return <span ref={ref}>{to}</span>
}

/**
 * "Inside the warehouse": an animated store room — racks of kraft cartons (each printed with a
 * category vector) settle onto the shelves, a conveyor carries cartons across the floor and a pallet
 * jack rolls by. Beside it, live product counts per CMS category grow as bars, each linking to its page.
 */
export default function Warehouse({
  categories,
  totalActive,
  images = {},
}: {
  categories: CategoryWithCount[]
  totalActive: number
  /** Still-life image per catalogue key, shown when a carton is hovered. */
  images?: Record<string, string | undefined>
}) {
  const rows = [...categories].sort((a, b) => b.count - a.count)
  const max = Math.max(1, ...rows.map((c) => c.count))
  const shelf: VectorKey[][] = [
    ['tissue', 'aluminium', 'cups', 'bags'],
    ['chemicals', 'tools', 'ppe', 'foam'],
    ['takeaway', 'film', 'paper', 'plastic'],
  ]
  const belt: VectorKey[] = [
    'cups',
    'tissue',
    'chemicals',
    'aluminium',
    'bags',
    'foam',
    'tools',
    'ppe',
  ]

  return (
    <section
      id="warehouse"
      aria-labelledby="warehouse-title"
      className="theme-dark relative overflow-hidden px-5 py-20 md:px-10 md:py-28"
    >
      <div className="relative mx-auto grid max-w-[1840px] items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        {/* The store room */}
        <motion.div
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-[#24346f] to-[#1a2758] p-6 pb-0 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] md:p-8 md:pb-0"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {/* Hanging lights */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 flex justify-around"
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="flex flex-col items-center">
                <span className="h-6 w-px bg-white/25" />
                <span
                  className="wh-lamp h-2 w-10 rounded-b-full bg-[#fff6d6]"
                  style={{ animationDelay: `${-i * 0.9}s` }}
                />
                <span className="h-24 w-28 bg-[radial-gradient(ellipse_at_top,rgb(255_246_214/0.22),transparent_70%)]" />
              </span>
            ))}
          </div>

          {/* Racks */}
          <div className="relative mt-6 flex flex-col gap-5">
            {shelf.map((row, r) => (
              <div key={r} className="relative">
                <div className="grid grid-cols-4 gap-3 px-4 md:gap-5">
                  {row.map((icon, c) => (
                    <motion.div
                      key={icon}
                      className="group/carton relative hover:z-30 focus-within:z-30"
                      initial={{ opacity: 0, y: -60, rotate: c % 2 ? 6 : -6 }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        type: 'spring',
                        stiffness: 220,
                        damping: 16,
                        delay: 0.2 + r * 0.25 + c * 0.08,
                      }}
                    >
                      {' '}
                      <a
                        href={categoryHref(icon)}
                        className="block transition duration-300 group-hover/carton:-translate-y-2 group-hover/carton:scale-105"
                        aria-label={`Open ${catalogueEntry(icon)?.name ?? icon}`}
                      >
                        <Carton icon={icon} className="mx-auto w-[min(100%,120px)]" />
                        {/* Preview: the category's still life, name and a link (opens on hover or keyboard focus) */}
                        <span
                          className={`pointer-events-none absolute z-30 w-72 origin-bottom scale-90 overflow-hidden rounded-2xl bg-white text-ink opacity-0 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-white/60 transition duration-300 group-hover/carton:pointer-events-auto group-hover/carton:scale-100 group-hover/carton:opacity-100 group-focus-within/carton:scale-100 group-focus-within/carton:opacity-100 ${
                            r === 0 ? 'top-full mt-2' : 'bottom-full mb-2'
                          } ${c === 0 ? 'start-0' : c === row.length - 1 ? 'end-0' : 'left-1/2 -translate-x-1/2'}`}
                        >
                          <span className="block aspect-[3/2] overflow-hidden bg-[#f6efdc]">
                            {images[icon] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={images[icon]}
                                alt=""
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-700 group-hover/carton:scale-110"
                              />
                            ) : (
                              <span className="grid h-full w-full place-items-center bg-[radial-gradient(ellipse_at_28%_72%,#cfe0ef_0%,transparent_55%),radial-gradient(ellipse_at_76%_28%,#dbe9d3_0%,transparent_52%)]">
                                <span className="block w-24">
                                  <VectorScene drawn>
                                    <CategoryVector name={icon} blob={false} className="w-full" />
                                  </VectorScene>
                                </span>
                              </span>
                            )}
                          </span>
                          <span className="flex items-center justify-between gap-2 px-3 py-2.5">
                            <span className="truncate font-display text-[15px] font-bold">
                              {catalogueEntry(icon)?.short ?? icon}
                            </span>
                            <span className="shrink-0 rounded-full bg-leaf px-2.5 py-1 text-xs font-semibold text-white">
                              See products →
                            </span>
                          </span>
                        </span>
                      </a>
                    </motion.div>
                  ))}
                </div>
                {/* Shelf board */}
                <div className="mt-1 h-3 rounded-full bg-gradient-to-b from-[#9fb0cf] to-[#5e6f9a] shadow-[0_10px_20px_-8px_rgba(0,0,0,0.6)]" />
                <div className="absolute -bottom-6 start-3 h-6 w-1.5 rounded-b bg-[#5e6f9a]" />
                <div className="absolute -bottom-6 end-3 h-6 w-1.5 rounded-b bg-[#5e6f9a]" />
              </div>
            ))}
          </div>

          {/* Floor: conveyor and a pallet jack */}
          <div className="relative mt-10 h-28 overflow-hidden border-t border-white/10">
            <div className="absolute inset-x-0 top-8 h-3 rounded-full bg-[#0f1838]">
              <div className="wh-belt absolute inset-0 rounded-full bg-[repeating-linear-gradient(90deg,rgb(255_255_255/0.18)_0_8px,transparent_8px_22px)]" />
            </div>
            <div className="wh-conveyor absolute top-0 flex w-max gap-10" aria-hidden>
              {[...belt, ...belt].map((icon, i) => (
                <Carton key={i} icon={icon} className="w-12" />
              ))}
            </div>
            <div className="wh-jack absolute bottom-2 w-28" aria-hidden>
              <svg viewBox="0 0 120 50" className="w-full">
                <rect
                  x="10"
                  y="20"
                  width="80"
                  height="10"
                  rx="3"
                  fill="#f5d36b"
                  stroke="#1c2a5c"
                  strokeWidth="2.5"
                />
                <path d="M90 25 L108 4" stroke="#1c2a5c" strokeWidth="3.5" strokeLinecap="round" />
                <rect x="100" y="0" width="16" height="7" rx="3" fill="var(--color-leaf)" />
                <circle cx="22" cy="38" r="7" fill="#1c2a5c" />
                <circle cx="78" cy="38" r="7" fill="#1c2a5c" />
                <rect
                  x="16"
                  y="6"
                  width="22"
                  height="14"
                  rx="2"
                  fill="#e7c99b"
                  stroke="#1c2a5c"
                  strokeWidth="2"
                />
                <rect
                  x="40"
                  y="6"
                  width="22"
                  height="14"
                  rx="2"
                  fill="#d4ac72"
                  stroke="#1c2a5c"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Counts per category */}
        <div>
          <motion.p
            className="label !text-leaf"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Inside the warehouse
          </motion.p>
          <motion.h2
            id="warehouse-title"
            className="mt-3 text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Stocked by the carton, <span className="text-leaf">shelved by aisle.</span>
          </motion.h2>
          <p className="mt-5 max-w-lg text-white/70">
            <span className="font-display text-2xl font-bold text-white">
              <Count to={totalActive} />
            </span>{' '}
            active products on the shelves right now, each with its carton or bundle pack.
          </p>

          <ul className="mt-8 flex flex-col gap-2.5">
            {rows.map((c, i) => (
              <li key={c.id}>
                <a
                  href={categoryHref(keyForCms(c.slug))}
                  className="group grid grid-cols-[150px_1fr_44px] items-center gap-3 text-sm"
                >
                  <span className="truncate font-medium text-white/85 transition group-hover:text-leaf">
                    {c.name}
                  </span>
                  <span className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
                    <motion.span
                      className="absolute inset-y-0 start-0 rounded-full bg-gradient-to-r from-leaf to-[#7ed36a]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(c.count / max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.1 + i * 0.06, ease: EASE }}
                    />
                  </span>
                  <span className="text-end font-mono tabular-nums text-white/70">{c.count}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
