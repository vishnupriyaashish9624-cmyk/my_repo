'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import ScrollDecor from '../vectors/ScrollDecor'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** What each moment of the day reaches for, shown as pins on the wave under the sky arc. */
const STOPS: { group: string; title: string; text: string; icons: [ItemKey, ItemKey] }[] = [
  {
    group: 'Hygiene',
    title: 'Morning prep',
    text: 'Gloves, hairnets and hand wash.',
    icons: ['glove-nitrile', 'hairnet'],
  },
  {
    group: 'Takeaway',
    title: 'Lunch service',
    text: 'Takeaway boxes, cups and lids.',
    icons: ['pet-glass', 'rect-box'],
  },
  {
    group: 'Consumables',
    title: 'Afternoon restock',
    text: 'Top up tissues, wraps and bags.',
    icons: ['maxi', 'carry-bag'],
  },
  {
    group: 'Tableware',
    title: 'Dinner service',
    text: 'Foil trays and cutlery for orders.',
    icons: ['platter', 'cutlery'],
  },
  {
    group: 'Cleaning',
    title: 'Closing clean',
    text: 'Mops, floor cleaner and bin liners.',
    icons: ['mop', 'bucket'],
  },
]

/** Green wave the pins sit on (1800x120 box, roughly the row's shape, stretched to fit): peaks under the
 * 1st/3rd/5th pins, troughs under the 2nd/4th. */
const WAVE =
  'M0 60 C90 60 90 20 180 20 C360 20 360 100 540 100 C720 100 720 20 900 20 C1080 20 1080 100 1260 100 C1440 100 1440 20 1620 20 C1710 20 1710 60 1800 60'

/** Same as the `pin:` variant in globals.css: wide and tall enough to hold the timeline on screen. */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 720px)'

/**
 * "A day in the back room": as you scroll, the section's tint shifts from day to night and a green
 * wave draws across five pins (what the kitchen reaches for at each point); the current pin lifts
 * and its dotted ring turns green.
 */
