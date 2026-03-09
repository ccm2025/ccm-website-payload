import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'

export const GivePage: GlobalConfig = {
  slug: 'give-page',
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
      name: 'content',
      type: 'group',
      label: 'Page Content',
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
        {
          name: 'donation_button_text',
          type: 'text',
          localized: true,
          defaultValue: 'Donate Now',
        },
        {
          name: 'donation_button_url',
          type: 'text',
          admin: {
            description: 'URL to donation form or payment processor',
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
      name: 'payment_methods',
      type: 'group',
      label: 'Payment Methods',
      fields: [
        {
          name: 'zelle_title',
          type: 'text',
          localized: true,
          defaultValue: 'Zelle',
        },
        {
          name: 'zelle_content',
          type: 'richText',
          localized: true,
        },
        {
          name: 'check_title',
          type: 'text',
          localized: true,
          defaultValue: 'Check',
        },
        {
          name: 'check_content',
          type: 'richText',
          localized: true,
        },
      ],
    },
    {
      name: 'resources',
      type: 'group',
      label: 'Resources',
      fields: [
        {
          name: 'pdf_links',
          type: 'array',
          label: 'PDF Documents',
          maxRows: 5,
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'file',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
