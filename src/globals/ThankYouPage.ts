import { editorOrAdminAccess, publicAccess } from '@/access'
import { styledTextField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const ThankYouPage: GlobalConfig = {
  slug: 'thank-you-page',
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
      name: 'content_title',
      type: 'text',
      required: true,
      localized: true,
    },
    styledTextField({ name: 'content', required: true, localized: true }),
  ],
}