export default function BackRoomDay() {
  const root = useRef<HTMLElement>(null)
  // Large screens: the section pins and the day plays out over a stretch of scroll, then the page
  // moves on. Elsewhere it scrolls normally and plays as it passes.
  const pinned = useRef(false)
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY)
    const on = () => (pinned.current = mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const { scrollYProgress: passing } = useScroll({
    target: root,
    offset: ['start 70%', 'end 60%'],
  })
  const { scrollYProgress: held } = useScroll({ target: root, offset: ['start start', 'end end'] })
  // One progress value fed from whichever scroll range applies
  const scrollYProgress = useMotionValue(0)
  useMotionValueEvent(passing, 'change', (v) => {
    if (!pinned.current) scrollYProgress.set(v)
  })
  useMotionValueEvent(held, 'change', (v) => {
    if (pinned.current) scrollYProgress.set(v)
  })
  const [active, setActive] = useState(0)
  useMotionValueEvent(scrollYProgress, 'change', (p) =>
    setActive(Math.min(STOPS.length - 1, Math.max(0, Math.floor(p * STOPS.length)))),
  )

  const draw = useTransform(scrollYProgress, [0, 0.75], [0.1, 1])
  const sky = useTransform(
    scrollYProgress,
    // Starts on the About section's navy, brightens to day blue, then dusk and night
    [0, 0.2, 0.5, 0.85, 1],
    ['#1c2a5c', '#1c2a5c', '#2f4a96', '#3a3a78', '#141d45'],
  )

  return (
    <motion.section
      ref={root}
      id="day"
      aria-labelledby="day-title"
      className="relative pin:h-[320svh]"
    >
      <motion.div
        className="theme-dark relative overflow-hidden px-5 py-20 md:px-10 md:py-28 pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:py-0 pin:pt-16"
        style={{ backgroundColor: sky }}
      >
        <ScrollDecor
          spots={[
            {
              icon: 'cat:cups',
              className: 'end-[30%] top-[4%] w-20',
              speed: 1.1,
              spin: 12,
              disc: true,
            },
            {
              icon: 'sandwich',
              className: 'end-[42%] top-[9%] w-16',
              speed: 0.6,
              spin: -10,
              disc: true,
            },
            {
              icon: 'cat:takeaway',
              className: 'end-[4%] top-[2%] w-20',
              speed: 1.4,
              spin: 16,
              disc: true,
            },
          ]}
        />
        <div className="relative mx-auto w-full max-w-[1840px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <motion.p
                className="label !text-leaf"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                A day in the back room
              </motion.p>
              <motion.h2
                id="day-title"
                className="mt-3 text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                From first prep to last mop, <span className="text-leaf">one supplier.</span>
              </motion.h2>
            </div>
            <p className="max-w-md text-white/70">
              Every shift reaches for something different. Here&apos;s what a busy kitchen goes
              through in a day, all on one list.
            </p>
          </div>

          {/* What the kitchen reaches for: pins on a wave that draws in as you scroll */}
          <ol className="relative mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
            <svg
              aria-hidden
              viewBox="0 0 1800 120"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-x-0 top-[154px] hidden h-[120px] w-full lg:block"
            >
              <path
                d={WAVE}
                fill="none"
                stroke="rgb(255 255 255 / 0.12)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <motion.path
                d={WAVE}
                fill="none"
                stroke="var(--color-leaf)"
                strokeWidth="6"
                strokeLinecap="round"
                style={{ pathLength: draw }}
              />
              {/* Soft lights that keep travelling along the wave */}
              {[0, 1.6].map((delay) => (
                <path
                  key={delay}
                  d={WAVE}
                  pathLength={1}
                  fill="none"
                  stroke="#c9f7b8"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="wave-flow"
                  style={{ animationDelay: `${-delay}s` }}
                />
              ))}
            </svg>

            {STOPS.map((m, i) => {
              const on = i === active
              const passed = i <= active
              return (
                <motion.li
                  key={m.title}
                  className="relative flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
                >
                  {/* Pin: sits on a wave peak (1st, 3rd, 5th) or trough (2nd, 4th) */}
                  <div
                    className={`relative flex flex-col items-center lg:h-[274px] ${i % 2 ? 'lg:pt-20' : ''}`}
                  >
                    <motion.div
                      className="relative"
                      animate={{ y: on ? -8 : 0, scale: on ? 1.05 : 1 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      {/* Dotted ring over the top: left half white until reached, right half green */}
                      <svg
                        aria-hidden
                        viewBox="0 0 100 100"
                        className="wave-ring absolute -inset-5 h-[calc(100%+40px)] w-[calc(100%+40px)]"
                        style={{ animationDelay: `${-i * 0.9}s` }}
                      >
                        <path
                          d="M8 50 A42 42 0 0 1 50 8"
                          fill="none"
                          stroke={passed ? 'var(--color-leaf)' : 'rgb(255 255 255 / 0.9)'}
                          strokeWidth="2.4"
                          strokeDasharray="0.1 5"
                          strokeLinecap="round"
                          className="transition-[stroke] duration-500"
                        />
                        <path
                          d="M50 8 A42 42 0 0 1 92 50"
                          fill="none"
                          stroke="var(--color-leaf)"
                          strokeWidth="2.4"
                          strokeDasharray="0.1 5"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div
                        className={`relative grid size-[150px] place-items-center rounded-full bg-white shadow-[0_20px_40px_-18px_rgba(0,0,0,0.6)] transition duration-500 ${on ? 'ring-4 ring-leaf' : ''}`}
                      >
                        <div className="flex items-center gap-1">
                          {m.icons.map((icon, j) => (
                            <VectorScene key={icon} drawn className="w-[58px]">
                              <ItemVector name={icon} delay={0.1 + j * 0.15} className="w-full" />
                            </VectorScene>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                    {/* Pointer down to the wave */}
                    <span
                      aria-hidden
                      className="mt-[-2px] hidden h-6 w-7 bg-leaf [clip-path:polygon(0_0,100%_0,50%_100%)] lg:block"
                    />
                  </div>

                  <p className="mt-6 font-display text-2xl font-extrabold tracking-[-0.02em] text-leaf lg:mt-4">
                    {m.group}
                  </p>
                  <h3 className="mt-1 text-xl font-bold tracking-[-0.01em] text-white">
                    {m.title}
                  </h3>
                  <p className="mt-2 max-w-[22ch] text-white/80">{m.text}</p>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </motion.div>
    </motion.section>
  )
}
