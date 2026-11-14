import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cms, getHomeData } from '@/lib/cms'
import { getMediaIndex } from '@/lib/media'
import {
  CATALOGUE,
  catalogueEntry,
  itemsFor,
  productsFor,
  rangeHeading,
  usesFor,
} from '@/lib/catalogue'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryChapter from '@/components/home/CategoryChapter'
import CategoryRange from '@/components/home/CategoryRange'
import Quote from '@/components/home/Quote'
import CategoryHero from '@/components/category/CategoryHero'
import ProductList from '@/components/category/ProductList'
import CategoryNav from '@/components/category/CategoryNav'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const entry = catalogueEntry((await params).slug)
  return entry ? { title: `${entry.name} · Klen Plus`, description: entry.text } : {}
}

/**
 * A category's inner page: the scroll-film hero (or a vector hero when the category has no film), its
 * product types, every active product grouped by subcategory, the rest of the catalogue and the quote form.
 */
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const entry = catalogueEntry(slug)
  if (!entry) notFound()

  const [{ home, site, categories }, payload] = await Promise.all([getHomeData(), cms()])
  const products = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    limit: 2000,
    depth: 0,
    pagination: false,
  })

  const bySlug = new Map(categories.map((c) => [c.slug, c]))
  const chapterCat = entry.chapter ? bySlug.get(entry.chapter) : undefined
  const film = chapterCat?.chapter?.giant ? chapterCat : undefined
  const items = itemsFor(entry, bySlug)
  const groups = productsFor(entry, products.docs, categories)
  const total = groups.reduce((n, g) => n + g.products.length, 0)
  const index = CATALOGUE.indexOf(entry) + 1

  return (
    <>
      <Header categories={categories} home="/" />
      <main className="relative z-10">
        {film ? (
          <>
            <span id="top" />
            <CategoryChapter category={film} index={index} />
          </>
        ) : (
          <CategoryHero
            icon={entry.key}
            name={entry.name}
            giant={entry.short}
            text={entry.text}
            count={total}
            items={items}
            image={getMediaIndex()[`catalogue/${entry.key}`]?.image}
          />
        )}
        <CategoryRange
          id="types"
          index={index}
          name={entry.name}
          count={total || undefined}
          heading={rangeHeading(entry, items.length)}
          text={(!entry.picks && film?.chapter?.hookText) || entry.text}
          items={items}
          uses={usesFor(entry)}
          icon={entry.key}
          cta={
            total
              ? { href: '#products-list', label: `See all ${total} products` }
              : { href: '#quote', label: 'Ask for a quote on this range' }
          }
        />
        <ProductList groups={groups} icon={entry.key} name={entry.short} />
        <CategoryNav current={entry.key} />
        <Quote content={home.quote} site={site} />
      </main>
      <Footer categories={categories} site={site} />
    </>
  )
}
