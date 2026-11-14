'use client'

import { motion } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import OrbitScene from '../vectors/OrbitScene'
import { Arrow } from '../Header'
import { EASE, Icon, Section, SectionHead, type AnyIcon } from './ui'

const SEND: { label: string; icon: AnyIcon }[] = [
  { label: 'Your product list', icon: 'bill-roll' },
  { label: 'Preferred sizes', icon: 'stack' },
  { label: 'Quantities', icon: 'cat:takeaway' },
  { label: 'Delivery location', icon: 'use:delivery' },
]

/**
 * 12 · Contact Klen Plus (light). What to send, as four cards, a big Request a Quote button that
 * jumps to the form below, and every category orbiting into one quotation.
 */
export default function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title" className="!pb-10">
      <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <SectionHead id="contact-title" eyebrow="Contact Klen Plus" title="Tell Us What Your Business Needs" highlight="Your Business Needs">
            Send us your product list, preferred sizes, quantities and delivery location. Whether
            you’re stocking a new kitchen or replenishing an existing workplace, we’ll use those
            details to prepare a quotation for your team.
          </SectionHead>
          <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {SEND.map((s, i) => (
              <motion.li
                key={s.label}
                className="vx-host group rounded-2xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-1 hover:border-leaf"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
              >
                <span className="font-mono text-[11px] text-leaf-deep">{String(i + 1).padStart(2, '0')}</span>
                <VectorScene className="mt-1 w-12 transition group-hover:-rotate-6">
                  <Icon name={s.icon} delay={0.1 + i * 0.08} />
                </VectorScene>
                <p className="mt-2 font-display font-bold leading-tight">{s.label}</p>
              </motion.li>
            ))}
          </ul>
          <motion.a
            href="#quote"
            className="group mt-8 inline-flex items-center gap-3 rounded-full bg-leaf px-8 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_-18px_rgba(47,138,32,0.8)] transition hover:bg-leaf-deep"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.3 }}
          >
            Request a Quote <Arrow />
          </motion.a>
        </div>
        <motion.div
          className="mx-auto hidden w-full max-w-[400px] lg:block"
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <OrbitScene
            tone="light"
            icons={['tissue', 'aluminium', 'cups', 'chemicals', 'tools', 'ppe', 'bags', 'film']}
            center={
              <VectorScene>
                <Icon name="bill-roll" />
              </VectorScene>
            }
          />
        </motion.div>
      </div>
    </Section>
  )
}
