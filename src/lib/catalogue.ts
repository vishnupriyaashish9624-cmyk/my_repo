import type { CategoryWithCount } from '@/lib/cms'
import type { VectorKey } from '@/components/vectors/CategoryVector'
import type { ItemKey } from '@/components/vectors/ItemVectors'
import type { UseKey } from '@/components/vectors/TissueVectors'
import { RANGES } from '@/components/home/rangeConfig'

/**
 * The 14 catalogue categories as the business lists them, and how each maps onto the CMS: `chapter`
 * is the CMS category with a scroll film (its specs are the default product types and its products
 * the default list), `picks` pull individual specs from other CMS categories, and `match` selects
 * products by name across the whole catalogue for categories the CMS doesn't have on their own.
 * Each one gets an inner page at /categories/<key>.
 */
export type Use = { key: UseKey; name: string; text: string }
/** A product type pulled from a CMS category's chapter specs, by spec label. */
export type Pick = { from: string; label: string }
/** A product type with no CMS spec yet: name, a line of text and a vector. */
export type Static = { label: string; text: string; icon: ItemKey }

export type Entry = {
  key: VectorKey
  short: string
  name: string
  text: string
  /** CMS category with a scroll film; its specs are the default product types. */
  chapter?: string
  picks?: Pick[]
  extra?: Static[]
  uses?: Use[]
  /** Products by name, across all CMS categories (overrides the chapter's products). */
  match?: RegExp
}

