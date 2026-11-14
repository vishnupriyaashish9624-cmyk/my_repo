import type { Metadata } from 'next'
import { getHomeData } from '@/lib/cms'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactHero from '@/components/contact/ContactHero'
import ContactBody from '@/components/contact/ContactBody'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Contact us · Klen Plus',
  description:
    'Contact Klen Plus about products, quotes, bulk and regular orders, deliveries, order support or supplying your business.',
}

/** Contact us: hero, six enquiry topics, and the contact form that saves an Enquiry. */
export default async function ContactPage() {
  const { site, categories } = await getHomeData()

  return (
    <>
      <Header categories={categories} home="/" />
      <main className="relative z-10">
        <ContactHero site={site} />
        <ContactBody site={site} />
      </main>
      <Footer categories={categories} site={site} />
    </>
  )
}
