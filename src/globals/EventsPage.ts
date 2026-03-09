import { publicAccess, contentManagerAccess } from '@/access'
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
    {
      name: 'hero',
      type: 'group',
      label: 'Hero Section',
      fields: [
        {
          name: 'hero_title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'hero_image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'upcomingEvents',
      type: 'group',
      label: 'Upcoming Events Section',
      fields: [
        {
          name: 'upcoming_events_subtitle',
          type: 'text',
          localized: true,
          defaultValue: "What's Coming",
        },
        {
          name: 'upcoming_events_title',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Upcoming Events',
        },
        {
          name: 'no_events_message',
          type: 'text',
          localized: true,
          defaultValue: 'No upcoming events at this time. Please check back soon!',
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
          name: 'past_events_subtitle',
          type: 'text',
          localized: true,
          defaultValue: 'Look Back',
        },
        {
          name: 'past_events_title',
          type: 'text',
          required: true,
          localized: true,
          defaultValue: 'Past Events',
        },
        {
          name: 'view_all_text',
          type: 'text',
          localized: true,
          defaultValue: 'View All Past Events',
        },
        {
          name: 'past_events_empty_text',
          type: 'text',
          localized: true,
          defaultValue: 'No past events to show.',
          admin: {
            description: 'Message to show when no past events',
          },
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Meta description for events page',
          },
        },
      ],
    },
  ],
}
