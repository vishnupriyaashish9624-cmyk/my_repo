import type { CollectionConfig } from 'payload'

/** Quote requests and contact-page messages from the website. Created by the forms' server actions. */
export const Enquiries: CollectionConfig = {
  slug: 'enquiries',
  admin: {
    useAsTitle: 'business',
    defaultColumns: ['business', 'enquiryType', 'phone', 'status', 'createdAt'],
    group: 'Sales',
  },
  access: {
    // Only signed-in staff can read or edit; the site creates entries server-side.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'business', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', admin: { description: 'Contact person (contact page).' } },
        { name: 'email', type: 'email' },
      ],
    },
    { name: 'list', type: 'textarea', required: true, admin: { description: 'What the customer needs.' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Quoted', value: 'quoted' },
        { label: 'Won', value: 'won' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'enquiryType',
      label: 'Enquiry type',
      type: 'select',
      options: [
        { label: 'General enquiry', value: 'general' },
        { label: 'Product enquiry', value: 'product' },
        { label: 'Request a quote', value: 'quote' },
        { label: 'Bulk & regular orders', value: 'bulk' },
        { label: 'Delivery enquiry', value: 'delivery' },
        { label: 'Order support', value: 'support' },
        { label: 'Business enquiry', value: 'business' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'quote',
      options: [
        { label: 'Quote form', value: 'quote' },
        { label: 'Contact page', value: 'contact' },
      ],
      admin: { position: 'sidebar', readOnly: true },
    },
    { name: 'notes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
