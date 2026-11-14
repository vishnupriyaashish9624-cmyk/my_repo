import type { Metadata } from 'next'
import { getHomeData } from '@/lib/cms'
import { CATALOGUE } from '@/lib/catalogue'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ContactCards } from '@/components/home/Commitment'
import Quote from '@/components/home/Quote'
import AboutFigures from '@/components/about/AboutHero'
import { HowWeWork, Story, Values, WhoHero, WorkWith } from '@/components/who/WhoWeAre'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Who we are · Klen Plus',
  description:
    'Klen Plus is a single supplier of food packaging, serving essentials, cleaning products and hygiene supplies for kitchens, cafés, hotels, offices and facilities teams.',
}

/** Who we are: hero, figures, story, values, how we work, who we work with, then quote + contact. */
export default async function WhoWeArePage() {
  const { home, site, categories, allBrands } = await getHomeData()
  const totalActive = categories.reduce((sum, c) => sum + c.count, 0)
  const industries = home?.industries ?? []

  return (
    <>
      <Header categories={categories} home="/" />
      <main className="relative z-10">
        <WhoHero />
        <AboutFigures
          figures={[
            { v: CATALOGUE.length, l: 'categories in one catalogue' },
            { v: totalActive, l: 'active products' },
            { v: allBrands.length, l: 'brands stocked' },
            { v: industries.length, l: 'kinds of business served' },
          ]}
        />
        <Story />
        <Values />
        <HowWeWork />
        <WorkWith industries={industries} />
        {home?.quote && <Quote content={home.quote} site={site} />}
        <ContactCards site={site} browseHref="/#catalogue" />
      </main>
      <Footer categories={categories} site={site} />
    </>
  )
}
