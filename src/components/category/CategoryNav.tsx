'use client'

import { motion } from 'motion/react'
import { CATALOGUE, categoryHref } from '@/lib/catalogue'
import { CategoryVector, VectorScene } from '../vectors/CategoryVector'

/** "More categories": the other 13 as buttons with their animated icons, plus a way back to the full catalogue. */
export default function CategoryNav({ current }: { current: string }) {
  const others = CATALOGUE.map((c, i) => ({ ...c, n: i + 1 })).filter((c) => c.key !== current)
  return (
    <section aria-labelledby="more-cats" className="bg-paper px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1260px]">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="more-cats" className="text-[clamp(1.7rem,3vw,2.6rem)] font-bold leading-none tracking-[-0.03em]">
            More from the catalogue
          </h2>
          {/* Full page load on purpose: the homepage's scroll scenes set themselves up on load. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/#catalogue" className="font-semibold text-leaf-deep hover:underline">
            All 14 categories →
          </a>
        </div>
        <ul className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {others.map((c, i) => (
            <motion.li
              key={c.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.05 }}
            >
              <a
                href={categoryHref(c.key)}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-white px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-leaf"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-leaf-soft">
                  <VectorScene drawn className="w-8">
                    <CategoryVector name={c.key} blob={false} className="w-full" />
                  </VectorScene>
                </span>
                <span className="flex-1 font-display text-[15px] font-bold leading-tight">{c.short}</span>
                <span className="font-mono text-sm text-line transition group-hover:text-leaf">{String(c.n).padStart(2, '0')}</span>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
