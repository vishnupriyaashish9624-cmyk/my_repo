'use client'

import { Fragment, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import type { Home } from '@/payload-types'
import { enter } from '@/lib/enter'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** Keyword in the statement → photo shown in an inline chip right after it (first occurrence only). */
export type IntroChips = Record<string, string | undefined>

const bare = (word: string) => word.toLowerCase().replace(/[^a-z]/g, '')

/**
 * White sheet that slides up over the pinned hero.
 * - The sheet grows from a slightly narrower card to full width as it rises.
 * - The statement darkens word by word with scroll; product words ("foil", "cleaner", "carton") pop a
 *   small photo chip inline as the reading reaches them.
 * - The shelf line above the facts draws across (the travelling products land on it), then each
 *   figure counts up, its unit slides in and its description rises line by line.
 */
export default function Intro({
  statement,
  facts,
  texture,
  chips = {},
}: {
  statement: string
  facts: NonNullable<Home['facts']>
  texture?: string
  chips?: IntroChips
}) {
  const root = useRef<HTMLElement>(null)

  const used = new Set<string>()
  // No closing full stop: the statement ends on its last photo chip.
  const words = statement
    .replace(/\.\s*$/, '')
    .split(' ')
    .map((raw) => {
      // Chips go between the word and its punctuation: "carton ●." rather than "carton. ●"
      const [, w, tail] = raw.match(/^(.*?)([.,:;!?]*)$/) ?? [raw, raw, '']
      const key = bare(w)
      const chip = chips[key] && !used.has(key) ? chips[key] : undefined
      if (chip) used.add(key)
      return { w: chip ? w : raw, tail: chip ? tail : '', chip }
    })

  useGSAP(
    () => {
      const el = root.current!
      const q = gsap.utils.selector(el)
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Sheet rises from a card into the full-width page.
        gsap.fromTo(
          el,
          { scale: 0.94, borderTopLeftRadius: 72, borderTopRightRadius: 72 },
          {
            scale: 1,
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 15%', scrub: true },
          },
        )

        // Reading pass: each word darkens in turn; chips pop as their word is reached.
        const reading = gsap.timeline({
          scrollTrigger: {
            trigger: q('.intro-statement')[0],
            start: 'top 80%',
            end: 'bottom 40%',
            scrub: 0.4,
          },
        })
        q('.iw').forEach((word, i) => {
          const chip = word.nextElementSibling?.classList.contains('intro-chip')
            ? word.nextElementSibling
            : null
          const tail = chip?.nextElementSibling?.classList.contains('iw-tail')
            ? chip.nextElementSibling
            : null
          reading.fromTo(
            [word, tail].filter(Boolean),
            { color: '#c3ccdc' },
            { color: '#1c2a5c', duration: 0.1, ease: 'none' },
            i * 0.1,
          )
          if (chip)
            reading.fromTo(
              chip,
              { scale: 0, rotate: -25 },
              { scale: 1, rotate: 0, duration: 0.25, ease: 'back.out(2.2)' },
              i * 0.1 + 0.04,
            )
        })

        // Facts: draw the shelf line, then count, slide and rise.
        const lines = q('.intro-fact dd').map((dd) =>
          SplitText.create(dd, { type: 'lines', mask: 'lines' }),
        )
        const facts = gsap.timeline({
          scrollTrigger: { trigger: q('.intro-facts')[0], start: 'top 85%', once: true },
        })
        facts.from(q('.intro-rule'), { scaleX: 0, duration: 1.1, ease: 'power3.inOut' }, 0)
        q('.intro-fact').forEach((fact, i) => {
          const at = 0.35 + i * 0.15
          const value = fact.querySelector<HTMLElement>('.intro-value')!
          const text = value.dataset.value ?? ''
          const counter = { p: 0 }
          // Start at zero so the figure doesn't show its final value before it counts up.
          value.textContent = text.replace(/\d+(\.\d+)?/g, '0')
          facts
            .from(fact, { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out' }, at)
            // Every number in the value counts up together, so "50×20" and "446" both work.
            .to(
              counter,
              {
                p: 1,
                duration: 1.4,
                ease: 'power3.out',
                onUpdate: () =>
                  (value.textContent = text.replace(/\d+(\.\d+)?/g, (m) =>
                    String(Math.round(Number(m) * counter.p)),
                  )),
              },
              at,
            )
            .from(
              fact.querySelector('.intro-unit'),
              { x: -16, opacity: 0, duration: 0.6, ease: 'power3.out' },
              at + 0.35,
            )
          enter(
            facts,
            lines[i].lines,
            { yPercent: 110 },
            { stagger: 0.06, duration: 0.7, ease: 'power3.out' },
            at + 0.25,
          )
        })

        return () => {
          lines.forEach((l) => l.revert())
          q('.intro-value').forEach((v) => (v.textContent = v.dataset.value ?? ''))
        }
      })
    },
    { scope: root, dependencies: [statement, facts.length] },
  )

  return (
    <section
      id="about"
      ref={root}
      className="relative z-10 origin-top rounded-t-[36px] theme-light px-5 pb-20 pt-24 shadow-[0_-24px_60px_rgba(28,42,92,0.10)] motion-safe:-mt-[100svh] md:px-10 md:pb-28 md:pt-36"
    >
      {texture && (
        // Faint quilted-tissue grain on the sheet (media/textures/tissue).
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 mix-blend-multiply"
          style={{ backgroundImage: `url(${texture})`, backgroundSize: '512px' }}
        />
      )}
      <div className="relative mx-auto max-w-[1840px]">
        <p
          className="intro-statement text-center font-display text-[clamp(1.9rem,4.3vw,3.9rem)] font-semibold leading-[1.1] tracking-[-0.025em]"
          // Centred, with breathing room either side that grows with the screen (none on phones).
          style={{ paddingInline: 'clamp(0px, 7vw, 160px)' }}
        >
          {words.map(({ w, tail, chip }, i) => (
            <Fragment key={i}>
              <span className="iw">{w}</span>
              {chip && (
                <span
                  aria-hidden
                  className="intro-chip mx-[0.18em] inline-block h-[0.82em] w-[1.5em] overflow-hidden rounded-full align-[-0.08em] shadow-[0_6px_16px_-6px_rgba(28,42,92,0.4)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={chip} alt="" className="h-full w-full object-cover" />
                </span>
              )}
              {tail && <span className="iw-tail">{tail}</span>}{' '}
            </Fragment>
          ))}
        </p>

        <dl
          // Same side padding as the statement, three equal centred columns beneath it.
          className="intro-facts relative mt-16 grid gap-8 pt-8 text-center md:mt-24 md:grid-cols-3"
          style={{ marginInline: 'clamp(0px, 7vw, 160px)' }}
        >
          <span
            aria-hidden
            className="intro-rule absolute inset-x-0 top-0 h-px origin-left bg-line"
          />
          {facts.map((f) => (
            <div key={f.id ?? f.value} className="intro-fact">
              <dt className="font-display text-5xl font-bold tracking-[-0.03em] text-navy tabular-nums md:text-6xl">
                <span className="intro-value" data-value={f.value}>
                  {f.value}
                </span>
                {f.unit && (
                  <small className="intro-unit ms-2 inline-block font-mono text-sm font-medium tracking-normal text-leaf-deep">
                    {f.unit}
                  </small>
                )}
              </dt>
              {f.text && <dd className="mx-auto mt-3 max-w-[32ch] text-slate">{f.text}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
