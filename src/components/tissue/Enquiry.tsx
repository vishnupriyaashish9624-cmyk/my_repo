'use client'

import { useActionState, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { sendCategoryQuote, type CategoryQuoteState } from '@/app/(frontend)/actions'
import { PRODUCT_OPTIONS, SHEET, TISSUE_IMG } from './content'

const EASE = [0.2, 0.7, 0.2, 1] as const

const field =
  'w-full rounded-xl border border-line bg-paper px-3.5 py-3 text-base text-ink placeholder:text-slate/60 focus:border-transparent focus:bg-white focus:outline-2 focus:outline-leaf'

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay, ease: EASE },
})

function Field({
  id,
  label,
  error,
  delay,
  className = '',
  children,
}: {
  id: string
  label: string
  error?: string
  delay: number
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div className={`flex flex-col gap-1.5 ${className}`} {...rise(delay)}>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </motion.div>
  )
}

/** 10 · "Request a tissue & hygiene quote": dark sheet, pitch on the left, the full enquiry form on the right. */
export default function TissueEnquiry({ whatsapp }: { whatsapp?: string | null }) {
  const [state, action, pending] = useActionState<CategoryQuoteState, FormData>(sendCategoryQuote, null)
  const [picked, setPicked] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const err = state?.ok ? undefined : state?.errors
  const v = state?.ok ? undefined : state?.values

  return (
    <section id="enquiry" data-sheet className={`${SHEET} theme-dark px-5 py-24 text-white md:px-10 md:py-32`}>
      <div className="relative mx-auto grid max-w-[1260px] gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div aria-hidden className="pointer-events-none absolute -start-60 top-1/3 size-[560px] rounded-full bg-leaf/15 blur-[140px]" />

        <div className="relative">
          <p className="label flex items-center gap-2.5 !text-[#8fd67e]" data-rise>
            <span className="h-px w-8 bg-[#8fd67e]" />
            Enquiry form
          </p>
          <h2 className="mt-4 text-[clamp(2.2rem,4.6vw,4rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white" data-split>
            Request a tissue &amp; hygiene <em className="not-italic text-[#8fd67e]">quote</em>
          </h2>
          <motion.p className="mt-5 max-w-[44ch] text-[#c8d1ea]" data-lines>
            Tell us what you use, how much you need and where you need it delivered. If you’re replacing an existing product,
            attach a photo of the pack label or dispenser to help us match the specification.
          </motion.p>

          <div aria-hidden className="relative mt-10 hidden h-56 lg:block">
            {[
              { src: TISSUE_IMG.facial, cls: 'start-0 top-0 w-40 -rotate-6', d: '0s' },
              { src: TISSUE_IMG.towels, cls: 'start-32 top-10 w-44 rotate-3', d: '-3s' },
              { src: TISSUE_IMG.kitchen, cls: 'start-[17rem] top-0 w-32 rotate-6', d: '-6s' },
            ].map((c, i) => (
              <motion.div
                key={c.src}
                className={`absolute ${c.cls}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.8, ease: EASE }}
              >
                <div className="vx-drift" style={{ '--d': c.d, '--dur': '10s' } as React.CSSProperties}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.src} alt="" loading="lazy" className="aspect-square w-full rounded-[22px] object-cover shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)] ring-4 ring-white/10" />
                </div>
              </motion.div>
            ))}
          </div>

          {whatsapp && (
            <motion.a
              href={`https://wa.me/${whatsapp}`}
              className="mt-8 inline-flex rounded-xl border border-white/30 px-5 py-3 font-semibold transition-colors hover:border-white"
              data-rise
            >
              Prefer WhatsApp? Message us
            </motion.a>
          )}
        </div>

        <div data-rise className="relative rounded-[28px] bg-white p-5 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:p-8">
          <AnimatePresence mode="wait" initial={false}>
            {state?.ok ? (
              <motion.div
                key="done"
                className="flex min-h-[420px] flex-col items-center justify-center gap-5 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <span className="grid size-20 place-items-center rounded-full bg-leaf-soft">
                  <svg viewBox="0 0 24 24" className="size-10 text-leaf" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <motion.path d="M5 12.5 10 17 19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.2 }} />
                  </svg>
                </span>
                <p className="font-display text-2xl font-bold">Request received</p>
                <p role="status" className="max-w-sm text-slate">
                  {state.message}
                </p>
              </motion.div>
            ) : (
              <motion.form key="form" action={action} className="flex flex-col gap-4" exit={{ opacity: 0, y: -10 }} noValidate>
                <input type="hidden" name="category" value="Tissue & hygiene" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="t-name" label="Full name" error={err?.name} delay={0.1}>
                    <input id="t-name" name="name" defaultValue={v?.name} autoComplete="name" placeholder="Your name" required aria-invalid={!!err?.name} className={field} />
                  </Field>
                  <Field id="t-company" label="Company name" error={err?.company} delay={0.14}>
                    <input id="t-company" name="company" defaultValue={v?.company} autoComplete="organization" placeholder="Business or organisation" required aria-invalid={!!err?.company} className={field} />
                  </Field>
                  <Field id="t-email" label="Email address" error={err?.email} delay={0.18}>
                    <input id="t-email" name="email" defaultValue={v?.email} type="email" autoComplete="email" placeholder="you@company.com" required aria-invalid={!!err?.email} className={field} />
                  </Field>
                  <Field id="t-phone" label="Phone number" error={err?.phone} delay={0.22}>
                    <input id="t-phone" name="phone" defaultValue={v?.phone} type="tel" autoComplete="tel" placeholder="+971 …" required aria-invalid={!!err?.phone} className={field} />
                  </Field>
                </div>
                <Field id="t-location" label="Delivery location" error={err?.location} delay={0.26}>
                  <input id="t-location" name="location" defaultValue={v?.location} placeholder="Emirate, area and branch, if applicable" required aria-invalid={!!err?.location} className={field} />
                </Field>

                <motion.fieldset className="flex flex-col gap-2" data-rise>
                  <legend className="mb-1.5 text-sm font-semibold">Products required</legend>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_OPTIONS.map((p) => {
                      const on = picked.includes(p)
                      return (
                        <label
                          key={p}
                          className={`relative cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-leaf ${on ? 'border-leaf bg-leaf text-white' : 'border-line bg-paper hover:border-leaf'}`}
                        >
                          <input
                            type="checkbox"
                            name="products"
                            value={p}
                            checked={on}
                            onChange={() => setPicked((s) => (on ? s.filter((x) => x !== p) : [...s, p]))}
                            className="sr-only"
                          />
                          <motion.span className="inline-flex items-center gap-1.5" animate={{ scale: on ? [1, 1.08, 1] : 1 }} transition={{ duration: 0.3 }}>
                            {on && <span aria-hidden>✓</span>}
                            {p}
                          </motion.span>
                        </label>
                      )
                    })}
                  </div>
                  {err?.products && <p className="text-sm text-red-600">{err.products}</p>}
                </motion.fieldset>

                <Field id="t-qty" label="Estimated quantity" delay={0.34}>
                  <input id="t-qty" name="quantity" defaultValue={v?.quantity} placeholder="For example, 10 cartons of folded hand towels per month" className={field} />
                </Field>
                <Field id="t-req" label="Product requirements" delay={0.38}>
                  <textarea id="t-req" name="requirements" defaultValue={v?.requirements} rows={3} placeholder="Preferred brand, ply, dimensions, dispenser model or required documentation" className={`${field} resize-y`} />
                </Field>

                <motion.div data-rise>
                  <p className="mb-1.5 text-sm font-semibold">
                    Attachment <span className="font-normal text-slate">(optional)</span>
                  </p>
                  <label
                    htmlFor="t-file"
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line bg-paper px-4 py-4 transition hover:border-leaf hover:bg-leaf-soft/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-leaf"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white text-leaf-deep ring-1 ring-line">
                      <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M10 13V4M6.5 7.5 10 4l3.5 3.5M4 13v2.5h12V13" />
                      </svg>
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block truncate font-semibold">{fileName || 'Upload a pack photo, dispenser label or purchasing list'}</span>
                      <span className="text-slate">JPG, PNG or WebP, up to 5 MB</span>
                    </span>
                    <input
                      id="t-file"
                      name="attachment"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
                    />
                  </label>
                  {err?.attachment && <p className="mt-1.5 text-sm text-red-600">{err.attachment}</p>}
                </motion.div>

                {state && !state.ok && (
                  <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                    {state.message}
                  </p>
                )}

                <motion.button
                  type="submit"
                  disabled={pending}
                  className="group mt-1 flex items-center justify-center gap-2 rounded-xl bg-leaf px-6 py-4 font-semibold text-white transition hover:bg-leaf-deep disabled:opacity-70"
                  whileTap={{ scale: 0.98 }}
                  data-rise
                >
                  {pending ? 'Sending…' : 'Request My Quote'}
                  {!pending && <span className="transition-transform group-hover:translate-x-1">→</span>}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
