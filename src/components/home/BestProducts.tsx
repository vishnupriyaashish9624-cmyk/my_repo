'use client'

import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector, type ItemKey } from '../vectors/ItemVectors'
import { UseVector, type UseKey } from '../vectors/TissueVectors'
import ScrollDecor from '../vectors/ScrollDecor'
import Tilt3D, { Depth } from '../vectors/Tilt3D'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Three jobs a shift comes down to, and the products that go together for each. */
const JOBS: {
  n: string
  scene: UseKey
  photo: string
  tag: string
  title: string
  text: string
  pair: { icon: ItemKey; label: string }[]
}[] = [
  {
    n: '01',
    scene: 'delivery',
    photo: '/media/categories/containers.webp',
    tag: 'Pack',
    title: 'Pack meals to go',
    text: 'Choose a container that fits your portion and a kraft bag that fits the order.',
    pair: [
      { icon: 'rect-box', label: 'Container' },
      { icon: 'paper-bag', label: 'Kraft bag' },
    ],
  },
  {
    n: '02',
    scene: 'table',
    photo: '/media/categories/cups.webp',
    tag: 'Serve',
    title: 'Serve food and drinks',
    text: 'Pair cups with matching lids and round out each order with napkins and cutlery.',
    pair: [
      { icon: 'rippled', label: 'Cup' },
      { icon: 'dome-lid', label: 'Lid' },
      { icon: 'napkin', label: 'Napkins' },
      { icon: 'cutlery', label: 'Cutlery' },
    ],
  },
  {
    n: '03',
    scene: 'washroom',
    photo: '/media/categories/tissue.webp',
    tag: 'Care',
    title: 'Care for your space',
    text: 'Stock washrooms with tissues and hand wash, and keep cleaning tools ready for the next shift.',
    pair: [
      { icon: 'toilet', label: 'Tissue' },
      { icon: 'cat:hygiene', label: 'Hand wash' },
      { icon: 'mop', label: 'Tools' },
    ],
  },
]

/**
 * Where the set's products float around the stage (they lift off it in 3D). Kept off the top edge
 * so they never cover the intro paragraph above the stage.
 */
const ORBIT = [
  { className: 'top-[10%] -end-4 w-20', z: 80, rotate: -8 },
  { className: '-bottom-8 end-[8%] w-20', z: 110, rotate: 6 },
  { className: 'top-[48%] -end-4 w-16', z: 60, rotate: 10 },
  { className: '-bottom-6 end-[34%] w-16', z: 90, rotate: -4 },
]

const HEAD = ['Our', 'best', 'products']
const HIGHLIGHT = ['for', 'every', 'shift.']

/** Small screens: how long each job stays on the stage before the next one comes up (ms). */
const STEP_MS = 5500
/** Same as the `pin:` variant in globals.css: wide and tall enough to hold the showcase on screen. */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 720px)'
const N = JOBS.length

/**
 * "Our best products for every shift" (dark): the intro, then a showcase. Three large tabs on the
 * left (pack, serve, care) and a stage on the right that swaps in that job's photo, its scene
 * vector and the products that go together, listed as a set.
 * Large screens: the section pins and scrolling steps through the three jobs (the open tab's bar
 * fills with the scroll), then the page moves on; clicking a tab glides to its step.
 * Elsewhere the tabs advance on their own while in view; hovering pauses them.
 */
