/**
 * Starting content for `npm run seed`. After seeding, edit everything in the admin; this file is only
 * used to fill empty fields and to classify rows from the product sheet.
 */

type Spec = { label: string; value: string }

export type CategorySeed = {
  slug: string
  name: string
  order: number
  blurb: string
  /** Rows are assigned to the first category whose rule matches (see RULE_ORDER). */
  match: RegExp
  subcategories: { key: string; name: string; match?: RegExp }[]
  showOnHome?: boolean
  chapter?: ChapterCopy
}

type ChapterCopy = {
  giant: string
  hook: string
  hookText: string
  specsTitle: string
  specs: Spec[]
  chips: string[]
  ctaLabel: string
  /** Overridden by FILM below, which is measured from the footage. */
  specsPlacement?: FilmSettings['specsPlacement']
}

type FilmSettings = {
  specsPlacement: 'on' | 'right' | 'left' | 'top' | 'behind'
  specsBox?: { x: number; y: number; w: number; h: number }
  timing: { titleUntil: number; hookFrom: number; hookUntil: number; specsFrom: number; ctaFrom: number }
  length: number
}

/**
 * Chapter layout and timing per category film, taken from the generated clips:
 * - timing follows each clip's measured motion window (`node scripts/motion-profile.mjs`), so the
 *   title shows while the product is closed, the hook while it opens, and the specs once it holds still;
 * - placement and specsBox follow where the final frame leaves room (specsBox = the product surface
 *   in video fractions).
 * Categories listed here get a homepage chapter.
 */
export const FILM: Record<string, FilmSettings> = {
  tissue: {
    specsPlacement: 'on',
    specsBox: { x: 0.28, y: 0.14, w: 0.45, h: 0.73 },
    timing: { titleUntil: 0.2, hookFrom: 0.25, hookUntil: 0.64, specsFrom: 0.68, ctaFrom: 0.78 },
    length: 3,
  },
  aluminium: {
    specsPlacement: 'on',
    specsBox: { x: 0.17, y: 0.22, w: 0.74, h: 0.57 },
    timing: { titleUntil: 0.14, hookFrom: 0.16, hookUntil: 0.43, specsFrom: 0.47, ctaFrom: 0.6 },
    length: 3,
  },
  containers: { specsPlacement: 'right', timing: { titleUntil: 0.25, hookFrom: 0.29, hookUntil: 0.6, specsFrom: 0.64, ctaFrom: 0.74 }, length: 3 },
  cups: { specsPlacement: 'top', timing: { titleUntil: 0.28, hookFrom: 0.3, hookUntil: 0.6, specsFrom: 0.66, ctaFrom: 0.76 }, length: 3 },
  bags: { specsPlacement: 'right', timing: { titleUntil: 0.3, hookFrom: 0.33, hookUntil: 0.55, specsFrom: 0.57, ctaFrom: 0.68 }, length: 3 },
  wraps: { specsPlacement: 'top', timing: { titleUntil: 0.14, hookFrom: 0.17, hookUntil: 0.56, specsFrom: 0.62, ctaFrom: 0.72 }, length: 3 },
  chemicals: { specsPlacement: 'behind', timing: { titleUntil: 0.14, hookFrom: 0.16, hookUntil: 0.5, specsFrom: 0.66, ctaFrom: 0.76 }, length: 3 },
  tools: { specsPlacement: 'behind', timing: { titleUntil: 0.15, hookFrom: 0.18, hookUntil: 0.6, specsFrom: 0.7, ctaFrom: 0.8 }, length: 3 },
  ppe: { specsPlacement: 'right', timing: { titleUntil: 0.25, hookFrom: 0.28, hookUntil: 0.5, specsFrom: 0.52, ctaFrom: 0.64 }, length: 3 },
  foam: { specsPlacement: 'left', timing: { titleUntil: 0.25, hookFrom: 0.28, hookUntil: 0.7, specsFrom: 0.78, ctaFrom: 0.86 }, length: 3 },
}

