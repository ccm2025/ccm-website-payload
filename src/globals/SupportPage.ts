import { editorOrAdminAccess, publicAccess } from '@/access'
import { infoSectionField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const SupportPage: GlobalConfig = {
  slug: 'support-page',
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
    infoSectionField({ name: 'info_sections', required: true, localized: true }),
  ],
}
