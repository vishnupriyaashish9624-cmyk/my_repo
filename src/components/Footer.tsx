'use client'

import { useRef, type CSSProperties } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { Site } from '@/payload-types'
import type { CategoryWithCount } from '@/lib/cms'
import { CATALOGUE, categoryHref } from '@/lib/catalogue'
import { chapterHash } from '@/lib/chapters'
import { CategoryVector, VectorScene, type VectorKey } from './vectors/CategoryVector'
import { UseVector, type UseKey } from './vectors/TissueVectors'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WORD = [
  { text: 'Klen', className: 'text-white' },
  { text: 'Plus', className: 'text-leaf' },
]

/** Chapter links by title (absolute, so they also work from category pages). */
const sec = (title: string) => `/${chapterHash(title)}`
const COMPANY = [
  { label: 'About Klen+', href: '/about' },
  { label: 'Who we are', href: '/who-we-are' },
  { label: 'Why choose Klen+', href: sec('Why choose Klen+') },
  { label: 'Quality checks', href: sec('Our approach to quality checks') },
  { label: 'Our commitment', href: sec('Our commitment to your business') },
  { label: 'FAQ', href: sec('Frequently asked questions') },
  { label: 'Contact us', href: '/contact' },
]
const EXPLORE = [
  // These two have no chapter header of their own, so they link to their section.
  { label: 'Product range', href: '/#catalogue' },
  { label: 'What we provide', href: sec('What we provide') },
  { label: 'Industrial solutions', href: sec('Our industrial solutions') },
  { label: 'Care in every delivery', href: '/#delivery' },
  { label: 'Product information', href: sec('Product information & documentation') },
]
/** Category icons drifting faintly behind the footer. */
const DRIFT: { key: VectorKey; className: string }[] = [
  { key: 'cups', className: 'start-[3%] top-[12%] w-20' },
  { key: 'tissue', className: 'start-[30%] top-[6%] w-16' },
  { key: 'chemicals', className: 'end-[30%] top-[14%] w-20' },
  { key: 'bags', className: 'end-[4%] top-[30%] w-24' },
  { key: 'aluminium', className: 'start-[8%] top-[48%] w-20' },
  { key: 'tools', className: 'start-[46%] top-[52%] w-16' },
  { key: 'foam', className: 'end-[12%] top-[60%] w-20' },
  { key: 'ppe', className: 'start-[22%] bottom-[16%] w-16' },
]

/** Link underline that draws in from the left on hover and keyboard focus. */
const link =
  'bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 hover:bg-[length:100%_1px] focus-visible:bg-[length:100%_1px]'

/**
 * Closing reveal. On tall desktop screens the footer sits underneath the page and is uncovered as the
 * quote section lifts away. As it's revealed, the content settles from below and a giant "Klen Plus"
 * rises letter by letter (the travelling products land on top of its letters). Link columns deal in
 * once, and the back-to-top button's ring tracks how far down the page you are.
 */
