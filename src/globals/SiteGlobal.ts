import { publicAccess, contentManagerAccess } from '@/access'
import { type GlobalConfig } from 'payload'

export const SiteGlobal: GlobalConfig = {
  slug: 'global',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: publicAccess,
    update: contentManagerAccess,
  },
  fields: [
    {
      name: 'navigation',
      type: 'group',
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Site logo',
          },
        },
        {
          name: 'websiteTitleCN',
          label: 'Website Title (Chinese)',
          type: 'text',
        },
        {
          name: 'websiteTitleEN',
          label: 'Website Title (English)',
          type: 'text',
        },
        {
          name: 'menuItems',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'href',
              type: 'text',
              required: true,
              admin: {
                description: 'Internal path (e.g., /about) or external URL',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'contactInfo',
          type: 'group',
          fields: [
            {
              name: 'address',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'phone',
              type: 'text',
              admin: {
                description: 'Contact phone number, e.g., +1 (555) 123-4567',
              },
            },
            {
              name: 'email',
              type: 'email',
              admin: {
                description: 'Contact email address, e.g., info@ccm.org',
              },
            },
          ],
        },
        {
          name: 'socialMedia',
          type: 'array',
          maxRows: 5,
          fields: [
            {
              name: 'platform',
              type: 'select',
              required: true,
              options: [
                { label: 'Facebook', value: 'facebook' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Twitter', value: 'twitter' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'YouTube', value: 'youtube' },
              ],
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'copyrightText',
          type: 'text',
        },
      ],
    },
  ],
}
