'use client'

import { motion } from 'motion/react'
import type { Site } from '@/payload-types'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import OrbitScene from '../vectors/OrbitScene'
import { Arrow } from '../Header'
import { EASE, Icon } from '../about/ui'

/** Products drifting around the orbit, at the corners of the hero. */
const DRIFT: { icon: ItemKey; className: string; d: string }[] = [
  { icon: 'cat:cups', className: 'start-[46%] top-[16%] w-20', d: '0s' },
  { icon: 'dome-lid', className: 'end-[4%] top-[12%] w-24', d: '-3s' },
  { icon: 'carry-bag', className: 'end-[2%] bottom-[14%] w-24', d: '-6s' },
  { icon: 'disinfect', className: 'start-[50%] bottom-[10%] w-16', d: '-8s' },
]

/**
 * 01 · Contact hero (light, full height): eyebrow, the big "How Can We Help?" line rising in, the
 * intro and calls to action, quick contact chips from the Site global, and every category orbiting
 * into a single message.
 */
export default function ContactHero({ site }: { site: Site }) {
  const quick = [
    site.phone && { label: 'Call', value: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    site.email && { label: 'Email', value: site.email, href: `mailto:${site.email}` },
    site.whatsapp && { label: 'WhatsApp', value: 'Message us', href: `https://wa.me/${site.whatsapp}` },
  ].filter(Boolean) as { label: string; value: string; href: string }[]

  return (
    <section
      id="top"
      aria-labelledby="contact-hero-title"
      className="theme-light relative flex min-h-svh items-center overflow-hidden px-5 pb-16 pt-32 md:px-10"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {DRIFT.map((f, i) => (
          <div key={f.icon} className={`absolute ${f.className}`}>
            <VectorScene>
              <div className="vx-drift" style={{ '--d': f.d, '--dur': '10s' } as React.CSSProperties}>
                <ItemVector name={f.icon} delay={0.6 + i * 0.2} className="w-full opacity-90" />
              </div>
            </VectorScene>
          </div>
        ))}
      </div>

      <div className="relative mx-auto grid w-full max-w-[1840px] items-center gap-12 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.p
            className="font-mono text-xs uppercase tracking-[0.16em] text-leaf-deep"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            01 · Contact Klen Plus
          </motion.p>
          <h1
            id="contact-hero-title"
            className="mt-4 overflow-hidden pb-2 text-[clamp(3.4rem,9vw,9rem)] font-extrabold leading-[0.88] tracking-[-0.055em]"
          >
            <motion.span
              className="inline-block"
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              How Can We <span className="text-leaf">Help?</span>
            </motion.span>
          </h1>
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-slate md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
          >
            Whether you’re planning your first order, restocking your business or following up on a
            delivery, send us a message. Include a few details so our team can help with your
            request.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          >
            <a
              href="#quote"
              className="group inline-flex items-center gap-3 rounded-full bg-leaf px-7 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_-18px_rgba(47,138,32,0.8)] transition hover:bg-leaf-deep"
            >
              Send us a message <Arrow />
            </a>
            <a
              href="#topics"
              className="inline-flex items-center rounded-full border border-line bg-white/70 px-7 py-4 text-lg font-semibold transition hover:bg-white"
            >
              Choose a topic
            </a>
          </motion.div>
          {quick.length > 0 && (
            <motion.ul
              className="mt-10 flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
            >
              {quick.map((q) => (
                <li key={q.href}>
                  <a
                    href={q.href}
                    className="flex flex-col rounded-2xl border border-line bg-white px-5 py-3 transition hover:-translate-y-0.5 hover:border-leaf"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-leaf-deep">
                      {q.label}
                    </span>
                    <span className="font-semibold">{q.value}</span>
                  </a>
                </li>
              ))}
            </motion.ul>
          )}
        </div>

        <motion.div
          className="mx-auto w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[520px]"
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
        >
          <OrbitScene
            tone="light"
            icons={['cups', 'aluminium', 'takeaway', 'chemicals', 'tissue', 'bags', 'ppe', 'tools']}
            center={
              <VectorScene>
                <Icon name="bill-roll" />
              </VectorScene>
            }
          />
        </motion.div>
      </div>
    </section>
  )
}
