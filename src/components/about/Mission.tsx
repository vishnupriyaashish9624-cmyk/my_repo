'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { EASE, Icon, Tick, type AnyIcon } from './ui'

type Side = {
  key: 'mission' | 'vision'
  tab: string
  when: string
  title: ReactNode
  statement: ReactNode
  points: { label: string; text: string; icon: AnyIcon }[]
  circles: { title: string; text: string; icon: LineIconName }[]
}

const SIDES: Side[] = [
  {
    key: 'mission',
    tab: 'Our Mission',
    when: 'Today',
    title: (
      <>
        Simplify everyday <span className="text-leaf">sourcing.</span>
      </>
    ),
    statement:
      'To simplify everyday product sourcing by bringing packaging, hygiene and cleaning essentials together with practical product information and attentive communication.',
    points: [
      { label: 'Together', text: 'Packaging, hygiene and cleaning in one place', icon: 'use:storeroom' },
      { label: 'Practical', text: 'Product information that helps you choose', icon: 'cat:takeaway' },
      { label: 'Attentive', text: 'Communication you can count on', icon: 'use:counter' },
    ],
    circles: [
      { title: 'One Connected Range', text: 'Packaging, hygiene and cleaning products brought together.', icon: 'boxes' },
      { title: 'Simpler Product Selection', text: 'Explore products by category, application and requirements.', icon: 'clipboard' },
      { title: 'Clearer Order Planning', text: 'Discuss quantities, packing formats and delivery arrangements.', icon: 'truck' },
    ],
  },
  {
    key: 'vision',
    tab: 'Our Vision',
    when: 'Tomorrow',
    title: (
      <>
        A trusted supply <span className="text-leaf">partner.</span>
      </>
    ),
    statement:
      'To become a trusted supply partner for businesses, supporting their changing requirements through a connected product range and lasting relationships.',
    points: [
      { label: 'Trusted', text: 'A supply partner businesses rely on', icon: 'use:kitchen' },
      { label: 'Connected', text: 'One range that grows with your needs', icon: 'stack' },
      { label: 'Lasting', text: 'Relationships built order after order', icon: 'use:delivery' },
    ],
    circles: [
      { title: 'Trusted Supply Partner', text: 'A partner businesses can rely on, order after order.', icon: 'shield' },
      { title: 'Changing Requirements', text: 'Supporting your needs as your business grows and changes.', icon: 'growth' },
      { title: 'Lasting Relationships', text: 'Built on a connected range and attentive service.', icon: 'handshake' },
    ],
  },
]

/** Rising bubbles and leaf sparks in the background (fixed spots so server and client match). */
const BUBBLES = [
  { x: '6%', s: 14, d: 0, t: 14 },
  { x: '18%', s: 8, d: 5, t: 11 },
  { x: '31%', s: 18, d: 2, t: 17 },
  { x: '47%', s: 10, d: 8, t: 13 },
  { x: '58%', s: 6, d: 1, t: 10 },
  { x: '71%', s: 16, d: 10, t: 16 },
  { x: '84%', s: 9, d: 4, t: 12 },
  { x: '94%', s: 12, d: 7, t: 15 },
]
const SPARKS = [
  { x: '42%', y: '18%', d: 0 },
  { x: '52%', y: '72%', d: 1.2 },
  { x: '88%', y: '86%', d: 2.1 },
  { x: '12%', y: '92%', d: 0.7 },
  { x: '64%', y: '8%', d: 1.7 },
]

/** Where the three circles sit around the Klen Plus centre (A top, B left, C right). */
const ORBIT = [
  { letter: 'A', x: '50%', y: '25%' },
  { letter: 'B', x: '23%', y: '66%' },
  { letter: 'C', x: '77%', y: '66%' },
]

type LineIconName = 'boxes' | 'clipboard' | 'truck' | 'shield' | 'growth' | 'handshake'

