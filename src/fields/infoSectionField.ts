import type { ArrayField, Field } from 'payload'
import { styledTextField } from './styledTextField'

type InfoSectionOptions = {
  name: string
  required?: boolean
  localized?: boolean
  includeButton?: boolean
  localizedImage?: boolean
}

export const infoSectionField = ({
  name,
  required,
  localized,
  includeButton,
  localizedImage,
}: InfoSectionOptions): ArrayField => ({
  name,
  type: 'array',
  required,
  labels: {
    singular: 'Info Section',
    plural: 'Info Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized,
    },
    {
      name: 'subtitle',
      type: 'text',
      localized,
    },
    styledTextField({ name: 'content', required: true, localized }),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      localized: localizedImage,
    },
    ...(includeButton
      ? ([
          {
            name: 'button_text',
            type: 'text',
            localized,
          },
          {
            name: 'button_url',
            type: 'text',
            localized,
          },
        ] as Field[])
      : []),
  ],
})
