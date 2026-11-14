'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CategoryWithCount } from '@/lib/cms'
import { applyWindows, coverRect, useFilmFrames } from '../film/useFilmFrames'
import { Arrow } from '../Header'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const giantSize = (text: string) =>
  text.length <= 5 ? 'clamp(5rem,17vw,15.5rem)' : text.length <= 8 ? 'clamp(4rem,13vw,13rem)' : 'clamp(3.2rem,11.5vw,12rem)'

const VIDEO = { width: 1920, height: 1080 }

/** Frosted panel so copy stays readable wherever it overlaps the footage. */
const card = 'rounded-2xl bg-white/75 p-5 shadow-[0_10px_40px_rgba(28,42,92,0.08)] backdrop-blur-md md:p-6'

/** Wash shapes in a 0–100 box where x = 0 is the page edge (the right-side wash is mirrored). */
const WASH = {
  left: {
    outer: 'M0 -5 L10 -5 C22 4 32 20 38 40 C44 58 54 64 70 66 C86 68 94 80 98 92 C99 97 100 100 100 105 L0 105 Z',
    body: 'M0 -5 L4 -5 C12 2 16 10 15 22 C14 34 10 42 22 46 C34 50 26 62 36 72 C46 82 60 88 66 105 L0 105 Z',
  },
  // Traced from the marked area: thin at the top-right corner, widening down to the bottom.
  right: {
    outer: 'M0 -5 L4 -5 C10 8 14 22 20 34 C26 46 36 52 44 60 C54 70 54 80 62 90 C66 96 68 100 70 105 L0 105 Z',
    body: 'M0 8 C6 22 4 36 12 48 C20 58 30 62 34 74 C38 86 30 96 24 105 L0 105 Z',
  },
}

/**
 * Navy washes that flow in from both edges along soft curves and blend into the footage. The left one
 * fills the gutter beside the title column so it never sits under the navy title; the right one is
 * wider and sits behind the frosted hook and spec cards, which stay readable over it.
 */
function ChapterWash({ side }: { side: 'left' | 'right' }) {
  const shape = WASH[side]
  const id = `chapter-wash-${side}`
  return (
    <div
      aria-hidden
      className={`chapter-wash pointer-events-none absolute inset-y-0 hidden ${
        side === 'left'
          ? '-start-10 w-[calc((100vw-1260px)/2+100px)] min-[1360px]:block'
          : 'chapter-wash-right -end-10 w-[40vw] lg:block'
      }`}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={`h-full w-full overflow-visible blur-[18px] ${side === 'right' ? '-scale-x-100' : ''}`}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="var(--color-navy)" stopOpacity={side === 'left' ? 0.95 : 0.9} />
            <stop offset="0.55" stopColor="var(--color-navy)" stopOpacity={side === 'left' ? 0.75 : 0.55} />
            <stop offset="1" stopColor="var(--color-navy)" stopOpacity={side === 'left' ? 0.25 : 0.12} />
          </linearGradient>
        </defs>
        {/* Outer, lighter band then the main body: two curves give the edge a layered, blended look */}
        <path fill={`url(#${id})`} opacity="0.45" d={shape.outer} />
        <path fill={`url(#${id})`} d={shape.body} />
      </svg>
    </div>
  )
}

/**
 * Category chapter: the section's scroll plays the category film (media/films/category-<slug>) while the
 * title, hook, specs and call to action appear in the windows set in the CMS. Specs go where the final
 * frame leaves room: printed on the product (mapped from the video's own coordinates), in a card at
 * either side, across the top, or centred over a cleaned surface.
 */
