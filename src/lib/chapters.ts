import type { ItemKey } from '@/components/vectors/ItemVectors'

export type Chapter = { n: number; title: string; icon: ItemKey }

/** The homepage's 10 chapters, in order. Each band and the side index read from this list. */
export const CHAPTERS: Chapter[] = [
  { n: 1, title: 'Welcome', icon: 'cat:tissue' },
  { n: 2, title: 'Why choose Klen+', icon: 'disinfect' },
  { n: 3, title: 'What we provide', icon: 'cat:takeaway' },
  { n: 4, title: 'Our industrial solutions', icon: 'mop' },
  { n: 5, title: 'Our approach to quality checks', icon: 'clear-bowl' },
  { n: 6, title: 'Your trusted supply partner', icon: 'glove-nitrile' },
  { n: 7, title: 'Frequently asked questions', icon: 'cat:cups' },
  { n: 8, title: 'Request a quote / contact', icon: 'carry-bag' },
  { n: 9, title: 'Our commitment to your business', icon: 'cat:hygiene' },
  { n: 10, title: 'Product information & documentation', icon: 'bill-roll' },
]

/** The About page's 12 chapters. */
export const ABOUT_CHAPTERS: Chapter[] = [
  { n: 1, title: 'About Klen Plus', icon: 'cat:tissue' },
  { n: 2, title: 'Our purpose', icon: 'dome-lid' },
  { n: 3, title: 'Our product range', icon: 'stack' },
  { n: 4, title: 'Who we serve', icon: 'cat:cups' },
  { n: 5, title: 'Food packaging & serving', icon: 'cat:takeaway' },
  { n: 6, title: 'Cleaning & hygiene', icon: 'disinfect' },
  { n: 7, title: 'Materials & product selection', icon: 'clear-bowl' },
  { n: 8, title: 'Cartons & pack sizes', icon: 'cat:bags' },
  { n: 9, title: 'Quality checks', icon: 'glove-nitrile' },
  { n: 10, title: 'Care in every delivery', icon: 'zip-pouch' },
  { n: 11, title: 'Returns & replacements', icon: 'bill-roll' },
  { n: 12, title: 'Contact Klen Plus', icon: 'carry-bag' },
]

export const chapterId = (n: number, prefix = 'sec') => `${prefix}-${String(n).padStart(2, '0')}`

/**
 * Homepage anchor for a chapter, found by its title so links survive chapters being reordered.
 * Falls back to the top of the page if the title is not in the list.
 */
export const chapterHash = (title: string) => {
  const i = CHAPTERS.findIndex((c) => c.title === title)
  return i < 0 ? '#top' : `#${chapterId(i + 1)}`
}
