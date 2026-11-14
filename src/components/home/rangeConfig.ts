import type { VectorKey } from '../vectors/CategoryVector'
import type { ItemKey } from '../vectors/ItemVectors'
import type { UseKey } from '../vectors/TissueVectors'

/**
 * Lead-in sections shown before each category film (see CategoryRange). Spec cards come from the
 * category's chapter specs in the CMS; this file picks the vector for each spec label, the heading
 * and the three "where it's used" cards. A spec label not listed here falls back to `icon`.
 */
export type RangeConfig = {
  /** Category vector used as the fallback item icon and for the drifting background shapes. */
  icon: VectorKey
  /** Heading; `n` is the number of spec cards as a capitalised word ("Five"). */
  heading: (n: string) => string
  /** Lower-cased spec label → item vector. */
  items: Record<string, ItemKey>
  uses: { key: UseKey; name: string; text: string }[]
}

export const RANGES: Record<string, RangeConfig> = {
  tissue: {
    icon: 'tissue',
    heading: (n) => `${n} tissues, one storeroom shelf.`,
    items: { 'maxi roll': 'maxi', interfold: 'interfold', 'toilet roll': 'toilet', napkin: 'napkin', facial: 'facial' },
    uses: [
      { key: 'kitchen', name: 'Kitchen line', text: 'Maxi rolls, auto-cut and kitchen towels' },
      { key: 'washroom', name: 'Washroom', text: 'Interfold, toilet rolls and dispensers' },
      { key: 'table', name: 'Table & personal', text: 'Napkins, facial tissue and wet wipes' },
    ],
  },
  aluminium: {
    icon: 'aluminium',
    heading: (n) => `${n} ways to wrap it in foil.`,
    items: { 'foil rolls': 'foil-roll', containers: 'cat:aluminium', platters: 'platter', wraps: 'burger-wrap' },
    uses: [
      { key: 'kitchen', name: 'Prep & grill line', text: 'Foil rolls in 30 and 45 cm widths' },
      { key: 'catering', name: 'Catering', text: 'Platters for buffets and party orders' },
      { key: 'delivery', name: 'Takeaway', text: 'Lidded containers and burger wraps' },
    ],
  },
  containers: {
    icon: 'takeaway',
    heading: (n) => `${n} ways to pack a portion.`,
    items: { rectangular: 'rect-box', round: 'round-tub', clear: 'clear-bowl', pack: 'stack' },
    uses: [
      { key: 'delivery', name: 'Delivery', text: 'Microwave-safe black-base containers' },
      { key: 'kitchen', name: 'Prep & storage', text: 'Clear PP bowls for portions and mise en place' },
      { key: 'storeroom', name: 'Storeroom', text: 'Packed 50 to a sleeve, three sleeves a pack' },
    ],
  },
  cups: {
    icon: 'cups',
    heading: (n) => `${n} ways to serve every pour.`,
    items: {
      'paper cups': 'cat:cups',
      rippled: 'rippled',
      'pet glasses': 'pet-glass',
      lids: 'dome-lid',
      straws: 'straws',
      'small cups': 'icecream',
    },
    uses: [
      { key: 'cafe', name: 'Coffee & tea', text: 'Paper and rippled cups with sip lids' },
      { key: 'delivery', name: 'Juice & shakes', text: 'PET glasses with dome lids and straws' },
      { key: 'table', name: 'Desserts', text: 'Small cups for ice cream and sides' },
    ],
  },
  bags: {
    icon: 'bags',
    heading: (n) => `${n} bags for every hand-off.`,
    items: { 'carry bags': 'carry-bag', kraft: 'cat:bags', 'paper bags': 'paper-bag', garbage: 'garbage', 'food bags': 'zip-pouch' },
    uses: [
      { key: 'counter', name: 'Checkout', text: 'Carry bags by the 20 kg bundle' },
      { key: 'delivery', name: 'Takeaway', text: 'Kraft and paper bags for every order size' },
      { key: 'kitchen', name: 'Back of house', text: 'Garbage bags for every bin size' },
    ],
  },
  wraps: {
    icon: 'film',
    heading: (n) => `${n} rolls that keep it sealed.`,
    items: {
      'cling film': 'cling',
      'stretch film': 'stretch',
      'sandwich paper': 'sandwich',
      'rotti paper': 'rotti',
      sufra: 'sufra',
      'bill rolls': 'bill-roll',
    },
    uses: [
      { key: 'kitchen', name: 'Prep line', text: 'Cling film and sandwich, rotti and baking paper' },
      { key: 'storeroom', name: 'Storeroom', text: 'Stretch film for cartons and pallets' },
      { key: 'counter', name: 'Billing counter', text: 'Thermal bill rolls, 80 × 80 mm' },
    ],
  },
  chemicals: {
    icon: 'chemicals',
    heading: (n) => `${n} bottles for a spotless shift.`,
    items: {
      'dish wash': 'dish',
      'floor cleaner': 'can-5l',
      'glass cleaner': 'cat:chemicals',
      disinfectant: 'disinfect',
      'hand wash': 'cat:hygiene',
      'heavy duty': 'heavy',
    },
    uses: [
      { key: 'kitchen', name: 'Kitchen', text: 'Dish wash and oven cleaner' },
      { key: 'floor', name: 'Floors', text: 'Floor cleaner, disinfectant and stripper' },
      { key: 'washroom', name: 'Washroom', text: 'Hand wash and glass cleaner' },
    ],
  },
  tools: {
    icon: 'tools',
    heading: (n) => `${n} tools that leave a shine.`,
    items: { mops: 'mop', floor: 'bucket', brooms: 'cat:tools', scrubbing: 'sponge', bins: 'pedal-bin', washroom: 'squeegee' },
    uses: [
      { key: 'floor', name: 'Floors & corridors', text: 'Mops, wipers, buckets and brooms' },
      { key: 'kitchen', name: 'Kitchen', text: 'Sponges, steel wool and pedal bins' },
      { key: 'washroom', name: 'Washroom', text: 'Squeegees and toilet brushes' },
    ],
  },
  ppe: {
    icon: 'ppe',
    heading: (n) => `${n} ways to keep it hygienic.`,
    items: { vinyl: 'glove-vinyl', latex: 'glove-latex', nitrile: 'glove-nitrile', 'hygiene wear': 'hairnet', cutlery: 'cutlery' },
    uses: [
      { key: 'kitchen', name: 'Food prep', text: 'Gloves and hair nets on the line' },
      { key: 'catering', name: 'Service', text: 'Aprons and face masks for the floor' },
      { key: 'table', name: 'Table', text: 'Disposable cutlery and skewers' },
    ],
  },
  foam: {
    icon: 'foam',
    heading: (n) => `${n} shapes to serve and pack.`,
    items: { plates: 'plate', boxes: 'cat:foam', trays: 'tray', 'bowls & cups': 'foam-bowl', 'paper boxes': 'cat:takeaway' },
    uses: [
      { key: 'catering', name: 'Events', text: 'Plates and compartment trays' },
      { key: 'delivery', name: 'Takeaway', text: 'Hamburger, hot dog and lunch boxes' },
      { key: 'table', name: 'Quick service', text: 'Foam bowls and cups' },
    ],
  },
}

const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve']
export const countWord = (n: number) => WORDS[n] ?? String(n)
