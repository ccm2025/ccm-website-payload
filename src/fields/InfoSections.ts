import { Field } from 'payload'

export const InfoSectionsField = (addOn: Field[] = []): Field => {
  return {
    name: 'infoSections',
    type: 'array',
    label: 'Information Sections',
    fields: [
      {
        name: 'content',
        type: 'richText',
        localized: true,
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        localized: true,
      },
      {
        name: 'hasButton',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'buttonText',
        type: 'text',
        localized: true,
        admin: {
          condition: (_, siblingData) => siblingData?.hasButton,
        },
      },
      {
        name: 'buttonUrl',
        type: 'text',
        admin: {
          condition: (_, siblingData) => siblingData?.hasButton,
        },
        validate: (value: string | undefined) => {
          if (value && value.trim()) {
            try {
              new URL(value, process.env.SITE_URL) // Use SITE_URL as base for relative URLs
              return true
            } catch {
              return 'Please enter a valid URL'
            }
          }
          return true
        },
      },
      ...addOn,
    ],
  }
}
