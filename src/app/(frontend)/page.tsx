import Link from 'next/link'
import { cms, getHomeData } from '@/lib/cms'
import { getMediaIndex } from '@/lib/media'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/home/Hero'
import Intro from '@/components/home/Intro'
import CategoryRail from '@/components/home/CategoryRail'
import BrandMarquee from '@/components/home/BrandMarquee'
import Industries from '@/components/home/Industries'
import RestockSteps from '@/components/home/RestockSteps'
import Quote from '@/components/home/Quote'
import TravellingItems from '@/components/home/TravellingItems'
import CategoryIndex from '@/components/home/CategoryIndex'
import WhyKlen from '@/components/home/WhyKlen'
import DeliveryMap from '@/components/home/DeliveryMap'
import TakeawayLoop from '@/components/home/TakeawayLoop'
import BestProducts from '@/components/home/BestProducts'
import DispatchChecks from '@/components/home/DispatchChecks'
import IsoCity from '@/components/home/IsoCity'
import Faq from '@/components/home/Faq'
import { faqItems } from '@/lib/faq'
import { CATALOGUE, categoryHref, keyForCms } from '@/lib/catalogue'
import { ChapterMark, ChapterNav } from '@/components/home/Chapters'
import { chapterId } from '@/lib/chapters'
import AboutKlen from '@/components/home/AboutKlen'
import QualityChecks from '@/components/home/QualityChecks'
import ProductInfo, { type SampleProduct } from '@/components/home/ProductInfo'
import { Commitment, ContactCards } from '@/components/home/Commitment'
import VectorRibbon from '@/components/home/VectorRibbon'

export const revalidate = 60

export default async function HomePage() {
  const { home, site, categories, brands, allBrands } = await getHomeData()
  const media = getMediaIndex()

  if (!home?.hero?.title) {
    return (
      <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center gap-4 px-5">
        <h1 className="text-4xl font-bold">Klen Plus</h1>
        <p className="text-slate">
          No content yet. Create an admin user at{' '}
          <Link className="font-semibold text-navy underline" href="/admin">
            /admin
          </Link>
          , then run{' '}
          <code className="rounded bg-mist px-1.5 py-0.5 font-mono text-sm">npm run seed</code> to
          import the product sheet and starting copy.
        </p>
      </main>
    )
  }
  const totalActive = categories.reduce((sum, c) => sum + c.count, 0)
  // Still-life image per catalogue key (media/catalogue/<key>)
  const catImages = Object.fromEntries(
    CATALOGUE.map((c) => [c.key, media[`catalogue/${c.key}`]?.image]),
  )

  // A few real products (one per category, with size and pack) for the product-sheet section.
  const payload = await cms()
  const withDetails = await payload.find({
    collection: 'products',
    where: {
      and: [
        { active: { equals: true } },
        { size: { exists: true } },
        { packing: { exists: true } },
      ],
    },
    limit: 200,
    depth: 0,
  })
  const catById = new Map(categories.map((c) => [String(c.id), c]))
  const seen = new Set<string>()
  const samples: SampleProduct[] = []
  for (const d of withDetails.docs) {
    const cat = catById.get(String(typeof d.category === 'object' ? d.category?.id : d.category))
    if (!cat || seen.has(cat.slug) || !d.size || !d.packing) continue
    seen.add(cat.slug)
    samples.push({
      name: d.name,
      category: cat.name,
      size: d.size,
      colour: d.colour,
      packing: d.packing,
      href: categoryHref(keyForCms(cat.slug)),
    })
    if (samples.length === 6) break
  }
  const industries = home.industries ?? []
  // Second category reel shows where the products are made (media/factory/<slug>)
  const factoryMedia = {
    ...media,
    ...Object.fromEntries(
      [
        'tissue',
        'aluminium',
        'containers',
        'cups',
        'bags',
        'wraps',
        'chemicals',
        'tools',
        'ppe',
        'foam',
      ].map((slug) => [`categories/${slug}`, { image: `/media/factory/${slug}.webp` }]),
    ),
  }

  return (
    <>
      <Header categories={categories} />
      {/* Above the footer so the footer can be uncovered from underneath */}
      <main className="relative z-10">
        {/* 01 · Welcome */}
        <span id={chapterId(1)} />
        <Hero
          content={{
            ...home.hero,
            // The "exact pack" line was dropped; strip it from older CMS content too.
            overlays: home.hero.overlays?.map((o) =>
              o.text?.startsWith('Every product lists its exact pack') ? { ...o, text: null } : o,
            ),
          }}
        />
        <Intro
          statement={home.statement}
          facts={(home.facts ?? []).map((f) =>
            // The pack-size fact was replaced by the order checks; swap it in older CMS content too.
            f.unit === 'pcs × pkt'
              ? {
                  ...f,
                  value: '3',
                  unit: 'order checks',
                  text: 'Before dispatch, we check the item, its packaging and the quantity against your order.',
                }
              : {
                  ...f,
                  value:
                    f.unit === 'categories' ? '14' : f.value.replace('{active}', String(totalActive)),
                },
          )}
          texture={media['textures/tissue']?.image}
          chips={{
            foil: media['categories/aluminium']?.image,
            cleaner: media['categories/chemicals']?.image,
            carton: media['categories/containers']?.image,
          }}
        />

        {/* Product range (part of 01, no header of its own) */}
        <CategoryIndex categories={categories} images={catImages} />
        <VectorRibbon />
        <CategoryRail
          label="Our manufacturing process"
          title="How everyday essentials take shape."
          categories={categories}
          media={factoryMedia}
          totalActive={totalActive}
          total={14}
        />

        {/* About Klen+ (part of 01, no header of its own) */}
        <AboutKlen
          tagline={site.tagline}
          statement={home.statement}
          totalActive={totalActive}
          brands={allBrands.length}
          industries={industries.length}
        />

        {/* 02 · Why choose Klen+ */}
        <span id={chapterId(2)} />
        <WhyKlen />

        {/* 03 · What we provide */}
        <span id={chapterId(3)} />
        <RestockSteps />
        <TakeawayLoop />
        <DispatchChecks />

        {/* 04 · Our industrial solutions */}
        <span id={chapterId(4)} />
        <Industries title={home.industriesTitle} items={industries} media={media} />
        <BestProducts />
        <IsoCity totalActive={totalActive} categories={CATALOGUE.length} />

        {/* Care in every delivery (part of 04, no header of its own) */}
        <DeliveryMap />

        {/* 06 · Your trusted supply partner */}
        <span id={chapterId(6)} />
        <BrandMarquee brands={brands.map((b) => b.name)} />

        {/* 07 · Frequently asked questions */}
        <span id={chapterId(7)} />
        <Faq
          items={faqItems({
            totalActive,
            categories: CATALOGUE.length,
            brands: allBrands,
            industries: industries.map((i) => i.name),
          })}
          whatsapp={site.whatsapp}
        />

        {/* 08 · Request a quote / contact */}
        <span id={chapterId(8)} />
        <Quote content={home.quote} site={site} />

        {/* 05 · Our approach to quality checks (shown after the quote form) */}
        <span id={chapterId(5)} />
        <QualityChecks />
        <ContactCards site={site} />

        {/* 09 · Our commitment to your business */}
        <ChapterMark n={9} tone="dark" />
        <Commitment />

        {/* 10 · Product information & documentation */}
        <ChapterMark n={10} />
        <ProductInfo samples={samples} />
      </main>
      <Footer categories={categories} site={site} />
      <TravellingItems />
      <ChapterNav />
    </>
  )
}
