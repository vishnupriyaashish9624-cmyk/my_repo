'use client'

import { useEffect, useRef, useState } from 'react'

type Manifest = { count: number; width: number; height: number }
export type FilmStatus = 'loading' | 'frames' | 'missing'

/**
 * Frame-sequence renderer for a canvas (frames from `npm run frames` in /media/films/<slug>/).
 * Returns `render(progress)` to draw the frame for 0–1, plus whether footage exists. Until it does,
 * a soft light gradient drifts with scroll. Frames load when the film comes within 1.5 screens (immediately\n * with priority), coarse frames first so scrubbing works at once, and are released again when it is far away.
 */
export function useFilmFrames(
  canvas: React.RefObject<HTMLCanvasElement | null>,
  slug: string,
  {
    transparent = false,
    priority = false,
    tones = ['#dfe8f3', '#e3f2dc'],
  }: { transparent?: boolean; priority?: boolean; tones?: [string, string] } = {},
) {
  const renderRef = useRef<(p: number) => void>(() => {})
  const [status, setStatus] = useState<FilmStatus>('loading')
  const [size, setSize] = useState<Manifest | null>(null)

  useEffect(() => {
    const cvs = canvas.current
    if (!cvs) return
    const ctx = cvs.getContext('2d', { alpha: transparent })!
    let frames: HTMLImageElement[] = []
    let manifest: Manifest | null = null
    let progress = 0
    let drawn = -1
    let cancelled = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      // Never render above the frame's native width: canvas upscaling blurs more than CSS scaling.
      const cap = manifest ? manifest.width : Infinity
      const w = Math.min(cvs.clientWidth * dpr, cap)
      cvs.width = Math.max(1, Math.round(w))
      cvs.height = Math.max(1, Math.round((w * cvs.clientHeight) / Math.max(1, cvs.clientWidth)))
      ctx.imageSmoothingQuality = 'high'
      drawn = -1
      draw()
    }

    const nearest = (target: number) => {
      for (let d = 0; d < frames.length; d++) {
        if (frames[target - d]?.complete && frames[target - d].naturalWidth) return target - d
        if (frames[target + d]?.complete && frames[target + d].naturalWidth) return target + d
      }
      return -1
    }

    const draw = () => {
      const { width: w, height: h } = cvs
      if (!manifest) {
        if (transparent) return
        ctx.fillStyle = '#f5f7fa'
        ctx.fillRect(0, 0, w, h)
        ;[
          { x: 0.3 + progress * 0.4, y: 0.4, c: tones[0] },
          { x: 0.75 - progress * 0.3, y: 0.7, c: tones[1] },
        ].forEach((o) => {
          const g = ctx.createRadialGradient(o.x * w, o.y * h, 0, o.x * w, o.y * h, Math.max(w, h) * 0.7)
          g.addColorStop(0, o.c)
          g.addColorStop(1, 'rgba(245,247,250,0)')
          ctx.fillStyle = g
          ctx.fillRect(0, 0, w, h)
        })
        return
      }
      const i = nearest(Math.round(progress * (manifest.count - 1)))
      if (i < 0 || i === drawn) return
      const img = frames[i]
      if (transparent) ctx.clearRect(0, 0, w, h)
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh)
      drawn = i
    }

    renderRef.current = (p: number) => {
      progress = Math.min(1, Math.max(0, p))
      if (!manifest) drawn = -1
      draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(cvs)

    // Frames are only kept for films near the viewport: ten 240-frame films at once would mean
    // hundreds of megabytes of downloads and decoded bitmaps. `generation` cancels a load in flight.
    let base = ''
    let generation = 0
    let loaded = false

    const loadFrames = async () => {
      if (!manifest || loaded) return
      loaded = true
      const gen = ++generation
      frames = new Array(manifest.count)
      const order: number[] = []
      const seen = new Set<number>()
      for (const step of [16, 8, 4, 2, 1])
        for (let i = 0; i < manifest.count; i += step) {
          if (seen.has(i)) continue
          seen.add(i)
          order.push(i)
        }
      for (const i of order) {
        if (cancelled || gen !== generation) return
        const img = new Image()
        img.decoding = 'async'
        img.src = `${base}/${String(i + 1).padStart(4, '0')}.webp`
        img.onload = () => {
          if (gen === generation && Math.abs(Math.round(progress * (manifest!.count - 1)) - i) < 24) {
            drawn = -1
            draw()
          }
        }
        frames[i] = img
        // Throttle so the first coarse pass lands quickly without flooding the network.
        if (i % 16 === 0) await img.decode().catch(() => {})
      }
    }

    const unloadFrames = () => {
      if (!loaded) return
      loaded = false
      generation++
      for (const img of frames) {
        if (!img) continue
        img.onload = null
        img.src = ''
      }
      frames = []
      drawn = -1
    }

    const host = cvs.closest('section') ?? cvs
    const near = new IntersectionObserver(([e]) => e.isIntersecting && loadFrames(), { rootMargin: '150% 0px' })
    const far = new IntersectionObserver(([e]) => !e.isIntersecting && unloadFrames(), { rootMargin: '400% 0px' })

    ;(async () => {
      const mobile = window.matchMedia('(max-aspect-ratio: 4/5)').matches
      for (const name of mobile ? [`${slug}-mobile`, slug] : [slug]) {
        try {
          const res = await fetch(`/media/films/${name}/manifest.json`)
          if (!res.ok) continue
          manifest = await res.json()
          if (cancelled || !manifest) return
          base = `/media/films/${name}`
          setStatus('frames')
          setSize(manifest)
          resize()
          if (priority) loadFrames()
          near.observe(host)
          far.observe(host)
          return
        } catch {}
      }
      if (!cancelled) setStatus('missing')
      draw()
    })()

    return () => {
      cancelled = true
      generation++
      ro.disconnect()
      near.disconnect()
      far.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, transparent, priority, tones.join()])
  return { render: (p: number) => renderRef.current(p), status, manifest: size }
}

