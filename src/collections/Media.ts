import { editorOrAdminAccess, publicAccess } from '@/access'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'nickname',
    defaultColumns: ['nickname', 'mimeType', 'filesize', 'createdAt'],
  },
  access: {
    read: publicAccess,
    create: editorOrAdminAccess,
    update: editorOrAdminAccess,
    delete: editorOrAdminAccess,
  },
  fields: [
    {
      name: 'nickname',
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
      hidden: true,
    },
  ],
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
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
  },
}