/** White line icons for the circles; each draws itself in. */
function LineIcon({ name }: { name: LineIconName }) {
  const d: Record<LineIconName, string[]> = {
    boxes: ['M12 6h14v12H12z', 'M4 18h14v12H4z', 'M18 18h14v12H18z', 'M17 6v5M8 18v5M23 18v5'],
    clipboard: ['M9 6h18v26H9z', 'M14 3h8v6h-8z', 'M13 15l2 2 3-3M20 16h4', 'M13 23l2 2 3-3M20 24h4'],
    truck: ['M2 9h19v15H2z', 'M21 14h7l5 5v5H21z', 'M8 29a3 3 0 1 0 0.01 0M27 29a3 3 0 1 0 0.01 0', 'M7 16l3 3 6-6'],
    shield: ['M18 3l12 5v9c0 8-5 13-12 16C11 30 6 25 6 17V8z', 'M12 17l4 4 8-8'],
    growth: ['M4 30h28', 'M8 26V18M15 26V13M22 26V16M29 26V8', 'M6 14l8-6 6 4 10-8', 'M25 4h5v5'],
    handshake: ['M3 14l6-5 6 3 5-3 5 2 8 3', 'M3 14l8 9c2 2 4 2 6 0l3-3', 'M33 17l-7 8c-2 2-4 2-6 0', 'M15 12l-4 5c-1 2 2 4 4 2l4-4'],
  }
  return (
    <svg viewBox="0 0 36 36" className="w-full" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {d[name].map((path, i) => (
        <motion.path
          key={path}
          d={path}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.12, ease: EASE }}
        />
      ))}
    </svg>
  )
}

/**
 * 04 · Our mission & vision, in the homepage's language (royal blue, white vector tiles, a 3D photo
 * stack) but its own layout. A Mission / Vision switch (auto-swapping, click to choose) changes the
 * headline, the statement and three key ideas on the left; on the right the photo for the active side
 * flips to the front of a tilting stack, with product badges floating in front and a today → tomorrow dial.
 */
