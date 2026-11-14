import 'server-only'
import { getPayload } from 'payload'
import config from '@payload-config'

export const cms = () => getPayload({ config })

/** Everything the homepage needs, in one round trip per collection. */
export async function getHomeData() {
  const payload = await cms()
  const [home, site, categories, brands] = await Promise.all([
    payload.findGlobal({ slug: 'home' }),
    payload.findGlobal({ slug: 'site' }),
    payload.find({ collection: 'categories', sort: 'order', limit: 50, depth: 0 }),
    payload.find({ collection: 'brands', limit: 200, depth: 0, sort: 'name' }),
  ])
  const counts = await Promise.all(
    categories.docs.map((c) =>
      payload.count({ collection: 'products', where: { and: [{ category: { equals: c.id } }, { active: { equals: true } }] } }),
    ),
  )
  const withCounts = categories.docs.map((c, i) => ({ ...c, count: counts[i].totalDocs }))
  // Marquee shows the flagged brands; allBrands is the whole list (for counts and the FAQ).
  return { home, site, categories: withCounts, brands: brands.docs.filter((b) => b.showInMarquee), allBrands: brands.docs.map((b) => b.name) }
}

export type HomeData = Awaited<ReturnType<typeof getHomeData>>
export type CategoryWithCount = HomeData['categories'][number]
