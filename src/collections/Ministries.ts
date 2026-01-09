import { editorOrAdminAccess, publicAccess } from '@/access'
import { styledTextField } from '@/fields'
import type { CollectionConfig } from 'payload'

export const Ministries: CollectionConfig = {
  slug: 'ministries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug'],
  },
  access: {
    read: publicAccess,
    create: editorOrAdminAccess,
    update: editorOrAdminAccess,
    delete: editorOrAdminAccess,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (operation === 'create' || operation === 'update') {
          const existing = await req.payload.find({
            collection: 'ministries',
            where: {
              slug: { equals: data.slug },
              ...(operation === 'update' && { id: { not_equals: data.id as string } }),
            },
            limit: 1,
          })
          if (existing.totalDocs > 0) {
            throw new Error(`Ministry with slug "${data.slug}" already exists`)
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
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'hero_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    styledTextField({ name: 'content', required: true }),
    {
      name: 'content_image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  timestamps: true,
}
