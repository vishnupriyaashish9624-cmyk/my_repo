'use client'

import { useActionState } from 'react'
import { motion } from 'motion/react'
import type { Home, Site } from '@/payload-types'
import { createEnquiry, type QuoteState } from '@/app/(frontend)/actions'
import Tilt3D, { Depth } from '../vectors/Tilt3D'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'

const EASE = [0.2, 0.7, 0.2, 1] as const

const field =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base text-ink focus:border-transparent focus:outline-2 focus:outline-leaf'

/** Products floating around the quote card, at different depths in front of and behind it. */
const FLOATERS: { icon: ItemKey; className: string; z: number; d: string }[] = [
  { icon: 'stack', className: '-start-10 -top-12 w-28', z: 120, d: '0s' },
  { icon: 'cat:cups', className: '-end-8 -top-10 w-24', z: 70, d: '-2s' },
  { icon: 'carry-bag', className: '-start-12 -bottom-10 w-24', z: 90, d: '-4s' },
  { icon: 'cat:chemicals', className: '-end-12 bottom-16 w-28', z: 140, d: '-6s' },
]

/** What happens after the form is sent, shown beside it so the next step is never a guess. */
const NEXT: { icon: ItemKey; title: string; text: string }[] = [
  { icon: 'bill-roll', title: 'Send your list', text: 'Rough is fine: names, sizes or photos.' },
  { icon: 'stack', title: 'We quote by the carton', text: 'Stock and carton prices confirmed.' },
  { icon: 'carry-bag', title: 'Delivery day agreed', text: 'Nothing ships until you say yes.' },
]

/** Fades and rises into place as it scrolls into view. */
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.7, delay, ease: EASE },
})

/**
 * "Request a quote": a navy card that is readable the moment it arrives. On the left, the headline,
 * a short line, the three steps that follow a request (each icon draws in, joined by a dashed line
 * that draws down) and a WhatsApp link; on the right, the white form, whose fields rise one by one.
 * Products float around the card in 3D and the card tilts gently toward the pointer.
 */
