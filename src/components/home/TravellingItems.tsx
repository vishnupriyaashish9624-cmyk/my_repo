'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Travelling products (desktop only): a fixed layer of cut-out product turntables from /media/sprites/item-<kind>/
 * that play a different role in each section as you scroll:
 *
 * - Hero: float around the headline.
 * - Intro: line up on the shelf above the facts.
 * - Category films: step aside (the films have their own products).
 * - Category rail: each product perches on its own category's card and rides the reel.
 * - Brand strip: ride along the strip's top edge like a conveyor.
 * - Industries: the product that industry orders most pops out of the photo frame's corner.
 * - Ordering steps: queue behind the progress marker, carried along the line.
 * - Quote: circle the closed aperture, then dive in as it opens.
 *
 * Section poses read element positions live, and each product eases toward its target, so switching
 * roles never jumps. Section hooks (ids): top, about, products, aisles, brands, industries, order, quote.
 */

const KINDS = ['paper-cup', 'foil-roll', 'maxi-roll', 'container', 'glove', 'sponge', 'spray-bottle'] as const
type Kind = (typeof KINDS)[number]

const SIZE: Record<Kind, number> = { 'paper-cup': 150, 'foil-roll': 150, 'maxi-roll': 140, container: 160, glove: 150, sponge: 120, 'spray-bottle': 160 }
/** Category card each product perches on in the rail. */
const CATEGORY: Record<Kind, string> = {
  'paper-cup': 'cups',
  'foil-roll': 'aluminium',
  'maxi-roll': 'tissue',
  container: 'containers',
  glove: 'ppe',
  sponge: 'tools',
  'spray-bottle': 'chemicals',
}
/** The product each industry shows beside its photo. */
const INDUSTRY: Record<string, Kind> = {
  restaurant: 'container',
  cafe: 'paper-cup',
  bakery: 'foil-roll',
  hotel: 'maxi-roll',
  facility: 'spray-bottle',
  salon: 'glove',
}

/** [x, y] in px, scale, opacity, tilt (deg). */
type Pose = [number, number, number, number, number]
type PoseFn = (i: number, t: number) => Pose
type Waypoint = { y: number; pose: PoseFn }

// Hero: the headline can reach ~70% of the width on short screens, so products keep to the right-hand column.
const HERO: [number, number, number, number, number][] = [
  [0.79, 0.17, 0.75, 1, -12],
  [0.93, 0.15, 0.7, 1, 14],
  [0.96, 0.41, 0.65, 1, -18],
  [0.85, 0.32, 0.7, 1, 8],
  [0.77, 0.47, 0.55, 0.95, 20],
  [0.91, 0.58, 0.55, 1, -8],
  [0.72, 0.28, 0.5, 0.9, 12],
]

const easeInOut = gsap.parseEase('power2.inOut')
const popIn = gsap.parseEase('back.out(1.6)')
const clamp01 = gsap.utils.clamp(0, 1)
const STEP = 2 // every 2nd frame is plenty for a scroll-driven spin

const QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)'
const subscribeQuery = (cb: () => void) => {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}

