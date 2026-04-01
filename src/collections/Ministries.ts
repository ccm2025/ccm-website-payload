import { contentManagerAccess, publicAccess, adminOnlyAccessField } from '@/access'
import { HeroField, InfoSectionsField } from '@/fields'
import { type CollectionConfig, ValidationError } from 'payload'

export const Ministries: CollectionConfig = {
  slug: 'ministries',
  admin: {
    useAsTitle: 'slug',
    defaultColumns: ['slug', 'createdAt'],
  },
  access: {
    read: publicAccess,
    create: contentManagerAccess,
    update: contentManagerAccess,
    delete: contentManagerAccess,
  },
  labels: {
    singular: 'Ministry',
    plural: 'Ministries',
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const existing = await req.payload.find({
            collection: 'ministries',
            where: {
              slug: { equals: data.slug },
            },
            limit: 1,
            req,
          })
          if (existing.totalDocs > 0) {
            throw new ValidationError({
              errors: [
                {
                  message: `Ministry with slug "${data.slug}" already exists`,
                  path: 'slug',
                },
              ],
            })
          }
        }

        return data
      },
    ],
  },
  fields: [
    HeroField(),
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'URL-friendly identifier, must be unique',
      },
    },
    {
      name: 'intro',
      type: 'richText',
      localized: true,
      label: 'Introduction',
    },
    InfoSectionsField(),
  ],
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['slug'],
    },
  ],
}
