import type { CollectionConfig } from 'payload'

/** One sellable SKU, as listed in the product sheet (size, colour and pack are separate variants). */
export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'subcategory', 'brand', 'packing', 'active'],
    listSearchableFields: ['name', 'packing'],
    group: 'Catalogue',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'relationship', relationTo: 'categories', required: true, index: true },
        {
          name: 'subcategory',
          type: 'text',
          index: true,
          admin: { description: 'Key of one of the category’s subcategories.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'brand', type: 'relationship', relationTo: 'brands' },
        { name: 'size', type: 'text', admin: { description: 'e.g. 12 Oz, 45cm, 5Ltr' } },
        { name: 'colour', type: 'text' },
      ],
    },
    { name: 'packing', type: 'text', admin: { description: 'Pack configuration, e.g. 50pcs x 20pkt' } },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: { position: 'sidebar', description: 'Inactive products stay in the admin but are hidden on the site.' },
    },
    { name: 'image', type: 'upload', relationTo: 'media', admin: { position: 'sidebar' } },
    {
      name: 'sourceName',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true, description: 'Original line from the product sheet.' },
    },
  ],
}
