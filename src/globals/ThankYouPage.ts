import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'

export const ThankYouPage: GlobalConfig = {
  slug: 'thank-you-page',
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
        },
        {
          name: 'hero_subtitle',
          type: 'richText',
          localized: true,
        },
        {
          name: 'hero_image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'group',
      label: 'Page Content',
      fields: [
        {
          name: 'content_title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'content',
          type: 'richText',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'navigation',
      type: 'group',
      label: 'Navigation Options',
      fields: [
        {
          name: 'home_button_text',
          type: 'text',
          localized: true,
          defaultValue: 'Return to Home',
        },
        {
          name: 'contact_button_text',
          type: 'text',
          localized: true,
          defaultValue: 'Contact Us',
        },
      ],
    },
  ],
}
