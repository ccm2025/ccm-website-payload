import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField } from '@/fields'
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
    HeroField(),
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
