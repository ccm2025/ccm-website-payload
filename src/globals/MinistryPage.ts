import { editorOrAdminAccess, publicAccess } from '@/access'
import { infoSectionField } from '@/fields'
import type { GlobalConfig } from 'payload'

export const MinistryPage: GlobalConfig = {
  slug: 'ministry-page',
  access: {
    read: publicAccess,
    update: editorOrAdminAccess,
  },
  fields: [
    {
      name: 'hero_title',
      type: 'text',
      required: true,
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    infoSectionField({
      name: 'info_sections',
      label: 'Info Sections',
      required: true,
      includeButton: true,
      includeSubtitle: false,
    }),
  ],
}
