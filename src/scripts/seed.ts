/**
 * Imports the product sheet and fills starting content.
 *
 *   npm run seed                      (reads "Products -Klen - 16-09-26.xlsx" in the project root)
 *   SEED_FILE="new-list.xlsx" npm run seed
 *   SEED_RESET_CHAPTERS=1 npm run seed   (rewrite homepage chapter copy, layout and timing from seed-data.ts)
 *
 * Safe to re-run: categories and brands are updated by slug/name (chapter copy is only filled when
 * empty), products from the sheet are replaced, and the Home/Site globals are only filled when empty.
 */
import path from 'node:path'
import ExcelJS from 'exceljs'
import { getPayload } from 'payload'
import config from '../payload.config'
import { BRANDS, CATEGORIES, EXTRA_CHAPTERS, FILM, HOME, PP_CONTAINERS, RULE_ORDER, type CategorySeed } from './seed-data'

const file = path.resolve(process.cwd(), process.env.SEED_FILE || 'Products -Klen - 16-09-26.xlsx')

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]))

function classify(name: string): CategorySeed | undefined {
  for (const key of RULE_ORDER) {
    if (key === 'pp-containers') {
      if (PP_CONTAINERS.test(name)) return bySlug.get('containers')
      continue
    }
    const cat = bySlug.get(key)!
    if (cat.match.test(name)) return cat
  }
  return undefined
}

function parse(raw: string) {
  const active = !/\bInactive\b/i.test(raw)
  const name = raw.replace(/\s*\bInactive\b\s*/i, ' ').replace(/\s+/g, ' ').trim()
  const packMatch =
    name.match(/\(([^()]*(?:pcs|pkt|pack|box|kg|x\s?\d|rolls)[^()]*)\)\s*(?:-\s*(?:Ctn|CTN|Bndl))?$/i) ||
    name.match(/-\s*(\d+\s*PCS|Pcs|PCS|Bndl|Ctn)\s*$/i)
  const size = name.match(/\d+(?:\.\d+)?\s?(?:oz|ml|ltr|l\b|cc|kg|gram|g\b|cm|mm|inch|")/i)?.[0]
  const colour = name.match(/\b(Black|White|Clear|Blue|Grey|Green|Red|Yellow|Brown|Milky|Pink)\b/i)?.[0]
  const packing = packMatch?.[1]?.trim()
  // "(20kg)" on bags is the bundle weight, not the product size.
  const cleanSize = size && packing?.includes(size) ? undefined : size?.replace(/\s+/g, ' ')
  return { name, active, packing, size: cleanSize, colour }
}

async function readRows() {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(file)
  const ws = wb.worksheets[0]
  const rows: string[] = []
  ws.eachRow((row) => {
    const v = row.getCell(1).text?.trim()
    if (v && v.toLowerCase() !== 'product') rows.push(v)
  })
  return rows
}

const payload = await getPayload({ config })
const rows = await readRows()
payload.logger.info(`Read ${rows.length} rows from ${path.basename(file)}`)

// Brands
const brandIds = new Map<string, number>()
for (const b of BRANDS) {
  const found = await payload.find({ collection: 'brands', where: { name: { equals: b.name } }, limit: 1 })
  const data = { name: b.name, thirdParty: Boolean(b.thirdParty), showInMarquee: Boolean(b.marquee) }
  const doc = found.docs[0]
    ? await payload.update({ collection: 'brands', id: found.docs[0].id, data })
    : await payload.create({ collection: 'brands', data })
  brandIds.set(b.name, doc.id)
}

// Categories
const categoryIds = new Map<string, number>()
for (const c of CATEGORIES) {
  const found = await payload.find({ collection: 'categories', where: { slug: { equals: c.slug } }, limit: 1 })
  const existing = found.docs[0]
  const base = {
    name: c.name,
    slug: c.slug,
    order: c.order,
    blurb: existing?.blurb || c.blurb,
    subcategories: existing?.subcategories?.length ? existing.subcategories : c.subcategories.map(({ key, name }) => ({ key, name })),
  }
  // Chapter copy is filled when empty; SEED_RESET_CHAPTERS=1 rewrites it (e.g. after new footage).
  const copy = c.chapter ?? EXTRA_CHAPTERS[c.slug]
  const film = FILM[c.slug]
  const chapter =
    copy && film && (!existing?.chapter?.giant || process.env.SEED_RESET_CHAPTERS)
      ? {
          showOnHome: true,
          chapter: {
            ...copy,
            ...film,
            chips: copy.chips.map((label) => ({ label })),
          },
        }
      : {}
  const doc = existing
    ? await payload.update({ collection: 'categories', id: existing.id, data: { ...base, ...chapter } })
    : await payload.create({ collection: 'categories', data: { ...base, ...chapter } })
  categoryIds.set(c.slug, doc.id)
}

// Products: replace everything that came from a sheet
const removed = await payload.delete({ collection: 'products', where: { sourceName: { exists: true } } })
payload.logger.info(`Removed ${removed.docs.length} previously imported products`)

const counts = new Map<string, number>()
const unmatched: string[] = []
const usedSlugs = new Set<string>()
let activeCount = 0

for (const raw of rows) {
  const cat = classify(raw)
  if (!cat) {
    unmatched.push(raw)
    continue
  }
  const p = parse(raw)
  const sub = cat.subcategories.find((s) => !s.match || s.match.test(p.name))
  const brand = BRANDS.find((b) => b.pattern.test(p.name))
  let slug = slugify(p.name)
  for (let n = 2; usedSlugs.has(slug); n++) slug = `${slugify(p.name)}-${n}`
  usedSlugs.add(slug)

  await payload.create({
    collection: 'products',
    data: {
      name: p.name,
      slug,
      category: categoryIds.get(cat.slug)!,
      subcategory: sub?.key,
      brand: brand ? brandIds.get(brand.name) : undefined,
      size: p.size,
      colour: p.colour,
      packing: p.packing,
      active: p.active,
      sourceName: raw,
    },
  })
  if (p.active) {
    activeCount++
    counts.set(cat.slug, (counts.get(cat.slug) ?? 0) + 1)
  }
}

// Globals: only fill when empty so admin edits survive re-runs
const home = await payload.findGlobal({ slug: 'home' })
if (!home?.hero?.title) {
  // Fact values may contain {active}; the page fills it with the live count of active products.
  await payload.updateGlobal({ slug: 'home', data: HOME })
  payload.logger.info('Filled Home content')
}
const site = await payload.findGlobal({ slug: 'site' })
if (!site?.tagline) {
  await payload.updateGlobal({ slug: 'site', data: { tagline: 'Food packaging, hygiene and cleaning supplies for commercial kitchens and buildings.' } })
}

payload.logger.info(`Imported ${rows.length - unmatched.length} products (${activeCount} active)`)
for (const c of CATEGORIES) payload.logger.info(`  ${c.slug.padEnd(11)} ${counts.get(c.slug) ?? 0} active`)
if (unmatched.length) payload.logger.warn(`Not classified (add a rule in seed-data.ts):\n  ${unmatched.join('\n  ')}`)

process.exit(0)
