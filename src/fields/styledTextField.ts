import type { ArrayField } from 'payload'

type StyledTextOptions = {
  name: string
  required?: boolean
  localized?: boolean
}

export const styledTextField = ({ name, required, localized }: StyledTextOptions): ArrayField => ({
  type: 'array',
  name,
  required,
  localized,
  labels: {
    singular: 'Line',
    plural: 'Lines',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
    },
    {
      name: 'font_size',
      dbName: 'fs',
      type: 'select',
      defaultValue: 'Normal',
      options: [
        { label: 'Small', value: 'Small' },
        { label: 'Normal', value: 'Normal' },
        { label: 'Large', value: 'Large' },
        { label: 'Extra Large', value: 'Extra-Large' },
      ],
    },
    {
      name: 'color',
      dbName: 'clr',
      type: 'select',
      defaultValue: 'Default',
      options: [
        { label: 'Default', value: 'Default' },
        { label: 'Theme Color 1', value: 'Website-Theme-Color1' },
        { label: 'Theme Color 2', value: 'Website-Theme-Color2' },
      ],
    },
    {
      name: 'font_style',
      dbName: 'fst',
      type: 'select',
      defaultValue: 'Normal',
      options: [
        { label: 'Normal', value: 'Normal' },
        { label: 'Italic', value: 'Italic' },
        { label: 'Bold', value: 'Bold' },
        { label: 'Underline', value: 'Underline' },
      ],
    },
  ],
})
