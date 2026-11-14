'use client'

import { startTransition, useActionState, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import type { Site } from '@/payload-types'
import { sendContactEnquiry, type ContactState } from '@/app/(frontend)/actions'
import { ENQUIRY_TYPES, type EnquiryType } from '@/lib/enquiry'
import { VectorScene } from '../vectors/CategoryVector'
import { Arrow } from '../Header'
import { Card, EASE, Icon, Section, SectionHead, type AnyIcon } from '../about/ui'

/** Contact topics 02–07. Each card's button picks its enquiry type in the form below. */
const TOPICS: {
  n: string
  type: EnquiryType
  eyebrow: string
  title: string
  text: string
  icon: AnyIcon
  hint: string
}[] = [
  {
    n: '02',
    type: 'product',
    eyebrow: 'Product Enquiries',
    title: 'Find the Right Product',
    text: 'Looking for a lid that fits your cups or a container for a particular meal? Share the size, material or a photo of what you use. We’ll help you explore the options.',
    icon: 'dome-lid',
    hint: 'e.g. We use 12 oz paper cups and need matching sip lids. Black or white, around 2 cartons a month.',
  },
  {
    n: '03',
    type: 'quote',
    eyebrow: 'Request a Quote',
    title: 'Get Pricing for Your List',
    text: 'Send us the items you need, the quantity of each and your delivery location. If you have a preferred pack size, include it so we can quote by the carton.',
    icon: 'bill-roll',
    hint: 'e.g. 10 ctn RE24 black containers, 5 ctn foil 45 cm 1.5 kg, 4 × 5 L dish wash. Delivery to our main kitchen.',
  },
  {
    n: '04',
    type: 'bulk',
    eyebrow: 'Bulk & Regular Orders',
    title: 'Plan Your Next Restock',
    text: 'If you order the same supplies each week or month, share your usual quantities and how often you need them. We can discuss pack sizes and availability around your schedule.',
    icon: 'stack',
    hint: 'e.g. Every week: 3 ctn garbage bags, 2 ctn interfold tissue, 1 ctn nitrile gloves.',
  },
  {
    n: '05',
    type: 'delivery',
    eyebrow: 'Delivery Enquiries',
    title: 'Arrange Your Delivery',
    text: 'Tell us where the order is going, who will receive it and when your site accepts deliveries. For an existing order, include your order reference so we can check the details.',
    icon: 'use:delivery',
    hint: 'e.g. Order ref 10452. Deliver to the back entrance, receiving 7–11 am, ask for Sam.',
  },
  {
    n: '06',
    type: 'support',
    eyebrow: 'Order Support',
    title: 'Get Help With an Order',
    text: 'If an item arrives damaged, missing or different from what you ordered, send your order reference and the quantity affected. A photo can help us review the issue and advise you on the next step.',
    icon: 'zip-pouch',
    hint: 'e.g. Order ref 10452: 1 carton of 750 ml containers arrived crushed, 2 cartons of lids missing.',
  },
  {
    n: '07',
    type: 'business',
    eyebrow: 'Business Enquiries',
    title: 'Discuss Your Supply Needs',
    text: 'Opening a café, stocking a new office or buying for several locations? Tell us about your business, the sites you manage and the supplies each one needs.',
    icon: 'use:cafe',
    hint: 'e.g. We run 3 cafés and a central kitchen and want one supplier for packaging and cleaning.',
  },
]

const DEFAULT_HINT = 'Tell us what you need. Include a product code or order reference if you have one.'

const field =
  'w-full rounded-xl border bg-paper px-3.5 py-3 text-base text-ink focus:border-transparent focus:outline-2 focus:outline-leaf'

/** Contact topics (dark) and the contact form (light), sharing the selected enquiry type. */
export default function ContactBody({ site }: { site: Site }) {
  const [type, setType] = useState<EnquiryType | ''>('')
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactEnquiry, null)
  const formRef = useRef<HTMLFormElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset()
      setType('')
    }
  }, [state])

  const pick = (t: EnquiryType) => {
    setType(t)
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => messageRef.current?.focus({ preventScroll: true }), 700)
  }

  const err = state?.errors ?? {}
  const hint = TOPICS.find((t) => t.type === type)?.hint ?? DEFAULT_HINT
  const border = (k: keyof typeof err) => (err[k] ? 'border-[#b3261e]' : 'border-line')

  return (
    <>
      {/* 02–07 · Topics */}
      <Section id="topics" labelledBy="topics-title" dark className="!pt-20 md:!pt-28">
        <SectionHead
          id="topics-title"
          eyebrow="What can we help with?"
          title="Pick a Topic, We’ll Take It From There"
          highlight="We’ll Take It From There"
          dark
        >
          Choose the topic closest to your request. We’ll set up the form with the right enquiry type
          and a few prompts for the details our team needs.
        </SectionHead>
        <ul className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TOPICS.map((t, i) => (
            <Card key={t.n} i={i} dark className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-leaf">
                  {t.n} · {t.eyebrow}
                </span>
                <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-white">
                  <VectorScene className="w-12 transition duration-300 group-hover:-rotate-6">
                    <Icon name={t.icon} delay={0.1 + i * 0.08} />
                  </VectorScene>
                </span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-bold leading-tight text-white md:text-3xl">
                {t.title}
              </h3>
              <p className="mt-3 flex-1 leading-relaxed text-white/70">{t.text}</p>
              <button
                type="button"
                onClick={() => pick(t.type)}
                className="mt-6 inline-flex items-center gap-2 self-start rounded-full border border-white/25 px-5 py-2.5 font-semibold text-white transition hover:border-leaf hover:bg-leaf"
              >
                Start this enquiry <Arrow />
              </button>
            </Card>
          ))}
        </ul>
      </Section>

      {/* 08 · Contact form */}
      <Section id="quote" labelledBy="form-title" className="scroll-mt-24 !pt-20 md:!pt-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div>
            <SectionHead
              id="form-title"
              eyebrow="08 · Contact Form"
              title="Send Us a Message"
              highlight="a Message"
            >
              Choose an enquiry type, add your details and tell us what you need. Include a product
              code or order reference if you have one.
            </SectionHead>
            <motion.div
              className="mt-10 grid gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              {site.phone && (
                <Detail label="Phone" value={site.phone} href={`tel:${site.phone.replace(/\s/g, '')}`} />
              )}
              {site.whatsapp && (
                <Detail label="WhatsApp" value="Message us on WhatsApp" href={`https://wa.me/${site.whatsapp}`} />
              )}
              {site.email && <Detail label="Email" value={site.email} href={`mailto:${site.email}`} />}
              {site.address && <Detail label="Address" value={site.address} />}
            </motion.div>
          </div>

          <motion.form
            ref={formRef}
            // Submitted by hand, not via `action`, so React doesn't reset the fields on a failed send.
            onSubmit={(e) => {
              e.preventDefault()
              const data = new FormData(e.currentTarget)
              startTransition(() => action(data))
            }}
            noValidate
            className="flex flex-col gap-4 rounded-[28px] border border-line bg-white p-5 shadow-[0_40px_90px_-50px_rgba(28,42,92,0.5)] md:p-9"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="c-name" label="Name" error={err.name}>
                <input id="c-name" name="name" autoComplete="name" required className={`${field} ${border('name')}`} />
              </Field>
              <Field id="c-company" label="Company name" optional>
                <input id="c-company" name="company" autoComplete="organization" className={`${field} border-line`} />
              </Field>
              <Field id="c-email" label="Email" error={err.email}>
                <input
                  id="c-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`${field} ${border('email')}`}
                />
              </Field>
              <Field id="c-phone" label="Phone number" error={err.phone}>
                <input
                  id="c-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  className={`${field} ${border('phone')}`}
                />
              </Field>
            </div>
            <Field id="c-type" label="Enquiry type" error={err.type}>
              <select
                id="c-type"
                name="type"
                required
                value={type}
                onChange={(e) => setType(e.target.value as EnquiryType)}
                className={`${field} ${border('type')} ${type ? '' : 'text-slate'}`}
              >
                <option value="" disabled>
                  Choose an enquiry type
                </option>
                {ENQUIRY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="c-message" label="Message" error={err.message}>
              <textarea
                ref={messageRef}
                id="c-message"
                name="message"
                required
                rows={6}
                placeholder={hint}
                className={`${field} ${border('message')}`}
              />
            </Field>
            <button
              type="submit"
              disabled={pending}
              className="group mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-leaf px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-leaf-deep disabled:opacity-60"
            >
              {pending ? 'Sending…' : 'Send Enquiry'} {!pending && <Arrow />}
            </button>
            <p
              aria-live="polite"
              className={`min-h-5 text-sm ${state?.ok ? 'font-semibold text-leaf-deep' : 'text-[#b3261e]'}`}
            >
              {state?.message}
            </p>
          </motion.form>
        </div>
      </Section>
    </>
  )
}

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-sm font-semibold">
      <span>
        {label}
        {optional && <span className="ms-1.5 font-normal text-slate">(optional)</span>}
      </span>
      {children}
      {error && <span className="text-xs font-medium text-[#b3261e]">{error}</span>}
    </label>
  )
}

function Detail({ label, value, href }: { label: string; value: string; href?: string }) {
  const body = (
    <>
      <span className="block font-mono text-[11px] uppercase tracking-[0.14em] text-leaf-deep">{label}</span>
      <span className="mt-1 block whitespace-pre-line font-semibold">{value}</span>
    </>
  )
  return href ? (
    <a href={href} className="block rounded-2xl border border-line bg-white p-4 transition hover:border-leaf">
      {body}
    </a>
  ) : (
    <div className="rounded-2xl border border-line bg-white p-4">{body}</div>
  )
}
