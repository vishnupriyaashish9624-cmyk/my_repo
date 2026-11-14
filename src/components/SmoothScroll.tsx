'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger stays in sync. */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Pause CSS ambient animations (marquee) in sections that are off-screen.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('ambient-off', !e.isIntersecting)),
      { rootMargin: '100px' },
    )
    document.querySelectorAll('main > section, main > div, footer').forEach((el) => observer.observe(el))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => observer.disconnect()

    const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -80 } })
    // Shared so sections can glide to a scroll position (e.g. the pinned catalogue).
    ;(window as unknown as { __smoothScroll?: Lenis }).__smoothScroll = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      observer.disconnect()
      gsap.ticker.remove(tick)
      lenis.destroy()
      delete (window as unknown as { __smoothScroll?: Lenis }).__smoothScroll
    }
  }, [])

  return <>{children}</>
}