export default function Footer({
  categories,
  site,
}: {
  categories: CategoryWithCount[]
  site: Site
}) {
  const root = useRef<HTMLElement>(null)
  const ring = useRef<SVGCircleElement>(null)

  const contact = [
    site.phone && { label: site.phone, href: `tel:${site.phone.replace(/\s/g, '')}` },
    site.whatsapp && { label: 'WhatsApp', href: `https://wa.me/${site.whatsapp}` },
    site.email && { label: site.email, href: `mailto:${site.email}` },
  ].filter(Boolean) as { label: string; href: string }[]

  useGSAP(
    () => {
      const el = root.current!
      const q = gsap.utils.selector(el)

      // Page progress ring on the back-to-top button (runs for everyone; it's information, not decoration).
      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) =>
          ring.current && (ring.current.style.strokeDashoffset = String(1 - self.progress)),
      })

      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The footer can be sticky, so its own box doesn't say where the reveal happens. The reveal runs
        // from main's bottom touching the viewport bottom until main has lifted by the footer's height.
        const main = document.querySelector('main')
        const at = (fraction: number) => () =>
          `bottom bottom-=${Math.round(el.offsetHeight * fraction)}`
        const reveal = {
          trigger: main,
          start: 'bottom bottom',
          end: at(1),
          scrub: 0.5,
          invalidateOnRefresh: true,
        }

        // Set the hidden state explicitly: a staggered fromTo on a scroll trigger only pre-renders its first target.
        // Explicit from/to values: a plain .to() re-reads its start on refresh and could lock the letters
        // at their hidden offset. Each letter gets the same range, staggered across the reveal.
        gsap.set(q('.footer-char'), { yPercent: 105 })
        gsap.fromTo(
          q('.footer-char'),
          { yPercent: 105 },
          {
            yPercent: 0,
            stagger: 0.06,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: { ...reveal },
          },
        )
        gsap.fromTo(
          q('.footer-plus'),
          { scale: 0, rotate: -120 },
          {
            scale: 1,
            rotate: 0,
            ease: 'back.out(2)',
            scrollTrigger: { ...reveal, start: at(0.45) },
          },
        )
        gsap.fromTo(
          q('.footer-inner'),
          { y: 80, opacity: 0.2 },
          { y: 0, opacity: 1, ease: 'none', scrollTrigger: { ...reveal, end: at(0.6) } },
        )
        // Columns deal in once, when a fifth of the footer is showing.
        gsap.set(q('.footer-col'), { y: 24, opacity: 0 })
        gsap.set(q('.footer-col li'), { x: -12, opacity: 0 })
        ScrollTrigger.create({
          trigger: main,
          start: at(0.2),
          invalidateOnRefresh: true,
          once: true,
          onEnter: () => {
            gsap.to(q('.footer-col'), {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.8,
              ease: 'power3.out',
            })
            gsap.to(q('.footer-col li'), {
              x: 0,
              opacity: 1,
              stagger: 0.03,
              duration: 0.5,
              ease: 'power2.out',
              delay: 0.1,
            })
          },
        })
      })

      return () => st.kill()
    },
    { scope: root },
  )

  const year = new Date().getFullYear()
  const countFor = (chapter?: string) => categories.find((c) => c.slug === chapter)?.count

  return (
    <footer
      id="site-footer"
      ref={root}
      className="theme-dark relative z-0 overflow-hidden px-5 pb-6 pt-10 md:px-10 [@media(min-width:1024px)_and_(min-height:760px)]:motion-safe:sticky [@media(min-width:1024px)_and_(min-height:760px)]:motion-safe:bottom-0"
    >
      {/* Background: a dotted delivery route with a van, and category icons drifting at low opacity */}
      <svg
        aria-hidden
        viewBox="0 0 1600 400"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 top-6 h-[60%] w-full"
      >
        <path
          id="footer-route"
          className="map-road"
          d="M-20 260 C220 120 420 330 680 210 C900 110 1080 300 1300 180 C1440 110 1540 160 1640 120"
          fill="none"
          stroke="var(--color-leaf)"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <g>
          <rect x="-14" y="-9" width="28" height="18" rx="4" fill="#fff" />
          <rect x="5" y="-7" width="8" height="7" rx="1.5" fill="#9cc1f0" />
          <rect x="-12" y="-3" width="13" height="3" rx="1" fill="var(--color-leaf)" />
          <circle cx="-7" cy="9" r="3.4" fill="#0f1838" />
          <circle cx="7" cy="9" r="3.4" fill="#0f1838" />
          <animateMotion dur="16s" repeatCount="indefinite" rotate="auto">
            <mpath href="#footer-route" />
          </animateMotion>
        </g>
      </svg>
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
        {DRIFT.map((d, i) => (
          <div key={d.key} className={`absolute ${d.className} opacity-[0.12]`}>
            <div
              className="vx-drift"
              style={{ '--d': `${-i * 1.6}s`, '--dur': `${9 + (i % 3) * 2}s` } as CSSProperties}
            >
              <VectorScene drawn>
                <CategoryVector
                  name={d.key}
                  blob={false}
                  className="w-full [&_.text-ink]:text-white"
                />
              </VectorScene>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-inner relative mx-auto max-w-[1840px]">
        {/* Call to action */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-7">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-leaf">
              Let&apos;s talk about your list
            </p>
            <p className="mt-3 font-display text-[clamp(2rem,4vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              Your next restock <span className="text-leaf">starts here.</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#quote"
              className="group inline-flex items-center gap-2 rounded-full bg-leaf px-6 py-3.5 font-semibold text-white transition hover:bg-leaf-deep"
            >
              Request a quote
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </a>
            {site.whatsapp && (
              <a
                href={`https://wa.me/${site.whatsapp}`}
                className="rounded-full border border-white/25 px-6 py-3.5 font-semibold transition hover:border-leaf"
              >
                WhatsApp us
              </a>
            )}
          </div>
        </div>

        {/* Columns */}
        <div className="mt-8 grid gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.6fr_auto]">
          <div className="footer-col">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/klen-plus-logo.png"
              alt="Klen Plus"
              width={246}
              height={100}
              className="box-content h-9 w-auto rounded-xl bg-white px-3 py-2"
            />
            {site.tagline && <p className="mt-4 max-w-[34ch] text-white/65">{site.tagline}</p>}
            <ul className="mt-5 flex flex-col gap-2 text-[15px]">
              {contact.map((c) => (
                <li key={c.href}>
                  <a href={c.href} className={`${link} inline-flex items-center gap-2`}>
                    <span className="size-1.5 rounded-full bg-leaf" />
                    {c.label}
                  </a>
                </li>
              ))}
              {!contact.length && process.env.NODE_ENV === 'development' && (
                <li className="text-sm text-white/45">
                  Add phone, WhatsApp and email in Site settings.
                </li>
              )}
              {site.address && (
                <li className="whitespace-pre-line text-white/60">{site.address}</li>
              )}
            </ul>
            <div className="mt-6 flex gap-2">
              {(['delivery', 'storeroom', 'counter'] as UseKey[]).map((k) => (
                <span
                  key={k}
                  className="orbit-bob grid size-12 place-items-center rounded-full bg-white"
                  style={{
                    animationDelay: `${-['delivery', 'storeroom', 'counter'].indexOf(k) * 0.6}s`,
                  }}
                >
                  <VectorScene drawn className="w-9">
                    <UseVector name={k} className="w-full" />
                  </VectorScene>
                </span>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h2 className="label mb-4 !text-leaf">Company</h2>
            <ul className="flex flex-col gap-2.5 text-[15px] text-white/85">
              {COMPANY.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="label mb-4 !text-leaf">Explore</h2>
            <ul className="flex flex-col gap-2.5 text-[15px] text-white/85">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="label mb-4 !text-leaf">Products</h2>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              {CATALOGUE.map((c) => (
                <li key={c.key}>
                  <a
                    href={categoryHref(c.key)}
                    className="group flex items-center gap-2 rounded-lg py-1 text-white/85 transition hover:text-white"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white/90 transition group-hover:-rotate-6 group-hover:bg-white">
                      <VectorScene drawn className="w-6">
                        <CategoryVector name={c.key} blob={false} className="w-full" />
                      </VectorScene>
                    </span>
                    <span className="truncate">{c.short}</span>
                    {countFor(c.chapter) !== undefined && !c.picks && (
                      <span className="ms-auto font-mono text-[10px] text-white/40">
                        {countFor(c.chapter)}
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col lg:justify-self-end">
            <a
              href="#top"
              aria-label="Back to top"
              className="group relative flex h-16 w-16 items-center justify-center rounded-full text-white"
            >
              <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="rgb(255 255 255 / 0.15)"
                  strokeWidth="2"
                />
                <circle
                  ref={ring}
                  cx="32"
                  cy="32"
                  r="30"
                  fill="none"
                  stroke="var(--color-leaf)"
                  strokeWidth="2"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  strokeLinecap="round"
                />
              </svg>
              <span
                aria-hidden
                className="text-xl transition-transform duration-300 group-hover:-translate-y-1"
              >
                ↑
              </span>
            </a>
          </div>
        </div>

        {/* Icon conveyor */}
        <div aria-hidden className="relative mt-8 overflow-hidden border-y border-white/10 py-2.5">
          <div className="marquee flex w-max items-center gap-8 [animation-duration:50s]">
            {[...CATALOGUE, ...CATALOGUE].map((c, i) => (
              <span
                key={i}
                className="flex items-center gap-2 whitespace-nowrap text-sm text-white/55"
              >
                <span className="grid size-8 place-items-center rounded-full bg-white/90">
                  <VectorScene drawn className="w-6">
                    <CategoryVector name={c.key} blob={false} className="w-full" />
                  </VectorScene>
                </span>
                {c.short}
                <span className="ms-4 text-leaf">+</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Giant wordmark; letters rise as the footer is revealed */}
      <div
        aria-hidden
        className="relative mx-auto mt-4 flex max-w-[1840px] select-none items-end justify-between overflow-hidden"
      >
        <p className="footer-word flex font-display text-[clamp(3.5rem,12vw,10.5rem)] font-extrabold leading-[0.82] tracking-[-0.06em]">
          {WORD.map((part) => (
            <span
              key={part.text}
              className={`flex ${part.className} ${part.text === 'Plus' ? 'ms-[0.12em]' : ''}`}
            >
              {part.text.split('').map((ch, i) => (
                <span key={i} className="footer-char inline-block pb-[0.04em]">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>
        <svg
          viewBox="0 0 48 48"
          className="footer-plus mb-[2%] hidden h-[clamp(3rem,7vw,6rem)] w-[clamp(3rem,7vw,6rem)] shrink-0 sm:block"
          aria-hidden
        >
          <path
            d="M18 6h12v12h12v12H30v12H18V30H6V18h12Z"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M17 31c2-9 9-14 18-14-1 9-7 15-18 14Z" fill="var(--color-leaf)" />
        </svg>
      </div>

      {/* Bottom bar */}
      <div className="relative mx-auto mt-4 flex max-w-[1840px] flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5 text-[13px] text-white/55">
        <span>© {year} Klen Plus</span>
        <span>Food packaging, tissue &amp; cleaning supplies</span>
        <a href="#quote" className={`${link} text-white/75`}>
          Request a quote
        </a>
      </div>
    </footer>
  )
}
