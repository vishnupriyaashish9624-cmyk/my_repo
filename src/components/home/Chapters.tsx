'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { VectorScene } from '../vectors/CategoryVector'
import { ItemVector } from '../vectors/ItemVectors'
import { CHAPTERS, chapterId, type Chapter } from '@/lib/chapters'
const pad = (n: number) => String(n).padStart(2, '0')

const EASE = [0.2, 0.7, 0.2, 1] as const

/**
 * Chapter band that opens each group of sections: a big outlined number fills in, the title rises,
 * the chapter's vector draws in, and a hairline sweeps across. Matches the theme of what follows.
 */
export function ChapterMark({
  n,
  tone = 'light',
  chapters = CHAPTERS,
  prefix,
}: {
  n: number
  tone?: 'light' | 'dark'
  /** Chapter list for this page (homepage by default). */
  chapters?: Chapter[]
  /** Anchor id prefix, e.g. "about" → #about-03. */
  prefix?: string
}) {
  const ch = chapters[n - 1]
  const dark = tone === 'dark'
  return (
    <div
      id={chapterId(n, prefix)}
      className={`${dark ? 'theme-dark' : 'theme-light'} relative scroll-mt-20 overflow-hidden px-5 pb-4 pt-8 md:px-10 md:pt-10`}
    >
      <div className="relative mx-auto flex max-w-[1840px] items-end gap-5 md:gap-8">
        <motion.span
          aria-hidden
          className="chapter-num font-display text-[clamp(4rem,9vw,8.5rem)] font-extrabold leading-[0.8] tracking-[-0.06em]"
          style={{
            WebkitTextStroke: `2px ${dark ? 'rgb(255 255 255 / 0.5)' : 'var(--color-navy)'}`,
          }}
          initial={{ opacity: 0, y: 40, backgroundSize: '100% 0%' }}
          whileInView={{ opacity: 1, y: 0, backgroundSize: '100% 100%' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {pad(n)}
        </motion.span>
        <div className="min-w-0 flex-1 pb-1">
          <motion.p
            className={`font-mono text-xs uppercase tracking-[0.16em] ${dark ? 'text-leaf' : 'text-leaf-deep'}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            Section {pad(n)} / {pad(chapters.length)}
          </motion.p>
          <motion.p
            className={`mt-1 font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-bold uppercase leading-none tracking-[-0.01em] ${dark ? 'text-white' : 'text-ink'}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          >
            {ch.title}
          </motion.p>
        </div>
        <motion.div
          className={`hidden shrink-0 rounded-full p-1.5 sm:block ${dark ? 'bg-white' : 'bg-white shadow-[0_14px_30px_-16px_rgba(28,42,92,0.45)]'}`}
          initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.2 }}
        >
          <div className="vx-drift w-16 md:w-20">
            <VectorScene>
              <ItemVector name={ch.icon} delay={0.3} className="w-full" />
            </VectorScene>
          </div>
        </motion.div>
      </div>
      <motion.div
        aria-hidden
        className={`relative mx-auto mt-6 h-px max-w-[1840px] origin-left ${dark ? 'bg-white/20' : 'bg-line'}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <span className="absolute -top-1 start-0 size-2.5 rounded-full bg-leaf" />
      </motion.div>
    </div>
  )
}

/**
 * Side index (wide screens): one dot per chapter, the current one filled and labelled; hovering shows
 * every label; clicking jumps to the chapter. Current chapter = the last band scrolled past.
 */
export function ChapterNav({
  chapters = CHAPTERS,
  prefix,
}: { chapters?: Chapter[]; prefix?: string } = {}) {
  const [current, setCurrent] = useState(1)
  // Step out of the way once the footer is on screen.
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      let c = 1
      for (const ch of chapters) {
        const el = document.getElementById(chapterId(ch.n, prefix))
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) c = ch.n
      }
      setCurrent(c)
      const footer = document.getElementById('site-footer')
      setHidden(!!footer && footer.getBoundingClientRect().top < window.innerHeight * 0.7)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [chapters, prefix])

  return (
    <nav
      aria-label="Page sections"
      className={`group/nav fixed end-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1.5 transition-opacity duration-500 xl:flex ${hidden ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
    >
      {chapters.map((ch) => {
        const on = ch.n === current
        return (
          <a
            key={ch.n}
            href={`#${chapterId(ch.n, prefix)}`}
            className="flex items-center justify-end gap-2"
            aria-current={on ? 'true' : undefined}
          >
            <span
              className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm backdrop-blur transition duration-300 ${
                on
                  ? 'bg-ink text-white opacity-100'
                  : 'bg-white/85 text-ink opacity-0 group-hover/nav:opacity-100'
              }`}
            >
              {pad(ch.n)} · {ch.title}
            </span>
            <span
              className={`grid size-3 place-items-center rounded-full border-2 transition ${on ? 'scale-125 border-leaf bg-leaf' : 'border-slate/50 bg-white/70'}`}
            />
          </a>
        )
      })}
    </nav>
  )
}