/** The full Klen+ catalogue, in the order the business lists it. */
export const CATALOGUE: Entry[] = [
  { key: 'tissue', short: 'Tissue', name: 'Tissue', text: 'Facial, interfold, toilet and maxi rolls for washrooms and tables.', chapter: 'tissue' },
  {
    key: 'paper',
    match: /napkin|sandwich|rotti|sufra|bill roll|butter|baking paper/i,
    short: 'Paper Products',
    name: 'Paper Products',
    text: 'Napkins, butter paper, bill rolls and food-wrap sheets.',
    picks: [
      { from: 'tissue', label: 'Napkin' },
      { from: 'wraps', label: 'Sandwich paper' },
      { from: 'wraps', label: 'Rotti paper' },
      { from: 'wraps', label: 'Sufra' },
      { from: 'wraps', label: 'Bill rolls' },
    ],
    uses: [
      { key: 'table', name: 'Table', text: 'Napkins and sufra for every cover' },
      { key: 'kitchen', name: 'Prep line', text: 'Sandwich, rotti and butter paper' },
      { key: 'counter', name: 'Billing counter', text: 'Thermal bill rolls' },
    ],
  },
  { key: 'aluminium', short: 'Aluminium Foils', name: 'Aluminium Foils & Food Containers', text: 'Foil rolls, platters and lidded containers in every size.', chapter: 'aluminium' },
  { key: 'takeaway', short: 'Takeaway Containers', name: 'Takeaway Containers', text: 'Paper and kraft meal boxes, trays and leak-proof containers.', chapter: 'containers' },
  { key: 'cups', short: 'Cups, Lids & Bowls', name: 'Cups, Lids & Bowls', text: 'Hot and cold cups, flat and dome lids, bowls in paper, kraft, PP and PET.', chapter: 'cups' },
  { key: 'bags', short: 'Paper & Kraft Bags', name: 'Paper & Kraft Bags', text: 'Carry bags, pouches and food bags, plain or printed.', chapter: 'bags' },
  { key: 'chemicals', short: 'Cleaning Chemicals', name: 'Cleaning Chemicals', text: 'Dish, floor, glass and hand-care concentrates for daily cleaning.', chapter: 'chemicals' },
  { key: 'tools', short: 'Cleaning Tools', name: 'Cleaning Equipment & Tools', text: 'Mops, brooms, wipers, buckets and scrubbers for every surface.', chapter: 'tools' },
  { key: 'ppe', short: 'PPE & Cutlery', name: 'PPE & Cutlery', text: 'Gloves, hair nets, masks, aprons and disposable cutlery.', chapter: 'ppe' },
  { key: 'foam', short: 'Foam Products', name: 'Foam Products', text: 'Foam boxes, plates, bowls and trays for quick service.', chapter: 'foam' },
  {
    key: 'bio',
    short: 'Biodegradable',
    name: 'Biodegradable Products',
    text: 'Plant-fibre plates, bowls and containers that break down after use.',
    extra: [
      { label: 'Plates', text: 'Plant-fibre plates for events and quick service', icon: 'cat:bio' },
      { label: 'Bowls', text: 'For curries, salads and desserts', icon: 'foam-bowl' },
      { label: 'Containers', text: 'Lidded boxes for takeaway and delivery', icon: 'cat:takeaway' },
      { label: 'Cutlery', text: 'Spoons and forks for single use', icon: 'cutlery' },
    ],
    uses: [
      { key: 'catering', name: 'Events', text: 'Plates and bowls for catering' },
      { key: 'delivery', name: 'Takeaway', text: 'Containers that break down after use' },
      { key: 'table', name: 'Quick service', text: 'Cutlery and bowls for the counter' },
    ],
  },
  {
    key: 'film',
    match: /cling|stretch|garbage/i,
    short: 'Films & Garbage Bags',
    name: 'Stretch Film, Cling Film & Garbage Bags',
    text: 'Cling and stretch rolls plus garbage bags in every size.',
    chapter: 'wraps',
    picks: [
      { from: 'wraps', label: 'Cling film' },
      { from: 'wraps', label: 'Stretch film' },
      { from: 'bags', label: 'Garbage' },
    ],
    uses: [
      { key: 'kitchen', name: 'Prep line', text: 'Cling film in 30 and 45 cm' },
      { key: 'storeroom', name: 'Storeroom', text: 'Stretch film for cartons and pallets' },
      { key: 'floor', name: 'Housekeeping', text: 'Garbage bags for every bin' },
    ],
  },
  {
    key: 'hygiene',
    match: /hand wash|sanitiz|sanitis|soap|wipe|hair net|face mask|apron/i,
    short: 'Personal Hygiene',
    name: 'Personal Hygiene Products',
    text: 'Hand wash, sanitiser, soaps and dispensers for staff and guests.',
    picks: [
      { from: 'chemicals', label: 'Hand wash' },
      { from: 'chemicals', label: 'Disinfectant' },
      { from: 'ppe', label: 'Hygiene wear' },
    ],
    extra: [{ label: 'Wet wipes', text: 'For hands, tables and quick clean-ups', icon: 'facial' }],
    uses: [
      { key: 'washroom', name: 'Washroom', text: 'Hand wash and refills' },
      { key: 'kitchen', name: 'Food prep', text: 'Hair nets, masks and aprons' },
      { key: 'table', name: 'Guests', text: 'Wet wipes at the table' },
    ],
  },
  {
    key: 'plastic',
    match: /tub|bottle|jar|dispenser|^MW|^PP /i,
    short: 'Plastics & Dispensers',
    name: 'Plastic Products, Containers, Bottles & Dispensers',
    text: 'Containers, bottles, jars and dispensers for kitchens and washrooms.',
    picks: [
      { from: 'containers', label: 'Rectangular' },
      { from: 'containers', label: 'Round' },
      { from: 'containers', label: 'Clear' },
    ],
    extra: [{ label: 'Bottles & dispensers', text: 'Bottles, jars and refill dispensers', icon: 'cat:plastic' }],
    uses: [
      { key: 'kitchen', name: 'Kitchen', text: 'Containers for prep and storage' },
      { key: 'storeroom', name: 'Storeroom', text: 'Bottles and jars for refills' },
      { key: 'washroom', name: 'Washroom', text: 'Soap and sanitiser dispensers' },
    ],
  },
]

