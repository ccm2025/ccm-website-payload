import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField } from '@/fields'
import { type GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
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
      type: 'group',
      label: 'Introduction Section',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'content',
          type: 'richText',
          localized: true,
        },
      ],
    },
    {
      name: 'history',
      type: 'group',
      label: 'History Section',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'History Items',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'team',
      type: 'group',
      label: 'Team Section',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'members',
          type: 'array',
          label: 'Team Members',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'position',
              type: 'text',
              localized: true,
            },
            {
              name: 'photo',
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
