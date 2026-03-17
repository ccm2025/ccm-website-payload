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
      admin: {
        description:
          'The 1st letter should be the most recent Chinese letter. The 2nd letter should be the most recent English letter.',
      },
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
