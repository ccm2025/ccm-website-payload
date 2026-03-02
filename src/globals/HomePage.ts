import { editorOrAdminAccess, publicAccess } from '@/access'
import { styledTextField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: publicAccess,
    update: editorOrAdminAccess,
  },
  fields: [
    {
      name: 'hero_title',
      type: 'text',
      required: true,
      localized: true,
    },
    styledTextField({ name: 'hero_subtitle', required: true, localized: true }),
    {
      name: 'hero_button_text',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'hero_background_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },

    styledTextField({ name: 'introduction_part1', required: true, localized: true }),
    {
      name: 'introduction_video_url',
      type: 'text',
      required: true,
    },
    styledTextField({ name: 'introduction_part2', required: true, localized: true }),

    {
      name: 'meet_title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'meet_cards',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
      ],
    },

    styledTextField({ name: 'conclusion', required: true, localized: true }),
  ],
}
