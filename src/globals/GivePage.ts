import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField } from '@/fields'
import { type GlobalConfig } from 'payload'

export const GivePage: GlobalConfig = {
  slug: 'give-page',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: publicAccess,
    update: contentManagerAccess,
  },
  fields: [
    HeroField(),
    {
      name: 'intro',
      type: 'richText',
      label: 'Introduction',
      localized: true,
    },
    {
      name: 'payment_methods',
      type: 'richText',
      label: 'Payment Methods',
      localized: true,
    },
    {
      name: 'letters',
      type: 'group',
      label: 'Prayer Letters',
      fields: [
        {
          name: 'pdfs',
          type: 'array',
          label: 'PDF Documents',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