export default function TravellingItems() {
  const layer = useRef<HTMLDivElement>(null)
  const enabled = useSyncExternalStore(subscribeQuery, () => window.matchMedia(QUERY).matches, () => false)
  const frames = useRef<Partial<Record<Kind, HTMLImageElement[]>>>({})
  const loadedAt = useRef<Partial<Record<Kind, number>>>({})

  // Load the cut-out frames after the hero film's first frames.
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    const load = () =>
      KINDS.forEach(async (kind) => {
        try {
          const res = await fetch(`/media/sprites/item-${kind}/manifest.json`)
          if (!res.ok) return
          const m: { count: number } = await res.json()
          const list: HTMLImageElement[] = []
          for (let i = 0; i < m.count; i += STEP) {
            const img = new Image()
            img.decoding = 'async'
            img.src = `/media/sprites/item-${kind}/${String(i + 1).padStart(4, '0')}.webp`
            list.push(img)
          }
          await list[0].decode().catch(() => {})
          if (cancelled) return
          frames.current[kind] = list
          loadedAt.current[kind] = gsap.ticker.time
        } catch {}
      })
    const timer = window.setTimeout(load, 1500)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    const root = layer.current!
    const outers = [...root.querySelectorAll<HTMLElement>('[data-item]')]
    const canvases = outers.map((o) => o.querySelector('canvas')!)
    const n = KINDS.length
    let waypoints: Waypoint[] = []
    // Displayed pose per product, eased toward the scroll target every tick.
    let current: Pose[] | null = null
    let lastTime = 0

    const vw = () => window.innerWidth
    const vh = () => window.innerHeight
    const rect = (sel: string) => {
      const el = document.querySelector(sel)
      const r = el?.getBoundingClientRect()
      return r && r.width ? r : null
    }
    const box = (id: string) => {
      const el = document.getElementById(id)
      if (!el) return null
      const host = el.parentElement?.classList.contains('pin-spacer') ? el.parentElement : el
      const r = host.getBoundingClientRect()
      return { top: r.top + window.scrollY, height: host.offsetHeight }
    }
    const off = (side: 'left' | 'right', y: number): Pose => [side === 'left' ? -120 : vw() + 120, y, 0.5, 0, 0]

    // --- Section roles --------------------------------------------------------------------------

    const hero: PoseFn = (i) => {
      const [x, y, s, o, r] = HERO[i]
      return [x * vw(), y * vh(), s, o, r]
    }
    const heroExit: PoseFn = (i) => {
      const [x, y, s, , r] = HERO[i]
      return [(x + 0.5) * vw(), (y - 0.08) * vh(), s, 0, r + 40]
    }

    // Standing in a row on the line above the intro facts, like stock on a shelf.
    const shelf =
      (enter: 'none' | 'right' | 'left' = 'none'): PoseFn =>
      (i) => {
        const line = rect('#about .intro-facts')
        if (!line) return off('right', vh() / 2)
        const x = line.left + ((i + 0.5) / n) * line.width
        const y = line.top - 42
        if (enter === 'right') return [x + vw() * 0.7, y, 0.42, 0, 25]
        if (enter === 'left') return [x - vw() * 0.8, y, 0.42, 0, -25]
        return [x, y, 0.42, 1, 0]
      }

    // Perched on the top edge of its own category's card, riding the reel; fades with the card's focus.
    const perch =
      (visible: boolean): PoseFn =>
      (i) => {
        const card = document.querySelector<HTMLElement>(`#aisles .rail-card[data-slug="${CATEGORY[KINDS[i]]}"]`)
        const photo = card?.querySelector('a')?.getBoundingClientRect()
        if (!card || !photo) return off('right', vh() * 0.4)
        const focus = Number(card.style.getPropertyValue('--f') || 0)
        return [photo.left + photo.width * 0.76, photo.top - 8, 0.36 + 0.1 * focus, visible ? 0.35 + 0.65 * focus : 0, -8]
      }

    // Riding along the top edge of the brand strip, looping right to left with the marquee.
    const conveyor: PoseFn = (i, t) => {
      const strip = rect('#brands')
      if (!strip) return off('left', vh() / 2)
      const u = (((i / n - t * 0.025) % 1) + 1) % 1
      const x = -80 + u * (vw() + 160)
      const edge = Math.min(u, 1 - u) * 8 // fade in and out at the screen edges
      return [x, strip.top - 20, 0.34, clamp01(edge), u * 360]
    }

    // The active industry's product pops out of the photo frame's top corner; the rest wait tucked behind it.
    const industry: PoseFn = (i) => {
      const frame = rect('#industries .ind-frame')
      if (!frame) return off('right', vh() / 2)
      const current = document.querySelector('#industries [aria-current="step"]')?.closest('li')
      const idx = current ? [...current.parentElement!.children].indexOf(current) : 0
      const slug = document.querySelectorAll<HTMLElement>('#industries [data-industry]')[idx]?.dataset.industry
      const mine = slug ? INDUSTRY[slug] === KINDS[i] : false
      return mine ? [frame.right - 36, frame.top + 28, 0.8, 1, -10] : [frame.right - 110, frame.top + 110, 0.2, 0, 20]
    }

    // Queued behind the progress marker, carried along the line; each appears once it's past the line's start.
    const line =
      (visible: boolean): PoseFn =>
      (i) => {
        const marker = rect('#order .steps-marker')
        const track = rect('#order .steps-fill')
        if (!marker || !track) return off('left', vh() / 2)
        const x = marker.left + marker.width / 2 - 20 - i * 58
        const y = marker.top - 34
        const shown = visible ? clamp01((x - track.left + 30) / 40) : 0
        return [x, y, 0.3, shown, 0]
      }

    // Circling the closed aperture, then diving into it as it opens.
    const aperture: PoseFn = (i, t) => {
      const card = document.querySelector<HTMLElement>('#quote .quote-card')
      const r = card?.getBoundingClientRect()
      const radius = Number(card?.dataset.r ?? NaN)
      if (!card || !r || Number.isNaN(radius)) return off('right', vh() / 2)
      const open = clamp01((radius - 72) / 260)
      const a = (i / n) * Math.PI * 2 + t * 0.5
      const ring = (radius + 95) * (1 - open)
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      return [cx + Math.cos(a) * ring, cy + Math.sin(a) * ring * 0.85, 0.46 * (1 - open * 0.85), 1 - open * open, (a * 180) / Math.PI + open * 540]
    }

    // Standing on top of the letters of the footer's giant wordmark, one product per letter.
    const wordmark: PoseFn = (i) => {
      const chars = document.querySelectorAll('#site-footer .footer-char')
      const ch = chars[Math.min(i + (i >= 4 ? 1 : 0), chars.length - 1)]?.getBoundingClientRect()
      if (!ch || !ch.width) return off('right', vh() * 0.8)
      const s = gsap.utils.clamp(0.28, 0.45, ch.width / 260)
      return [ch.left + ch.width / 2, ch.top + ch.height * 0.14 - 40 * s, s, 1, (i % 2 ? 1 : -1) * 6]
    }

    const compute = () => {
      const h = vh()
      const heroBox = box('top')
      const about = box('about')
      const products = box('products')
      const aisles = box('aisles')
      const brands = box('brands')
      const ind = box('industries')
      const order = box('order')
      const quote = box('quote')
      if (!heroBox || !about || !products || !aisles || !brands || !ind || !order || !quote) return
      const main = document.querySelector('main')
      const mainEnd = main ? main.getBoundingClientRect().bottom + window.scrollY : quote.top + quote.height
      const footerH = document.getElementById('site-footer')?.offsetHeight ?? h
      const hs = Math.max(1, heroBox.height - h)
      const list: Waypoint[] = [
        { y: heroBox.top, pose: hero },
        // Leave before the hero's overlays (from 0.28 of its scroll).
        { y: heroBox.top + hs * 0.2, pose: hero },
        { y: heroBox.top + hs * 0.27, pose: heroExit },
        { y: about.top - h * 0.9, pose: shelf('right') },
        { y: about.top - h * 0.3, pose: shelf() },
        { y: products.top - h * 0.6, pose: shelf() },
        { y: products.top - h * 0.1, pose: shelf('left') },
        { y: aisles.top - h * 0.3, pose: perch(false) },
        { y: aisles.top, pose: perch(true) },
        { y: aisles.top + aisles.height - h, pose: perch(true) },
        { y: brands.top - h * 0.75, pose: conveyor },
        { y: brands.top - h * 0.15, pose: conveyor },
        { y: ind.top, pose: industry },
        { y: ind.top + ind.height - h, pose: industry },
        { y: order.top - h * 0.3, pose: line(false) },
        { y: order.top, pose: line(true) },
        { y: order.top + order.height - h, pose: line(true) },
        { y: quote.top - h * 0.45, pose: aperture },
        { y: quote.top + quote.height - h, pose: aperture },
        // Footer reveal: pop back out and land on the wordmark (main's end is the reveal's start; the footer may be sticky).
        { y: mainEnd - h + footerH * 0.55, pose: wordmark },
      ]
      for (let i = 1; i < list.length; i++) list[i].y = Math.max(list[i].y, list[i - 1].y + 1)
      waypoints = list
    }

    const render = (time: number) => {
      if (!waypoints.length) return
      const dt = Math.min(0.1, time - lastTime)
      lastTime = time
      const y = window.scrollY
      let k = waypoints.findIndex((w, i) => i === waypoints.length - 1 || (y >= w.y && y < waypoints[i + 1].y))
      if (y < waypoints[0].y) k = 0
      const a = waypoints[k]
      const b = waypoints[Math.min(k + 1, waypoints.length - 1)]
      const t = b === a ? 1 : easeInOut(clamp01((y - a.y) / (b.y - a.y)))

      const targets = KINDS.map((_, i) => {
        const pa = a.pose(i, time)
        const pb = b.pose(i, time)
        return pa.map((v, j) => v + (pb[j] - v) * t) as Pose
      })
      if (!current) current = targets.map((p) => [...p] as Pose)
      const ease = 1 - Math.exp(-dt * 9)

      KINDS.forEach((kind, i) => {
        const c = current![i]
        for (let j = 0; j < 5; j++) c[j] += (targets[i][j] - c[j]) * ease
        const [px, py, ps, po, pr] = c
        const el = outers[i]
        const size = SIZE[kind]
        const bob = Math.sin(time * (0.8 + i * 0.07) + i) * 6 * ps
        const list = frames.current[kind]
        // Stay hidden until this product's frames have loaded, then grow in.
        const ready = list ? clamp01((time - (loadedAt.current[kind] ?? time)) / 0.9) : 0
        el.style.opacity = String(clamp01(po) * Math.min(1, ready * 2))
        el.style.transform = `translate3d(${px - size / 2}px, ${py - size / 2 + bob}px, 0) scale(${ps * popIn(ready)}) rotate(${pr}deg)`
        if (po <= 0.01 || !list) return

        const spin = (((y * 0.0006 + time * 0.035 + i * 0.13) % 1) + 1) % 1
        const img = list[Math.floor(spin * list.length) % list.length]
        const cvs = canvases[i]
        if (img.complete && img.naturalWidth && cvs.dataset.frame !== img.src) {
          const ctx = cvs.getContext('2d')!
          ctx.clearRect(0, 0, cvs.width, cvs.height)
          ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
          cvs.dataset.frame = img.src
        }
      })
    }

    compute()
    const late = window.setTimeout(compute, 800)
    ScrollTrigger.addEventListener('refresh', compute)
    window.addEventListener('resize', compute)
    gsap.ticker.add(render)
    return () => {
      window.clearTimeout(late)
      ScrollTrigger.removeEventListener('refresh', compute)
      window.removeEventListener('resize', compute)
      gsap.ticker.remove(render)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div ref={layer} className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
      {KINDS.map((kind) => (
        <div key={kind} data-item={kind} className="absolute left-0 top-0 opacity-0 will-change-transform" style={{ width: SIZE[kind], height: SIZE[kind] }}>
          <canvas width={320} height={320} className="h-full w-full drop-shadow-[0_18px_22px_rgba(28,42,92,0.18)]" />
        </div>
      ))}
    </div>
  )
}
