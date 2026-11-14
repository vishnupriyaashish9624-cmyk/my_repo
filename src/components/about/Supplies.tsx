'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { categoryHref } from '@/lib/catalogue'
import { VectorScene, type VectorKey } from '../vectors/CategoryVector'
import ScrollDecor from '../vectors/ScrollDecor'
import { CatIcon, Chip, EASE, Icon, Section, SectionHead, type AnyIcon } from './ui'

/* ───────────────────────── 05 · Food packaging & serving ───────────────────────── */

const FLOW: { step: string; fit: string; icon: AnyIcon }[] = [
  { step: 'Containers', fit: 'to suit the portion', icon: 'round-tub' },
  { step: 'Wrapping', fit: 'to suit the food', icon: 'burger-wrap' },
  { step: 'Bags', fit: 'to suit the finished order', icon: 'carry-bag' },
]
const ITEMS: { label: string; icon: AnyIcon }[] = [
  { label: 'Foil trays', icon: 'platter' },
  { label: 'Kraft boxes', icon: 'rect-box' },
  { label: 'Cups', icon: 'rippled' },
  { label: 'Lids', icon: 'dome-lid' },
  { label: 'Napkins', icon: 'napkin' },
  { label: 'Cutlery', icon: 'cutlery' },
]

/**
 * Dark. Kitchen → container → wrapping → bag → customer as a connected flow whose dashed line runs,
 * then the items that complete an order, then the three kinds of service.
 */
