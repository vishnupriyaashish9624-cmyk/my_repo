'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import type { Home } from '@/payload-types'
import { applyWindows, useFilmFrames } from '../film/useFilmFrames'
import { Arrow } from '../Header'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

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
        {/* Blue tint over the footage, deeper behind the headline on the right so the text stays readable */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[rgb(70_120_200/0.38)] mix-blend-multiply" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-l from-[rgb(214_228_247/0.75)] via-[rgb(214_228_247/0.25)] via-45% to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/10 via-45% to-paper/40" />

        <div className="relative mx-auto h-full max-w-[1260px] px-5 md:px-10">
          <div data-at="0,0.24" className="absolute inset-x-5 bottom-[11%] md:inset-x-10">
            <p className="hero-eyebrow label flex w-fit flex-wrap gap-x-3 rounded-full border border-white/70 bg-white/85 px-4 py-2 !text-[13px] !font-semibold !tracking-[0.12em] !text-ink shadow-[0_8px_24px_-12px_rgba(28,42,92,0.45)] backdrop-blur md:!text-sm">{content.eyebrow}</p>
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
              {o.eyebrow && <p className="label !text-leaf-deep [-webkit-text-stroke:3px_white] [paint-order:stroke_fill]">{o.eyebrow}</p>}
              <h2 className="mt-3 max-w-3xl text-4xl font-bold leading-[1] tracking-[-0.03em] md:text-7xl">{o.title}</h2>
              {o.text && (
                // Off-white letters with a navy outline (stroke painted behind the fill so the letters stay full)
                <p className="mt-4 max-w-lg text-lg font-normal text-[#f6f3ea] [-webkit-text-stroke:2px_var(--color-navy)] [paint-order:stroke_fill]">
                  {o.text}
                </p>
              )}
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
