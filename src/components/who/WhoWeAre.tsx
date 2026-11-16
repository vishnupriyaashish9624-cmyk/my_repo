'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { Arrow } from '../Header'
import { Card, Chip, EASE, Icon, Section, SectionHead, Tick, type AnyIcon } from '../about/ui'

/* ───────────────────────── 02 · Our story ───────────────────────── */

const BEFORE = ['Packaging supplier', 'Cleaning wholesaler', 'Tissue distributor', 'Cash & carry run']

/**
 * Light. Who Klen Plus is and why it exists: the "many suppliers → one" story beside a stage where
 * the separate suppliers collapse into a single Klen Plus order on toggle.
 */
export function Story() {
  const [joined, setJoined] = useState(true)
  return (
    <Section id="story" labelledBy="story-title">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1fr]">
        <SectionHead id="story-title" eyebrow="Our story" title="One Supplier for the Everyday" highlight="the Everyday">
          <p>
            Running a kitchen, café, hotel or office means keeping dozens of small things in stock:
            containers and lids, cups, foil, bags, tissue, gloves, chemicals and cleaning tools.
            Too often they come from different suppliers, on different days, with different minimum
            orders.
          </p>
          <p className="mt-4">
            Klen Plus brings those supplies into one catalogue. We stock the sizes and pack formats
            businesses actually use, check orders before they leave, and deliver them together, so
            restocking becomes one routine instead of several errands.
          </p>
        </SectionHead>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div role="tablist" aria-label="Compare ordering" className="mb-5 inline-flex rounded-full border border-line bg-white p-1">
            {(
              [
                [false, 'Before'],
                [true, 'With Klen Plus'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={label}
                role="tab"
                aria-selected={joined === k}
                onClick={() => setJoined(k)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition ${joined === k ? 'text-white' : 'text-slate hover:text-ink'}`}
              >
                {joined === k && (
                  <motion.span layoutId="story-pill" className="absolute inset-0 rounded-full bg-leaf" transition={{ type: 'spring', stiffness: 300, damping: 28 }} />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-34px_rgba(28,42,92,0.55)] ring-1 ring-line">
            <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-leaf via-leaf-deep to-navy" />
            <AnimatePresence mode="wait">
              {joined ? (
                <motion.div key="one" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: EASE }}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-leaf-deep">1 supplier · 1 delivery</p>
                  <p className="mt-1 font-display text-2xl font-bold">Klen Plus</p>
                  <ul className="mt-5 grid grid-cols-2 gap-3">
                    {BEFORE.map((b, i) => (
                      <motion.li
                        key={b}
                        className="flex items-center gap-3 rounded-2xl bg-leaf-soft p-3 ring-2 ring-leaf"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-leaf text-white">
                          <Tick className="size-3.5" />
                        </span>
                        <span className="text-sm font-semibold leading-tight">{b.replace(/ (supplier|wholesaler|distributor|run)$/, '')}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-slate">One quotation, one invoice, one delivery window.</p>
                </motion.div>
              ) : (
                <motion.div key="many" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4, ease: EASE }}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate">{BEFORE.length} suppliers · {BEFORE.length} deliveries</p>
                  <p className="mt-1 font-display text-2xl font-bold">Separate errands</p>
                  <ul className="mt-5 grid grid-cols-2 gap-3">
                    {BEFORE.map((b, i) => (
                      <motion.li
                        key={b}
                        className="rounded-2xl border-2 border-dashed border-line p-3"
                        initial={{ opacity: 0, rotate: 0 }}
                        animate={{ opacity: 1, rotate: i % 2 ? 2 : -2 }}
                        transition={{ delay: i * 0.08, duration: 0.35 }}
                      >
                        <span className="block font-mono text-[10px] uppercase tracking-[0.12em] text-slate/80">Trip {i + 1}</span>
                        <span className="text-sm font-semibold leading-tight">{b}</span>
                      </motion.li>
                    ))}
                  </ul>
                  <p className="mt-6 text-sm text-slate">Separate minimums, invoices and delivery days.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Section>
  )
}

/* ───────────────────────── 03 · What we stand for ───────────────────────── */

const VALUES: { title: string; text: string; icon: AnyIcon }[] = [
  { title: 'Practical range', text: 'Products chosen for daily use in real kitchens and workplaces, not for a brochure.', icon: 'stack' },
  { title: 'Clear pack sizes', text: 'Carton quantities and formats listed up front, so you can plan storage and spend.', icon: 'cartons' },
  { title: 'Checked before dispatch', text: 'Orders are picked, counted and checked against your list before they leave us.', icon: 'clear-bowl' },
  { title: 'Careful delivery', text: 'Packed to arrive intact and in usable condition, ready to go on the shelf.', icon: 'use:delivery' },
  { title: 'Straight answers', text: 'Honest advice on materials, sizes and alternatives when something is out of stock.', icon: 'phone' },
  { title: 'Reliable restocking', text: 'Regular orders that repeat without fuss, so you are not caught short mid-service.', icon: 'calendar' },
]

/** Dark. Six principles as rising cards. */
export function Values() {
  return (
    <Section id="values" labelledBy="values-title" dark>
      <SectionHead id="values-title" eyebrow="What we stand for" title="Six Things We Hold Ourselves To" highlight="Hold Ourselves To" dark>
        Supplying everyday essentials is not complicated, but it has to be dependable. These are the
        standards our team works to on every order.
      </SectionHead>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {VALUES.map((v, i) => (
          <Card key={v.title} i={i} dark>
            <div className="flex items-start gap-5">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white transition duration-500 group-hover:-rotate-6">
                <VectorScene className="w-12">
                  <Icon name={v.icon} delay={0.1 + i * 0.06} />
                </VectorScene>
              </span>
              <span>
                <span className="font-mono text-[11px] text-leaf">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-xl font-bold leading-tight">{v.title}</h3>
                <p className="mt-2 text-white/70">{v.text}</p>
              </span>
            </div>
          </Card>
        ))}
      </ul>
    </Section>
  )
}

/* ───────────────────────── 04 · How we work ───────────────────────── */

const STEPS: { title: string; text: string; icon: AnyIcon }[] = [
  { title: 'We listen', text: 'Tell us your business, your product list and how often you restock.', icon: 'bill-roll' },
  { title: 'We recommend', text: 'We match sizes, materials and pack formats to how you actually work.', icon: 'product-box' },
  { title: 'We prepare', text: 'Your order is picked, counted and checked before it is packed.', icon: 'cartons' },
  { title: 'We deliver', text: 'Everything arrives together, and we stay on hand for the next order.', icon: 'use:delivery' },
]

/** Light. Four steps on a line that draws as it scrolls into view. */
export function HowWeWork() {
  return (
    <Section id="how" labelledBy="how-title">
      <SectionHead id="how-title" eyebrow="How we work" title="From Your List to Your Shelf" highlight="Your Shelf">
        Whether it is a first order for a new site or a weekly top-up, the way we work stays the
        same.
      </SectionHead>
      <ol className="relative mt-14 grid gap-8 md:grid-cols-4">
        <motion.span
          aria-hidden
          className="absolute start-8 end-8 top-8 hidden h-[3px] origin-left rounded-full bg-leaf md:block"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.4, ease: EASE }}
        />
        {STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            className="vx-host relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: EASE }}
          >
            <span className="relative grid size-16 place-items-center rounded-2xl bg-white ring-2 ring-leaf shadow-[0_16px_30px_-18px_rgba(28,42,92,0.5)]">
              <VectorScene className="w-11">
                <Icon name={s.icon} delay={0.3 + i * 0.15} />
              </VectorScene>
            </span>
            <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-leaf-deep">Step {i + 1}</p>
            <h3 className="mt-1 text-2xl font-bold leading-tight">{s.title}</h3>
            <p className="mt-2 text-slate">{s.text}</p>
          </motion.li>
        ))}
      </ol>
    </Section>
  )
}

/* ───────────────────────── 05 · Who we work with ───────────────────────── */

/** Dark. The businesses from the CMS as chips, with a short promise and a link to the catalogue. */
export function WorkWith({ industries }: { industries: { slug: string; name: string }[] }) {
  return (
    <Section id="work-with" labelledBy="work-with-title" dark>
      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
        <SectionHead id="work-with-title" eyebrow="Who we work with" title="Businesses That Can’t Run Out" highlight="Can’t Run Out" dark>
          <p>
            Our customers are the people who notice first when the cups run low or the washroom
            needs restocking: kitchen managers, café owners, housekeeping leads, office managers and
            facilities teams.
          </p>
          {industries.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {industries.map((it) => (
                <li key={it.slug}>
                  <Chip dark>{it.name}</Chip>
                </li>
              ))}
            </ul>
          )}
        </SectionHead>
        <motion.div
          className="rounded-[28px] border border-white/10 bg-white/[0.05] p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <span aria-hidden className="font-display text-[80px] leading-[0.6] text-leaf">&ldquo;</span>
          <p className="font-display text-2xl font-semibold leading-snug">
            If it keeps your business serving, cleaning and running,{' '}
            <span className="text-leaf">we want to make it easier to order.</span>
          </p>
          <Link
            href="/#catalogue"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3 font-semibold text-white transition hover:bg-leaf-deep"
          >
            Explore the catalogue <Arrow />
          </Link>
        </motion.div>
      </div>
    </Section>
  )
}
