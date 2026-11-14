import type { CollectionConfig } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'thirdParty', 'showInMarquee'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    {
      name: 'thirdParty',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'A consumer brand owned by another company (e.g. Dettol). Use supplier photos, never generated ones.' },
    },
    { name: 'showInMarquee', type: 'checkbox', defaultValue: false },
  ],
}
