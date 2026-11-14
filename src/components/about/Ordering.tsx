'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useInView, useMotionValueEvent, useScroll } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import Tilt3D, { Depth } from '../vectors/Tilt3D'
import ScrollDecor from '../vectors/ScrollDecor'
import { EASE, Icon, Section, SectionHead, Tick, type AnyIcon } from './ui'

/* ───────────────────────── 08 · Cartons & pack sizes ───────────────────────── */

const PKT = 20
const PCS = 50

/** Counts up from 0 once in view. */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    const c = animate(0, to, { duration: 1.6, ease: 'easeOut', onUpdate: (x) => setV(Math.round(x)) })
    return () => c.stop()
  }, [inView, to])
  return <span ref={ref}>{v.toLocaleString('en')}</span>
}

const CONFIRM: { title: string; text: string; icon: AnyIcon }[] = [
  { title: 'Pack size', text: 'How many pieces are in each packet or bundle.', icon: 'stack' },
  { title: 'Quantity', text: 'How many packets make up one carton.', icon: 'cat:takeaway' },
  { title: 'Carton price', text: 'What the full carton costs, so options compare fairly.', icon: 'bill-roll' },
]

/**
 * Light. A carton opened into the sum it stands for (20 packets × 50 pieces), with packets popping in
 * and a running total, beside the three things confirmed in every quotation.
 */
export function Cartons() {
  return (
    <Section id="cartons" labelledBy="cartons-title">
      <ScrollDecor spots={[{ icon: 'cat:bags', className: 'start-[46%] top-[4%] w-14', speed: 1.1, spin: 12 }]} />
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHead id="cartons-title" eyebrow="Cartons & pack sizes" title="Know What You’re Ordering" highlight="Ordering">
            A carton price is only useful when you know what the carton contains. We confirm the
            pack size, quantity and carton price during the quotation process so your purchasing
            team can compare options and plan replenishment around actual usage.
          </SectionHead>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {CONFIRM.map((c, i) => (
              <motion.li
                key={c.title}
                className="vx-host rounded-2xl border border-line bg-white p-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <VectorScene className="w-12">
                  <Icon name={c.icon} delay={0.15 + i * 0.1} />
                </VectorScene>
                <p className="mt-2 flex items-center gap-1.5 font-display text-lg font-bold">
                  <span className="grid size-5 place-items-center rounded-full bg-leaf text-white"><Tick className="size-3" /></span>
                  {c.title}
                </p>
                <p className="mt-1 text-sm text-slate">{c.text}</p>
              </motion.li>
            ))}
          </ul>
        </div>

        <Tilt3D className="w-full" max={6} enter={10}>
          <div className="rounded-[28px] bg-ink p-6 text-white shadow-[0_40px_80px_-34px_rgba(28,42,92,0.7)] md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-leaf">Example · what one carton holds</p>
            <div className="mt-6 grid items-center gap-5 sm:grid-cols-[auto_1fr]">
              <motion.div
                className="mx-auto w-28"
                initial={{ rotate: -10, scale: 0.8 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 160, damping: 12 }}
              >
                <div className="rounded-2xl bg-white p-2">
                  <VectorScene>
                    <Icon name="use:storeroom" />
                  </VectorScene>
                </div>
                <p className="mt-2 text-center font-display font-bold">1 carton</p>
              </motion.div>
              <div>
                <p className="font-mono text-xs text-white/60">= {PKT} packets</p>
                <ul aria-hidden className="mt-2 grid grid-cols-10 gap-1.5">
                  {Array.from({ length: PKT }).map((_, i) => (
                    <motion.li
                      key={i}
                      className="aspect-[3/4] rounded-md bg-leaf/80 ring-1 ring-white/20"
                      initial={{ opacity: 0, scale: 0, y: -10 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18, delay: 0.3 + i * 0.04 }}
                    />
                  ))}
                </ul>
                <p className="mt-3 font-mono text-xs text-white/60">× {PCS} pieces in each packet</p>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
              <span className="text-white/70">Pieces in the carton</span>
              <span className="font-display text-[clamp(2.6rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.04em] text-leaf">
                <CountUp to={PKT * PCS} />
              </span>
            </div>
            <p className="mt-3 text-sm text-white/55">
              Shown as {PCS} pcs × {PKT} pkt. Every pack is confirmed with your quotation.
            </p>
          </div>
        </Tilt3D>
      </div>
    </Section>
  )
}

