'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { enter } from '@/lib/enter'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** Line icons on a white tile, in the brand navy with leaf accents. */
function Icon({ name }: { name: 'list' | 'carton' | 'basket' }) {
  const s = { className: 'rs-stroke', fill: 'none', stroke: 'currentColor', strokeWidth: 3, strokeLinecap: 'round', strokeLinejoin: 'round' } as const
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full text-ink" aria-hidden>
      {name === 'list' && (
        <>
          {[18, 32, 46].map((y) => (
            <g key={y}>
              <path d={`M12 ${y} l4 4 8-8`} {...s} stroke="var(--color-leaf)" />
              <path d={`M30 ${y} h22`} {...s} />
            </g>
          ))}
        </>
      )}
      {name === 'carton' && (
        <>
          <path d="M22 10h20v8l6 8v28H16V26l6-8z" {...s} />
          <path d="M16 26h32M22 18h20" {...s} />
          <path d="M38 30h6v20h-6z" fill="var(--color-leaf-soft)" stroke="none" />
        </>
      )}
      {name === 'basket' && (
        <>
          <path d="M20 22l8-12M44 22l-8-12" {...s} />
          <path d="M8 22h48v6H8zM12 28l4 22h28l4-22" {...s} />
          <path d="M24 34v10M32 34v10" {...s} />
          <circle cx="48" cy="46" r="10" fill="var(--color-leaf)" stroke="white" strokeWidth="3" />
          <path d="M48 41v10M43 46h10" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

const STEPS = [
  {
    tag: 'Open list',
    icon: 'list',
    title: 'Start with your usual supplies',
    text: 'Open your saved list of products.',
  },
  {
    tag: 'Adjust',
    icon: 'carton',
    title: 'Choose how much you need',
    text: 'Check your stock and update the quantities.',
  },
  {
    tag: 'Add items',
    icon: 'basket',
    title: 'Add what’s missing',
    text: 'Include any extra supplies you need this week.',
  },
] as const

/**
 * Restock for the week ahead: three glass cards on the navy theme (same colours as
 * "A day in the back room"), each with a green numbered tab. The middle tab sits at the bottom
 * so the three read as a zig-zag path.
 *
 * GSAP: the heading rises word by word, the cards tip up out of perspective one after another,
 * each tab's number spins in and its arrow band unrolls, then the icon tile pops and the copy
 * rises while the icon's lines draw themselves. A zig-zag line between the tabs draws as you
 * scroll. Afterwards: icon tiles bob, a light sweep crosses each glass card in turn, the tab
 * numbers pulse, cards tilt towards the pointer, and the background glows drift with scroll.
 */
export default function RestockSteps() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(q('.rs-title'), { type: 'words', mask: 'words' })
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: { trigger: root.current, start: 'top 70%', once: true },
        })
        enter(tl, q('.rs-label'), { x: -24, opacity: 0 }, { duration: 0.6 }, 0)
        enter(tl, split.words, { yPercent: 110 }, { duration: 1.1, stagger: 0.06, ease: 'expo.out' }, 0.05)

        q('.rs-step').forEach((step, i) => {
          const sq = gsap.utils.selector(step)
          const at = 0.35 + i * 0.22
          enter(
            tl,
            sq('.rs-card'),
            { y: 90, opacity: 0, rotateX: 28, scale: 0.92 },
            { rotateX: 0, duration: 1, ease: 'expo.out', transformPerspective: 900, transformOrigin: '50% 100%' },
            at,
          )
          enter(tl, sq('.rs-num'), { scale: 0, rotate: -200 }, { duration: 0.7, ease: 'back.out(2.2)' }, at + 0.25)
          tl.fromTo(
            sq('.rs-band'),
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.6, ease: 'power2.inOut' },
            at + 0.45,
          )
          enter(tl, sq('.rs-icon'), { scale: 0, rotate: -18 }, { duration: 0.7, ease: 'back.out(2.4)' }, at + 0.4)
          enter(tl, sq('.rs-copy > *'), { y: 22, opacity: 0 }, { duration: 0.6, stagger: 0.08 }, at + 0.55)
          // The icon's lines draw themselves in.
          sq('.rs-stroke').forEach((el, k) => {
            const len = (el as unknown as SVGGeometryElement).getTotalLength?.() ?? 60
            gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
            tl.to(el, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out' }, at + 0.6 + k * 0.08)
          })
        })

        // Zig-zag connector between the tabs, drawn with scroll.
        gsap.fromTo(
          q('.rs-path'),
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: { trigger: q('.rs-list')[0], start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
          },
        )

        // Once in: icon tiles bob out of step, a light sweep crosses each card in turn,
        // and the tab numbers send out a pulse ring.
        tl.add(() => {
          q('.rs-icon').forEach((el, i) =>
            gsap.to(el, { y: -6, duration: 1.8 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
          )
          gsap.fromTo(
            q('.rs-sweep'),
            { xPercent: -160 },
            { xPercent: 260, duration: 1.4, ease: 'power2.inOut', stagger: { each: 0.5, repeat: -1, repeatDelay: 3.6 } },
          )
          gsap.fromTo(
            q('.rs-ring'),
            { scale: 1, opacity: 0.7 },
            { scale: 1.9, opacity: 0, duration: 1.6, ease: 'power2.out', stagger: { each: 0.4, repeat: -1, repeatDelay: 1.2 } },
          )
        })

        // Cards tilt towards the pointer (on the list item, so it doesn't fight the entrance).
        const offs: (() => void)[] = []
        if (window.matchMedia('(hover: hover)').matches) {
          q('.rs-step').forEach((step) => {
            gsap.set(step, { transformPerspective: 1000 })
            const rx = gsap.quickTo(step, 'rotationX', { duration: 0.5, ease: 'power3' })
            const ry = gsap.quickTo(step, 'rotationY', { duration: 0.5, ease: 'power3' })
            const move = (ev: Event) => {
              const e = ev as PointerEvent
              const r = step.getBoundingClientRect()
              ry(((e.clientX - r.left) / r.width - 0.5) * 10)
              rx(-((e.clientY - r.top) / r.height - 0.5) * 8)
            }
            const leave = () => {
              rx(0)
              ry(0)
            }
            step.addEventListener('pointermove', move)
            step.addEventListener('pointerleave', leave)
            offs.push(() => {
              step.removeEventListener('pointermove', move)
              step.removeEventListener('pointerleave', leave)
            })
          })
        }

        // Background glows drift against the scroll.
        gsap.to(q('.rs-glow-a'), {
          yPercent: -40,
          xPercent: 15,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        gsap.to(q('.rs-glow-b'), {
          yPercent: 35,
          xPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })

        return () => {
          split.revert()
          offs.forEach((off) => off())
        }
      })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="order"
      aria-labelledby="restock-title"
      className="theme-dark relative overflow-hidden px-5 py-20 md:px-10 md:py-28"
    >
      {/* Extra glows for the glass to pick up */}
      <div aria-hidden className="rs-glow-a pointer-events-none absolute start-[12%] top-[38%] size-[420px] rounded-full bg-leaf/20 blur-[120px]" />
      <div aria-hidden className="rs-glow-b pointer-events-none absolute end-[8%] bottom-[5%] size-[380px] rounded-full bg-[#3b5bd9]/25 blur-[120px]" />

      <div className="relative mx-auto max-w-[1840px]">
        <p className="rs-label label !text-leaf">How ordering works</p>
        <h2
          id="restock-title"
          className="rs-title mt-3 text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.035em]"
        >
          Restock for the <span className="text-leaf">week ahead.</span>
        </h2>

        <ol className="rs-list relative mt-16 grid gap-14 md:grid-cols-3 md:gap-6 lg:gap-8">
          {/* Zig-zag connector from tab 01 down to 02 and up to 03 (wide layouts only) */}
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden h-full w-full overflow-visible md:block"
          >
            <path
              d="M3 0 C 20 0, 17 104, 35 104 S 52 0, 70 0"
              fill="none"
              stroke="var(--color-leaf)"
              strokeOpacity="0.18"
              strokeWidth="2"
              strokeDasharray="6 8"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="rs-path"
              d="M3 0 C 20 0, 17 104, 35 104 S 52 0, 70 0"
              pathLength={1}
              fill="none"
              stroke="var(--color-leaf)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="1"
              vectorEffect="non-scaling-stroke"
              style={{ filter: 'drop-shadow(0 0 6px rgb(61 166 41 / 0.7))' }}
            />
          </svg>
          {STEPS.map((s, i) => {
            const bottomTab = i === 1
            return (
              <li key={s.tag} className={`rs-step relative ${bottomTab ? 'md:mt-10' : ''}`}>
                {/* Glass card, same surface as the About Klen Plus pillars */}
                <div
                  className={`rs-card group relative flex h-full flex-col items-center rounded-2xl border border-white/10 bg-white/[0.05] px-7 text-center backdrop-blur-sm transition-[border-color,background-color] duration-300 hover:border-leaf hover:bg-white/[0.08] ${bottomTab ? 'pb-16 pt-10' : 'pb-10 pt-16'}`}
                >
                  {/* Light sweep, clipped to the card */}
                  <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <span className="rs-sweep absolute -inset-y-4 start-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" />
                  </span>
                  <span className="rs-icon relative grid size-20 place-items-center rounded-xl bg-white p-3.5">
                    <Icon name={s.icon} />
                  </span>
                  <div className="rs-copy relative">
                    <h3 className="mt-6 font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
                      {s.title}
                    </h3>
                    <p className="mx-auto mt-3 max-w-[30ch] text-white/65">{s.text}</p>
                  </div>
                </div>

                {/* Green numbered tab: a circle with an arrow-tipped band */}
                <div
                  className={`absolute start-[-10px] flex items-center ${bottomTab ? '-bottom-8' : '-top-8'}`}
                >
                  <span className="rs-num relative z-10 grid size-16 place-items-center rounded-full bg-leaf font-display text-2xl font-extrabold text-white shadow-[0_0_0_6px_rgb(28_42_92),0_12px_30px_-8px_rgba(61,166,41,0.7)]">
                    <span aria-hidden className="rs-ring absolute inset-0 rounded-full border-2 border-leaf opacity-0" />
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {/* Outer span unrolls; the inner one keeps the arrow-tip clip */}
                  <span className="rs-band -ms-4 block">
                    <span className="block bg-leaf py-2.5 pe-9 ps-8 font-display text-sm font-extrabold uppercase tracking-[0.08em] text-white [clip-path:polygon(0_0,calc(100%-18px)_0,100%_50%,calc(100%-18px)_100%,0_100%)]">
                      {s.tag}
                    </span>
                  </span>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
