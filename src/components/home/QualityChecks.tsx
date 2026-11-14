'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import Tilt3D, { Depth } from '../vectors/Tilt3D'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** The checks an order goes through, each restating how ordering works on this site. */
const CHECKS: { title: string; text: string; icon: ItemKey }[] = [
  {
    title: 'Matched line by line',
    text: 'Every line on your list is matched to an exact product: size, colour and pack.',
    icon: 'bill-roll',
  },
  {
    title: 'Stock confirmed',
    text: 'We confirm what is on the shelf before we send your quote.',
    icon: 'stack',
  },
  {
    title: 'Cartons match the quote',
    text: 'Carton and bundle packs are on every product, so what arrives is what you were quoted.',
    icon: 'cat:takeaway',
  },
  {
    title: 'Delivery day agreed',
    text: 'Nothing ships until the delivery day is confirmed with you.',
    icon: 'zip-pouch',
  },
]
const N = CHECKS.length

/**
 * "Our approach to quality checks": a clipboard on a 3D tilt whose rows tick off one by one as the
 * section scrolls (pen-drawn check marks), a magnifier sweeping across a carton, and four check cards
 * whose vectors light up in step. Copy only restates the ordering process the site already describes.
 */
export default function QualityChecks() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start 70%', 'end 70%'] })
  const [done, setDone] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) =>
    setDone(Math.min(N, Math.floor(p * (N + 0.6)))),
  )

  return (
    <section
      ref={root}
      id="quality"
      aria-labelledby="quality-title"
      className="theme-light relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28"
    >
      <ScrollDecor
        spots={[
          { icon: 'glove-latex', className: 'start-[44%] top-[2%] w-16', speed: 1.1, spin: 12 },
          { icon: 'disinfect', className: 'end-[3%] bottom-[6%] w-16', speed: 0.8, spin: -12 },
        ]}
      />
      <div className="relative mx-auto grid max-w-[1840px] items-center gap-14 lg:grid-cols-[1fr_1.2fr]">
        {/* Clipboard */}
        <Tilt3D className="relative mx-auto w-full max-w-[520px]" max={9} enter={14}>
          <div className="relative rounded-[28px] bg-[#c99c5c] p-4 shadow-[0_40px_80px_-30px_rgba(28,42,92,0.55)]">
            <div className="absolute left-1/2 top-0 h-8 w-32 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-ink shadow-md" />
            <div className="rounded-[20px] bg-white p-6 pt-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
                Order check · before dispatch
              </p>
              <ul className="mt-4 flex flex-col gap-3">
                {CHECKS.map((c, i) => {
                  const on = i < done
                  return (
                    <li
                      key={c.title}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-500 ${on ? 'bg-leaf-soft' : 'bg-paper'}`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-lg border-2 transition-colors duration-500 ${on ? 'border-leaf bg-leaf' : 'border-line bg-white'}`}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="size-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <motion.path
                            d="M3.5 8.5l3 3 6-7"
                            initial={false}
                            animate={{ pathLength: on ? 1 : 0 }}
                            transition={{ duration: 0.4, ease: EASE }}
                          />
                        </svg>
                      </span>
                      <span
                        className={`font-display text-[17px] font-bold transition-colors ${on ? 'text-ink' : 'text-slate/70'}`}
                      >
                        {c.title}
                      </span>
                      <motion.span
                        className="ms-auto font-mono text-[11px] text-leaf-deep"
                        initial={false}
                        animate={{ opacity: on ? 1 : 0, x: on ? 0 : 8 }}
                        transition={{ duration: 0.4 }}
                      >
                        OK
                      </motion.span>
                    </li>
                  )
                })}
              </ul>
              {/* Stamp once everything is ticked */}
              <motion.div
                className="mt-5 flex items-center justify-between rounded-xl border-2 border-dashed border-leaf px-4 py-3"
                initial={false}
                animate={{
                  opacity: done >= N ? 1 : 0.25,
                  scale: done >= N ? 1 : 0.96,
                  rotate: done >= N ? -2 : 0,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <span className="font-display text-lg font-extrabold uppercase tracking-[0.06em] text-leaf-deep">
                  Ready to ship
                </span>
                <span className="font-mono text-xs text-slate">
                  {done}/{N} checks
                </span>
              </motion.div>
            </div>
          </div>
          {/* Magnifier scanning a carton, floating in front */}
          <Depth z={110} className="absolute -end-10 -bottom-12 w-40">
            <div className="relative">
              <VectorScene drawn>
                <ItemVector name="cat:takeaway" className="w-full" />
              </VectorScene>
              <svg viewBox="0 0 60 60" className="qc-scan absolute left-0 top-2 w-16" aria-hidden>
                <circle
                  cx="24"
                  cy="24"
                  r="16"
                  fill="rgb(214 228 247 / 0.45)"
                  stroke="#1c2a5c"
                  strokeWidth="4"
                />
                <path d="M36 36 L54 54" stroke="#1c2a5c" strokeWidth="6" strokeLinecap="round" />
                <path
                  d="M16 18 q6 -6 12 -2"
                  stroke="#fff"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </Depth>
        </Tilt3D>

        <div>
          <motion.h2
            id="quality-title"
            className="text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            Checked against your list, <span className="text-leaf">before it leaves.</span>
          </motion.h2>
          <p className="mt-5 max-w-xl text-slate">
            Four checks between your list and your back door, so the cartons that arrive are the
            ones you were quoted.
          </p>
          <ol className="mt-8 grid gap-3 sm:grid-cols-2">
            {CHECKS.map((c, i) => {
              const on = i < done
              return (
                <motion.li
                  key={c.title}
                  className={`vx-host flex gap-4 rounded-2xl border bg-white p-4 transition duration-500 ${on ? 'border-leaf shadow-[0_20px_40px_-26px_rgba(47,138,32,0.6)]' : 'border-line'}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                >
                  <VectorScene className="w-16 shrink-0">
                    <ItemVector name={c.icon} delay={0.15 + i * 0.1} className="w-full" />
                  </VectorScene>
                  <div>
                    <p className="font-mono text-[11px] text-leaf-deep">
                      CHECK {String(i + 1).padStart(2, '0')}
                    </p>
                    <p className="font-display text-lg font-bold leading-tight">{c.title}</p>
                    <p className="mt-1 text-sm text-slate">{c.text}</p>
                  </div>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