/** Chapter copy for categories whose films were added after the first four. */
export const EXTRA_CHAPTERS: Record<string, ChapterCopy> = {
  cups: {
    giant: 'Cups',
    hook: 'One stack, every size you pour.',
    hookText: 'Paper cups from 2.5 to 12 oz, rippled cups, PET cold cups with dome lids, and the straws to go with them.',
    specsTitle: 'Cups & lids',
    specs: [
      { label: 'Paper cups', value: '2.5 · 4 · 6 · 6.5 · 8 · 12 oz' },
      { label: 'Rippled', value: '8 oz black · brown · check' },
      { label: 'PET glasses', value: '84 mm 10–16 oz · 92 mm 14 oz' },
      { label: 'Lids', value: 'Paper cup 6–12 oz · dome 84 & 92 mm' },
      { label: 'Straws', value: '6 · 8 · 12 mm, paper or plastic wrapped' },
      { label: 'Small cups', value: 'Plastic 5 & 6 oz · ice cream 4 oz' },
    ],
    chips: ['6.5 oz 250 gsm', 'PET 84 mm 12 oz', 'Dome lids'],
    ctaLabel: 'See cups & lids',
  },
  bags: {
    giant: 'Bags',
    hook: 'From flat pack to full order.',
    hookText: 'Carry bags by the 20 kg bundle, kraft bags with twisted handles, paper bags No.0–5 and garbage bags for every bin.',
    specsTitle: 'Bags',
    specs: [
      { label: 'Carry bags', value: 'White · clear · recycled colours, mini small to large' },
      { label: 'Kraft', value: 'Small to jumbo, flat or twist handle' },
      { label: 'Paper bags', value: 'No.0 – No.5, plain white or brown' },
      { label: 'Garbage', value: '50×60 up to 110×130' },
      { label: 'Food bags', value: 'Smoky 6×9 & 8×12 · TP 4×5 to 10×14' },
    ],
    chips: ['20 kg bundles', 'Twist-handle kraft', '110×130 garbage'],
    ctaLabel: 'See bags',
  },
  wraps: {
    giant: 'Wraps',
    hook: 'Sealed in one pull.',
    hookText: 'Cling film for the prep line, stretch film for the storeroom, and sandwich, rotti and baking paper for everything in between.',
    specsTitle: 'Wraps & rolls',
    specs: [
      { label: 'Cling film', value: '30 & 45 cm · jumbo 4–5.5 kg' },
      { label: 'Stretch film', value: '800 g · 1.8 kg' },
      { label: 'Sandwich paper', value: 'Plain 6–7 kg · printed 4.5–5 kg' },
      { label: 'Rotti paper', value: 'Small · medium · large · 5 kg' },
      { label: 'Sufra', value: '2 · 3 · 6 kg' },
      { label: 'Bill rolls', value: '80×80 mm, 48 & 65 gsm' },
    ],
    chips: ['Cling film 45 cm', 'Sandwich paper 6 kg', 'Bill roll 80×80'],
    ctaLabel: 'See wraps & rolls',
  },
  tools: {
    giant: 'Tools',
    hook: 'Leave a shine behind.',
    hookText: 'Flat and clip mops, brooms, floor wipers, sponges and pedal bins for kitchens, washrooms and corridors.',
    specsTitle: 'Cleaning tools',
    specs: [
      { label: 'Mops', value: 'Dust mop 60 cm · clip mops 260 & 350 g' },
      { label: 'Floor', value: 'Wipers 43–45 cm · 32 L mop bucket' },
      { label: 'Brooms', value: 'Soft & coco brooms · dustpan sets' },
      { label: 'Scrubbing', value: 'Sponges · steel wool · microfiber' },
      { label: 'Bins', value: 'Pedal bins 30 · 45 · 68 · 120 L' },
      { label: 'Washroom', value: 'Window squeegee 35 cm · toilet brush' },
    ],
    chips: ['Dust mop 60 cm', 'Pedal bin 68 L', 'Microfiber 40×40'],
    ctaLabel: 'See cleaning tools',
  },
  ppe: {
    giant: 'Gloves',
    hook: 'Hands on, hygiene on.',
    hookText: 'Vinyl, latex and nitrile gloves in every size, plus hair nets, aprons, masks and disposable cutlery.',
    specsTitle: 'PPE & cutlery',
    specs: [
      { label: 'Vinyl', value: 'Black & clear · M · L · XL' },
      { label: 'Latex', value: 'Powder-free · S · L · XL' },
      { label: 'Nitrile', value: 'Blue · L' },
      { label: 'Hygiene wear', value: 'Hair nets · aprons · face masks' },
      { label: 'Cutlery', value: 'Spoons · forks · sets · skewers' },
    ],
    chips: ['Vinyl black L', '100 × 10 box', 'Hair nets'],
    ctaLabel: 'See PPE & cutlery',
  },
  foam: {
    giant: 'Foam',
    hook: 'Snap it open, pack it up.',
    hookText: 'Foam plates, trays and hamburger boxes, plus paper plates and meal boxes for catering and takeaway.',
    specsTitle: 'Foam & plates',
    specs: [
      { label: 'Plates', value: 'Foam 7 · 9 · 10 in · paper 7 & 9 in' },
      { label: 'Boxes', value: 'Hamburger HB2 · hot dog · lunch LB1 & LB2' },
      { label: 'Trays', value: 'S1 · M2 · M13 · D18 · JB2 · 5 compartment' },
      { label: 'Bowls & cups', value: 'Foam bowl 6 & 8 oz · cup 6 oz' },
      { label: 'Paper boxes', value: 'Dinner · snack · burger boxes' },
    ],
    chips: ['Foam plate 9 in', 'HB2 box', '5 compartment tray'],
    ctaLabel: 'See foam & plates',
  },
}

