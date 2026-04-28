import { publicAccess, contentManagerAccess, adminOnlyAccessField } from '@/access'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'uploadedBy', 'createdAt'],
  },
  access: {
    read: publicAccess,
    create: contentManagerAccess,
    update: contentManagerAccess,
    delete: contentManagerAccess,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
      },
      access: {
        update: adminOnlyAccessField,
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeValidate: [
      ({ req, data, originalDoc }) => {
        return {
          ...data,
          uploadedBy: originalDoc?.uploadedBy ?? data.uploadedBy ?? req.user?.id,
        }
      },
    ],
  },
  upload: {
    // These are not supported on Workers yet due to lack of sharp
    crop: false,
    focalPoint: false,
    pasteURL: false,
    mimeTypes: ['image/jpeg', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4'],
  },
}
