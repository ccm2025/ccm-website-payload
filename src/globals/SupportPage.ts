import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'

export const SupportPage: GlobalConfig = {
  slug: 'support-page',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: publicAccess,
    update: contentManagerAccess,
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'hero_title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'hero_image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'group',
      label: 'Page Content',
      fields: [
        {
          name: 'info_sections',
          type: 'array',
          label: 'Info Sections',
          maxRows: 10,
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              admin: { description: 'Small subtitle above heading' },
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: { description: 'Main section heading' },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
  ],
}