export const CATEGORIES: CategorySeed[] = [
  {
    slug: 'tissue',
    name: 'Tissue & paper',
    order: 1,
    blurb: 'Maxi rolls, interfold, toilet rolls, napkins, facial tissue, wet wipes',
    match: /Tissue|Maxi Roll|Interfold|Toilet Roll|Kitchen Towel|Autocut|Dispenser-Maxi|Wet Wipes/i,
    subcategories: [
      { key: 'kitchen-rolls', name: 'Kitchen rolls', match: /Maxi|Autocut|Kitchen Towel/i },
      { key: 'washroom', name: 'Washroom', match: /Interfold|Toilet|Dispenser/i },
      { key: 'table', name: 'Table & personal' },
    ],
    showOnHome: true,
    chapter: {
      giant: 'Tissue',
      hook: 'From crumpled to crisp.',
      hookText: 'Maxi rolls for the kitchen line, interfold for washrooms and napkins for the table, in pack sizes that fit your storeroom.',
      specsTitle: 'Tissue & paper',
      specs: [
        { label: 'Maxi roll', value: 'M05, M06, glue-laminated, auto-cut' },
        { label: 'Interfold', value: '1 ply · 2 ply · 150 sheets' },
        { label: 'Toilet roll', value: '100 · 300 sheets, 10 × 10 rolls' },
        { label: 'Napkin', value: '30 · 33 · 40 cm, white and black' },
        { label: 'Facial', value: '200 × 2 ply · 500 · 600 sheets' },
      ],
      chips: ['Maxi roll M05 · M06', 'Interfold 1 & 2 ply', 'Napkin 40×40 cm'],
      ctaLabel: 'See tissue products',
      specsPlacement: 'on',
    },
  },
  {
    slug: 'aluminium',
    name: 'Aluminium',
    order: 2,
    blurb: 'Foil rolls, containers and platters',
    match: /^Alu|Aluminium|Golden Foil|Burger Foil/i,
    subcategories: [
      { key: 'foil-rolls', name: 'Foil rolls', match: /Foil/i },
      { key: 'platters', name: 'Platters', match: /Platter/i },
      { key: 'containers', name: 'Containers' },
    ],
    showOnHome: true,
    chapter: {
      giant: 'Foil',
      hook: 'Pull out exactly the width you need.',
      hookText: 'Foil in 30 and 45 cm, containers from 8342 to 83185 and platters for catering orders.',
      specsTitle: 'Aluminium, by the size code',
      specs: [
        { label: 'Foil rolls', value: '30 cm & 45 cm · 1 kg, 1.5 kg, 2 kg · 6 per carton' },
        { label: 'Containers', value: '8342 · 8368 · 8389 · 83120 · 83185 · 73365' },
        { label: 'Platters', value: '6550 small · 6586 medium · 65180 large' },
        { label: 'Wraps', value: 'Burger foil 25 × 35 cm · golden foil' },
      ],
      chips: ['30 cm · 45 cm', '8389 · 83120', 'Platter 65180'],
      ctaLabel: 'See aluminium products',
      specsPlacement: 'on',
    },
  },
  {
    slug: 'containers',
    name: 'Takeaway containers',
    order: 3,
    blurb: 'Microwave containers, PP bowls and cups, compartment boxes, tubs, juice bottles',
    match: /Container|Compartment|Tub|WIDDER|Cupco|Chicken|Club Box|Lunch Box|Salad Bowl|Sandwich Wedge|Plastic Tray|Juice Bottle|MW Corepack/i,
    subcategories: [
      { key: 'microwave', name: 'Microwave containers', match: /^MW/i },
      { key: 'bowls-cups', name: 'Bowls & portion cups', match: /^PP /i },
      { key: 'meal-boxes', name: 'Meal boxes & trays', match: /Compartment|Cupco|Tray|Lunch Box/i },
      { key: 'tubs-bottles', name: 'Tubs, buckets & bottles' },
    ],
    showOnHome: true,
    chapter: {
      giant: 'Containers',
      hook: 'Lift the lid on 100+ containers.',
      hookText: 'Black-base microwave containers, clear PP bowls and cups, and compartment boxes, from sauce cups to family meals.',
      specsTitle: 'Microwave containers, black base',
      specs: [
        { label: 'Rectangular', value: 'RE12 · RE16 · RE24 · RE28 · RE32 · RE38 · RE48 · RE58' },
        { label: 'Round', value: 'RO16 · RO24 · RO32 · RO48' },
        { label: 'Clear', value: '500 · 650 · 750 · 1000 · 2000 ml' },
        { label: 'Pack', value: '50 pcs × 3 pkt' },
      ],
      chips: ['RE12 – RE58', 'RO16 – RO48', 'PP bowl 200–500 cc'],
      ctaLabel: 'See containers',
      specsPlacement: 'right',
    },
  },
  {
    slug: 'cups',
    name: 'Cups & lids',
    order: 4,
    blurb: 'Paper cups 2.5–12 oz, PET glasses, dome lids, straws',
    match: /\bCups?\b|\d+MM .*GLASS|92MM|^Lids|Straw|Juice Cover/i,
    subcategories: [
      { key: 'hot', name: 'Hot cups & lids', match: /Paper Cup|Rippled|Lids - (IHC|Paper)/i },
      { key: 'cold', name: 'Cold cups & dome lids', match: /GLASS|92MM|Juice|Dome/i },
      { key: 'straws-small', name: 'Straws & small cups' },
    ],
  },
  {
    slug: 'bags',
    name: 'Bags',
    order: 5,
    blurb: 'Carry bags, kraft and paper bags, garbage bags, smoky and TP bags',
    match: /Bag|Pouch/i,
    subcategories: [
      { key: 'garbage', name: 'Garbage bags', match: /Garbage/i },
      { key: 'paper-kraft', name: 'Paper & kraft bags', match: /Kraft|Paper Bag|Pouch/i },
      { key: 'food-grade', name: 'Food bags', match: /Smoky|TP Bags/i },
      { key: 'carry', name: 'Carry bags' },
    ],
  },
  {
    slug: 'wraps',
    name: 'Wraps & rolls',
    order: 6,
    blurb: 'Cling and stretch film, sandwich paper, rotti paper, sufra, bill rolls',
    match: /Cling|Stretch Film|Sandwich Paper|Rotti|Sufra|Vegetable Roll|Bill Roll|Baking Paper|Tape|Carton|Rubber Band/i,
    subcategories: [
      { key: 'film', name: 'Cling & stretch film', match: /Cling|Stretch/i },
      { key: 'counter-supplies', name: 'Counter supplies', match: /Bill Roll|Tape|Carton|Rubber/i },
      { key: 'food-paper', name: 'Food paper & rolls' },
    ],
  },
  {
    slug: 'chemicals',
    name: 'Cleaning chemicals',
    order: 7,
    blurb: 'Dish wash, floor and glass cleaners, disinfectant, hand wash',
    match: /Clean|Wash|Bleach|Clorox|Clorex|Dettol|Disinfect|Detergent|Harpic|Sanitizer|Freshener|Stripper|Opener|PIF PAF/i,
    subcategories: [
      { key: 'kitchen', name: 'Kitchen', match: /Dish|Oven|Drainage|Detergent/i },
      { key: 'hands-glass', name: 'Hands & glass', match: /Hand Wash|Sanitizer|Glass/i },
      { key: 'air', name: 'Air & insects', match: /Freshener|PIF PAF/i },
      { key: 'floor-surface', name: 'Floor & surfaces' },
    ],
    showOnHome: true,
    chapter: {
      giant: 'Chemicals',
      hook: "One pass and it's spotless.",
      hookText: 'Dish wash, floor and glass cleaners, disinfectant and hand wash, from 500 ml bottles to 5 L refills.',
      specsTitle: 'Back of house, covered.',
      specs: [
        { label: 'Dish wash', value: '500 ml · 1 L · 5 L' },
        { label: 'Floor cleaner', value: '5 L · green, lavender, pink' },
        { label: 'Glass cleaner', value: '700 ml · 750 ml · 5 L' },
        { label: 'Disinfectant', value: '5 L × 4 pcs' },
        { label: 'Hand wash', value: '500 ml · 5 L refill' },
        { label: 'Heavy duty', value: 'Oven cleaner · floor stripper' },
      ],
      chips: ['500 ml · 1 L · 5 L', '4 × 5 L cartons'],
      ctaLabel: 'See chemicals',
      specsPlacement: 'behind',
    },
  },
  {
    slug: 'tools',
    name: 'Cleaning tools',
    order: 8,
    blurb: 'Mops, brooms, floor wipers, sponges, pedal bins, mop buckets',
    match: /Mop|Broom|Wiper|Duster|Dustpan|Sponge|Scourer|Steel Wool|\bBin\b|Bucket|Brush|Squeegee|Washer|Microfiber|Plastic Clip|Machine Pad|Insect Trap|Cooler Box/i,
    subcategories: [
      { key: 'floor', name: 'Floor care', match: /Mop|Wiper|Bucket|Machine Pad|Plastic Clip/i },
      { key: 'brooms', name: 'Brooms & dustpans', match: /Broom|Dustpan|Duster/i },
      { key: 'scrubbing', name: 'Sponges & cloths', match: /Sponge|Scourer|Steel Wool|Microfiber/i },
      { key: 'bins-washroom', name: 'Bins & washroom' },
    ],
  },
  {
    slug: 'ppe',
    name: 'PPE & cutlery',
    order: 9,
    blurb: 'Vinyl, latex and nitrile gloves, hair nets, aprons, spoons, forks, skewers',
    match: /Glove|Hair Net|Face Mask|Apron|Spoon|Fork|Cutlery|Skewer|Toothpick/i,
    subcategories: [
      { key: 'gloves', name: 'Gloves', match: /Glove/i },
      { key: 'hygiene-wear', name: 'Hair nets, masks & aprons', match: /Hair Net|Mask|Apron/i },
      { key: 'cutlery', name: 'Cutlery & skewers' },
    ],
  },
  {
    slug: 'foam',
    name: 'Foam & plates',
    order: 10,
    blurb: 'Foam plates, trays, bowls, hamburger and lunch boxes, paper plates',
    match: /^Foam|Plate|Dinner Box|Snack Box|Meal Box|Burger Box|Plastic Bowl/i,
    subcategories: [
      { key: 'plates-bowls', name: 'Plates & bowls', match: /Plate|Bowl|Cup/i },
      { key: 'paper-boxes', name: 'Paper boxes', match: /Dinner Box|Snack Box|Meal Box|Paper Burger|Kraft Burger/i },
      { key: 'boxes-trays', name: 'Foam boxes & trays' },
    ],
  },
]

