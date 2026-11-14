'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { FaqIcon, FaqItem } from '@/lib/faq'
import { CategoryVector, VectorScene } from '../vectors/CategoryVector'
import { ItemVector } from '../vectors/ItemVectors'
import { UseVector, type UseKey } from '../vectors/TissueVectors'
import { Arrow } from '../Header'
import ScrollDecor, { type DecorSpot } from '../vectors/ScrollDecor'

/** Vectors scattered into the FAQ's empty left side and the gutter beside the questions. */
const FAQ_DECOR: DecorSpot[] = [
  { icon: 'cat:tissue', className: 'start-[31%] top-[14%] w-24', speed: 1.2, spin: 14 },
  { icon: 'rippled', className: 'start-[33.5%] top-[42%] w-20', speed: 0.6, spin: -10 },
  { icon: 'cat:chemicals', className: 'start-[30.5%] top-[68%] w-24', speed: 1.4, spin: 18 },
  { icon: 'carry-bag', className: 'start-[5%] bottom-[8%] w-28', speed: 0.9, spin: -12 },
  { icon: 'glove-nitrile', className: 'start-[19%] bottom-[16%] w-20', speed: 1.5, spin: 16 },
  { icon: 'foil-roll', className: 'start-[13%] bottom-[30%] w-16', speed: 0.5, spin: -8 },
]

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Renders a question's icon (item vector, or a "use:" scene vector). */
function Icon({
  name,
  className = '',
  delay = 0,
}: {
  name: FaqIcon
  className?: string
  delay?: number
}) {
  return name.startsWith('use:') ? (
    <UseVector name={name.slice(4) as UseKey} className={className} delay={delay} />
  ) : (
    <ItemVector
      name={name as Exclude<FaqIcon, `use:${string}`>}
      className={className}
      delay={delay}
    />
  )
}

