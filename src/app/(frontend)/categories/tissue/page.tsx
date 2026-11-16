import type { Metadata } from 'next'
import { cms, getHomeData } from '@/lib/cms'
import { catalogueEntry, productsFor } from '@/lib/catalogue'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductList from '@/components/category/ProductList'
import CategoryNav from '@/components/category/CategoryNav'
import {
  TissueApplications,
  TissueBrandStandards,
  TissueFaq,
  TissueGuide,
  TissueIndustries,
  TissueRange,
  TissueWhy,
} from '@/components/tissue/sections'
import TissueEnquiry from '@/components/tissue/Enquiry'
import TissueHero from '@/components/tissue/Hero'
import TissueMotion from '@/components/tissue/Motion'
import { SHEET } from '@/components/tissue/content'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Tissue Paper & Hygiene Supplies · Klen Plus',
  description:
    'Facial tissues, table napkins, folded hand towels, toilet and kitchen rolls for restaurants, hotels, offices and facility teams. Matched to your dispensers, quoted by the carton.',
}

/**
 * Tissue Paper & Hygiene Supplies: a dedicated page (this static segment wins over categories/[slug]).
 * Range, reasons, industries, where each product goes, specs, a selection guide with an order
 * estimator, FAQ, the live product list from the CMS and the category enquiry form.
 */
export default async function TissuePage() {
  const entry = catalogueEntry('tissue')!
  const [{ site, categories }, payload] = await Promise.all([getHomeData(), cms()])
  const products = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    limit: 2000,
    depth: 0,
    pagination: false,
  })
  const groups = productsFor(entry, products.docs, categories)

  return (
    <>
      <Header categories={categories} home="/" />
      <TissueMotion>
        <TissueHero />
        <TissueRange />
        <TissueWhy />
        <TissueIndustries />
        <TissueApplications />
        <TissueBrandStandards />
        <TissueGuide />
        <TissueFaq />
        <div data-sheet className={`${SHEET} bg-white`}>
          <ProductList groups={groups} icon="tissue" name="Tissue" />
        </div>
        <TissueEnquiry whatsapp={site.whatsapp} />
        <div data-sheet className={`${SHEET} bg-paper pb-10`}>
          <CategoryNav current="tissue" />
        </div>
      </TissueMotion>
      <Footer categories={categories} site={site} />
    </>
  )
}