/* ───────────────────────── 09 · Quality checks ───────────────────────── */

const CHECKS: { title: string; text: string; icon: AnyIcon }[] = [
  { title: 'Item & specification', text: 'Checked against the confirmed requirement.', icon: 'clear-bowl' },
  { title: 'Packaging', text: 'Reviewed for visible concerns.', icon: 'cat:takeaway' },
  { title: 'Quantities', text: 'Checked before the order moves to the next stage.', icon: 'stack' },
]

/**
 * Dark. A vertical track whose leaf fill grows with scroll, lighting each check node in turn, beside
 * a seal that stamps once all three are done.
 */
export function Quality() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start 60%', 'end 80%'] })
  const [done, setDone] = useState(0)
  const [fill, setFill] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setFill(Math.min(1, Math.max(0, p)))
    setDone(Math.min(CHECKS.length, Math.floor(p * (CHECKS.length + 0.5))))
  })
  const all = done >= CHECKS.length

  return (
    <Section id="quality-about" labelledBy="quality-title" dark sectionRef={root}>
      <div className="grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <SectionHead id="quality-title" eyebrow="Quality checks" title="Checked with Care. Prepared with Confidence." highlight="Prepared with Confidence." dark>
            During order preparation, we check the item and specification against the confirmed
            requirement. We review the packaging for visible concerns and check quantities before
            the order moves to the next stage.
          </SectionHead>
          <ol className="relative mt-10 flex flex-col gap-6 ps-16">
            <span aria-hidden className="absolute bottom-6 start-[23px] top-6 w-1 rounded-full bg-white/10">
              <span className="block w-full rounded-full bg-leaf transition-[height] duration-300" style={{ height: `${fill * 100}%` }} />
            </span>
            {CHECKS.map((c, i) => {
              const on = i < done
              return (
                <li key={c.title} className="relative">
                  <span
                    className={`absolute -start-16 top-1 grid size-12 place-items-center rounded-full border-4 transition-colors duration-500 ${on ? 'border-leaf bg-leaf text-white' : 'border-white/15 bg-ink text-white/40'}`}
                  >
                    {on ? <Tick className="size-5" /> : <span className="font-mono text-sm">{i + 1}</span>}
                  </span>
                  <div className={`vx-host flex items-center gap-4 rounded-2xl border p-4 transition duration-500 ${on ? 'border-leaf/60 bg-white/[0.08]' : 'border-white/10 bg-white/[0.03]'}`}>
                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-white">
                      <VectorScene className="w-10">
                        <Icon name={c.icon} delay={0.1 + i * 0.1} />
                      </VectorScene>
                    </span>
                    <span>
                      <span className="block font-display text-xl font-bold">{c.title}</span>
                      <span className="block text-white/65">{c.text}</span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="relative mx-auto aspect-square w-[min(380px,85%)]" aria-hidden>
          <svg viewBox="0 0 200 200" className="vx-orbit absolute inset-0 h-full w-full" style={{ '--dur': '30s' } as React.CSSProperties}>
            <defs>
              <path id="qa-ring" d="M100 100 m-80 0 a80 80 0 1 1 160 0 a80 80 0 1 1 -160 0" />
            </defs>
            <circle cx="100" cy="100" r="96" fill="none" stroke="rgb(255 255 255 / 0.2)" strokeDasharray="2 6" />
            <text className="fill-white font-mono" fontSize="11.5" letterSpacing="3">
              <textPath href="#qa-ring">CHECKED WITH CARE · PREPARED WITH CONFIDENCE · </textPath>
            </text>
          </svg>
          <motion.div
            className="absolute inset-[22%] grid place-items-center rounded-full"
            animate={{
              backgroundColor: all ? 'rgb(61 166 41)' : 'rgb(255 255 255 / 0.06)',
              scale: all ? 1 : 0.92,
              rotate: all ? -8 : 0,
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          >
            {all && <span className="orbit-pulse absolute inset-0 rounded-full bg-leaf/50" />}
            <span className="relative text-center">
              <span className="block font-display text-5xl font-extrabold leading-none">{done}/{CHECKS.length}</span>
              <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em]">{all ? 'Ready' : 'Checks'}</span>
            </span>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── 10 · Care in every delivery ───────────────────────── */

const DOCKET: { label: string; hint: string; icon: AnyIcon }[] = [
  { label: 'Delivery address', hint: 'Where the order is going', icon: 'use:delivery' },
  { label: 'Receiving contact', hint: 'Who will accept the order', icon: 'use:counter' },
  { label: 'Site instructions', hint: 'Entrances, timings, where to unload', icon: 'use:storeroom' },
]

/** Light. Two promises about preparing and handing over, beside a delivery docket with a van running its route. */
export function Delivery() {
  return (
    <Section id="delivery-about" labelledBy="delivery-title">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <SectionHead id="delivery-title" eyebrow="Care in every delivery" title="Prepared Carefully. Handled Thoughtfully." highlight="Handled Thoughtfully.">
            We consider each product’s size and packaging when preparing it for transport. Your
            delivery address, receiving contact and site instructions help us coordinate the
            handover with the team accepting the order.
          </SectionHead>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              { t: 'Prepared for transport', d: 'Packed with each product’s size and packaging in mind.', icon: 'cat:bags' as AnyIcon },
              { t: 'Coordinated handover', d: 'Arranged with the team accepting the order.', icon: 'use:delivery' as AnyIcon },
            ].map((x, i) => (
              <motion.div
                key={x.t}
                className="vx-host flex gap-4 rounded-2xl border border-line bg-white p-4"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <VectorScene className="w-14 shrink-0">
                  <Icon name={x.icon} delay={0.1 + i * 0.1} />
                </VectorScene>
                <span>
                  <span className="block font-display text-lg font-bold">{x.t}</span>
                  <span className="block text-sm text-slate">{x.d}</span>
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <Tilt3D className="mx-auto w-full max-w-[540px]" max={8} enter={12}>
          <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_40px_80px_-34px_rgba(28,42,92,0.55)] ring-1 ring-line">
            {/* Route */}
            <div className="relative h-36 bg-ink">
              <svg viewBox="0 0 400 140" className="absolute inset-0 h-full w-full" aria-hidden>
                <path id="about-route" className="map-road" d="M20 110 C90 30 160 120 230 60 S340 40 380 30" fill="none" stroke="var(--color-leaf)" strokeOpacity="0.6" strokeWidth="2.5" strokeDasharray="6 7" strokeLinecap="round" />
                <circle cx="20" cy="110" r="7" fill="#fff" />
                <circle cx="380" cy="30" r="9" fill="var(--color-leaf)" />
                <circle cx="380" cy="30" r="9" fill="var(--color-leaf)" className="map-pulse" />
                <g>
                  <rect x="-14" y="-9" width="28" height="18" rx="4" fill="#fff" />
                  <rect x="5" y="-7" width="8" height="7" rx="1.5" fill="#9cc1f0" />
                  <rect x="-12" y="-3" width="13" height="3" rx="1" fill="var(--color-leaf)" />
                  <circle cx="-7" cy="9" r="3.4" fill="#0f1838" />
                  <circle cx="7" cy="9" r="3.4" fill="#0f1838" />
                  <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                    <mpath href="#about-route" />
                  </animateMotion>
                </g>
              </svg>
              <p className="absolute start-5 top-4 font-mono text-[11px] uppercase tracking-[0.14em] text-white/70">Delivery docket</p>
            </div>
            <ul className="flex flex-col gap-2 p-5">
              {DOCKET.map((d, i) => (
                <motion.li
                  key={d.label}
                  className="vx-host flex items-center gap-4 rounded-2xl bg-paper p-3"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: EASE }}
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white">
                    <VectorScene className="w-9">
                      <Icon name={d.icon} delay={0.2 + i * 0.12} />
                    </VectorScene>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold">{d.label}</span>
                    <span className="block text-sm text-slate">{d.hint}</span>
                  </span>
                  <span className="grid size-6 place-items-center rounded-full bg-leaf text-white">
                    <Tick className="size-3.5" />
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>
          <Depth z={90} className="absolute -bottom-6 -start-6 w-24">
            <div className="orbit-bob rounded-full bg-white p-2 shadow-[0_20px_40px_-16px_rgba(28,42,92,0.5)] ring-4 ring-leaf/30">
              <VectorScene drawn>
                <Icon name="zip-pouch" />
              </VectorScene>
            </div>
          </Depth>
        </Tilt3D>
      </div>
    </Section>
  )
}

/* ───────────────────────── 11 · Returns & replacements ───────────────────────── */

const SHARE: { label: string; text: string; icon: AnyIcon }[] = [
  { label: 'Order reference', text: 'So we can find the confirmed order.', icon: 'bill-roll' },
  { label: 'Affected quantity', text: 'How many items are damaged or different.', icon: 'stack' },
  { label: 'Photos', text: 'Where relevant, to show the issue.', icon: 'use:counter' },
]
const FLOW = ['You share the details', 'Our team reviews them', 'We advise the next step']

/** Dark. When to get in touch, what to share, and what happens next as a three-stop flow. */
export function Returns() {
  return (
    <Section id="returns" labelledBy="returns-title" dark>
      <ScrollDecor spots={[{ icon: 'cat:ppe', className: 'end-[4%] top-[6%] w-14', speed: 1.1, spin: 12, disc: true }]} />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionHead id="returns-title" eyebrow="Returns & replacements" title="Support When an Order Needs Attention" highlight="Needs Attention" dark>
            If an item arrives damaged or differs from the confirmed order, share your order
            reference, the affected quantity and photos where relevant. Our team reviews the
            details and advises you on the next step for the reported issue.
          </SectionHead>
          <div className="mt-8 flex flex-wrap gap-3">
            {['Arrived damaged', 'Differs from the confirmed order'].map((t, i) => (
              <motion.span
                key={t}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 font-semibold"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 260, damping: 16, delay: i * 0.1 }}
              >
                <span className="grid size-5 place-items-center rounded-full bg-[#f2b53a] text-xs font-extrabold text-ink">!</span>
                {t}
              </motion.span>
            ))}
          </div>
        </div>

        <div>
          <p className="label !text-leaf">What to share with us</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {SHARE.map((s, i) => (
              <motion.li
                key={s.label}
                className="vx-host rounded-[22px] border border-white/10 bg-white/[0.05] p-5"
                initial={{ opacity: 0, y: 30, rotateY: -20 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
                style={{ transformPerspective: 900 }}
              >
                <span className="grid size-14 place-items-center rounded-xl bg-white">
                  <VectorScene className="w-10">
                    <Icon name={s.icon} delay={0.1 + i * 0.1} />
                  </VectorScene>
                </span>
                <p className="mt-3 font-display text-lg font-bold">{s.label}</p>
                <p className="mt-1 text-sm text-white/65">{s.text}</p>
              </motion.li>
            ))}
          </ul>

          <p className="label mt-10 !text-leaf">What happens next</p>
          <ol className="relative mt-5 grid gap-4 sm:grid-cols-3">
            <motion.span
              aria-hidden
              className="absolute inset-x-[16%] top-5 hidden h-0.5 origin-left bg-leaf/60 sm:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: EASE }}
            />
            {FLOW.map((f, i) => (
              <motion.li
                key={f}
                className="relative flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.25, ease: EASE }}
              >
                <span className="grid size-10 place-items-center rounded-full bg-leaf font-display font-extrabold ring-8 ring-ink">{i + 1}</span>
                <span className="mt-3 font-display text-lg font-bold leading-tight">{f}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
