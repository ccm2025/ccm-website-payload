import { publicAccess, contentManagerAccess } from '@/access'
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
          name: 'hero_image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'introduction',
      type: 'group',
      label: 'Introduction Section',
      fields: [
        {
          name: 'introduction_subtitle',
          type: 'text',
          localized: true,
        },
        {
          name: 'introduction_title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'introduction_content',
          type: 'richText',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'application',
      type: 'group',
      label: 'Application Section',
      fields: [
        {
          name: 'application_button_text',
          type: 'text',
          localized: true,
          defaultValue: 'Apply Now',
        },
        {
          name: 'application_button_url',
          type: 'text',
          admin: {
            description: 'URL to volunteer application form',
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
      ],
    },
    {
      name: 'volunteer',
      type: 'group',
      label: 'Volunteer Information',
      fields: [
        {
          name: 'volunteer_title',
          type: 'text',
          localized: true,
        },
        {
          name: 'volunteer_content',
          type: 'richText',
          localized: true,
        },
      ],
    },
  ],
}