/**
 * Maps a rectangle given as fractions of the video frame onto an element drawn with object-fit: cover,
 * clamped to the element with a gutter. Returns pixel CSS values.
 */
export function coverRect(
  box: { x: number; y: number; w: number; h: number },
  view: { width: number; height: number },
  video: { width: number; height: number },
  gutter = 16,
) {
  const scale = Math.max(view.width / video.width, view.height / video.height)
  const dw = video.width * scale
  const dh = video.height * scale
  const ox = (view.width - dw) / 2
  const oy = (view.height - dh) / 2
  const left = Math.max(gutter, ox + box.x * dw)
  const top = Math.max(gutter, oy + box.y * dh)
  const right = Math.min(view.width - gutter, ox + (box.x + box.w) * dw)
  const bottom = Math.min(view.height - gutter, oy + (box.y + box.h) * dh)
  return { left, top, width: Math.max(0, right - left), height: Math.max(0, bottom - top) }
}

/** Opacity for a window [a, b] with soft edges; windows touching 0 or 1 stay fully visible at that end. */
export const FADE = 0.06
export function windowOpacity(p: number, a: number, b: number) {
  const fadeIn = a <= 0 ? 1 : Math.min(1, Math.max(0, (p - a) / FADE))
  const fadeOut = b >= 1 ? 1 : Math.min(1, Math.max(0, (b - p) / FADE))
  return Math.min(fadeIn, fadeOut)
}

/** Applies data-at="a,b" windows to every overlay inside `root`. */
export function applyWindows(root: HTMLElement, p: number) {
  root.querySelectorAll<HTMLElement>('[data-at]').forEach((node) => {
    const [a, b] = node.dataset.at!.split(',').map(Number)
    const o = windowOpacity(p, a, b)
    node.style.opacity = String(o)
    node.style.transform = `translateY(${(1 - o) * (p < a + FADE ? 24 : -24)}px)`
    node.style.visibility = o === 0 ? 'hidden' : 'visible'
  })
}
