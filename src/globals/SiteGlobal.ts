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
      label: 'Navigation',
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
          name: 'menuItems',
          type: 'array',
          label: 'Menu Items',
          minRows: 1,
          maxRows: 10,
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
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      label: 'Footer',
      fields: [
        {
          name: 'description',
          type: 'richText',
          localized: true,
          admin: {
            description: 'Footer description text',
          },
        },
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
            },
            {
              name: 'email',
              type: 'email',
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
          localized: true,
          defaultValue: '© 2024 CCM Website. All rights reserved.',
        },
      ],
    },
  ],
}
