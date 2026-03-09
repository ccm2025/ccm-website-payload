import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'

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
          admin: {
            description: 'Main hero title',
          },
        },
        {
          name: 'hero_subtitle',
          type: 'richText',
          localized: true,
          admin: {
            description: 'Hero subtitle content',
          },
        },
        {
          name: 'hero_background_image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            description: 'Hero background image',
          },
        },
        {
          name: 'hero_button_text',
          type: 'text',
          localized: true,
          defaultValue: 'Plan Your Visit',
          admin: {
            description: 'Hero call-to-action button text',
          },
        },
      ],
    },
    {
      name: 'content',
      type: 'group',
      label: 'Page Content',
      fields: [
        {
          name: 'introduction_part1',
          type: 'richText',
          required: true,
          localized: true,
          admin: {
            description: 'First introduction section',
          },
        },
        {
          name: 'introduction_video_url',
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
          name: 'introduction_part2',
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
          name: 'meet_title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Title for the meet with us section',
          },
        },
        {
          name: 'meet_cards',
          type: 'array',
          label: 'Meet Cards',
          maxRows: 6,
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