/** A looping little chat: a question pops in, the typing dots run, then the answer arrives. */
function ChatScene() {
  return (
    <div aria-hidden className="relative mt-10 hidden max-w-sm lg:block">
      <div className="absolute -end-6 -top-10 w-24 opacity-90">
        <VectorScene>
          <div className="vx-drift" style={{ '--d': '-2s' } as React.CSSProperties}>
            <CategoryVector name="cups" className="w-full" />
          </div>
        </VectorScene>
      </div>
      <div className="absolute -bottom-12 -start-4 w-20 opacity-90">
        <VectorScene>
          <div className="vx-drift" style={{ '--d': '-5s' } as React.CSSProperties}>
            <CategoryVector name="tissue" className="w-full" />
          </div>
        </VectorScene>
      </div>
      <div className="relative flex flex-col gap-3 rounded-[24px] border border-line bg-white/80 p-5 shadow-[0_24px_60px_-30px_rgba(28,42,92,0.45)] backdrop-blur">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <span className="grid size-8 place-items-center rounded-full bg-leaf-soft font-display text-sm font-bold text-leaf-deep">
            K+
          </span>
          <span className="text-sm font-semibold">Klen Plus</span>
          <span className="ms-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-leaf-deep">
            <span className="size-1.5 rounded-full bg-leaf" /> Online
          </span>
        </div>
        <p className="chat-q max-w-[85%] rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5 text-sm">
          Is there a minimum order?
        </p>
        <div className="relative min-h-[64px]">
          <span className="chat-dots absolute end-0 top-0 flex gap-1 rounded-2xl rounded-br-md bg-leaf/15 px-3.5 py-3">
            {[0, 0.15, 0.3].map((d) => (
              <span
                key={d}
                className="chat-dot size-1.5 rounded-full bg-leaf-deep"
                style={{ animationDelay: `${d}s` }}
              />
            ))}
          </span>
          <p className="chat-a absolute end-0 top-0 max-w-[88%] rounded-2xl rounded-br-md bg-leaf px-3.5 py-2.5 text-sm text-white">
            We confirm it on your quote, before you commit to anything ✓
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * "Before you buy": frequently asked questions as an accordion. One answer opens at a time with a
 * height animation; the plus turns into a minus. Also emits FAQPage structured data for search.
 */
export default function Faq({ items, whatsapp }: { items: FaqItem[]; whatsapp?: string | null }) {
  const [open, setOpen] = useState<number | null>(0)
  const base = useId()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="theme-light relative overflow-hidden px-5 py-12 md:px-10 md:py-16"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollDecor spots={FAQ_DECOR} />
      <div className="relative mx-auto grid max-w-[1840px] gap-8 lg:grid-cols-[minmax(320px,0.8fr)_1.4fr] lg:gap-12">
        {/* Left: heading, a drifting vector and a way to ask anything else */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <motion.p
            className="label !text-leaf-deep"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Before you buy
          </motion.p>
          <motion.h2
            id="faq-title"
            className="mt-3 text-[clamp(2.2rem,4.6vw,4.4rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Frequently asked questions<span className="text-leaf">.</span>
          </motion.h2>
          <p className="mt-5 max-w-sm text-slate">
            Anything else, ask us with your list. A person reads every one.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#quote"
              className="group flex items-center gap-2 rounded-xl bg-leaf px-5 py-3 font-semibold text-white transition hover:bg-leaf-deep"
            >
              Ask with your list <Arrow />
            </a>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                className="rounded-xl border border-line bg-white px-5 py-3 font-semibold transition hover:border-leaf"
              >
                WhatsApp us
              </a>
            )}
          </div>
          <ChatScene />
        </div>

        {/* Right: the questions */}
        <ul className="flex flex-col gap-2">
          {items.map((f, i) => {
            const on = open === i
            const id = `${base}-${i}`
            return (
              <motion.li
                key={f.q}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: Math.min(i, 5) * 0.05, ease: EASE }}
                className={`overflow-hidden rounded-[20px] border bg-white transition-colors duration-300 ${on ? 'border-leaf shadow-[0_20px_44px_-28px_rgba(28,42,92,0.45)]' : 'border-line hover:border-leaf/60'}`}
              >
                <h3>
                  <button
                    type="button"
                    id={`${id}-q`}
                    aria-expanded={on}
                    aria-controls={`${id}-a`}
                    onClick={() => setOpen(on ? null : i)}
                    className="group flex w-full items-center gap-3 px-4 py-3 text-start md:px-5"
                  >
                    <span
                      className={`relative grid size-10 shrink-0 place-items-center rounded-xl transition duration-500 ${on ? 'rotate-[-6deg] bg-leaf-soft' : 'bg-paper group-hover:bg-leaf-soft'}`}
                    >
                      <VectorScene drawn className="w-8">
                        <Icon name={f.icon} className="w-full" />
                      </VectorScene>
                      <span className="absolute -end-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-white font-mono text-[9px] tabular-nums text-slate shadow-sm">
                        {i + 1}
                      </span>
                    </span>
                    <span className="flex-1 font-display text-base font-bold leading-snug tracking-[-0.01em] md:text-lg">
                      {f.q}
                    </span>
                    <span
                      className={`relative grid size-9 shrink-0 place-items-center rounded-full transition-colors duration-300 ${on ? 'bg-leaf text-white' : 'bg-paper text-ink'}`}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                      <motion.span
                        className="absolute h-3.5 w-0.5 rounded-full bg-current"
                        animate={{ scaleY: on ? 0 : 1 }}
                        transition={{ duration: 0.3, ease: EASE }}
                      />
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`${id}-a`}
                      role="region"
                      aria-labelledby={`${id}-q`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                    >
                      <div className="flex items-end gap-5 px-4 pb-4 ps-[4.25rem] md:px-5 md:ps-[4.75rem]">
                        <p className="flex-1 text-slate">{f.a}</p>
                        <motion.div
                          className="hidden w-20 shrink-0 sm:block"
                          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
                        >
                          <VectorScene>
                            <Icon name={f.icon} delay={0.2} className="w-full" />
                          </VectorScene>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