export default function BestProducts() {
  const root = useRef<HTMLElement>(null)
  const inView = useInView(root, { amount: 0.35 })
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  // Pinned mode: scroll position through the section picks the job.
  const [pinned, setPinned] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(PIN_QUERY)
    const on = () => setPinned(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (pinned) setActive(Math.min(N - 1, Math.max(0, Math.floor(p * N))))
  })
  /** How far through the open job's step the scroll is (0-1), for its progress bar. */
  const fill = useTransform(scrollYProgress, (p) => {
    const s = p * N
    return Math.min(1, Math.max(0, s - Math.min(N - 1, Math.floor(s))))
  })

  const running = inView && !paused && !pinned

  /** Open a job; when pinned, glide to the middle of its scroll step. */
  const pick = (i: number) => {
    const el = root.current
    if (!pinned || !el) return setActive(i)
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: top + (el.offsetHeight - window.innerHeight) * ((i + 0.5) / N),
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setActive((a) => (a + 1) % JOBS.length), STEP_MS)
    return () => clearTimeout(t)
  }, [running, active])

  const job = JOBS[active]

  return (
    <section
      ref={root}
      id="best-products"
      aria-labelledby="best-title"
      className="relative pin:h-[300svh]"
    >
      <div
        className="theme-dark relative overflow-hidden px-5 pb-20 pt-10 md:px-10 md:pb-28 md:pt-14 pin:sticky pin:top-0 pin:flex pin:h-svh pin:flex-col pin:justify-center pin:py-0 pin:pt-16"
        // Pinned: start just under the site header instead of centring, so there's no empty band on top.
        style={pinned ? { justifyContent: 'flex-start', paddingTop: 96 } : undefined}
      >
        <ScrollDecor
          spots={[
            {
              icon: 'cat:takeaway',
              className: 'end-[6%] top-[6%] w-20',
              speed: 1.2,
              spin: 14,
              disc: true,
            },
            {
              icon: 'sponge',
              className: 'start-[3%] bottom-[5%] w-14',
              speed: 1,
              spin: 12,
              disc: true,
            },
          ]}
        />

        <div className="relative mx-auto w-full max-w-[1840px]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div>
              <motion.p
                className="label !text-leaf"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                Our best products
              </motion.p>
              <motion.h2
                id="best-title"
                aria-label="Our best products for every shift."
                className="mt-3 text-[clamp(2.2rem,4.4vw,4.4rem)] font-bold leading-[0.95] tracking-[-0.035em]"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.6 }}
                transition={{ staggerChildren: 0.07 }}
              >
                {[...HEAD, ...HIGHLIGHT].map((w, i) => (
                  <span
                    key={i}
                    aria-hidden
                    className="inline-block overflow-hidden pb-[0.12em] align-top"
                  >
                    <motion.span
                      className={`inline-block ${i >= HEAD.length ? 'text-leaf' : ''}`}
                      variants={{
                        hidden: { y: '110%', rotate: 6 },
                        show: { y: '0%', rotate: 0, transition: { duration: 0.8, ease: EASE } },
                      }}
                    >
                      {w}
                    </motion.span>
                    {i === HEAD.length - 1 ? <br /> : '\u00a0'}
                  </span>
                ))}
              </motion.h2>
            </div>
            <motion.p
              className="max-w-xl text-lg text-white/70"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              At Klen Plus, we supply the everyday essentials that restaurants, hotels, caterers and
              commercial facilities count on. Whether you&apos;re packing a lunch order, setting a
              table or restocking a guest washroom, you&apos;ll find the sizes, materials and pack
              quantities that suit your business.
            </motion.p>
          </div>

          <div
            className="mt-14 grid items-stretch gap-6 pin:mt-8 lg:grid-cols-[minmax(320px,0.75fr)_1.6fr] xl:gap-10"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Tabs */}
            <motion.div
              role="tablist"
              aria-label="Jobs in a shift"
              className="relative flex flex-col gap-6 [perspective:1200px]"
              initial="away"
              whileInView="landed"
              viewport={{ once: true, amount: 0.3 }}
            >
              {JOBS.map((j, i) => {
                const on = i === active
                const last = i === JOBS.length - 1
                return (
                  <motion.div
                    key={j.n}
                    className="relative flex flex-1"
                    style={{ transformOrigin: '0% 50%' }}
                    variants={{
                      away: { opacity: 0, x: -280, y: -140, rotate: -16, rotateX: 40, scale: 0.7 },
                      landed: {
                        opacity: 1,
                        x: 0,
                        y: 0,
                        rotate: 0,
                        rotateX: 0,
                        scale: 1,
                        transition: {
                          type: 'spring',
                          stiffness: 110,
                          damping: 15,
                          mass: 0.9,
                          delay: 0.15 + i * 0.22,
                        },
                      },
                    }}
                  >
                    <motion.button
                      type="button"
                      role="tab"
                      id={`best-tab-${i}`}
                      aria-selected={on}
                      aria-controls="best-stage"
                      onClick={() => pick(i)}
                      className="group relative flex flex-1 items-center gap-5 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-start transition-colors duration-500 hover:bg-white/[0.06]"
                      whileHover={{ x: 6 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    >
                      {/* Highlight that slides between tabs */}
                      {on && (
                        <motion.span
                          layoutId="best-tab-bg"
                          aria-hidden
                          className="absolute inset-0 rounded-3xl border border-leaf/60 bg-white/[0.09] shadow-[0_24px_50px_-26px_rgba(108,207,47,0.6)]"
                          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                        />
                      )}
                      <motion.span
                        className={`relative font-display text-5xl font-extrabold leading-none tracking-[-0.05em] transition-colors duration-500 ${on ? 'text-leaf' : 'text-white/15 group-hover:text-white/30'}`}
                        animate={{ scale: on ? 1 : 0.82, rotate: on ? 0 : -6 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      >
                        {j.n}
                      </motion.span>
                      <span className="relative min-w-0 flex-1">
                        <span
                          className={`block font-mono text-[11px] font-semibold uppercase tracking-[0.16em] ${on ? 'text-leaf' : 'text-white/45'}`}
                        >
                          {j.tag}
                        </span>
                        <span
                          className={`mt-0.5 block font-display text-xl font-bold tracking-[-0.02em] transition-colors md:text-2xl ${on ? 'text-white' : 'text-white/60'}`}
                        >
                          {j.title}
                        </span>
                      </span>
                      <motion.span
                        aria-hidden
                        className={`relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-500 ${on ? 'bg-leaf text-ink' : 'bg-white/10 text-white/60'}`}
                        animate={{ rotate: on ? 0 : -45, scale: on ? 1.08 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="size-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 8h10M9 4l4 4-4 4" />
                        </svg>
                      </motion.span>
                      {/* Progress through this job: follows the scroll when pinned, else a timer */}
                      {on && pinned && (
                        <motion.span
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-1 origin-left bg-leaf"
                          style={{ scaleX: fill }}
                        />
                      )}
                      {on && !pinned && (
                        <motion.span
                          key={`bar-${active}-${running}`}
                          aria-hidden
                          className="absolute inset-x-0 bottom-0 h-1 origin-left bg-leaf"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: running ? 1 : 0 }}
                          transition={{ duration: running ? STEP_MS / 1000 : 0.3, ease: 'linear' }}
                        />
                      )}
                    </motion.button>

                    {/* Link down to the next card: green once the shift has moved past it */}
                    {!last && (
                      <span
                        aria-hidden
                        className="pointer-events-none absolute start-[46px] top-full z-10 h-6 w-1"
                      >
                        <motion.span
                          className={`absolute inset-x-0 inset-y-0 origin-top rounded-full transition-colors duration-700 ${i < active ? 'bg-leaf' : 'bg-white/20'}`}
                          initial={{ scaleY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.9 + i * 0.22, ease: EASE }}
                        />
                        <span className="absolute -top-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border-2 border-leaf bg-ink" />
                        <span className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rounded-full border-2 border-leaf bg-ink" />
                        {/* Pulse running down the link */}
                        <motion.span
                          className="absolute left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-leaf shadow-[0_0_10px_3px_rgba(108,207,47,0.8)]"
                          animate={{ top: ['0%', '100%'], opacity: [0, 1, 0] }}
                          transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 1.4 + i * 0.5,
                          }}
                        />
                      </span>
                    )}

                    {/* Beam from the open card across to the stage (wide screens) */}
                    {on && (
                      <motion.span
                        layoutId="best-beam"
                        aria-hidden
                        className="pointer-events-none absolute start-full top-1/2 z-10 hidden h-1 w-6 -translate-y-1/2 lg:block xl:w-10"
                        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                      >
                        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-leaf to-leaf/40" />
                        <span className="absolute -start-1 top-1/2 size-3 -translate-y-1/2 rounded-full bg-leaf ring-4 ring-leaf/25" />
                        <motion.span
                          className="absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_3px_rgba(108,207,47,0.9)]"
                          animate={{ left: ['0%', '100%'], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </motion.span>
                    )}
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Stage, tilting toward the pointer with the set's products floating in front */}
            <Tilt3D className="relative" max={6} enter={12}>
              <AnimatePresence mode="popLayout" initial={false}>
                {job.pair.map((p, k) => (
                  <Depth
                    key={`${active}-${p.label}`}
                    z={ORBIT[k % ORBIT.length].z}
                    className={`pointer-events-none absolute z-30 hidden md:block ${ORBIT[k % ORBIT.length].className}`}
                  >
                    <motion.div
                      initial={{
                        opacity: 0,
                        scale: 0.3,
                        rotate: ORBIT[k % ORBIT.length].rotate * 4,
                      }}
                      animate={{ opacity: 1, scale: 1, rotate: ORBIT[k % ORBIT.length].rotate }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                      transition={{
                        type: 'spring',
                        stiffness: 240,
                        damping: 15,
                        delay: 0.35 + k * 0.1,
                      }}
                    >
                      <motion.div
                        className="rounded-[22px] bg-white p-2 shadow-[0_24px_50px_-18px_rgba(0,0,0,0.65)] ring-4 ring-white/20"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4 + k, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <VectorScene drawn>
                          <ItemVector name={p.icon} delay={0.4 + k * 0.1} className="w-full" />
                        </VectorScene>
                      </motion.div>
                    </motion.div>
                  </Depth>
                ))}
              </AnimatePresence>
              <motion.div
                id="best-stage"
                role="tabpanel"
                aria-labelledby={`best-tab-${active}`}
                className="relative grid min-h-[460px] overflow-hidden rounded-[32px] bg-white text-ink shadow-[0_50px_100px_-40px_rgba(0,0,0,0.8)] md:grid-cols-[1.05fr_1fr]"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
              >
                {/* Photo */}
                <div className="relative min-h-[280px] overflow-hidden bg-mist">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={job.photo}
                      src={job.photo}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                      initial={{ clipPath: 'inset(0% 100% 0% 0% round 0px)', scale: 1.18 }}
                      animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.5 } }}
                      transition={{
                        clipPath: { duration: 0.9, ease: EASE },
                        scale: { duration: 1.6, ease: EASE },
                      }}
                    />
                  </AnimatePresence>
                  <motion.span
                    key={`sweep-${active}`}
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-leaf/50 to-transparent"
                    initial={{ left: '-10%', opacity: 1 }}
                    animate={{ left: '105%', opacity: 0 }}
                    transition={{ duration: 0.95, ease: EASE }}
                  />
                  {/* Scene vector badge */}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={job.scene}
                      className="absolute bottom-5 start-5 rounded-3xl bg-white/90 p-2 shadow-[0_20px_40px_-16px_rgba(28,42,92,0.5)] backdrop-blur"
                      initial={{ opacity: 0, y: 20, rotate: -8 }}
                      animate={{ opacity: 1, y: 0, rotate: -3 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.2 }}
                    >
                      <VectorScene drawn className="w-24">
                        <UseVector name={job.scene} className="w-full" />
                      </VectorScene>
                    </motion.div>
                  </AnimatePresence>
                  <span className="absolute end-5 top-5 rounded-full bg-ink/80 px-3 py-1 font-mono text-[11px] font-semibold tabular-nums text-white backdrop-blur">
                    {job.n} / {String(JOBS.length).padStart(2, '0')}
                  </span>
                </div>

                {/* The set */}
                <div className="relative flex flex-col p-7 md:p-9">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={job.n}
                      className="flex h-full flex-col"
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.45, ease: EASE }}
                    >
                      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-leaf-deep">
                        {job.tag} · the set
                      </p>
                      <h3 className="mt-2 text-3xl font-bold tracking-[-0.025em] text-ink">
                        {job.title}
                      </h3>
                      <p className="mt-2 text-slate">{job.text}</p>

                      <ul className="mt-6 flex flex-col gap-2.5">
                        {job.pair.map((p, k) => (
                          <motion.li
                            key={p.label}
                            className="vx-host flex items-center gap-4 rounded-2xl bg-paper px-3 py-2"
                            initial={{ opacity: 0, x: 40, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            whileHover={{ x: 6, backgroundColor: 'var(--color-leaf-soft)' }}
                            transition={{
                              type: 'spring',
                              stiffness: 260,
                              damping: 22,
                              delay: 0.2 + k * 0.09,
                            }}
                          >
                            <motion.span
                              className="grid size-12 shrink-0 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-line"
                              initial={{ scale: 0, rotate: -30 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{
                                type: 'spring',
                                stiffness: 380,
                                damping: 14,
                                delay: 0.3 + k * 0.09,
                              }}
                            >
                              <VectorScene drawn className="w-9">
                                <ItemVector
                                  name={p.icon}
                                  delay={0.2 + k * 0.08}
                                  className="w-full"
                                />
                              </VectorScene>
                            </motion.span>
                            <span className="font-display text-lg font-bold">{p.label}</span>
                            <span className="ms-auto font-mono text-[11px] text-slate/70">
                              {String(k + 1).padStart(2, '0')}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      <p className="mt-auto flex items-center gap-2 pt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-slate">
                        <span className="size-1.5 rounded-full bg-leaf" />
                        {job.pair.length} products · one order
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </Tilt3D>
          </div>
        </div>
      </div>
    </section>
  )
}