export function Packaging() {
  return (
    <Section id="packaging" labelledBy="packaging-title" dark>
      <ScrollDecor
        spots={[{ icon: 'cat:foam', className: 'end-[4%] top-[4%] w-14', speed: 1.2, spin: 14, disc: true }]}
      />
      <SectionHead id="packaging-title" eyebrow="Food packaging & serving" title="From the Kitchen to the Customer" highlight="the Customer" dark>
        Choose containers to suit the portion, wrapping to suit the food and bags to suit the
        finished order. Foil trays, kraft boxes, cups, lids, napkins and cutlery help your team
        prepare complete orders for counter service, catering and takeaway.
      </SectionHead>

      {/* Flow */}
      <div className="relative mt-14">
        <svg aria-hidden className="absolute inset-x-[8%] top-[52px] hidden h-2 w-[84%] lg:block" preserveAspectRatio="none" viewBox="0 0 100 2">
          <motion.line
            x1="0" y1="1" x2="100" y2="1"
            stroke="var(--color-leaf)" strokeWidth="2" strokeDasharray="6 6"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        </svg>
        <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { step: 'Kitchen', fit: 'where the order starts', icon: 'use:kitchen' as AnyIcon },
            ...FLOW,
            { step: 'Customer', fit: 'a complete order, handed over', icon: 'use:delivery' as AnyIcon },
          ].map((f, i) => (
            <motion.li
              key={f.step}
              className="vx-host flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: EASE }}
            >
              <span
                className={`grid size-[104px] place-items-center rounded-full ring-8 ${i === 0 || i === 4 ? 'bg-leaf ring-leaf/20' : 'bg-white ring-white/10'}`}
              >
                <VectorScene className={`w-16 ${i === 0 || i === 4 ? '[&_.text-ink]:text-white' : ''}`}>
                  <Icon name={f.icon} delay={0.3 + i * 0.15} />
                </VectorScene>
              </span>
              <span className="mt-4 font-mono text-[11px] text-leaf">STEP {String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-xl font-bold">{f.step}</span>
              <span className="mt-1 text-sm text-white/65">{f.fit}</span>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Items + service types */}
      <div className="mt-16 grid gap-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 md:p-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="label !text-leaf">Everything that completes an order</p>
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {ITEMS.map((it, i) => (
              <motion.li
                key={it.label}
                className="vx-host group flex flex-col items-center gap-2 text-center"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 220, damping: 15, delay: i * 0.06 }}
              >
                <span className="grid aspect-square w-full place-items-center rounded-2xl bg-white transition duration-500 group-hover:-translate-y-1 group-hover:-rotate-6">
                  <VectorScene className="w-3/4">
                    <Icon name={it.icon} delay={0.1 + i * 0.06} />
                  </VectorScene>
                </span>
                <span className="text-sm font-semibold">{it.label}</span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-center gap-3 lg:border-s lg:border-white/10 lg:ps-8">
          <p className="label !text-leaf">Ready for</p>
          {['Counter service', 'Catering', 'Takeaway'].map((s, i) => (
            <motion.p
              key={s}
              className="flex items-center justify-between rounded-2xl bg-white/[0.06] px-5 py-4 font-display text-2xl font-bold"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: EASE }}
            >
              {s} <span className="text-leaf">+</span>
            </motion.p>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── 06 · Cleaning & hygiene ───────────────────────── */

const AREAS: { area: string; icon: AnyIcon; need: string; supplies: string[] }[] = [
  {
    area: 'Kitchen counters',
    icon: 'use:kitchen',
    need: 'Grease, spills and prep surfaces',
    supplies: ['Dishwashing liquids', 'Surface cleaners', 'Brushes & sponges'],
  },
  {
    area: 'Dining areas',
    icon: 'use:table',
    need: 'Tables, seating and floors between covers',
    supplies: ['Surface cleaners', 'Floor-care products', 'Mops', 'Tissues'],
  },
  {
    area: 'Washrooms',
    icon: 'use:washroom',
    need: 'Hands, refills and fresh floors',
    supplies: ['Hand wash', 'Dispensers', 'Tissues', 'Floor-care products'],
  },
]
const DAY: { label: string; icon: AnyIcon }[] = [
  { label: 'Brushes', icon: 'sponge' },
  { label: 'Mops', icon: 'mop' },
  { label: 'Buckets', icon: 'bucket' },
  { label: 'Tissues', icon: 'maxi' },
  { label: 'Hand wash', icon: 'disinfect' },
  { label: 'Squeegees', icon: 'squeegee' },
  { label: 'Bins', icon: 'pedal-bin' },
]

/** Light. Three areas, each with what it needs and the supplies for it, then a strip of day-long tools. */
export function Cleaning() {
  return (
    <Section id="cleaning" labelledBy="cleaning-title">
      <ScrollDecor
        spots={[{ icon: 'cat:chemicals', className: 'end-[4%] top-[6%] w-16', speed: 1.1, spin: 12 }]}
      />
      <SectionHead id="cleaning-title" eyebrow="Cleaning & hygiene" title="Keep Each Area Ready for Use" highlight="Ready for Use">
        Kitchen counters, dining areas and washrooms each need different supplies. Our range
        includes dishwashing liquids, surface cleaners and floor-care products, alongside the
        brushes, mops, tissues, hand wash and dispensers used throughout the day.
      </SectionHead>

      <ul className="mt-12 grid gap-5 lg:grid-cols-3">
        {AREAS.map((a, i) => (
          <motion.li
            key={a.area}
            className="vx-host group relative overflow-hidden rounded-[28px] border border-line bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(28,42,92,0.45)]"
            initial={{ opacity: 0, y: 40, rotateX: 18 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
            style={{ transformPerspective: 900 }}
          >
            <div className="relative grid h-48 place-items-center bg-[radial-gradient(circle_at_50%_60%,var(--color-leaf-soft),var(--color-paper)_70%)]">
              <span className="absolute start-5 top-5 font-mono text-[11px] text-leaf-deep">AREA {String(i + 1).padStart(2, '0')}</span>
              {/* Sparkle that sweeps once on hover */}
              <span aria-hidden className="pointer-events-none absolute inset-y-0 -start-1/3 w-1/3 skew-x-[-20deg] bg-white/70 opacity-0 transition-all duration-700 group-hover:start-[110%] group-hover:opacity-100" />
              <VectorScene className="w-36 transition duration-500 group-hover:scale-105">
                <Icon name={a.icon} delay={0.2 + i * 0.12} />
              </VectorScene>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold tracking-[-0.02em]">{a.area}</h3>
              <p className="mt-1 text-slate">{a.need}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {a.supplies.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="mt-8 overflow-hidden rounded-[24px] border border-line bg-white py-5">
        <p className="label px-6">Used throughout the day</p>
        <div className="relative mt-4 overflow-hidden">
          <div className="marquee flex w-max items-center gap-4 px-3 [animation-duration:30s]">
            {[...DAY, ...DAY].map((d, i) => (
              <span key={i} aria-hidden={i >= DAY.length} className="flex items-center gap-3 rounded-full bg-paper py-1.5 pe-5 ps-1.5">
                <span className="grid size-11 place-items-center rounded-full bg-white">
                  <VectorScene drawn className="w-8">
                    <Icon name={d.icon} />
                  </VectorScene>
                </span>
                <span className="whitespace-nowrap font-semibold">{d.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── 07 · Materials & product selection ───────────────────────── */

const QUESTIONS = [
  { q: 'What do you serve?', a: 'Hot, cold, wet or dry food each suit different materials.' },
  { q: 'What is the portion size?', a: 'Match the container to the portion, not the other way round.' },
  { q: 'How will the order travel?', a: 'Counter, table, delivery bag or catering run.' },
]
const MATERIALS: { name: string; use: string; key: VectorKey; link: VectorKey }[] = [
  { name: 'Paper', use: 'Cups, napkins, wraps and food sheets for counter and table service.', key: 'paper', link: 'paper' },
  { name: 'Kraft', use: 'Carry bags and meal boxes with a natural finish for takeaway orders.', key: 'bags', link: 'bags' },
  { name: 'Aluminium', use: 'Foil rolls, platters and lidded containers for hot food and catering trays.', key: 'aluminium', link: 'aluminium' },
  { name: 'Plastic', use: 'PP and PET containers, cups and lids for sealed portions and clear display.', key: 'plastic', link: 'cups' },
  { name: 'Biodegradable', use: 'Plates, bowls, cutlery and containers that break down after use.', key: 'bio', link: 'bio' },
]

/** Dark. Three questions to start with, a material picker, and a lid-fit reminder with a lid that drops onto a cup. */
export function Materials() {
  const [m, setM] = useState(0)
  const mat = MATERIALS[m]
  return (
    <Section id="materials" labelledBy="materials-title" dark>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <SectionHead id="materials-title" eyebrow="Materials & product selection" title="Choose What Fits the Job" highlight="Fits the Job" dark>
            For takeaway packaging, start with what you serve, the portion size and how the order
            will travel. Compare paper, kraft, aluminium, plastic and biodegradable options by their
            intended use.
          </SectionHead>
          <ol className="mt-8 flex flex-col gap-3">
            {QUESTIONS.map((x, i) => (
              <motion.li
                key={x.q}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-leaf font-display text-lg font-extrabold">{i + 1}</span>
                <span>
                  <span className="block font-display text-lg font-bold">{x.q}</span>
                  <span className="block text-sm text-white/65">{x.a}</span>
                </span>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-5">
          <div role="tablist" aria-label="Materials" className="flex flex-wrap gap-2">
            {MATERIALS.map((x, i) => (
              <button
                key={x.name}
                role="tab"
                aria-selected={i === m}
                onClick={() => setM(i)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${i === m ? 'border-leaf bg-leaf text-white' : 'border-white/20 text-white/75 hover:border-leaf hover:text-white'}`}
              >
                {x.name}
              </button>
            ))}
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-[28px] bg-white p-7 text-ink" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={mat.name}
                className="grid items-center gap-6 sm:grid-cols-[1fr_auto]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-leaf-deep">Intended use</p>
                  <h3 className="mt-1 text-4xl font-extrabold tracking-[-0.03em]">{mat.name}</h3>
                  <p className="mt-3 text-slate">{mat.use}</p>
                  <a
                    href={categoryHref(mat.link)}
                    className="mt-5 inline-flex items-center gap-1 rounded-full bg-leaf-soft px-4 py-2 text-sm font-semibold text-leaf-deep transition hover:bg-leaf hover:text-white"
                  >
                    See the range →
                  </a>
                </div>
                <motion.div
                  className="mx-auto w-36"
                  initial={{ rotate: -20, scale: 0.7 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14 }}
                >
                  <CatIcon name={mat.key} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Lid fit */}
          <motion.div
            className="flex items-center gap-5 rounded-[24px] border-2 border-dashed border-leaf/60 p-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="relative h-24 w-20 shrink-0 rounded-2xl bg-white" aria-hidden>
              <motion.div
                className="absolute inset-x-2 top-0"
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 4, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.5 }}
              >
                <VectorScene drawn>
                  <Icon name="dome-lid" />
                </VectorScene>
              </motion.div>
              <div className="absolute inset-x-3 bottom-1">
                <VectorScene drawn>
                  <Icon name="rippled" />
                </VectorScene>
              </div>
            </div>
            <p className="text-white/80">
              <span className="block font-display text-xl font-bold text-white">Check the lid, every time.</span>
              For cups and containers, check the lid size and fit as part of your selection.
            </p>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}
