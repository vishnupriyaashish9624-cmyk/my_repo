'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { CategoryVector, VectorScene, type VectorKey } from '../vectors/CategoryVector'
import { Arrow } from '../Header'
import { CATALOGUE, categoryHref } from '@/lib/catalogue'
import { EASE, Icon, type AnyIcon } from './ui'

/** Every catalogue category, each with its still (media/catalogue/<key>). */
const PHOTOS = CATALOGUE.map((c) => ({
  key: c.key,
  src: `/media/catalogue/${c.key}.webp`,
  label: c.short,
  href: categoryHref(c.key),
}))
const pad = (n: number) => String(n).padStart(2, '0')
const SERVED: { label: string; icon: AnyIcon }[] = [
  { label: 'Restaurants', icon: 'use:kitchen' },
  { label: 'Hotels', icon: 'use:washroom' },
  { label: 'Cafés', icon: 'use:cafe' },
  { label: 'Catering', icon: 'use:catering' },
  { label: 'Offices', icon: 'use:storeroom' },
  { label: 'Commercial facilities', icon: 'use:floor' },
]
const SHOW_MS = 3200
/** Product line drawings drifting faintly behind the section (white lines on navy). */
const DRIFT: { key: VectorKey; className: string }[] = [
  { key: 'cups', className: 'start-[2%] top-[4%] w-24' },
  { key: 'tissue', className: 'start-[44%] top-[2%] w-20' },
  { key: 'bags', className: 'end-[3%] top-[30%] w-24' },
  { key: 'aluminium', className: 'start-[1%] top-[46%] w-20' },
  { key: 'chemicals', className: 'end-[2%] top-[62%] w-20' },
  { key: 'tools', className: 'start-[38%] top-[58%] w-16' },
  { key: 'foam', className: 'start-[3%] bottom-[6%] w-20' },
  { key: 'ppe', className: 'end-[30%] bottom-[3%] w-16' },
]
/** The families "under one roof", drawn in a row under the opening line. */
const ROOF: { key: VectorKey; label: string }[] = [
  { key: 'cups', label: 'Cups' },
  { key: 'takeaway', label: 'Containers' },
  { key: 'aluminium', label: 'Foil' },
  { key: 'bags', label: 'Bags' },
  { key: 'tissue', label: 'Tissue' },
  { key: 'chemicals', label: 'Cleaning' },
]

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8, delay, ease: EASE },
})

/**
 * "Who we are" (navy). Headline and opening line on top, then a bento: a photo
 * tile cycling through all 14 categories beside the story and the businesses we serve.
 */
