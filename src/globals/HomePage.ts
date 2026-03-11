import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'
import { HeroField } from '@/fields'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: publicAccess,
    update: contentManagerAccess,
  },
  fields: [
    HeroField([
      {
        name: 'subtitle',
        type: 'richText',
        localized: true,
      },
      {
        name: 'buttonText',
        type: 'text',
        localized: true,
        admin: {
          description: 'Hero call-to-action button text',
        },
      },
      {
        name: 'buttonUrl',
        type: 'text',
        admin: {
          description: 'Hero call-to-action button URL',
        },
      },
    ]),
    {
      name: 'intro',
      type: 'group',
      label: 'Introduction Section',
      fields: [
        {
          name: 'part1',
          type: 'richText',
          localized: true,
          admin: {
            description: 'First introduction section',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description: 'YouTube embed URL for introduction video',
            placeholder: 'https://www.youtube.com/embed/...',
          },
          validate: (value: string | undefined) => {
            if (value && value.trim()) {
              try {
                new URL(value)
                return true
              } catch {
                return 'Please enter a valid URL'
              }
            }
            return true
          },
        },
        {
          name: 'part2',
          type: 'richText',
          localized: true,
          admin: {
            description: 'Second introduction section (after video)',
          },
        },
        {
          name: 'conclusion',
          type: 'richText',
          localized: true,
          admin: {
            description: 'Conclusion section',
          },
        },
      ],
    },
    {
      name: 'meet',
      type: 'group',
      label: 'Meet With Us Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'cards',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              admin: {
                description: 'URL slug (e.g., "about", "events")',
              },
            },
            {
              name: 'image',
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
