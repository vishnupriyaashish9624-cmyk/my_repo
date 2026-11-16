import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getHomeData } from '@/lib/cms'
import { getMediaIndex } from '@/lib/media'
import { ABOUT_CHAPTERS, chapterId } from '@/lib/chapters'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChapterMark, ChapterNav } from '@/components/home/Chapters'
import { ContactCards } from '@/components/home/Commitment'
import Quote from '@/components/home/Quote'
import Hero from '@/components/home/Hero'
import { Purpose, Serve } from '@/components/about/Story'
import { Cleaning, Materials, Packaging } from '@/components/about/Supplies'
import { Cartons, Delivery, Quality, Returns } from '@/components/about/Ordering'
import Contact from '@/components/about/Contact'
import MissionVision from '@/components/about/Mission'
import WhoWeAreBento from '@/components/about/WhoWeAreBento'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'About us · Klen Plus',
  description:
    'Klen Plus supplies food packaging, serving essentials, cleaning products and hygiene supplies for commercial kitchens and workplaces, all in one catalogue.',
}

const P = 'about'

/** The homepage's scroll film, with About copy. Overlays appear over the wall as the film plays. */
const HERO = {
  eyebrow: 'About Klen Plus',
  title: 'Everyday Supplies for Busy Businesses',
  highlight: 'Busy Businesses',
  text: 'Food packaging, serving essentials, cleaning products and hygiene supplies for commercial kitchens and workplaces, in one catalogue.',
  primary: 'Explore the catalogue',
  secondary: 'Request a Quote',
  overlays: [
    {
      eyebrow: 'One catalogue',
      title: 'Plan what your team needs.',
      text: 'From the first takeaway order to the final clean.',
      align: 'end' as const,
      from: 0.28,
      until: 0.5,
    },
    {
      eyebrow: 'Our purpose',
      title: 'Make everyday ordering simpler.',
      text: 'Everyday supplies, easier to find and order together.',
      align: 'start' as const,
      from: 0.56,
      until: 0.86,
    },
  ],
}
const mark = (n: number, tone?: 'light' | 'dark') => (
  <ChapterMark n={n} tone={tone} chapters={ABOUT_CHAPTERS} prefix={P} />
)

/** About us: twelve chapters, alternating dark and light, each with its own layout. */
export default async function AboutPage() {
  const { home, site, categories } = await getHomeData()
  if (!home?.hero?.title) notFound()
  const media = getMediaIndex()

  const industries = home.industries ?? []
  const industryImages = Object.fromEntries(
    industries.map((i) => [i.slug, media[`industries/${i.slug}`]?.image]),
  )
  const rangeHref = '/#catalogue'

  return (
    <>
      <Header categories={categories} home="/" />
      <main className="relative z-10">
        <span id={chapterId(1, P)} />
        <Hero content={HERO} primaryHref={rangeHref} />
        <WhoWeAreBento productsHref={rangeHref} />
        <span id={chapterId(2, P)} className="block scroll-mt-20" />
        <Purpose />
        <span id={chapterId(3, P)} className="block scroll-mt-20" />
        <Serve industries={industries} images={industryImages} />
        <span id={chapterId(4, P)} className="block scroll-mt-20" />
        <MissionVision />
        {mark(5, 'dark')}
        <Packaging />
        {mark(6)}
        <Cleaning />
        {mark(7, 'dark')}
        <Materials />
        {mark(8)}
        <Cartons />
        {mark(9, 'dark')}
        <Quality />
        {mark(10)}
        <Delivery />
        {mark(11, 'dark')}
        <Returns />
        {mark(12)}
        <Contact />
        <Quote content={home.quote} site={site} />
        <ContactCards site={site} browseHref={rangeHref} />
      </main>
      <Footer categories={categories} site={site} />
      <ChapterNav chapters={ABOUT_CHAPTERS} prefix={P} />
    </>
  )
}
