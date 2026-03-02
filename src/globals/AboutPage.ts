import { editorOrAdminAccess, publicAccess } from '@/access'
import { styledTextField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
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
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'introduction_subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'introduction_title',
      type: 'text',
      required: true,
      localized: true,
    },
    styledTextField({
      name: 'introduction_content',
      required: true,
      localized: true,
    }),

    {
      name: 'history_subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'history_title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'history_section',
      type: 'array',
      required: true,
      fields: [
        styledTextField({ name: 'content', required: true, localized: true }),
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    {
      name: 'team_subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'team_title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'team_section',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