export default function WhoWeAreBento({ productsHref }: { productsHref: string }) {
  const reduce = useReducedMotion()
  const [shot, setShot] = useState(0)
  const go = (step: number) => setShot((s) => (s + step + PHOTOS.length) % PHOTOS.length)
  // Advance on a timer; picking a category restarts the count from the new one.
  useEffect(() => {
    if (reduce) return
    const t = setTimeout(() => setShot((s) => (s + 1) % PHOTOS.length), SHOW_MS)
    return () => clearTimeout(t)
  }, [reduce, shot])

  return (
    <section
      id="who-we-are"
      aria-labelledby="who-title"
      className="relative overflow-hidden bg-ink px-5 pb-16 pt-12 text-white md:px-10 md:pb-20 md:pt-16"
    >
      <span aria-hidden className="pointer-events-none absolute -end-40 -top-40 size-[560px] rounded-full bg-leaf/20 blur-[140px]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-48 -start-40 size-[520px] rounded-full bg-[#2f4aa8]/50 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {DRIFT.map((d, i) => (
          <div key={d.key} className={`absolute ${d.className} opacity-[0.14]`}>
            <div className="vx-drift" style={{ '--d': `${-i * 1.6}s`, '--dur': `${9 + (i % 3) * 2}s` } as CSSProperties}>
              <VectorScene drawn>
                <CategoryVector name={d.key} blob={false} className="w-full [&_.text-ink]:text-white" />
              </VectorScene>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mx-auto max-w-[1840px]">
        {/* ── Headline + opening line ── */}
        <div className="grid items-end gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-12">
          <div>
            <motion.p
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-leaf"
              {...rise()}
            >
              <span className="h-px w-7 bg-leaf" />
              Who we are
            </motion.p>
            <motion.h2
              id="who-title"
              className="mt-4 text-[clamp(2.4rem,5vw,5rem)] font-bold leading-[0.95] tracking-[-0.04em]"
              {...rise(0.1)}
            >
              Everyday Essentials.
              <br />
              <span className="text-leaf">One Trusted Source.</span>
            </motion.h2>
          </div>
          <motion.div {...rise(0.2)}>
            <p className="text-xl leading-relaxed text-white/85">
              At Klen Plus, we bring together packaging, hygiene, cleaning and everyday business supplies{' '}
              <strong className="font-semibold text-leaf">under one roof.</strong>
            </p>
            <a
              href={productsHref}
              className="group/btn mt-6 inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3.5 font-semibold text-white transition hover:bg-leaf-deep"
            >
              Explore Our Products
              <span className="transition-transform group-hover/btn:translate-x-1">
                <Arrow />
              </span>
            </a>
          </motion.div>
        </div>

        {/* Under one roof: each family drawn in its own white disc */}
        <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-5 md:gap-x-10">
          {ROOF.map((r, i) => (
            <motion.li
              key={r.key}
              className="vx-host group flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 + i * 0.07 }}
            >
              <span className="grid size-16 place-items-center rounded-full bg-white shadow-[0_0_0_6px_rgb(255_255_255/0.06)] transition group-hover:-translate-y-1 group-hover:shadow-[0_0_0_6px_rgb(61_166_41/0.35)] md:size-20">
                <VectorScene className="w-11 md:w-14">
                  <CategoryVector name={r.key} blob={false} delay={0.2 + i * 0.07} className="w-full" />
                </VectorScene>
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">{r.label}</span>
            </motion.li>
          ))}
        </ul>

        {/* ── Bento: photo, story, who we serve ── */}
        <div className="mt-9 grid gap-5 lg:grid-cols-12 lg:grid-rows-[auto_auto]">
          {/* Photo tile cycling through the product families */}
          <motion.div
            className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-white/5 ring-1 ring-white/10 lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[520px]"
            {...rise(0.1)}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={PHOTOS[shot].key}
                src={PHOTOS[shot].src}
                alt={PHOTOS[shot].label}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.1, ease: EASE }}
              />
            </AnimatePresence>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

            {/* One segment per category along the top; the current one fills while its photo shows */}
            <div className="absolute inset-x-5 top-5 flex gap-1 pe-32 md:pe-36">
              {PHOTOS.map((p, i) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`Show ${p.label}`}
                  aria-pressed={i === shot}
                  className="group/seg flex h-4 flex-1 items-center"
                >
                  <span className="relative block h-1 w-full overflow-hidden rounded-full bg-white/30 transition group-hover/seg:bg-white/60">
                    <motion.span
                      key={i === shot ? `on-${shot}` : `off-${i}`}
                      className="absolute inset-0 origin-left rounded-full bg-white"
                      initial={{ scaleX: i < shot ? 1 : 0 }}
                      animate={{ scaleX: i <= shot ? 1 : 0 }}
                      transition={i === shot && !reduce ? { duration: SHOW_MS / 1000, ease: 'linear' } : { duration: 0 }}
                    />
                  </span>
                </button>
              ))}
            </div>

            {/* Current category, counter and arrows */}
            <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <span className="font-mono text-xs tabular-nums text-white/80">
                  {pad(shot + 1)} / {pad(PHOTOS.length)}
                </span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.a
                    key={PHOTOS[shot].key}
                    href={PHOTOS[shot].href}
                    className="group/cat mt-1.5 flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-leaf hover:text-white"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <span className="size-2 rounded-full bg-leaf group-hover/cat:bg-white" />
                    {PHOTOS[shot].label}
                    <span className="transition-transform group-hover/cat:translate-x-0.5">
                      <Arrow />
                    </span>
                  </motion.a>
                </AnimatePresence>
              </div>
              <div className="flex shrink-0 gap-2">
                {[
                  { step: -1, label: 'Previous category', d: 'M10 4 6 8l4 4' },
                  { step: 1, label: 'Next category', d: 'M6 4l4 4-4 4' },
                ].map((b) => (
                  <button
                    key={b.step}
                    type="button"
                    onClick={() => go(b.step)}
                    aria-label={b.label}
                    className="grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white hover:text-ink"
                  >
                    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
                      <path d={b.d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Seal */}
            <div aria-hidden className="absolute end-5 top-5 size-24 rounded-full bg-white/95 shadow-lg md:size-28">
              <motion.svg
                viewBox="0 0 160 160"
                className="absolute inset-0 size-full"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                <defs>
                  <path id="wwb-ring" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
                </defs>
                <text className="fill-ink font-mono text-[12px] uppercase" letterSpacing="3.4">
                  <textPath href="#wwb-ring">Under one roof • One trusted source •</textPath>
                </text>
              </motion.svg>
              <span className="absolute inset-[32%] grid place-items-center rounded-full bg-leaf text-white">
                <svg viewBox="0 0 24 24" className="size-6">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </div>
          </motion.div>

          {/* Story */}
          <motion.div
            className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:p-8 lg:col-span-5"
            {...rise(0.2)}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-leaf">Our range</p>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              From food containers, aluminium foil and paper cups to tissues, cleaning essentials and personal hygiene
              products, our range supports the daily needs of restaurants, hotels, cafés, catering businesses, offices
              and commercial facilities.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/80">
              We understand that <span className="font-semibold text-white">every business has different requirements.</span>{' '}
              That&apos;s why we focus on helping customers explore suitable products, compare available options and
              choose the right materials, sizes and quantities for their operations.
            </p>
          </motion.div>

          {/* Who we serve */}
          <motion.div
            className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm md:p-8 lg:col-span-5"
            {...rise(0.3)}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-leaf">Supporting the daily needs of</p>
            <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {SERVED.map((sv, i) => (
                <motion.li
                  key={sv.label}
                  className="vx-host flex items-center gap-2.5 rounded-2xl bg-white px-2.5 py-2 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
                  initial={{ opacity: 0, scale: 0.7 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 + i * 0.06 }}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-leaf-soft">
                    <VectorScene className="w-7">
                      <Icon name={sv.icon} delay={0.3 + i * 0.06} />
                    </VectorScene>
                  </span>
                  <span className="leading-tight">{sv.label}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