/**
 * Specific rules run before broad ones, e.g. "PP Cup" is a container not a cup, and "Chicken Bucket"
 * is a container not a cleaning tool.
 */
export const RULE_ORDER = ['aluminium', 'tissue', 'ppe', 'foam', 'pp-containers', 'cups', 'bags', 'wraps', 'containers', 'tools', 'chemicals']
export const PP_CONTAINERS = /^PP (Cup|Bowls)/i

/** Brand names as they appear in the sheet. thirdParty: owned by another company, never generate imagery. */
export const BRANDS: { name: string; pattern: RegExp; thirdParty?: boolean; marquee?: boolean }[] = [
  { name: 'Ducon', pattern: /\bDucon\b/i, marquee: true },
  { name: 'Evopack', pattern: /\bEvopack\b/i, marquee: true },
  { name: 'Prestige', pattern: /\bPrestige\b/i, marquee: true },
  { name: 'Hotpack', pattern: /\bHotpack\b/i, marquee: true },
  { name: 'Corepack', pattern: /\bCorepack\b/i, marquee: true },
  { name: 'Gesalife', pattern: /\bGesa(life|clean)\b/i, marquee: true },
  { name: 'Interplast', pattern: /\b(Interplast|IP)\b/ },
  { name: 'Falcon', pattern: /\bFalcon\b/i },
  { name: 'Safco', pattern: /\bSafco\b/i },
  { name: 'Wrapall', pattern: /\bWrapall\b/i },
  { name: 'Cosmo', pattern: /\bCosmo\b/i },
  { name: 'Noortech', pattern: /\bNoortech\b/i },
  { name: 'Saada', pattern: /\bSaada\b/i },
  { name: 'Jabiri', pattern: /\bJabiri\b/i },
  { name: 'Moonlight', pattern: /\bMoonlight\b/i },
  { name: 'Xtra Clean', pattern: /\bXtra Clean\b/i },
  { name: 'Realox', pattern: /\bRealox\b/i },
  { name: 'Eurowash', pattern: /\bEurowash\b/i },
  { name: 'Dettol', pattern: /\bDettol\b/i, thirdParty: true, marquee: true },
  { name: 'Clorox', pattern: /\bClor(o|e)x\b/i, thirdParty: true, marquee: true },
  { name: 'Purell', pattern: /\bPurell\b/i, thirdParty: true, marquee: true },
  { name: 'Harpic', pattern: /\bHarpic\b/i, thirdParty: true },
  { name: 'Lux', pattern: /\bLUX\b/, thirdParty: true },
  { name: 'JIF', pattern: /\bJIF\b/, thirdParty: true },
  { name: 'PIF PAF', pattern: /\bPIF PAF\b/i, thirdParty: true },
]