export default function MissionVision() {
  const reduce = useReducedMotion()
  const [a, setA] = useState(0)
  const [hold, setHold] = useState(false)
  useEffect(() => {
    if (reduce || hold) return
    const t = setInterval(() => setA((v) => (v + 1) % SIDES.length), 6500)
    return () => clearInterval(t)
  }, [reduce, hold, a])
  const s = SIDES[a]
  // Which of the three idea cards is lit (cycles faster than the tab swap)
  const [p, setP] = useState(0)
  useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setP((v) => (v + 1) % 3), 1800)
    return () => clearInterval(t)
  }, [reduce])

  return (
    <section
      id="mission"
      aria-labelledby="mission-title"
      className="theme-dark relative overflow-hidden px-5 pb-20 pt-8 md:px-10 md:pb-28"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
    >
      {/* Rising bubbles and twinkling sparks behind everything */}
      {!reduce && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {BUBBLES.map((b, i) => (
            <motion.span
              key={i}
              className="absolute bottom-[-30px] rounded-full border border-white/20 bg-white/[0.06]"
              style={{ left: b.x, width: b.s, height: b.s }}
              animate={{ y: [0, -900], opacity: [0, 0.8, 0] }}
              transition={{ duration: b.t, repeat: Infinity, delay: b.d, ease: 'linear' }}
            />
          ))}
          {SPARKS.map((k, i) => (
            <motion.span
              key={`s${i}`}
              className="absolute size-1.5 rounded-full bg-leaf"
              style={{ left: k.x, top: k.y }}
              animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, delay: k.d, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}


      <div className="relative mx-auto grid max-w-[1840px] items-center gap-14 lg:grid-cols-[1fr_1.05fr] xl:gap-20">
        {/* ── Words ── */}
        <div>
          <motion.p
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-leaf"
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="h-px w-7 bg-leaf" />
            What drives us
          </motion.p>
          <h2 id="mission-title" className="mt-3 text-[clamp(2.2rem,4.2vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.035em]">
            {['Built', 'Around', 'Everyday', 'Business', 'Needs.'].map((w, i) => (
              <span key={w} className="word-mask inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className={`inline-block ${i >= 3 ? 'text-leaf' : ''}`}
                  initial={{ y: '115%', rotate: 4 }}
                  whileInView={{ y: 0, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: EASE }}
                >
                  {w}
                  {i < 4 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </h2>

          {/* Switch */}
          <div role="tablist" aria-label="Mission and vision" className="mt-9 inline-flex rounded-full border border-white/20 bg-white/[0.08] p-1 backdrop-blur">
            {SIDES.map((x, i) => (
              <button
                key={x.key}
                role="tab"
                aria-selected={a === i}
                onClick={() => setA(i)}
                className={`relative rounded-full px-6 py-3 text-sm font-semibold transition ${a === i ? 'text-ink' : 'text-white/70 hover:text-white'}`}
              >
                {a === i && (
                  <motion.span layoutId="mv-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: 'spring', stiffness: 320, damping: 28 }} />
                )}
                <span className="relative flex items-center gap-2">
                  <span className={`font-mono text-[10px] ${a === i ? 'text-leaf-deep' : 'text-white/50'}`}>0{i + 1}</span>
                  {x.tab}
                </span>
                {a === i && !hold && !reduce && (
                  <motion.span
                    key={`bar-${a}`}
                    aria-hidden
                    className="absolute inset-x-5 bottom-1 h-0.5 origin-left rounded-full bg-leaf"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6.5, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Active side */}
          <div className="relative mt-8 min-h-[380px]" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                transition={{ duration: 0.55, ease: EASE }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">
                  {s.tab} · {s.when}
                </p>
                <h3 className="relative mt-2 inline-block font-display text-[clamp(1.8rem,2.8vw,2.8rem)] font-bold leading-tight tracking-[-0.03em]">
                  {s.title}
                  {/* Hand-drawn underline under the headline (mission only) */}
                  {s.key === 'mission' && (
                  <svg viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-2 end-0 h-3 w-[42%] text-leaf" aria-hidden>
                    <motion.path
                      d="M3 8 C70 2 150 11 297 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
                    />
                  </svg>
                  )}
                </h3>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">{s.statement}</p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-3">
                  {s.points.map((pt, j) => {
                    const lit = p === j && !reduce
                    return (
                      <motion.li
                        key={pt.label}
                        className={`vx-host group relative overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-leaf hover:bg-white/[0.12] ${
                          lit ? '-translate-y-1 border-leaf bg-white/[0.12] shadow-[0_20px_40px_-24px_rgba(61,166,41,0.8)]' : 'border-white/15 bg-white/[0.07]'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 + j * 0.08, ease: EASE }}
                      >
                        {/* Fill that sweeps across the lit card */}
                        {lit && (
                          <motion.span
                            key={`f-${p}`}
                            aria-hidden
                            className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-leaf"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1.8, ease: 'linear' }}
                          />
                        )}
                        <motion.span
                          className="block w-14"
                          animate={lit ? { y: [0, -6, 0], rotate: [0, -6, 0] } : { y: 0, rotate: 0 }}
                          transition={{ duration: 0.9, ease: 'easeInOut' }}
                        >
                          <VectorScene className="w-14 rounded-xl bg-white p-1 transition group-hover:-rotate-6">
                            <Icon name={pt.icon} delay={0.25 + j * 0.1} />
                          </VectorScene>
                        </motion.span>
                        <p className="mt-3 flex items-center gap-1.5 font-display text-lg font-bold leading-tight">
                          <motion.span
                            className="grid size-4 place-items-center rounded-full bg-leaf"
                            animate={lit ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Tick className="size-2.5" />
                          </motion.span>
                          {pt.label}
                        </p>
                        <p className="mt-1 text-sm text-white/65">{pt.text}</p>
                      </motion.li>
                    )
                  })}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Three circles around Klen Plus ── */}
        <div className="relative mx-auto aspect-square w-full max-w-[680px]">
          {/* Orbit rings and riding dots */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <motion.div
              className="absolute inset-[2%] rounded-full border-2 border-dotted border-white/20"
              animate={reduce ? undefined : { rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              {[
                ['14.6%', '14.6%'],
                ['85.4%', '14.6%'],
                ['50%', '100%'],
              ].map(([l, t]) => (
                <span
                  key={l + t}
                  className="absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf shadow-[0_0_14px_3px_rgb(61_166_41/0.55)]"
                  style={{ left: l, top: t }}
                />
              ))}
            </motion.div>
            <motion.div
              className="absolute inset-[12%] rounded-full border border-white/10"
              animate={reduce ? undefined : { rotate: -360 }}
              transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
            >
              <span className="absolute left-1/2 top-0 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            </motion.div>
            <div className="absolute inset-[22%] rounded-full bg-[#1f45b8]/25 blur-3xl" />
          </div>

          {/* Outer circles */}
          {ORBIT.map((pos, j) => {
            const c = s.circles[j]
            const lit = p === j && !reduce
            return (
              <motion.div
                key={pos.letter}
                className="absolute aspect-square w-[44%] -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.x, top: pos.y }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.3 + j * 0.15 }}
              >
                <motion.div
                  className="relative flex size-full flex-col items-center overflow-hidden rounded-full border-2 text-center text-white"
                  style={{ background: 'radial-gradient(circle at 50% 28%, #1c2f72 0%, #142459 55%, #0c1740 100%)' }}
                  animate={{
                    scale: lit ? 1.05 : 1,
                    borderColor: lit ? 'rgb(61 166 41 / 1)' : 'rgb(96 140 255 / 0.35)',
                    boxShadow: lit
                      ? '0 0 0 6px rgb(61 166 41 / 0.18), 0 30px 60px -20px rgba(5,15,60,0.9)'
                      : '0 0 0 0px rgb(61 166 41 / 0), 0 30px 60px -24px rgba(5,15,60,0.85)',
                  }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-[12%] top-[6%] h-1/3 rounded-full bg-white/10 blur-xl" />
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${s.key}-${j}`}
                      className="relative flex flex-1 flex-col items-center justify-center px-[13%] pt-[6%]"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, delay: j * 0.06, ease: EASE }}
                    >
                      <motion.span
                        className="block w-[26%] text-white"
                        animate={lit ? { y: [0, -5, 0], rotate: [0, -6, 0] } : { y: 0, rotate: 0 }}
                        transition={{ duration: 0.9, ease: 'easeInOut' }}
                      >
                        <LineIcon name={c.icon} />
                      </motion.span>
                      <p className="mt-[5%] font-display text-[clamp(0.9rem,1.35vw,1.35rem)] font-bold leading-tight">{c.title}</p>
                      <p className="mt-[3%] text-[clamp(0.68rem,0.9vw,0.92rem)] leading-snug text-white/80">{c.text}</p>
                    </motion.div>
                  </AnimatePresence>
                  <span
                    className={`relative grid h-[22%] w-full place-items-center border-t font-display text-[clamp(1.4rem,2.6vw,2.6rem)] font-extrabold transition-colors duration-500 ${
                      lit ? 'border-leaf/60 bg-leaf/90' : 'border-white/15 bg-[#0a1438]/80'
                    }`}
                  >
                    {pos.letter}
                  </span>
                </motion.div>
              </motion.div>
            )
          })}

          {/* Centre: Klen Plus */}
          <motion.div
            className="absolute left-1/2 top-[58%] z-10 aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.3, rotate: -60 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 170, damping: 14, delay: 0.1 }}
          >
            {!reduce &&
              [0, 1].map((k) => (
                <motion.span
                  key={k}
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-leaf"
                  animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, delay: k * 1.3, ease: 'easeOut' }}
                />
              ))}
            <div className="relative grid size-full place-items-center rounded-full bg-white text-center shadow-[0_30px_60px_-16px_rgba(5,15,60,0.9)] ring-[6px] ring-leaf">
              {/* Turning arc */}
              <motion.svg
                aria-hidden
                viewBox="0 0 100 100"
                className="absolute -inset-[7%] size-[114%]"
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <circle cx="50" cy="50" r="48" fill="none" stroke="var(--color-leaf)" strokeWidth="2.5" strokeDasharray="40 262" strokeLinecap="round" />
              </motion.svg>
              <div>
                <svg viewBox="0 0 60 16" className="mx-auto w-[42%] text-leaf" aria-hidden>
                  <path d="M4 14 C18 2 40 0 56 6 C40 4 24 7 4 14 Z" fill="currentColor" />
                </svg>
                <p className="font-display text-[clamp(1.1rem,2.1vw,2.1rem)] font-extrabold leading-none tracking-[-0.03em] text-[#1b3a8f]">Klen Plus</p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={s.key}
                    className="mt-[8%] font-mono text-[clamp(0.6rem,0.85vw,0.85rem)] font-semibold uppercase leading-tight tracking-[0.16em] text-ink"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    {s.tab.split(' ')[0]}
                    <br />
                    {s.tab.split(' ')[1]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
            {/* Joints where the circles meet the centre */}
            {['left-1/2 top-0 -translate-x-1/2 -translate-y-1/2', 'left-[8%] top-[78%] -translate-x-1/2 -translate-y-1/2', 'left-[92%] top-[78%] -translate-x-1/2 -translate-y-1/2'].map((c, k) => (
              <span key={k} aria-hidden className={`absolute size-[9%] rounded-full border-2 border-white bg-leaf ${c}`}>
                {!reduce && p === k && (
                  <motion.span
                    className="absolute inset-0 rounded-full bg-leaf"
                    animate={{ scale: [1, 2.4], opacity: [0.7, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
