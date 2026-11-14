'use client'

import { motion } from 'motion/react'
import type { Site } from '@/payload-types'
import { VectorScene } from '../vectors/CategoryVector'
import { UseVector, type UseKey } from '../vectors/TissueVectors'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Promises the site already makes, gathered in one place. */
const PLEDGES: { icon: UseKey; title: string; text: string }[] = [
  {
    icon: 'counter',
    title: 'A person reads every list',
    text: 'Send it rough or tidy. Someone matches every line to a product and replies with a quote.',
  },
  {
    icon: 'storeroom',
    title: 'Your quote matches the cartons',
    text: 'Carton and bundle packs are shown up front, so the price you see is for what arrives.',
  },
  {
    icon: 'delivery',
    title: 'Nothing ships unconfirmed',
    text: 'Stock, carton price and delivery day are confirmed with you first.',
  },
  {
    icon: 'kitchen',
    title: 'Your list is kept',
    text: 'Next month’s restock is the same list with new quantities.',
  },
  {
    icon: 'washroom',
    title: 'Brands your team trusts',
    text: 'Names like Dettol, Harpic and Hotpack alongside our own range.',
  },
  {
    icon: 'catering',
    title: 'One account, every aisle',
    text: 'Packaging, tissue, chemicals, tools and PPE without juggling suppliers.',
  },
]

const SEAL_TEXT = 'KLEN PLUS · OUR COMMITMENT · TO YOUR BUSINESS · '

/**
 * "Our commitment to your business" (dark): a seal whose lettering turns slowly around a check that
 * draws itself, beside six pledge cards with animated icons. Every pledge restates what the site says.
 */
export function Commitment() {
  return (
    <section
      id="commitment"
      aria-labelledby="commit-title"
      className="theme-dark relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28"
    >
      <ScrollDecor
        spots={[
          {
            icon: 'cat:bio',
            className: 'start-[3%] bottom-[8%] w-14',
            speed: 1.2,
            spin: 14,
            disc: true,
          },
          {
            icon: 'cat:foam',
            className: 'start-[24%] bottom-[4%] w-12',
            speed: 0.7,
            spin: -12,
            disc: true,
          },
        ]}
      />
      <div className="relative mx-auto grid max-w-[1840px] items-center gap-14 lg:grid-cols-[0.8fr_1.6fr]">
        <div>
          <motion.h2
            id="commit-title"
            className="text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            What you can <span className="text-leaf">count on.</span>
          </motion.h2>
          {/* Seal */}
          <motion.div
            className="relative mt-10 aspect-square w-[min(300px,80%)]"
            initial={{ opacity: 0, scale: 0.7, rotate: -40 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            aria-hidden
          >
            <svg
              viewBox="0 0 200 200"
              className="vx-orbit absolute inset-0 h-full w-full"
              style={{ '--dur': '28s' } as React.CSSProperties}
            >
              <defs>
                <path id="seal-ring" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
              </defs>
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="rgb(255 255 255 / 0.2)"
                strokeDasharray="2 6"
              />
              <text className="fill-white font-mono" fontSize="12" letterSpacing="3">
                <textPath href="#seal-ring">{SEAL_TEXT + SEAL_TEXT.slice(0, 18)}</textPath>
              </text>
            </svg>
            <div className="absolute inset-[22%] grid place-items-center rounded-full bg-leaf shadow-[0_0_60px_-10px_rgba(61,166,41,0.8)]">
              <span className="orbit-pulse absolute inset-0 rounded-full bg-leaf/50" />
              <svg
                viewBox="0 0 48 48"
                className="relative w-1/2 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d="M10 25 l9 9 l19 -21"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {PLEDGES.map((p, i) => (
            <motion.li
              key={p.title}
              className="vx-host group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-leaf/60"
              initial={{ opacity: 0, y: 40, rotateX: 25 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: EASE }}
              style={{ transformPerspective: 900 }}
            >
              <div className="grid size-16 place-items-center rounded-2xl bg-white transition duration-500 group-hover:-rotate-6">
                <VectorScene className="w-12">
                  <UseVector name={p.icon} delay={0.1 + (i % 3) * 0.15} className="w-full" />
                </VectorScene>
              </div>
              <h3 className="mt-5 text-xl font-bold leading-tight tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-2 text-white/70">{p.text}</p>
              <span
                aria-hidden
                className="absolute inset-x-6 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-leaf transition duration-500 group-hover:scale-x-100"
              />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/**
 * Contact cards closing the quote chapter: WhatsApp, phone and email when set in Site settings, and
 * always a way into the catalogue and the quote form. Each card has an animated icon.
 */
export function ContactCards({
  site,
  browseHref = '#catalogue',
}: {
  site: Site
  /** Where "Browse first" jumps to (the product range on this page). */
  browseHref?: string
}) {
  const cards = [
    site.whatsapp && {
      icon: 'counter' as UseKey,
      label: 'WhatsApp',
      value: 'Send your list in a message',
      href: `https://wa.me/${site.whatsapp}`,
    },
    site.phone && {
      icon: 'delivery' as UseKey,
      label: 'Call us',
      value: site.phone,
      href: `tel:${site.phone.replace(/\s/g, '')}`,
    },
    site.email && {
      icon: 'storeroom' as UseKey,
      label: 'Email',
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: 'kitchen' as UseKey,
      label: 'Browse first',
      value: 'Explore all 14 categories',
      href: browseHref,
    },
    {
      icon: 'catering' as UseKey,
      label: 'Request a quote',
      value: 'Send your monthly list',
      href: '#quote',
    },
  ].filter(Boolean) as { icon: UseKey; label: string; value: string; href: string }[]

  return (
    <div className="theme-light relative px-5 pb-20 md:px-10 lg:rounded-b-[36px] lg:shadow-[0_28px_60px_-12px_rgba(28,42,92,0.25)]">
      <ul className="mx-auto grid max-w-[1260px] gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
        {cards.map((c, i) => (
          <motion.li
            key={c.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
          >
            <a
              href={c.href}
              className="vx-host group flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-leaf hover:shadow-[0_20px_40px_-26px_rgba(47,138,32,0.6)]"
            >
              <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-leaf-soft transition group-hover:-rotate-6">
                <VectorScene className="w-11">
                  <UseVector name={c.icon} delay={0.1 + i * 0.1} className="w-full" />
                </VectorScene>
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[11px] uppercase tracking-[0.12em] text-leaf-deep">
                  {c.label}
                </span>
                <span className="block truncate font-display text-lg font-bold">{c.value}</span>
              </span>
              <span className="ms-auto text-leaf-deep transition group-hover:translate-x-1">→</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
