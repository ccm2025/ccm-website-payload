import { editorOrAdminAccess, publicAccess } from '@/access'
import { styledTextField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const VolunteerPage: GlobalConfig = {
  slug: 'volunteer-page',
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
      name: 'application_button_text',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'application_button_url',
      type: 'text',
      required: true,
    },
    {
      name: 'volunteer_title',
      type: 'text',
      required: true,
      localized: true,
    },
    styledTextField({ name: 'volunteer_content', required: true, localized: true }),
  ],
}
