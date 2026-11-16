/** Copy and media for the Tissue Paper & Hygiene Supplies category page. */

/**
 * Sections stack like sheets, alternating dark and light as on the homepage: each one overlaps the
 * previous by its corner radius, and TissueMotion scales it up from a card as it scrolls in.
 */
export const SHEET = 'relative -mt-9 overflow-clip rounded-t-[36px]'

const IMG = '/media/tissue'

export const TISSUE_IMG = {
  kitchen: `${IMG}/kitchen-roll.webp`,
  napkins: `${IMG}/napkin-packs.webp`,
  towels: `${IMG}/hand-towels.webp`,
  toilet: `${IMG}/toilet-rolls.webp`,
  facial: `${IMG}/facial-box.webp`,
  centre: `${IMG}/centre-pull.webp`,
  jumbo: `${IMG}/jumbo-roll.webp`,
}

export const RANGE = [
  {
    key: 'facial',
    name: 'Facial Tissues',
    text: 'Boxed tissues for hotel bedside tables, reception counters, meeting rooms and other guest spaces.',
    image: TISSUE_IMG.facial,
    tag: 'Guest spaces',
  },
  {
    key: 'napkins',
    name: 'Table Napkins',
    text: 'Paper napkins for dine-in service, takeaway bags and catering trays. Choose a folded size that suits your table setting or packaging.',
    image: TISSUE_IMG.napkins,
    tag: 'Dining & takeaway',
  },
  {
    key: 'towels',
    name: 'Folded Hand Towels',
    text: 'Individual paper towels for hand drying in shared washrooms and staff handwashing areas. Match the fold and sheet size to your dispenser.',
    image: TISSUE_IMG.towels,
    tag: 'Washrooms',
  },
  {
    key: 'toilet',
    name: 'Toilet Tissue Rolls',
    text: 'Standard rolls for guest bathrooms and jumbo rolls for busy shared facilities. Check the roll diameter and core size against your holder.',
    image: TISSUE_IMG.toilet,
    tag: 'Standard & jumbo',
  },
  {
    key: 'kitchen',
    name: 'Kitchen Paper Rolls',
    text: 'Tear-off sheets for small spills and routine wiping at beverage stations, staff pantries and kitchen counters.',
    image: TISSUE_IMG.kitchen,
    tag: 'Pantry & counters',
  },
] as const

export const PRODUCT_OPTIONS = ['Facial tissues', 'Table napkins', 'Hand towels', 'Toilet rolls', 'Kitchen rolls']

export const WHY = [
  {
    title: 'A clear basis for comparison.',
    text: 'We confirm the pack count and carton quantity so you can compare the cost per box, roll or pack.',
  },
  {
    title: 'Help with dispenser fit.',
    text: 'Share a model number, measurements or a photo of your current refill. Our team can help narrow down the options before you place a bulk order.',
  },
  {
    title: 'One list for several spaces.',
    text: 'Combine guest-room tissues, table napkins and washroom refills in a single enquiry.',
  },
  {
    title: 'Simpler repeat orders.',
    text: 'Once you’ve chosen your products, we can keep your list on hand so your team can reorder the same specifications.',
  },
]

export const INDUSTRIES = [
  {
    name: 'Restaurants & Cafés',
    text: 'Table napkins for seated guests, compact napkins for takeaway orders and paper towels for staff handwashing areas.',
    image: TISSUE_IMG.napkins,
    uses: ['Table napkins', 'Takeaway napkins', 'Hand towels'],
  },
  {
    name: 'Hotels & Serviced Apartments',
    text: 'Facial tissue boxes that fit guest-room holders, toilet rolls for housekeeping trolleys and separate refills for public washrooms.',
    image: TISSUE_IMG.facial,
    uses: ['Facial tissues', 'Toilet rolls', 'Washroom refills'],
  },
  {
    name: 'Catering & Events',
    text: 'Napkin quantities based on guest count, service style and the number of food or beverage stations.',
    image: TISSUE_IMG.centre,
    uses: ['Napkins by guest count', 'Station rolls'],
  },
  {
    name: 'Offices & Commercial Buildings',
    text: 'Pantry rolls, meeting-room tissues and washroom refills that fit the dispensers already installed.',
    image: TISSUE_IMG.kitchen,
    uses: ['Pantry rolls', 'Meeting-room tissues', 'Dispenser refills'],
  },
  {
    name: 'Cleaning & Facility Management',
    text: 'Site-specific refill lists that help cleaning teams bring the correct cartons to each building.',
    image: TISSUE_IMG.jumbo,
    uses: ['Jumbo rolls', 'Hand towels', 'Per-site lists'],
  },
]

export const APPLICATIONS = [
  {
    place: 'At the takeaway counter',
    text: 'Keep folded napkins beside the packing station. Choose a size that sits flat inside your most-used bag or meal box.',
    image: TISSUE_IMG.napkins,
  },
  {
    place: 'In guest rooms',
    text: 'Match the facial tissue box to the bedside or vanity holder so housekeeping can replace it easily.',
    image: TISSUE_IMG.facial,
  },
  {
    place: 'In shared washrooms',
    text: 'Pair the hand towel fold and toilet roll dimensions with the installed dispensers. Use peak-hour consumption to plan refill rounds.',
    image: TISSUE_IMG.towels,
  },
  {
    place: 'At beverage stations',
    text: 'Keep kitchen rolls within reach for coffee splashes, condensation and minor counter spills.',
    image: TISSUE_IMG.kitchen,
  },
]

export const SPECS = [
  'Paper composition',
  'Ply count',
  'Sheet dimensions',
  'Roll length',
  'Core diameter',
  'Carton quantity',
]

export const GUIDE = [
  {
    title: 'Start with the task',
    text: 'Choose napkins for meal service, facial tissues for guest spaces, hand towels for hand drying and kitchen rolls for light wiping.',
  },
  {
    title: 'Measure the holder',
    text: 'For rolls, check the width, outer diameter and core diameter. For folded towels, check the fold type and folded dimensions.',
  },
  {
    title: 'Compare like for like',
    text: 'For folded products, compare sheet size and sheets per pack. For rolls, compare roll length alongside the number of rolls per carton.',
  },
  {
    title: 'Estimate your order',
    text: 'Multiply your average weekly usage by the number of weeks between deliveries. If you use 12 boxes a week and order every four weeks, plan for 48 boxes before adding any reserve for busy periods.',
  },
]

export const FAQ = [
  {
    q: 'How can I check whether a refill fits my dispenser?',
    a: 'Send the dispenser model number or a photo of the current refill label. If the label is missing, share the roll or folded towel measurements so we can help identify a suitable size.',
  },
  {
    q: 'What does “2-ply” mean?',
    a: 'A 2-ply sheet has two layers of paper. When comparing options, also consider sheet size, texture and how the product performs in its intended use.',
  },
  {
    q: 'How do I compare two cartons with different pack sizes?',
    a: 'For boxed tissues, divide the carton price by the total number of sheets, then compare products with similar ply and sheet dimensions. For toilet rolls of different lengths, compare the price per metre.',
  },
  {
    q: 'Can I request one quote for several branches?',
    a: 'Yes. List the items and quantities for each branch, along with its delivery location. If the branches use different dispensers, include the refill details for each site.',
  },
  {
    q: 'Can I request product documents before ordering?',
    a: 'Yes. Include the item name and the document your purchasing team needs. We’ll confirm what is available for that product.',
  },
]
