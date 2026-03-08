import { adminOnlyAccess, selfOrAdminAccess, adminOnlyAccessField } from '@/access'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'lastName', 'email', 'role', 'isActive'],
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 1000 * 60 * 30, // 30 min lock
  },
  access: {
    read: selfOrAdminAccess,
    create: adminOnlyAccess,
    update: selfOrAdminAccess,
    delete: adminOnlyAccess,
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Administer', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Member', value: 'member' },
      ],
      required: true,
      defaultValue: 'member',
      saveToJWT: true,
      access: {
        update: adminOnlyAccessField,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Toggle to activate/deactivate user account',
      },
      access: {
        update: adminOnlyAccessField,
      },
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
        description: 'Last login time',
      },
    },
  ],
  timestamps: true,
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        await req.payload.update({
          collection: 'users',
          id: user.id,
          data: {
            lastLoginAt: new Date().toISOString(),
          },
          req,
        })
      },
    ],
  },
}
