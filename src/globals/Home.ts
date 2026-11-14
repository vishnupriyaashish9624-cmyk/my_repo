import type { GlobalConfig } from 'payload'

const windowFields = [
  {
    type: 'row' as const,
    fields: [
      { name: 'from', type: 'number' as const, required: true, min: 0, max: 1 },
      { name: 'until', type: 'number' as const, required: true, min: 0, max: 1 },
    ],
  },
]

export const Home: GlobalConfig = {
  slug: 'home',
  access: { read: () => true },
  admin: { group: 'Pages' },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              fields: [
                { name: 'eyebrow', type: 'text' },
                { name: 'title', type: 'text', required: true },
                { name: 'highlight', type: 'text', admin: { description: 'Word in the title shown in green, e.g. "plus"' } },
                { name: 'text', type: 'textarea' },
                { name: 'primary', type: 'text' },
                { name: 'secondary', type: 'text' },
                {
                  name: 'overlays',
                  type: 'array',
                  admin: { description: 'Lines that appear over the hero film as you scroll (0–1).' },
                  fields: [
                    { name: 'eyebrow', type: 'text' },
                    { name: 'title', type: 'text', required: true },
                    { name: 'text', type: 'textarea' },
                    {
                      name: 'align',
                      type: 'select',
                      defaultValue: 'start',
                      options: ['start', 'end'],
                    },
                    ...windowFields,
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Intro',
          fields: [
            { name: 'statement', type: 'textarea', required: true },
            {
              name: 'facts',
              type: 'array',
              maxRows: 4,
              fields: [
                { name: 'value', type: 'text', required: true },
                { name: 'unit', type: 'text' },
                { name: 'text', type: 'text' },
              ],
            },
            { name: 'chaptersTitle', type: 'text' },
            { name: 'chaptersText', type: 'textarea' },
          ],
        },
        {
          label: 'Industries',
          fields: [
            { name: 'industriesTitle', type: 'text' },
            {
              name: 'industries',
              type: 'array',
              fields: [
                { name: 'slug', type: 'text', required: true, admin: { description: 'Media slot: media/industries/<slug>' } },
                { name: 'name', type: 'text', required: true },
                { name: 'orders', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Ordering',
          fields: [
            { name: 'stepsTitle', type: 'text' },
            {
              name: 'steps',
              type: 'array',
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Quote',
          fields: [
            {
              name: 'quote',
              type: 'group',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'highlight', type: 'text' },
                { name: 'text', type: 'textarea' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
