import { editorOrAdminAccess, publicAccess } from '@/access'
import { styledTextField } from '@/fields'
import type { CollectionConfig } from 'payload'
import { ValidationError } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'slug'],
  },
  access: {
    read: publicAccess,
    create: editorOrAdminAccess,
    update: editorOrAdminAccess,
    delete: editorOrAdminAccess,
  },
  versions: { drafts: true },
  labels: {
    singular: 'Event',
    plural: 'Events',
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create') {
          const existing = await req.payload.find({
            collection: 'events',
            where: {
              slug: { equals: data.slug },
            },
            limit: 1,
          })
          if (existing.totalDocs > 0) {
            throw new ValidationError({
              errors: [
                {
                  message: `Event with slug "${data.slug}" already exists`,
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
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    styledTextField({ name: 'content', localized: true }),
    {
      name: 'content_image',
      type: 'upload',
      relationTo: 'media',
      localized: true,
    },
    {
      name: 'content_video_url',
      type: 'text',
    },
  ],
  timestamps: true,
}
