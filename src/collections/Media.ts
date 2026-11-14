import type { CollectionConfig } from 'payload'

/** CMS uploads (product photos, supplier packshots). Scroll-film frames live in /public/media, not here. */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: { group: 'Catalogue' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}
