import type { GlobalConfig } from 'payload'

export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Site settings',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    { name: 'tagline', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'whatsapp', type: 'text', admin: { description: 'International format, digits only, e.g. 9715XXXXXXXX' } },
        { name: 'email', type: 'email' },
      ],
    },
    { name: 'address', type: 'textarea' },
  ],
}
