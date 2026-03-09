import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'

export const FreshmanPage: GlobalConfig = {
  slug: 'freshman-page',
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
          name: 'hero_subtitle',
          type: 'richText',
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
        {
          name: 'resources_title',
          type: 'text',
          localized: true,
        },
        {
          name: 'resources_content',
          type: 'richText',
          localized: true,
        },
        {
          name: 'info_sections',
          type: 'array',
          label: 'Information Sections',
          maxRows: 10,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
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
            {
              name: 'button_text',
              type: 'text',
              localized: true,
            },
            {
              name: 'button_url',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
