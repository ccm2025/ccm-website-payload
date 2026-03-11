import { Field } from 'payload'

export const HeroField = (addOn: Field[] = []): Field => {
  return {
    name: 'hero',
    type: 'group',
    label: 'Hero Section',
    fields: [
      {
        name: 'title',
        type: 'text',
        localized: true,
      },
      {
        name: 'backgroundImage',
        type: 'upload',
        relationTo: 'media',
        required: true,
        admin: {
          description: 'Hero background image',
        },
      },
      ...addOn,
    ],
  }
}
