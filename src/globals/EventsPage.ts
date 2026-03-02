import { editorOrAdminAccess, publicAccess } from '@/access'
import type { GlobalConfig } from 'payload'

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  access: {
    read: publicAccess,
    update: editorOrAdminAccess,
  },
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
    {
      name: 'upcoming_events_subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'upcoming_events_title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'upcoming_events_empty_text',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'past_events_subtitle',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'past_events_title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'past_events_empty_text',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'default_event_image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