export const HOME = {
  hero: {
    eyebrow: 'Food packaging · Tissue & hygiene · Cleaning supplies',
    title: 'Clean, plus everything your kitchen runs on.',
    highlight: 'plus',
    text: 'Klen Plus supplies foil and takeaway containers, cups, bags, tissue, chemicals and gloves by the carton, for restaurants, cafés, hotels and facility teams.',
    primary: 'Browse products',
    secondary: 'Send your order list',
    overlays: [
      { eyebrow: 'One supplier', title: 'Packaging and hygiene, on one delivery.', text: 'Order takeaway packaging and back-of-house cleaning supplies together.', align: 'end' as const, from: 0.28, until: 0.46 },
      // The intro sheet starts sliding over the hero at about 0.67, so overlays finish before then.
      { eyebrow: 'By the carton', title: 'Priced the way you buy.', align: 'start' as const, from: 0.5, until: 0.66 },
    ],
  },
  statement:
    "From the foil that wraps tonight's orders to the cleaner that mops the floor after close: one supplier, one delivery, priced by the carton.",
  facts: [
    { value: '{active}', unit: 'active SKUs', text: 'Every size, colour and pack variant listed separately, so you order exactly what you use.' },
    { value: '14', unit: 'categories', text: 'Packaging, disposables, tissue, chemicals, tools and PPE, all from one account.' },
    { value: '3', unit: 'order checks', text: 'Before dispatch, we check the item, its packaging and the quantity against your order.' },
  ],
  chaptersTitle: 'Every aisle unpacks as you scroll.',
  chaptersText: 'Each category opens the way you use the product: a tissue unfolds, a foil roll runs out, a lid lifts and a squeegee clears the glass.',
  industriesTitle: 'Built around how you work.',
  industries: [
    { slug: 'restaurant', name: 'Restaurants & cloud kitchens', orders: 'MW containers, foil, carry bags, cutlery sets' },
    { slug: 'cafe', name: 'Cafés & juice bars', orders: 'Paper cups 4–12 oz, PET glasses, dome lids, straws' },
    { slug: 'bakery', name: 'Bakeries & sweet shops', orders: 'Sandwich paper, kraft bags, club boxes, cling film' },
    { slug: 'hotel', name: 'Hotels & catering', orders: 'Interfold, napkins, platters, hand wash, chemicals' },
    { slug: 'facility', name: 'Facility management', orders: 'Garbage bags, maxi rolls, mops, floor stripper' },
    { slug: 'salon', name: 'Salons & clinics', orders: 'Nitrile and vinyl gloves, aprons, hair nets, wipes' },
  ],
  stepsTitle: 'From list to delivery in four steps.',
  steps: [
    { title: 'Build your list', text: 'Add products with the exact size and pack, e.g. RE24, 50 pcs × 3 pkt.' },
    { title: 'Send for a quote', text: 'Submit the list here or on WhatsApp. No account needed for your first order.' },
    { title: 'Confirm cartons', text: 'We confirm stock, carton price and delivery day before anything ships.' },
    { title: 'Reorder from your list', text: "Your list is saved, so next month's restock takes a minute." },
  ],
  quote: {
    title: 'Send your monthly list.',
    highlight: "We'll price it by the carton.",
    text: "Paste what you order now, even as a rough list. We'll match every line to a Klen Plus product and send back a quote.",
  },
}
