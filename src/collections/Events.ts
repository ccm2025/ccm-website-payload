import { contentManagerAccess, publicAccess, adminOnlyAccessField } from '@/access'
import { type CollectionConfig, ValidationError } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'slug', 'createdAt'],
  },
  access: {
    read: publicAccess,
    create: contentManagerAccess,
    update: contentManagerAccess,
    delete: contentManagerAccess,
  },
  versions: {
    drafts: {
      autosave: false,
      validate: false,
    },
  },
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

        // Auto-set createdBy field
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
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
      admin: {
        description: 'Event title',
      },
    },
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
      name: 'date',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Event date',
      },
    },
    {
      name: 'time',
      type: 'group',
      fields: [
        {
          name: 'start',
          type: 'text',
          validate: (value: string | undefined) => {
            if (value && value.trim()) {
              const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
              return timeRegex.test(value) || 'Please enter time in HH:MM format (24-hour)'
            }
            return true
          },
          admin: {
            placeholder: 'eg. 14:00',
            description: 'Start time (24-hour format)',
          },
        },
        {
          name: 'end',
          type: 'text',
          validate: (value: string | undefined) => {
            if (value && value.trim()) {
              const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/
              return timeRegex.test(value) || 'Please enter time in HH:MM format (24-hour)'
            }
            return true
          },
          admin: {
            placeholder: 'eg. 17:00',
            description: 'End time (24-hour format)',
          },
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'venue',
          type: 'text',
          localized: true,
          admin: {
            description: 'Venue name',
          },
        },
        {
          name: 'address',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Detailed address',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
      admin: {
        description: 'Event description',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      minRows: 0,
      maxRows: 10,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
      admin: {
        description: 'Event image gallery',
      },
    },
    {
      name: 'content_video_url',
      type: 'text',
      validate: (value: string | undefined) => {
        if (value && value.trim()) {
          // Basic URL validation
          try {
            new URL(value)
            return true
          } catch {
            return 'Please enter a valid URL'
          }
        }
        return true
      },
      admin: {
        description: 'Event video link (YouTube, Vimeo, etc.)',
      },
    },
    {
      name: 'registration',
      type: 'group',
      fields: [
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether registration is required',
          },
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          validate: (value: string | undefined, { siblingData }: any) => {
            if (siblingData?.required) {
              if (!value || !value.trim()) {
                return 'Registration URL is required when registration is enabled'
              }
              try {
                new URL(value)
                return true
              } catch {
                return 'Please enter a valid registration URL'
              }
            }
            return true
          },
          admin: {
            condition: (data, siblingData) => siblingData?.required,
            description: 'Registration link',
          },
        },
        {
          name: 'deadline',
          type: 'date',
          required: true,
          admin: {
            condition: (data, siblingData) => siblingData?.required,
            description: 'Registration deadline',
          },
        },
      ],
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        description: 'Event creator',
      },
      access: {
        update: adminOnlyAccessField,
      },
    },
  ],
  timestamps: true,
}
