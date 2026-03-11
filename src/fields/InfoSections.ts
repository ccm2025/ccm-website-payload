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
        name: 'localizeImage',
        type: 'checkbox',
        label: 'Localize Image',
        defaultValue: false,
        admin: {
          description: 'Enable this to use different images for different locales',
        },
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        localized: false,
        label: 'Image (Global)',
        admin: {
          condition: (_, siblingData) => !siblingData?.localizeImage,
          description: 'This image will be used for all locales',
        },
      },
      {
        name: 'imageLocalized',
        type: 'upload',
        relationTo: 'media',
        localized: true,
        label: 'Image (Localized)',
        admin: {
          condition: (_, siblingData) => siblingData?.localizeImage,
          description: 'This image can be different for each locale',
        },
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
              new URL(value)
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
