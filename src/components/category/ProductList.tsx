'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { ProductGroup } from '@/lib/catalogue'
import { CategoryVector, VectorScene, type VectorKey } from '../vectors/CategoryVector'

const EASE = [0.2, 0.7, 0.2, 1] as const

/**
 * Every active product in the category, grouped by subcategory. Filter chips narrow to one group and
 * the search box filters by name, size or pack; cards animate in and out as the list changes.
 */
export default function ProductList({ groups, icon, name }: { groups: ProductGroup[]; icon: VectorKey; name: string }) {
  const [group, setGroup] = useState<string>('all')
  const [q, setQ] = useState('')
  const total = groups.reduce((n, g) => n + g.products.length, 0)

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return groups
      .filter((g) => group === 'all' || g.key === group)
      .map((g) => ({
        ...g,
        products: needle
          ? g.products.filter((p) => [p.name, p.size, p.colour, p.packing].some((v) => v?.toLowerCase().includes(needle)))
          : g.products,
      }))
      .filter((g) => g.products.length)
  }, [groups, group, q])
  const count = shown.reduce((n, g) => n + g.products.length, 0)

  return (
    <section id="products-list" aria-labelledby="products-list-title" className="relative bg-white px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-[1260px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label !text-leaf-deep">The full list · {name}</p>
            <h2 id="products-list-title" className="mt-3 text-[clamp(2rem,4.2vw,3.6rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              {total ? `${total} products` : 'Sourced to order'}
            </h2>
          </div>
          {total > 0 && (
            <label className="flex w-full items-center gap-2 rounded-xl border border-line bg-paper px-4 py-3 focus-within:border-leaf sm:w-80">
              <svg viewBox="0 0 16 16" className="size-4 text-slate" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5 14 14" />
              </svg>
              <span className="sr-only">Search products</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, size or pack"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate/70"
              />
            </label>
          )}
        </div>

        {total === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-line bg-paper px-6 py-14 text-center">
            <VectorScene className="w-28">
              <CategoryVector name={icon} className="w-full" />
            </VectorScene>
            <p className="max-w-md text-slate">
              This range is sourced to order. Tell us what you use and how much, and we&apos;ll quote it with the rest of your list.
            </p>
            <a href="#quote" className="rounded-xl bg-leaf px-5 py-3 font-semibold text-white transition hover:bg-leaf-deep">
              Ask for a quote
            </a>
          </div>
        ) : (
          <>
            {groups.length > 1 && (
              <div role="group" aria-label="Filter by type" className="mt-8 flex flex-wrap gap-2">
                {[{ key: 'all', name: 'All', products: { length: total } }, ...groups].map((g) => {
                  const on = group === g.key
                  return (
                    <button
                      key={g.key}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setGroup(g.key)}
                      className={`relative rounded-full border px-4 py-2 text-sm font-medium transition ${on ? 'border-transparent text-white' : 'border-line bg-white hover:border-leaf'}`}
                    >
                      {on && <motion.span layoutId="product-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
                      <span className="relative">
                        {g.name} <span className={on ? 'text-white/60' : 'text-slate'}>{g.products.length}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            <p className="mt-6 font-mono text-xs text-slate" aria-live="polite">
              Showing {count} of {total}
            </p>

            <div className="mt-4 flex flex-col gap-10">
              <AnimatePresence initial={false} mode="popLayout">
                {shown.map((g) => (
                  <motion.div key={g.key} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <h3 className="flex items-center gap-3 text-xl font-bold tracking-[-0.02em]">
                      {g.name}
                      <span className="h-px flex-1 bg-line" />
                      <span className="font-mono text-xs font-normal text-slate">{g.products.length}</span>
                    </h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      <AnimatePresence initial={false} mode="popLayout">
                        {g.products.map((p, i) => (
                          <motion.li
                            key={p.id}
                            layout
                            initial={{ opacity: 0, y: 20, scale: 0.97 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.45, delay: Math.min(i, 8) * 0.03, ease: EASE }}
                            className="group flex flex-col gap-3 rounded-2xl border border-line bg-paper p-4 transition hover:-translate-y-0.5 hover:border-leaf hover:bg-white hover:shadow-[0_16px_36px_-24px_rgba(28,42,92,0.45)]"
                          >
                            <p className="font-medium leading-snug">{p.name}</p>
                            <div className="mt-auto flex flex-wrap gap-1.5">
                              {p.size && <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[11px] group-hover:bg-leaf-soft">{p.size}</span>}
                              {p.colour && <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[11px] group-hover:bg-leaf-soft">{p.colour}</span>}
                              {p.packing && (
                                <span className="rounded-full bg-white px-2.5 py-1 font-mono text-[11px] text-slate group-hover:bg-leaf-soft">Pack {p.packing}</span>
                              )}
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </motion.div>
                ))}
              </AnimatePresence>
              {count === 0 && <p className="text-slate">Nothing matches “{q}”. Try a size like “45cm” or a pack like “x 20”.</p>}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
