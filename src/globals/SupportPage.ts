import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField, InfoSectionsField } from '@/fields'
import { type GlobalConfig } from 'payload'

export const SupportPage: GlobalConfig = {
  slug: 'support-page',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: publicAccess,
    update: contentManagerAccess,
  },
  fields: [HeroField(), InfoSectionsField()],
}