export default function CategoryChapter({ category, index }: { category: CategoryWithCount; index: number }) {
  const c = category.chapter!
  const t = {
    titleUntil: c.timing?.titleUntil ?? 0.2,
    hookFrom: c.timing?.hookFrom ?? 0.24,
    hookUntil: c.timing?.hookUntil ?? 0.52,
    specsFrom: c.timing?.specsFrom ?? 0.58,
    ctaFrom: c.timing?.ctaFrom ?? 0.76,
  }
  const placement = c.specsPlacement ?? 'right'
  const film = `category-${category.slug}`
  const root = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const zoom = useRef<HTMLDivElement>(null)
  const onBox = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLDivElement>(null)
  const counter = useRef<HTMLSpanElement>(null)
  const { render, status, manifest } = useFilmFrames(canvas, film)
  const total = manifest?.count ?? 240

  // Keep "on the product" specs glued to the product at any viewport size.
  const box = c.specsBox
  useEffect(() => {
    if (placement !== 'on' || !stage.current) return
    const el = stage.current
    const place = () => {
      const r = coverRect(
        { x: box?.x ?? 0.25, y: box?.y ?? 0.15, w: box?.w ?? 0.5, h: box?.h ?? 0.7 },
        { width: el.clientWidth, height: el.clientHeight },
        manifest ?? VIDEO,
      )
      if (onBox.current) Object.assign(onBox.current.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` })
      if (zoom.current) zoom.current.style.transformOrigin = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(el)
    return () => ro.disconnect()
  }, [placement, box?.x, box?.y, box?.w, box?.h, manifest])

  useGSAP(
    () => {
      const el = root.current!
      const update = (p: number) => {
        render(p)
        applyWindows(el, p)
        // The footage holds still at the end; a slow push-in keeps it alive while the specs are read.
        const hold = gsap.utils.clamp(0, 1, (p - t.specsFrom) / (1 - t.specsFrom || 1))
        if (zoom.current) zoom.current.style.transform = `scale(${1 + 0.05 * hold})`
        if (bar.current) bar.current.style.transform = `scaleX(${p})`
        if (counter.current) counter.current.textContent = String(Math.round(p * (total - 1)) + 1).padStart(4, '0')
      }
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const st = ScrollTrigger.create({ trigger: el, start: 'top top', end: 'bottom bottom', onUpdate: (s) => update(s.progress), onRefresh: (s) => update(s.progress) })
        return () => st.kill()
      })
      // No scroll playback: the final frame with the specs and call to action.
      mm.add('(prefers-reduced-motion: reduce)', () => update(1))
    },
    { scope: root, dependencies: [total], revertOnUpdate: true },
  )

  const specs = (layout: 'list' | 'columns') => (
    <>
      {c.specsTitle && <h4 className="text-[clamp(1.1rem,2vw,1.9rem)] font-bold leading-tight tracking-[-0.02em]">{c.specsTitle}</h4>}
      {layout === 'list' ? (
        <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[clamp(0.78rem,1.05vw,0.95rem)]">
          {c.specs?.map((s) => (
            <div key={s.id ?? s.label} className="contents">
              <dt className="font-mono text-leaf-deep">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-[clamp(0.78rem,1.05vw,0.95rem)] md:grid-cols-3">
          {c.specs?.map((s) => (
            <div key={s.id ?? s.label}>
              <dt className="font-mono text-leaf-deep">{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </>
  )

  const hookSide = placement === 'left' ? 'md:start-10' : 'md:end-10'

  return (
    <section
      id={`chapter-${category.slug}`}
      ref={root}
      aria-label={category.name}
      style={{ '--len': c.length ?? 3 } as React.CSSProperties}
      className="relative bg-paper motion-safe:h-[calc(var(--len)*100svh)]"
    >
      <div ref={stage} className="top-0 h-svh min-h-[560px] overflow-hidden motion-safe:sticky">
        <div ref={zoom} className="absolute inset-0 will-change-transform">
          <canvas ref={canvas} className="absolute inset-0 h-full w-full" aria-hidden />
          {placement === 'on' && (
            <div ref={onBox} className="absolute flex flex-col justify-center p-[clamp(1rem,3vw,2.5rem)]">
              <div data-at={`${t.specsFrom},1`} className="invisible">
                {specs('list')}
              </div>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(245_247_250/0.92)_0%,transparent_26%),linear-gradient(to_bottom,rgb(245_247_250/0.7)_0%,transparent_16%)]" />
        <ChapterWash side="left" />
        <ChapterWash side="right" />

        <div className="relative mx-auto h-full max-w-[1260px] px-5 md:px-10">
          <div data-at={`0,${t.titleUntil}`} className="absolute inset-x-5 bottom-[20%] md:inset-x-10 md:bottom-[13%]">
            <p className="label flex items-center gap-2.5">
              Category
              <span className="rounded-full bg-leaf-soft px-2 py-1 tracking-normal normal-case text-leaf-deep">{category.count} products</span>
            </p>
            <h3 className="mt-3 font-extrabold leading-[0.8] tracking-[-0.055em]" style={{ fontSize: giantSize(c.giant ?? '') }}>
              {c.giant}
              <span className="text-leaf">.</span>
            </h3>
          </div>

          {c.hook && (
            <div
              data-at={`${t.hookFrom},${t.hookUntil}`}
              className={`invisible absolute inset-x-5 top-[16%] md:inset-x-auto md:top-[20%] md:w-[400px] ${hookSide} ${card}`}
            >
              <h3 className="text-[clamp(1.7rem,3.2vw,3rem)] font-bold leading-none tracking-[-0.03em]">{c.hook}</h3>
              {c.hookText && <p className="mt-3 text-slate">{c.hookText}</p>}
            </div>
          )}

          {(placement === 'right' || placement === 'left') && (
            <div
              data-at={`${t.specsFrom},1`}
              className={`invisible absolute inset-x-5 top-[16%] md:inset-x-auto md:top-1/2 md:w-[min(440px,36%)] md:-translate-y-1/2 ${placement === 'left' ? 'md:start-10' : 'md:end-10'} ${card}`}
            >
              {specs('list')}
            </div>
          )}
          {placement === 'top' && (
            <div data-at={`${t.specsFrom},1`} className={`invisible absolute inset-x-5 top-[13%] mx-auto max-w-4xl md:inset-x-10 ${card}`}>
              {specs('columns')}
            </div>
          )}
          {placement === 'behind' && (
            <div data-at={`${t.specsFrom},1`} className={`invisible absolute inset-x-5 top-1/2 mx-auto max-w-3xl -translate-y-1/2 md:inset-x-10 ${card}`}>
              {specs('columns')}
            </div>
          )}

          <div data-at={`${t.ctaFrom},1`} className="invisible absolute inset-x-5 bottom-14 flex flex-wrap items-end justify-between gap-4 md:inset-x-10 md:bottom-16">
            <ul className="flex flex-wrap gap-2">
              {c.chips?.map((chip) => (
                <li key={chip.id ?? chip.label} className="rounded-full border border-line bg-white px-3 py-2 font-mono text-xs">
                  {chip.label}
                </li>
              ))}
            </ul>
            <a href="#quote" className="group flex items-center gap-2 rounded-xl bg-leaf px-5 py-3.5 font-semibold text-white transition hover:bg-leaf-deep">
              {c.ctaLabel || `See ${category.name.toLowerCase()}`} <Arrow />
            </a>
          </div>

          <div className="absolute inset-x-5 bottom-5 flex items-center gap-4 font-mono text-xs text-slate md:inset-x-10">
            <span className="text-ink">{String(index).padStart(2, '0')}</span>
            <span className="hidden uppercase tracking-[0.14em] sm:inline">{category.name}</span>
            <div className="relative h-px flex-1 bg-line">
              <div ref={bar} className="absolute inset-0 origin-left scale-x-0 bg-leaf" />
            </div>
            <span className="tabular-nums">
              <span ref={counter}>0001</span> / {String(total).padStart(4, '0')}
            </span>
          </div>
        </div>

        {status === 'missing' && process.env.NODE_ENV === 'development' && (
          <p className="absolute end-5 top-24 max-w-[calc(100%-2.5rem)] rounded-md border border-dashed border-note-line bg-note px-2.5 py-1.5 font-mono text-[11px] text-note-ink md:end-10">
            Awaiting footage · media-src/{film}.mp4 → npm run frames · docs/category-media/{category.slug}.md
          </p>
        )}
      </div>
    </section>
  )
}
