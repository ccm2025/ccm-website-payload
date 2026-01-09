import { editorOrAdminAccess, publicAccess } from '@/access'
import { styledTextField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const GivePage: GlobalConfig = {
  slug: 'give-page',
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
      name: 'zelle_title',
      type: 'text',
      required: true,
      localized: true,
    },
    styledTextField({ name: 'zelle_content', required: true, localized: true }),

    {
      name: 'check_title',
      type: 'text',
      required: true,
      localized: true,
    },
    styledTextField({ name: 'check_content', required: true, localized: true }),

    {
      name: 'pdf_links',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'pdf',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
