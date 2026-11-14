'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import type { Home } from '@/payload-types'
import { enter } from '@/lib/enter'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

type Steps = NonNullable<Home['steps']>

/** Example lines shown in the step vignettes (illustrative, taken from real products in the sheet). */
const LIST = [
  { item: 'MW container black RE24', qty: '10 ctn', pack: '50 pcs × 3 pkt' },
  { item: 'Foil roll 45 cm · 1.5 kg', qty: '5 ctn', pack: '1 × 6' },
  { item: 'Dish wash lemon 5 L', qty: '2 ctn', pack: '4 × 5 L' },
]

const Check = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={`h-4 w-4 ${className}`} aria-hidden>
    <path
      d="M3.5 8.5 6.5 11.5 12.5 4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/** A small, concrete picture of each step. Only the first four steps have one. */
function Vignette({ index }: { index: number }) {
  const shell =
    'v-card relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white p-4 text-ink shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]'
  if (index === 0)
    return (
      <div className={shell}>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-slate">
          My order list
        </p>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {LIST.map((l) => (
            <li
              key={l.item}
              className="v-row flex items-center justify-between gap-2 rounded-lg bg-paper px-2.5 py-1.5 text-[12.5px]"
            >
              <span className="truncate font-medium">{l.item}</span>
              <span className="shrink-0 font-mono text-[11px] text-leaf-deep">{l.qty}</span>
            </li>
          ))}
        </ul>
      </div>
    )
  if (index === 1)
    return (
      <div className={`${shell} flex flex-col justify-end gap-2 bg-[#eef3f9]`}>
        <div className="v-bubble ms-auto max-w-[85%] rounded-2xl rounded-br-md bg-leaf px-3 py-2 text-[12.5px] text-white">
          Hi Klen Plus, here’s this month’s list: 3 items, 17 cartons.
        </div>
        <p className="v-status ms-auto flex items-center gap-1 font-mono text-[10.5px] text-slate">
          Sent <Check className="v-tick text-leaf-deep" />
        </p>
        <svg
          viewBox="0 0 24 24"
          className="v-plane absolute start-4 top-4 h-6 w-6 text-navy"
          aria-hidden
        >
          <path
            d="M3 11.5 21 3l-6.5 18-3-7.5L3 11.5Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  if (index === 2)
    return (
      <div className={shell}>
        <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-slate">Confirmed</p>
        <ul className="mt-2.5 flex flex-col gap-1.5">
          {LIST.map((l) => (
            <li key={l.item} className="flex items-center justify-between gap-2 text-[12.5px]">
              <span className="truncate">{l.pack}</span>
              <span className="v-ok flex shrink-0 items-center gap-1 font-mono text-[11px] text-leaf-deep">
                <Check /> In stock
              </span>
            </li>
          ))}
        </ul>
        <span className="v-chip mt-3 inline-flex rounded-full bg-leaf-soft px-2.5 py-1 font-mono text-[11px] text-leaf-deep">
          Delivery · Thursday
        </span>
      </div>
    )
  if (index === 3)
    return (
      <div className={`${shell} flex flex-col justify-between`}>
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-slate">
            Saved list · 3 items
          </p>
          <svg viewBox="0 0 24 24" className="v-spin h-5 w-5 text-navy" aria-hidden>
            <path
              d="M20 12a8 8 0 1 1-2.34-5.66M20 4v4h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          {LIST.map((l) => (
            <span
              key={l.item}
              className="h-1.5 rounded-full bg-mist"
              style={{ width: `${90 - LIST.indexOf(l) * 18}%` }}
            />
          ))}
        </div>
        <span className="v-button inline-flex justify-center rounded-xl bg-navy px-3 py-2 text-[13px] font-semibold text-white">
          Reorder
        </span>
      </div>
    )
  return null
}

