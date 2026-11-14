import type { ItemKey } from '@/components/vectors/ItemVectors'
import type { UseKey } from '@/components/vectors/TissueVectors'

/** A question's icon: an item vector, or a 'use:' scene vector. */
export type FaqIcon = ItemKey | `use:${UseKey}`
export type FaqItem = { q: string; a: string; icon: FaqIcon }

/**
 * Builds the questions from what the site already states (ordering steps, carton pricing, catalogue
 * size, brands, who it's for). Delivery areas, minimum order and payment terms aren't stated anywhere
 * yet, so they're answered by pointing to the quote, where they're confirmed.
 */
export function faqItems({ totalActive, categories, brands, industries }: { totalActive: number; categories: number; brands: string[]; industries: string[] }): FaqItem[] {
  const someBrands = brands.filter((b) => ['Dettol', 'Harpic', 'Clorox', 'Hotpack', 'Falcon', 'Ducon', 'Purell', 'Lux'].includes(b))
  return [
    {
      icon: 'use:counter',
      q: 'Do I need an account to order?',
      a: 'No. Send your list through the quote form or on WhatsApp. No account is needed for your first order, and we keep your list for the next one.',
    },
    {
      icon: 'stack',
      q: 'How is pricing worked out?',
      a: 'By the carton. Every product shows its carton or bundle pack (for example 50 pcs × 20 pkt), so the price on your quote matches what arrives.',
    },
    {
      icon: 'bill-roll',
      q: 'Can I send a rough list?',
      a: 'Yes. Paste what you order now, even as a rough list. We match every line to a Klen Plus product and send back a quote.',
    },
    {
      icon: 'clear-bowl',
      q: 'Can I choose an exact size, colour or pack?',
      a: `Yes. There are ${totalActive} active products across ${categories} categories, and every size, colour and pack variant is listed on its own, so you order exactly what you use.`,
    },
    {
      icon: 'use:storeroom',
      q: 'When do I find out stock and the delivery day?',
      a: 'Before anything ships. We confirm stock, carton price and the delivery day with your quote, so there are no surprises on the day.',
    },
    {
      icon: 'disinfect',
      q: 'Which brands do you carry?',
      a: `${brands.length} brands${someBrands.length ? `, including ${someBrands.slice(0, 5).join(', ')}` : ''}, alongside our own range. If you need a specific brand, add it to your list and we'll quote it.`,
    },
    {
      icon: 'use:catering',
      q: 'Who do you supply?',
      a: `${industries.length ? industries.join(', ') : 'Restaurants, cafés, hotels and facility teams'}. If your business runs a kitchen, a counter or a washroom, the catalogue covers it.`,
    },
    {
      icon: 'carry-bag',
      q: 'How do reorders work?',
      a: 'Your list is saved, so next month’s restock is the same list with new quantities. It takes about a minute.',
    },
    {
      icon: 'use:delivery',
      q: 'Do you deliver to my area, and is there a minimum order?',
      a: 'Tell us your area with your list. Delivery, any minimum and payment terms are confirmed on your quote before you commit to anything.',
    },
  ]
}