export default function Quote({ content, site }: { content: Home['quote']; site: Site }) {
  const [state, action, pending] = useActionState<QuoteState, FormData>(createEnquiry, null)

  return (
    <section id="quote" className="theme-light relative px-5 py-16 md:px-10 md:py-24">
      <div className="relative mx-auto w-full max-w-[1260px]">
        <Tilt3D className="relative" max={4} enter={12}>
          {FLOATERS.map((f) => (
            <Depth
              key={f.icon}
              z={f.z}
              className={`pointer-events-none absolute z-10 hidden lg:block ${f.className}`}
            >
              <div
                className="vx-drift rounded-full bg-white p-2 shadow-[0_24px_50px_-18px_rgba(28,42,92,0.55)] ring-1 ring-line"
                style={{ '--d': f.d, '--dur': '9s' } as React.CSSProperties}
              >
                <VectorScene>
                  <ItemVector name={f.icon} className="w-full" />
                </VectorScene>
              </div>
            </Depth>
          ))}

          <motion.div
            className="quote-card relative grid items-center gap-10 overflow-hidden rounded-[36px] bg-navy p-7 text-white md:grid-cols-2 md:gap-16 md:p-14"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {/* Soft glows and a slowly turning dotted ring behind the content */}
            <div
              aria-hidden
              className="pointer-events-none absolute -end-40 -top-40 size-[560px] rounded-full bg-leaf/25 blur-[120px]"
            />
            <motion.svg
              aria-hidden
              viewBox="0 0 400 400"
              className="pointer-events-none absolute -bottom-40 -start-40 hidden w-[620px] text-white/10 md:block"
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
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
            </motion.svg>

            {/* Left: pitch, next steps, WhatsApp */}
            <div className="relative">
              <motion.p className="label !text-leaf" {...rise(0.1)}>
                Request a quote
              </motion.p>
              <motion.h2
                className="mt-3 text-[clamp(2.1rem,4.4vw,4rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white"
                {...rise(0.15)}
              >
                {content?.title} <em className="not-italic text-[#8fd67e]">{content?.highlight}</em>
              </motion.h2>
              {content?.text && (
                <motion.p className="mt-5 max-w-[42ch] text-[#c8d1ea]" {...rise(0.25)}>
                  {content.text}
                </motion.p>
              )}

              <ol className="relative mt-8 flex flex-col gap-4">
                <svg
                  aria-hidden
                  className="absolute start-6 top-6 h-[calc(100%-3rem)] w-px overflow-visible"
                  preserveAspectRatio="none"
                  viewBox="0 0 1 100"
                >
                  <motion.path
                    d="M0.5 0 V100"
                    stroke="rgb(255 255 255 / 0.3)"
                    strokeWidth="2"
                    strokeDasharray="4 6"
                    vectorEffect="non-scaling-stroke"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeInOut' }}
                  />
                </svg>
                {NEXT.map((s, i) => (
                  <motion.li
                    key={s.title}
                    className="vx-host relative flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.15, ease: EASE }}
                  >
                    <span className="relative grid size-12 shrink-0 place-items-center rounded-full bg-white shadow-[0_12px_28px_-12px_rgba(0,0,0,0.6)]">
                      <VectorScene className="w-9">
                        <ItemVector name={s.icon} delay={0.5 + i * 0.15} className="w-full" />
                      </VectorScene>
                      <span className="absolute -end-1 -top-1 grid size-5 place-items-center rounded-full bg-leaf font-mono text-[10px] font-semibold text-white">
                        {i + 1}
                      </span>
                    </span>
                    <span>
                      <span className="block font-display text-lg font-bold leading-tight">
                        {s.title}
                      </span>
                      <span className="block text-sm text-white/65">{s.text}</span>
                    </span>
                  </motion.li>
                ))}
              </ol>

              {site.whatsapp && (
                <motion.a
                  href={`https://wa.me/${site.whatsapp}`}
                  className="mt-8 inline-flex rounded-xl border border-white/30 px-5 py-3 font-semibold transition-colors hover:border-white"
                  {...rise(0.8)}
                >
                  Message us on WhatsApp
                </motion.a>
              )}
            </div>

            {/* Right: the form */}
            <motion.form
              action={action}
              className="relative flex flex-col gap-3.5 rounded-[22px] bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:p-8"
              initial={{ opacity: 0, y: 50, rotate: 1.5 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.3 }}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <motion.label
                  htmlFor="q-business"
                  className="flex flex-col gap-1.5 text-sm font-semibold"
                  {...rise(0.45)}
                >
                  Business name
                  <input
                    id="q-business"
                    name="business"
                    autoComplete="organization"
                    required
                    className={field}
                  />
                </motion.label>
                <motion.label
                  htmlFor="q-phone"
                  className="flex flex-col gap-1.5 text-sm font-semibold"
                  {...rise(0.52)}
                >
                  Phone or WhatsApp
                  <input
                    id="q-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className={field}
                  />
                </motion.label>
              </div>
              <motion.label
                htmlFor="q-list"
                className="flex flex-col gap-1.5 text-sm font-semibold"
                {...rise(0.6)}
              >
                What do you need?
                <textarea
                  id="q-list"
                  name="list"
                  required
                  rows={4}
                  placeholder="e.g. 10 ctn RE24 black containers, 5 ctn foil 45 cm 1.5 kg, 4 × 5 L dish wash"
                  className={field}
                />
              </motion.label>
              <motion.button
                type="submit"
                disabled={pending}
                className="rounded-xl bg-leaf px-5 py-3.5 font-semibold text-white transition-colors hover:bg-leaf-deep disabled:opacity-60"
                {...rise(0.68)}
              >
                {pending ? 'Sending…' : 'Request a quote'}
              </motion.button>
              <p
                aria-live="polite"
                className={`min-h-5 text-sm ${state?.ok ? 'text-leaf-deep' : 'text-[#b3261e]'}`}
              >
                {state?.message}
              </p>
            </motion.form>
          </motion.div>
        </Tilt3D>
      </div>
    </section>
  )
}