/** Adds each vignette's own motion to a timeline at `at`. */
function playVignette(tl: gsap.core.Timeline, card: HTMLElement | null, index: number, at: number) {
  if (!card) return
  const q = gsap.utils.selector(card)
  tl.from(
    card,
    { y: 30, opacity: 0, rotate: index % 2 ? 2 : -2, duration: 0.35, ease: 'power3.out' },
    at,
  )
  if (index === 0)
    enter(
      tl,
      q('.v-row'),
      { x: -24, opacity: 0 },
      { stagger: 0.12, duration: 0.3, ease: 'power3.out' },
      at + 0.15,
    )
  if (index === 1)
    tl.from(
      q('.v-bubble'),
      {
        y: 20,
        scale: 0.9,
        opacity: 0,
        transformOrigin: '100% 100%',
        duration: 0.3,
        ease: 'back.out(1.7)',
      },
      at + 0.15,
    )
      .fromTo(
        q('.v-plane'),
        { x: 0, y: 0, opacity: 1 },
        { x: 140, y: -40, opacity: 0, duration: 0.4, ease: 'power2.in' },
        at + 0.3,
      )
      .from(q('.v-status'), { opacity: 0, duration: 0.15 }, at + 0.45)
      .from(q('.v-tick'), { scale: 0, duration: 0.2, ease: 'back.out(3)' }, at + 0.5)
  if (index === 2)
    enter(
      tl,
      q('.v-ok'),
      { opacity: 0, x: 10 },
      { stagger: 0.1, duration: 0.2, ease: 'power2.out' },
      at + 0.15,
    ).from(
      q('.v-chip'),
      { scale: 0.6, opacity: 0, transformOrigin: '0% 50%', duration: 0.3, ease: 'back.out(2)' },
      at + 0.5,
    )
  if (index === 3)
    tl.fromTo(
      q('.v-spin'),
      { rotate: -360 },
      { rotate: 0, duration: 0.6, ease: 'power2.inOut' },
      at + 0.1,
    ).fromTo(
      q('.v-button'),
      { scale: 1 },
      { scale: 0.94, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.inOut' },
      at + 0.5,
    )
}

/**
 * Ordering steps as a sequence. Desktop pins the section: a line draws through the numbered steps,
 * a marker travels along it, and as it reaches each step the number fills green, the title and text
 * rise through masks and a small example card shows the step happening. Smaller screens get the same
 * reveals step by step as they scroll into view, with the line drawing down the side.
 */
export default function OrderSteps({ title, steps }: { title?: string | null; steps: Steps }) {
  const root = useRef<HTMLElement>(null)
  const n = steps.length

  useGSAP(
    () => {
      const el = root.current!
      const q = gsap.utils.selector(el)
      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 1023px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean }
          const splits = q('.step-copy').map((c) =>
            SplitText.create(c.querySelectorAll('h3, p'), { type: 'lines', mask: 'lines' }),
          )
          const heading = SplitText.create(q('.steps-title'), { type: 'words', mask: 'words' })
          enter(
            gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 70%', once: true } }),
            heading.words,
            { yPercent: 110 },
            { stagger: 0.06, duration: 1.1, ease: 'expo.out' },
            0,
          )

          const stepIn = (tl: gsap.core.Timeline, i: number, at: number) => {
            const step = q('.step')[i]
            const sq = gsap.utils.selector(step)
            tl.fromTo(
              sq('.step-num'),
              { backgroundColor: 'rgba(255,255,255,0.12)', color: '#b7c0dd', scale: 0.8 },
              {
                backgroundColor: '#3da629',
                color: '#ffffff',
                scale: 1,
                duration: 0.25,
                ease: 'back.out(2.5)',
              },
              at,
            )
            enter(
              tl,
              splits[i].lines,
              { yPercent: 110 },
              { stagger: 0.05, duration: 0.35, ease: 'power3.out' },
              at + 0.05,
            )
            playVignette(tl, (sq('.v-card')[0] as HTMLElement | undefined) ?? null, i, at + 0.1)
          }

          if (desktop) {
            // One step per unit; the line and marker reach step i at time i.
            const tl = gsap.timeline({
              defaults: { ease: 'none' },
              scrollTrigger: { trigger: el, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
            })
            tl.set(q('.steps-fill'), { scaleX: 0 }).set(q('.steps-marker'), { left: '0%' })
            for (let i = 0; i < n; i++) {
              if (i > 0) {
                tl.to(
                  q('.steps-fill'),
                  { scaleX: i / (n - 1), duration: 0.5, ease: 'power2.inOut' },
                  i - 0.5,
                ).to(
                  q('.steps-marker'),
                  { left: `${(i / (n - 1)) * 100}%`, duration: 0.5, ease: 'power2.inOut' },
                  i - 0.5,
                )
              }
              stepIn(tl, i, i)
            }
            tl.to({}, { duration: 0.6 }) // hold on the last step before the section releases
            // Render the start state now, so the steps aren't shown finished while the section scrolls into view.
            tl.progress(1).progress(0)
          } else {
            q('.step').forEach((step, i) => {
              const tl = gsap.timeline({
                scrollTrigger: { trigger: step, start: 'top 75%', once: true },
              })
              tl.from(
                step.querySelector('.step-rail'),
                { scaleY: 0, transformOrigin: 'top', duration: 0.6, ease: 'power2.out' },
                0,
              )
              stepIn(tl, i, 0)
              tl.timeScale(1.6)
            })
          }

          return () => {
            splits.forEach((s) => s.revert())
            heading.revert()
          }
        },
      )
    },
    { scope: root, dependencies: [n] },
  )

  return (
    <section id="order" ref={root} className="relative overflow-clip bg-ink text-white lg:motion-safe:h-[300svh]">
      <div className="relative px-5 py-20 md:px-10 md:py-28 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:items-center lg:motion-safe:py-0">
        {/* Same navy theme as Why Klen Plus: soft leaf and navy glows behind */}
        <div aria-hidden className="pointer-events-none absolute -end-40 -top-40 size-[560px] rounded-full bg-leaf/25 blur-[120px]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-48 -start-40 size-[560px] rounded-full bg-navy blur-[120px]" />
        <div className="relative mx-auto w-full max-w-[1260px] lg:motion-safe:pt-12">
          <p className="label !text-leaf">How ordering works</p>
          <h2 className="steps-title mt-3 max-w-3xl text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.035em] short:text-5xl">
            {title}
          </h2>

          <div className="relative mt-14 short:mt-8">
            {/* Desktop line through the step numbers (from the first centre to the last) */}
            <div
              aria-hidden
              className="absolute top-[14px] hidden h-0.5 bg-white/15 lg:block"
              style={{ left: `${50 / n}%`, right: `${50 / n}%` }}
            >
              <div className="steps-fill absolute inset-0 origin-left bg-leaf" />
              <span className="steps-marker absolute top-1/2 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-ink bg-leaf shadow-[0_0_0_4px_rgba(61,166,41,0.25)] lg:motion-safe:block" />
            </div>

            <ol
              className="grid gap-12 lg:grid-cols-[repeat(var(--steps),minmax(0,1fr))] lg:gap-7"
              style={{ '--steps': n } as React.CSSProperties}
            >
              {steps.map((s, i) => (
                <li
                  key={s.id ?? s.title}
                  className="step relative grid grid-cols-[36px_1fr] gap-x-4 lg:flex lg:flex-col lg:items-center lg:gap-5 lg:text-center"
                >
                  {/* Mobile rail down the side */}
                  {i < n - 1 && (
                    <span
                      aria-hidden
                      className="step-rail absolute bottom-[-3rem] start-[14px] top-9 w-0.5 bg-white/15 lg:hidden"
                    />
                  )}
                  <span className="step-num relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-leaf font-mono text-xs text-white">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-4 lg:w-full lg:items-center">
                    <div className="step-copy lg:order-2">
                      <h3 className="text-[22px] font-bold tracking-[-0.02em]">{s.title}</h3>
                      {s.text && (
                        <p className="mt-2 max-w-[34ch] text-white/70 lg:mx-auto">{s.text}</p>
                      )}
                    </div>
                    {i < 4 && (
                      <div className="h-[168px] w-full max-w-[320px] text-start short:h-[140px] lg:order-1">
                        <Vignette index={i} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
