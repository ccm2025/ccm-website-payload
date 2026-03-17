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
      type: 'richText',
      localized: true,
    },
  ],
}
