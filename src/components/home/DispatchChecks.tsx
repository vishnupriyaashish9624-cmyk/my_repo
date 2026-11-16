'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { motion, useInView } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

const CHECKS: { title: string; text: string; icon: ItemKey }[] = [
  {
    title: 'Product details',
    text: 'We check the item, size and pack format against your order.',
    icon: 'bill-roll',
  },
  {
    title: 'Packaging condition',
    text: 'We inspect cartons and bundles for visible damage during packing.',
    icon: 'cat:takeaway',
  },
  {
    title: 'Order accuracy',
    text: 'We confirm that the items and quantities match your order before dispatch.',
    icon: 'stack',
  },
]

/** Products riding the conveyor strip along the bottom of the section. */
const BELT: ItemKey[] = [
  'rect-box',
  'dome-lid',
  'carry-bag',
  'foil-roll',
  'round-tub',
  'pet-glass',
  'burger-wrap',
  'paper-bag',
  'clear-bowl',
  'zip-pouch',
]

/** Drifting product vectors around the photo collage. */
const FLOATS: { icon: ItemKey; className: string }[] = [
  { icon: 'dome-lid', className: '-end-6 top-[18%] w-20' },
  { icon: 'foil-roll', className: '-end-2 bottom-[30%] w-16' },
  { icon: 'pet-glass', className: 'start-0 top-[42%] w-16' },
]

/** How long each check stays highlighted before the next one lights up (ms). */
const STEP_MS = 2400

