import type { CollectionConfig } from 'payload'

/**
 * A product category and its homepage chapter: a scroll film (frames in /media/films/category-<slug>/)
 * with text that appears at set points of the chapter's scroll (0–1).
 */
export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'order', 'showOnHome'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Used in URLs and media paths, e.g. "tissue" → media-src/category-tissue.mp4' },
    },
    { name: 'order', type: 'number', defaultValue: 0 },
    { name: 'blurb', type: 'textarea', admin: { description: 'One line for the category rail.' } },
    {
      name: 'subcategories',
      type: 'array',
      admin: { description: 'Groups shown on the category page. Products point to these by key.' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
      ],
    },
    {
      type: 'collapsible',
      label: 'Homepage chapter',
      fields: [
        {
          name: 'showOnHome',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Give this category its own scroll-film chapter on the homepage.' },
        },
        {
          name: 'chapter',
          type: 'group',
          admin: { condition: (_, siblingData) => Boolean(siblingData?.showOnHome) },
          fields: [
            { name: 'giant', type: 'text', admin: { description: 'Huge title over the opening frames, e.g. "Tissue"' } },
            { name: 'hook', type: 'text', admin: { description: 'Short headline that appears while the product opens.' } },
            { name: 'hookText', type: 'textarea' },
            { name: 'specsTitle', type: 'text' },
            {
              name: 'specs',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
              ],
            },
            {
              name: 'chips',
              type: 'array',
              fields: [{ name: 'label', type: 'text', required: true }],
            },
            { name: 'ctaLabel', type: 'text' },
            {
              name: 'specsPlacement',
              type: 'select',
              defaultValue: 'right',
              options: [
                { label: 'On the product (uses the specs box below, e.g. tissue sheet)', value: 'on' },
                { label: 'Card on the right', value: 'right' },
                { label: 'Card on the left', value: 'left' },
                { label: 'Across the top (product sits low in the frame)', value: 'top' },
                { label: 'Centred over the clean surface (e.g. glass, floor)', value: 'behind' },
              ],
              admin: { description: 'Where the final frame of the footage leaves room for text.' },
            },
            {
              name: 'specsBox',
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData?.specsPlacement === 'on',
                description: 'The product surface in the final frame, as fractions of the video (0–1). The text is mapped onto it at any screen size.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'x', type: 'number', min: 0, max: 1, defaultValue: 0.25 },
                    { name: 'y', type: 'number', min: 0, max: 1, defaultValue: 0.15 },
                    { name: 'w', type: 'number', min: 0, max: 1, defaultValue: 0.5 },
                    { name: 'h', type: 'number', min: 0, max: 1, defaultValue: 0.7 },
                  ],
                },
              ],
            },
            {
              name: 'length',
              type: 'number',
              defaultValue: 3,
              min: 2,
              max: 6,
              admin: { description: 'Scroll length of the chapter, in screen heights.' },
            },
            {
              name: 'timing',
              type: 'group',
              admin: { description: 'Scroll positions from 0 to 1. Defaults follow the 1 s / 4 s / 3 s clip rhythm.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'titleUntil', type: 'number', defaultValue: 0.2, min: 0, max: 1 },
                    { name: 'hookFrom', type: 'number', defaultValue: 0.24, min: 0, max: 1 },
                    { name: 'hookUntil', type: 'number', defaultValue: 0.52, min: 0, max: 1 },
                    { name: 'specsFrom', type: 'number', defaultValue: 0.58, min: 0, max: 1 },
                    { name: 'ctaFrom', type: 'number', defaultValue: 0.76, min: 0, max: 1 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
