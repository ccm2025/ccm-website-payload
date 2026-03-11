import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField, InfoSectionsField } from '@/fields'
import { type GlobalConfig } from 'payload'

export const VolunteerPage: GlobalConfig = {
  slug: 'volunteer-page',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: publicAccess,
    update: contentManagerAccess,
  },
  fields: [HeroField(), InfoSectionsField()],
}