const Tick = ({ delay = 0, className = 'size-4' }: { delay?: number; className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    className={`${className} text-white`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <motion.path
      d="M3.5 8.5l3 3 6-7"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    />
  </svg>
)

/**
 * "Our quality checks" (dark): the three checks made before an order leaves, beside a photo
 * collage of containers coming off the line, with a scan line sweeping the main photo and a
 * dispatch card whose ticks draw in.
 */
export default function DispatchChecks() {
  const root = useRef<HTMLElement>(null)
  const inView = useInView(root, { amount: 0.3 })
  const [active, setActive] = useState(0)
  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => setActive((a) => (a + 1) % CHECKS.length), STEP_MS)
    return () => clearInterval(t)
  }, [inView])

  return (
    <section
      ref={root}
      id="dispatch-checks"
      aria-labelledby="dispatch-title"
      className="theme-dark relative overflow-hidden px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-12"
    >
      <ScrollDecor
        spots={[
          {
            icon: 'carry-bag',
            className: 'start-[44%] top-[6%] w-14',
            speed: 1.2,
            spin: 14,
            disc: true,
          },
        ]}
      />
      <div className="relative mx-auto grid w-full max-w-[1840px] items-center gap-16 lg:items-start lg:grid-cols-[1fr_1fr] xl:gap-24">
        {/* Left: heading and the three checks */}
        <div>
          <motion.p
            className="label !text-leaf"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Our quality checks
          </motion.p>
          <motion.h2
            id="dispatch-title"
            className="mt-3 text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            What we check <span className="text-leaf">before dispatch</span>
          </motion.h2>
          <p className="mt-5 max-w-lg text-lg text-white/70">
            We match your order to the confirmed requirements, from the product size to the number
            of cartons.
          </p>

          <ol className="relative mt-10 flex flex-col gap-4">
            {/* Line joining the checks */}
            <motion.span
              aria-hidden
              className="absolute bottom-10 start-[38px] top-10 w-0.5 origin-top bg-gradient-to-b from-leaf via-leaf/60 to-leaf/10"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            />
            {CHECKS.map((c, i) => (
              <motion.li
                key={c.title}
                onMouseEnter={() => setActive(i)}
                className={`vx-host relative flex items-center gap-5 overflow-hidden rounded-3xl border p-3 pe-6 backdrop-blur-sm transition-[border-color,background-color,box-shadow,translate] duration-500 ${i === active ? 'translate-x-2 border-leaf/70 bg-white/[0.09] shadow-[0_24px_50px_-24px_rgba(108,207,47,0.55)]' : 'border-white/10 bg-white/[0.04]'}`}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.25 + i * 0.15, ease: EASE }}
              >
                {/* Progress bar on the highlighted check */}
                {i === active && (
                  <motion.span
                    key={`bar-${active}`}
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-leaf"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: STEP_MS / 1000, ease: 'linear' }}
                  />
                )}
                <span className="relative z-10 grid size-[52px] shrink-0 place-items-center rounded-full bg-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)] sm:size-14">
                  {i === active && (
                    <span
                      aria-hidden
                      className="absolute inset-0 animate-ping rounded-full bg-leaf/40 [animation-duration:1.6s]"
                    />
                  )}
                  <VectorScene drawn className="w-9">
                    <ItemVector name={c.icon} delay={0.5 + i * 0.15} className="w-full" />
                  </VectorScene>
                  <span className="absolute -end-1 -top-1 grid size-6 place-items-center rounded-full bg-leaf ring-[3px] ring-ink">
                    <Tick delay={0.9 + i * 0.2} className="size-3.5" />
                  </span>
                </span>
                <span className="min-w-0 py-1">
                  <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-leaf">
                    Check {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mt-0.5 block font-display text-xl font-bold leading-tight tracking-[-0.02em] text-white">
                    {c.title}
                  </span>
                  <span className="mt-1 block text-sm text-white/70">{c.text}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        {/* Right: photo collage */}
        <div className="relative mx-auto w-full max-w-[600px] pb-16 ps-10 sm:ps-20">
          {/* Drifting product vectors around the collage */}
          {FLOATS.map((f, i) => (
            <motion.div
              key={f.icon}
              aria-hidden
              className={`absolute z-20 hidden sm:block ${f.className}`}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.7 + i * 0.15 }}
            >
              <div
                className="vx-drift rounded-full bg-white p-2 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]"
                style={{ '--d': `${-i * 1.9}s`, '--dur': `${8 + i * 2}s` } as CSSProperties}
              >
                <VectorScene drawn>
                  <ItemVector name={f.icon} delay={0.9 + i * 0.15} className="w-full" />
                </VectorScene>
              </div>
            </motion.div>
          ))}

          {/* Glow behind the photos */}
          <div aria-hidden className="absolute inset-10 -z-0 rounded-full bg-leaf/25 blur-[90px]" />

          {/* Main photo: containers coming off the line */}
          <motion.figure
            className="relative aspect-[5/6] overflow-hidden rounded-[32px] border border-white/15 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <img
              src="/media/factory/quality-checks.webp"
              alt="Black takeaway containers being thermoformed on a production line"
              className="kenburns h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            {/* Scan line sweeping the photo */}
            <motion.div
              aria-hidden
              className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-leaf/30 to-transparent"
              animate={{ top: ['-15%', '100%'] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-leaf shadow-[0_0_12px_2px_rgba(108,207,47,0.8)]" />
            </motion.div>
            {/* Corner brackets */}
            {[
              'start-4 top-4 border-s-2 border-t-2 rounded-ss-xl',
              'end-4 top-4 border-e-2 border-t-2 rounded-se-xl',
              'start-4 bottom-4 border-s-2 border-b-2 rounded-es-xl',
              'end-4 bottom-4 border-e-2 border-b-2 rounded-ee-xl',
            ].map((c) => (
              <span key={c} aria-hidden className={`absolute size-8 border-leaf ${c}`} />
            ))}
            <figcaption className="absolute bottom-6 end-6 rounded-full bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
              Packing line
            </figcaption>
          </motion.figure>

          {/* Second photo: packed containers */}
          <motion.div
            className="absolute bottom-0 start-0 w-[58%] overflow-hidden rounded-[24px] border-4 border-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 40, rotate: -8 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
          >
            <img
              src="/media/quality/packed-carton.webp"
              alt="A packed carton of kraft bowls and clear lids beside a ticked checklist"
              className="aspect-[3/2] h-full w-full object-cover"
            />
          </motion.div>

          {/* Dispatch card */}
          <motion.div
            className="absolute -top-6 start-0 w-60 rounded-2xl bg-white p-4 text-ink shadow-[0_30px_60px_-24px_rgba(0,0,0,0.7)] sm:start-4"
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.5 }}
          >
            <div className="vx-drift" style={{ '--dur': '10s' } as CSSProperties}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
                Before dispatch
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {CHECKS.map((c, i) => (
                  <li
                    key={c.title}
                    className={`-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1 text-sm font-semibold transition-colors duration-500 ${i === active ? 'bg-leaf-soft text-leaf-deep' : ''}`}
                  >
                    <span className="grid size-5 shrink-0 place-items-center rounded-md bg-leaf">
                      <Tick delay={1 + i * 0.25} className="size-3" />
                    </span>
                    {c.title}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between rounded-lg bg-leaf-soft px-3 py-2">
                <span className="font-display text-xs font-extrabold uppercase tracking-[0.08em] text-leaf-deep">
                  Ready to ship
                </span>
                <span className="font-mono text-[11px] text-leaf-deep">3/3</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Conveyor strip: products roll past a scanner gate */}
      <div
        aria-hidden
        className="relative mx-auto mt-14 max-w-[1840px] pt-8 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      >
        <div className="absolute inset-x-0 top-[calc(50%+16px)] h-14 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.03]">
          <div className="absolute inset-x-6 top-1/2 h-px -translate-y-1/2 border-t border-dashed border-white/20" />
        </div>
        <div className="marquee flex w-max gap-10 py-3" style={{ animationDuration: '60s' }}>
          {[...BELT, ...BELT, ...BELT, ...BELT].map((icon, i) => (
            <span
              key={i}
              className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)]"
            >
              <VectorScene drawn className="w-11">
                <ItemVector name={icon} className="w-full" />
              </VectorScene>
            </span>
          ))}
        </div>
        {/* Scanner gate in the middle of the belt */}
        <div className="pointer-events-none absolute bottom-0 top-8 left-1/2 w-28 -translate-x-1/2">
          <div className="absolute inset-0 rounded-2xl border-2 border-leaf/70 bg-leaf/10 shadow-[0_0_40px_-6px_rgba(108,207,47,0.7)]" />
          <motion.span
            className="absolute inset-x-2 h-0.5 bg-leaf shadow-[0_0_12px_2px_rgba(108,207,47,0.8)]"
            animate={{ top: ['10%', '90%', '10%'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-leaf px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-ink">
            Checked
          </span>
        </div>
      </div>
    </section>
  )
}
