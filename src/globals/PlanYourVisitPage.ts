import { editorOrAdminAccess, publicAccess } from '@/access'
import { infoSectionField, styledTextField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const PlanYourVisitPage: GlobalConfig = {
  slug: 'plan-your-visit-page',
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
    infoSectionField({ name: 'introduction_content', required: true, localized: true }),

    {
      name: 'location_map_link',
      type: 'text',
      required: true,
    },
    styledTextField({ name: 'location_description', required: true, localized: true }),

    {
      name: 'hours_title',
      type: 'text',
      required: true,
      localized: true,
    },
    infoSectionField({ name: 'hours_content', required: true, localized: true }),
  ],
}
