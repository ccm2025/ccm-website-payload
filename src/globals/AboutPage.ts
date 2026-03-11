import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField, InfoSectionsField } from '@/fields'
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
      type: 'richText',
      label: 'Introduction Section',
      localized: true,
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
        InfoSectionsField(),
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
              localized: true,
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
            },
          ],
        },
      ],
    },
  ],
}