export type Item = { label: string; chips: string[]; text?: string; icon: ItemKey }

export const chipsOf = (value: string) => value.split(/·|,/).map((v) => v.trim()).filter(Boolean)

/** Product types for an entry: picked CMS specs, else its chapter's specs, plus any static extras. */
export function itemsFor(entry: Entry, bySlug: Map<string, CategoryWithCount>): Item[] {
  const fromSpec = (slug: string, label: string): Item | null => {
    const spec = bySlug.get(slug)?.chapter?.specs?.find((s) => s.label.toLowerCase() === label.toLowerCase())
    if (!spec) return null
    return { label: spec.label, chips: chipsOf(spec.value), icon: RANGES[slug]?.items[spec.label.toLowerCase()] ?? `cat:${entry.key}` }
  }
  const picked = entry.picks
    ? entry.picks.map((p) => fromSpec(p.from, p.label))
    : entry.chapter
      ? (bySlug.get(entry.chapter)?.chapter?.specs ?? []).map((s) => fromSpec(entry.chapter!, s.label))
      : []
  return [...picked.filter((i): i is Item => !!i), ...(entry.extra ?? []).map((e) => ({ ...e, chips: [] }))]
}


/** Catalogue key for a CMS category slug (e.g. containers → takeaway). */
export const keyForCms = (slug: string) => CATALOGUE.find((e) => e.chapter === slug && !e.picks)?.key ?? CATALOGUE.find((e) => e.chapter === slug)?.key ?? slug

export const catalogueEntry = (key: string) => CATALOGUE.find((e) => e.key === key)

export const categoryHref = (key: string) => `/categories/${key}`

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

/** Heading for an entry's product-type section ("Five tissues, one storeroom shelf."). */
export function rangeHeading(entry: Entry, n: number) {
  const word = WORDS[n] ?? String(n)
  const cfg = entry.chapter && !entry.picks ? RANGES[entry.chapter] : undefined
  return cfg ? cfg.heading(word) : `${word} ways to stock ${entry.short.toLowerCase()}.`
}

export const usesFor = (entry: Entry): Use[] => entry.uses ?? (entry.chapter ? RANGES[entry.chapter]?.uses : undefined) ?? []

/** A product as the inner page lists it. */
export type ListedProduct = { id: number | string; name: string; size?: string | null; colour?: string | null; packing?: string | null }
export type ProductGroup = { key: string; name: string; products: ListedProduct[] }

type RawProduct = ListedProduct & { category: number | string | { id: number | string } | null; subcategory?: string | null }

/**
 * Products for an entry, grouped by CMS subcategory: name matches across the catalogue when the entry
 * has \`match\`, otherwise everything in its chapter category.
 */
export function productsFor(entry: Entry, products: RawProduct[], categories: CategoryWithCount[]): ProductGroup[] {
  const byId = new Map(categories.map((c) => [String(c.id), c]))
  const catOf = (p: RawProduct) => byId.get(String(typeof p.category === 'object' && p.category ? p.category.id : p.category))
  const chosen = entry.match
    ? products.filter((p) => entry.match!.test(p.name))
    : entry.chapter
      ? products.filter((p) => catOf(p)?.slug === entry.chapter)
      : []
  const groups = new Map<string, ProductGroup>()
  for (const p of chosen) {
    const cat = catOf(p)
    const sub = cat?.subcategories?.find((s) => s.key === p.subcategory)
    const key = `${cat?.slug ?? 'other'}:${p.subcategory ?? 'other'}`
    const name = sub?.name ?? cat?.name ?? 'Other'
    if (!groups.has(key)) groups.set(key, { key, name, products: [] })
    groups.get(key)!.products.push({ id: p.id, name: p.name, size: p.size, colour: p.colour, packing: p.packing })
  }
  return [...groups.values()].map((g) => ({ ...g, products: g.products.sort((a, b) => a.name.localeCompare(b.name)) }))
}
