'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Arrow } from '../Header'
import { Photo, Reveal } from './sections'
import { TISSUE_IMG } from './content'

const EASE = [0.2, 0.7, 0.2, 1] as const
const EASE_OUT = [0.16, 1, 0.3, 1] as const

const HERO_IMAGE = '/media/catalogue/tissue.webp'

const THUMBS = [
  { src: TISSUE_IMG.facial, alt: 'Facial tissues' },
  { src: TISSUE_IMG.napkins, alt: 'Table napkins' },
  { src: TISSUE_IMG.towels, alt: 'Folded hand towels' },
  { src: TISSUE_IMG.toilet, alt: 'Toilet rolls' },
  { src: TISSUE_IMG.kitchen, alt: 'Kitchen rolls' },
]

/**
 * Full-height hero: the tissue still life fills the right of the screen and fades into the page on the
 * left (the top half on small screens), wiping in, zooming slowly and drifting with the scroll.
 * Headline, copy and buttons sit over the fade, with a strip of the five formats and two floating badges.
 */
export default function TissueHero() {
  const root = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const lift = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-svh items-center overflow-hidden bg-paper px-5 pb-16 pt-28 md:px-10"
    >
      {/* The still life */}
      <motion.div
        aria-hidden
        className="absolute end-0 top-0 h-[62svh] w-full lg:inset-y-0 lg:h-auto lg:w-[68%]"
        style={{ y: imgY, scale: imgScale }}
        initial={{ opacity: 0, clipPath: 'inset(0 0 0 100%)' }}
        animate={{ opacity: 1, clipPath: 'inset(0 0 0 0%)' }}
        transition={{ duration: 1.4, ease: EASE_OUT }}
      >
        <div className="hero-img-mask absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_IMAGE}
            alt=""
            fetchPriority="high"
            className="kenburns h-full w-full object-cover object-[60%_50%]"
          />
        </div>
      </motion.div>
      {/* Readability wash on the text side, and a soft floor into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgb(245_247_250)_0%,rgb(245_247_250/0.92)_36%,rgb(245_247_250/0)_60%)] lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,rgb(245_247_250),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -start-40 top-1/3 size-[520px] rounded-full bg-leaf/15 blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-[1260px] max-lg:mt-[40svh]">
        <motion.div className="max-w-[640px]" style={{ opacity: fade, y: lift }}>
          <motion.p
            className="label flex flex-wrap items-center gap-2.5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <span className="rounded-full bg-leaf-soft px-2.5 py-1 tracking-normal normal-case text-leaf-deep">
              Category 01
            </span>
            Tissue Paper &amp; Hygiene Supplies
          </motion.p>
          <h1 data-split="load" className="mt-5 text-[clamp(2.8rem,6.2vw,5.6rem)] font-extrabold leading-[0.92] tracking-[-0.045em]">
            <Reveal text="From the dining table to the washroom." accent="washroom." />
          </h1>
          <motion.p
            className="mt-6 max-w-[52ch] text-lg leading-relaxed text-slate"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
          >
            A café needs napkins that fit neatly into a takeaway bag. A hotel needs facial tissues for guest rooms
            and paper rolls that fit its washroom dispensers. At Klen+, we help you choose the right tissue format,
            pack size and carton quantity for each part of your business.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: EASE }}
          >
            <a
              href="#range"
              className="group flex items-center gap-2 rounded-xl bg-leaf px-6 py-4 font-semibold text-white shadow-[0_18px_40px_-18px_rgba(61,166,41,0.9)] transition hover:-translate-y-0.5 hover:bg-leaf-deep"
            >
              Explore the Range <Arrow />
            </a>
            <a
              href="#enquiry"
              className="rounded-xl border border-line bg-white/70 px-6 py-4 font-semibold backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
            >
              Request a Quote
            </a>
          </motion.div>

          {/* The five formats */}
          <motion.ul
            className="mt-10 flex items-center"
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 1.2 } } }}
          >
            {THUMBS.map((t, i) => (
              <motion.li
                key={t.src}
                className="-ms-3 first:ms-0"
                style={{ zIndex: THUMBS.length - i }}
                variants={{ hidden: { opacity: 0, x: -16, scale: 0.8 }, show: { opacity: 1, x: 0, scale: 1 } }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                <a
                  href="#range"
                  title={t.alt}
                  className="block size-14 overflow-hidden rounded-full shadow-[0_10px_24px_-12px_rgba(28,42,92,0.6)] ring-4 ring-paper transition hover:-translate-y-1 hover:scale-110"
                >
                  <Photo src={t.src} alt={t.alt} />
                </a>
              </motion.li>
            ))}
            <motion.li className="ms-4 text-sm leading-tight text-slate" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}>
              <span className="block font-display text-base font-bold text-ink">5 formats</span>
              one enquiry
            </motion.li>
          </motion.ul>
        </motion.div>
      </div>

      {/* Floating badges over the image */}
      <motion.div
        aria-hidden
        className="absolute end-[7%] top-[22%] hidden lg:block"
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1.4, type: 'spring', stiffness: 160, damping: 16 }}
      >
        <div
          className="vx-drift rounded-2xl bg-white/90 px-4 py-3 shadow-[0_20px_40px_-20px_rgba(28,42,92,0.5)] backdrop-blur"
          style={{ '--dur': '8s' } as React.CSSProperties}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate">Per carton</p>
          <p className="font-display text-lg font-bold">Pack count confirmed</p>
        </div>
      </motion.div>
      <motion.div
        aria-hidden
        className="absolute bottom-[16%] end-[28%] hidden lg:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: EASE }}
      >
        <div
          className="vx-drift flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-[0_20px_40px_-20px_rgba(28,42,92,0.8)]"
          style={{ '--d': '-4s', '--dur': '9s' } as React.CSSProperties}
        >
          <span className="grid size-5 place-items-center rounded-full bg-leaf text-[11px]">✓</span>
          Dispenser fit checked
        </div>
      </motion.div>

      <motion.a
        href="#range"
        aria-label="Scroll to the range"
        className="absolute bottom-6 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        Scroll
        <span className="relative h-10 w-px overflow-hidden bg-line">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-leaf"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.a>
    </section>
  )
}
