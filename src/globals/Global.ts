import { editorOrAdminAccess, publicAccess } from '@/access'
import type { GlobalConfig } from 'payload'

export const Global: GlobalConfig = {
  slug: 'global',
  access: {
    read: publicAccess,
    update: editorOrAdminAccess,
  },
  fields: [
    {
      name: 'website_icon',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'website_title_cn',
      type: 'text',
      required: true,
    },
    {
      name: 'website_title_en',
      type: 'text',
      required: true,
    },
    {
      name: 'contact_title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'email',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'instagram_url',
      type: 'text',
    },
    {
      name: 'youtube_url',
      type: 'text',
    },
    {
      name: 'nav_title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'involve_title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'nav',
      type: 'array',
      labels: {
        singular: 'Nav Item',
        plural: 'Nav Items',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
