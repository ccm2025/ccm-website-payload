import { publicAccess, contentManagerAccess } from '@/access'
import { HeroField } from '@/fields'
import { type GlobalConfig } from 'payload'

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  admin: {
    group: 'Site Content',
  },
  access: {
    read: publicAccess,
    update: contentManagerAccess,
  },
  fields: [
    HeroField(),
    {
      name: 'upcomingEvents',
      type: 'group',
      label: 'Upcoming Events Section',
      fields: [
        {
          name: 'title',
          type: 'richText',
          localized: true,
        },
        {
          name: 'empty_message',
          type: 'text',
          localized: true,
          admin: {
            description: 'Message to show when no upcoming events',
          },
        },
      ],
    },
    {
      name: 'pastEvents',
      type: 'group',
      label: 'Past Events Section',
      fields: [
        {
          name: 'title',
          type: 'richText',
          localized: true,
        },
        {
          name: 'empty_message',
          type: 'text',
          localized: true,
          admin: {
            description: 'Message to show when no past events',
          },
        },
      ],
    },
  ],
}
