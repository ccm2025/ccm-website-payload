import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'

export const PlanYourVisitPage: GlobalConfig = {
  slug: 'plan-your-visit-page',
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
          type: 'array',
          label: 'Introduction Items',
          maxRows: 10,
          fields: [
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
    {
      name: 'location',
      type: 'group',
      label: 'Location Section',
      fields: [
        {
          name: 'location_map_link',
          type: 'text',
          admin: {
            description: 'Google Maps embed URL for the iframe src',
          },
        },
        {
          name: 'location_description',
          type: 'richText',
          localized: true,
        },
      ],
    },
    {
      name: 'hours',
      type: 'group',
      label: 'Hours Section',
      fields: [
        {
          name: 'hours_title',
          type: 'text',
          localized: true,
        },
        {
          name: 'hours_content',
          type: 'array',
          label: 'Hours Items',
          maxRows: 10,
          fields: [
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
