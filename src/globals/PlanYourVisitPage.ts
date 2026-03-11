import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField, InfoSectionsField } from '@/fields'
import { type GlobalConfig } from 'payload'

export const PlanYourVisitPage: GlobalConfig = {
  slug: 'plan-your-visit-page',
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
      type: 'group',
      label: 'Introduction Section',
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        InfoSectionsField(),
      ],
    },
    {
      name: 'location',
      type: 'group',
      label: 'Location Section',
      fields: [
        {
          name: 'mapUrl',
          type: 'text',
          admin: {
            description: 'Google Maps embed URL for the iframe src',
          },
          validate: (value: string | undefined) => {
            if (value && value.trim()) {
              try {
                new URL(value)
                return true
              } catch {
                return 'Please enter a valid URL'
              }
            }
            return true
          },
        },
        {
          name: 'address',
          type: 'richText',
          localized: true,
        },
      ],
    },
    {
      name: 'schedule',
      type: 'group',
      label: 'Schedule Section',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        InfoSectionsField(),
      ],
    },
  ],
}
