import type { Metadata } from 'next'
import { getHomeData } from '@/lib/cms'
import { CATALOGUE } from '@/lib/catalogue'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ContactCards } from '@/components/home/Commitment'
import Hero from '@/components/home/Hero'
import Quote from '@/components/home/Quote'
import AboutFigures from '@/components/about/AboutHero'
import { HowWeWork, Story, Values, WorkWith } from '@/components/who/WhoWeAre'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Who we are · Klen Plus',
  description:
    'Klen Plus is a single supplier of food packaging, serving essentials, cleaning products and hygiene supplies for kitchens, cafés, hotels, offices and facilities teams.',
}

/** The homepage's scroll film, with Who We Are copy. Overlays appear over the wall as the film plays. */
const HERO = {
  eyebrow: 'Who we are',
  title: 'The Team Behind Your Back Room',
  highlight: 'Your Back Room',
  text: 'Klen Plus supplies food packaging, serving essentials, cleaning products and hygiene supplies, so kitchens, counters, washrooms and workplaces keep running.',
  primary: 'Our story',
  secondary: 'Request a Quote',
  overlays: [
    {
      eyebrow: 'One supplier',
      title: 'Everyday supplies, ordered together.',
      text: 'Packaging, cleaning and hygiene in one catalogue.',
      align: 'end' as const,
      from: 0.28,
      until: 0.5,
    },
    {
      eyebrow: 'Our promise',
      title: 'Checked, packed and delivered with care.',
      text: 'So your team never runs short mid-service.',
      align: 'start' as const,
      from: 0.56,
      until: 0.86,
    },
  ],
}

/** Who we are: video hero, figures, story, values, how we work, who we work with, then quote + contact. */
export default async function WhoWeArePage() {
  const { home, site, categories, allBrands } = await getHomeData()
  const totalActive = categories.reduce((sum, c) => sum + c.count, 0)
  const industries = home?.industries ?? []

  return (
    <>
      <Header categories={categories} home="/" />
      <main className="relative z-10">
        <Hero content={HERO} primaryHref="#story" />
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
