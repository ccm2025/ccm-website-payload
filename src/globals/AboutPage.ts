import { publicAccess, contentManagerAccess } from '@/access'
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
      name: 'introduction',
      type: 'group',
      label: 'Introduction Section',
      fields: [
        {
          name: 'introduction_subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'introduction_title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'introduction_content',
          type: 'richText',
          required: true,
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
          name: 'history_subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'history_title',
          type: 'text',
          localized: true,
        },
        {
          name: 'history_section',
          type: 'array',
          label: 'History Items',
          maxRows: 10,
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'content',
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
          name: 'team_subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'team_title',
          type: 'text',
          localized: true,
        },
        {
          name: 'team_section',
          type: 'array',
          label: 'Team Members',
          maxRows: 20,
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
            {
              name: 'bio',
              type: 'richText',
              localized: true,
            },
          ],
        },
      ],
    },
  ],
}
