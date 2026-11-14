'use client'

import { useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import type { Home } from '@/payload-types'
import { applyWindows, useFilmFrames } from '../film/useFilmFrames'
import { Arrow } from '../Header'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const Bubbles = dynamic(() => import('./Bubbles'), { ssr: false })

const FRAMES_LABEL = 'Klen Plus'

/**
 * Opening scroll film: frames from media/films/hero (bubbles until footage exists) with the headline
 * and CMS overlays timed over 4 screens of scroll. The intro sheet slides over its last screen.
 */
export default function Hero({
  content,
  primaryHref = '#catalogue',
}: {
  content: Home['hero']
  /** Where the primary button jumps to (the catalogue on the homepage). */
  primaryHref?: string
}) {
  const root = useRef<HTMLElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const progress = useRef(0)
  const { render, status } = useFilmFrames(canvas, 'hero', { priority: true })

  useGSAP(
    () => {
      const el = root.current!
      const update = (p: number) => {
        progress.current = p
        render(p)
        applyWindows(el, p)
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        if (counter.current) counter.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      }
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('.hero-title', { type: 'words', mask: 'words', wordsClass: 'word' })
        gsap
          .timeline({ defaults: { ease: 'expo.out' } })
          .from('.hero-eyebrow', { opacity: 0, y: 16, duration: 1 }, 0.2)
          .from(split.words, { yPercent: 120, duration: 1.4, stagger: 0.06 }, 0.3)
          .from('.hero-fade', { opacity: 0, y: 24, duration: 1.2, stagger: 0.1 }, 0.9)
        const st = ScrollTrigger.create({ trigger: el, start: 'top top', end: 'bottom bottom', onUpdate: (s) => update(s.progress), onRefresh: (s) => update(s.progress) })
        return () => {
          split.revert()
          st.kill()
        }
      })
      mm.add('(prefers-reduced-motion: reduce)', () => update(0))
    },
    { scope: root },
  )

  const [before, after] = content.highlight && content.title.includes(content.highlight) ? content.title.split(content.highlight) : [content.title, null]

  return (
    <section id="top" ref={root} className="relative min-h-svh bg-paper motion-safe:h-[400svh]">
      <div className="top-0 h-svh min-h-[600px] overflow-hidden motion-safe:sticky">
        <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
        <Bubbles progress={progress} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/10 via-45% to-paper/40" />

        <div className="relative mx-auto h-full max-w-[1260px] px-5 md:px-10">
          <div data-at="0,0.24" className="absolute inset-x-5 bottom-[11%] md:inset-x-10">
            <p className="hero-eyebrow label flex flex-wrap gap-x-3">{content.eyebrow}</p>
            <h1 className="hero-title mt-5 max-w-[11.5ch] text-[clamp(2.9rem,8.4vw,8rem)] font-bold leading-[0.9] tracking-[-0.04em]">
              {before}
              {after !== null && <em className="not-italic text-leaf">{content.highlight}</em>}
              {after}
            </h1>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
              <p className="hero-fade max-w-[46ch] text-lg text-slate">{content.text}</p>
              <div className="hero-fade flex flex-wrap gap-3">
                <a href={primaryHref} className="group flex items-center gap-2 rounded-xl bg-leaf px-5 py-3.5 font-semibold text-white transition hover:bg-leaf-deep">
                  {content.primary} <Arrow />
                </a>
                <a href="#quote" className="rounded-xl border border-line bg-white/70 px-5 py-3.5 font-semibold transition hover:bg-white">
                  {content.secondary}
                </a>
              </div>
            </div>
          </div>

          {content.overlays?.map((o) => (
            <div
              key={o.id ?? o.title}
              data-at={`${o.from},${o.until}`}
              // The hero footage builds the product group along the counter, so overlays use the wall above it.
              className={`invisible absolute inset-x-5 top-[17%] flex flex-col md:inset-x-10 ${o.align === 'end' ? 'items-end text-end' : 'items-start'}`}
            >
              {o.eyebrow && <p className="label !text-leaf-deep">{o.eyebrow}</p>}
              <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-[1] tracking-[-0.03em] md:text-7xl">{o.title}</h2>
              {o.text && <p className="mt-4 max-w-lg text-lg text-slate">{o.text}</p>}
            </div>
          ))}

          <div className="absolute inset-x-5 bottom-5 flex items-center gap-4 font-mono text-xs text-slate md:inset-x-10">
            <span className="text-ink">00</span>
            <span className="uppercase tracking-[0.14em]">{FRAMES_LABEL}</span>
            <div className="relative h-px flex-1 bg-line">
              <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-leaf" />
            </div>
            <span className="tabular-nums">
              <span ref={counter}>000</span>%
            </span>
          </div>
        </div>

        {status === 'missing' && process.env.NODE_ENV === 'development' && (
          <p className="absolute end-5 top-24 rounded-md border border-dashed border-note-line bg-note px-2.5 py-1.5 font-mono text-[11px] text-note-ink md:end-10">
            Awaiting footage · media-src/hero.mp4 → npm run frames
          </p>
        )}
      </div>
    </section>
  )
}
