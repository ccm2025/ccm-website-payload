import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField, InfoSectionsField } from '@/fields'
import { type GlobalConfig } from 'payload'

export const GospelMinistryPage: GlobalConfig = {
  slug: 'gospel-ministry-page',
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
      name: 'intro',
      type: 'richText',
      label: 'Introduction Section',
      localized: true,
    },
    InfoSectionsField(),
  ],
}
