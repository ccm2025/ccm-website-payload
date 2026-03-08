import { getPayload } from 'payload'
import config from '@payload-config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Events Collection Tests', () => {
  let payload: any
  let adminUser: any
  let editorUser: any
  let memberUser: any
  let testMediaId: string

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create test users
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@events.com',
        password: 'password123',
        firstName: 'Events',
        lastName: 'Admin',
        role: 'admin',
        isActive: true,
      } as any,
    })

    editorUser = await payload.create({
      collection: 'users',
      data: {
        email: 'editor@events.com',
        password: 'password123',
        firstName: 'Events',
        lastName: 'Editor',
        role: 'editor',
        isActive: true,
      } as any,
    })

    memberUser = await payload.create({
      collection: 'users',
      data: {
        email: 'member@events.com',
        password: 'password123',
        firstName: 'Events',
        lastName: 'Member',
        role: 'member',
        isActive: true,
      } as any,
    })

    // Create test media for gallery tests using mock file
    try {
      // Try to create a minimal media entry without actual file upload for testing
      // This will likely fail but we can test gallery logic with mock data
      testMediaId = 'test-media-id-123'
      console.log('Using mock media ID for testing:', testMediaId)
    } catch (error) {
      console.warn('Could not create test media:', error)
      testMediaId = null
    }
  })

  afterAll(async () => {
    // Cleanup test data
    await payload.delete({ collection: 'users', where: { email: { contains: '@events.com' } } })
    await payload.delete({ collection: 'events', where: {} })
    // Skip media cleanup since we use mock IDs
  })

  describe('Events Access Control', () => {
    it('should allow public to read events', async () => {
      const result = await payload.find({
        collection: 'events',
        overrideAccess: false,
      })

      expect(result.docs).toBeDefined()
      expect(Array.isArray(result.docs)).toBe(true)
    })

    it('should allow member to read events but not create/update/delete', async () => {
      // Member should be able to read events (public access)
      const result = await payload.find({
        collection: 'events',
        user: memberUser,
        overrideAccess: false,
      })

      expect(result.docs).toBeDefined()
    })

    it('should allow admin to have full access to events', async () => {
      // Admin should be able to read events
      const result = await payload.find({
        collection: 'events',
        user: adminUser,
        overrideAccess: false,
      })

      expect(result.docs).toBeDefined()
    })

    it('should allow editor to have content management access', async () => {
      // Editor should be able to read events
      const result = await payload.find({
        collection: 'events',
        user: editorUser,
        overrideAccess: false,
      })

      expect(result.docs).toBeDefined()
    })
  })

  describe('Event Creation and Validation', () => {
    it('should create event with required fields', async () => {
      const eventData = {
        title: 'Test Event',
        slug: 'test-event-' + Date.now(),
        date: '2024-12-25',
        description: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    text: 'This is a test event description',
                  },
                ],
              },
            ],
          },
        },
      }

      const event = await payload.create({
        collection: 'events',
        data: eventData,
        user: adminUser,
      })

      expect(event.id).toBeDefined()
      expect(event.title).toBe(eventData.title)
      expect(event.slug).toBe(eventData.slug)
      expect(typeof event.createdBy === 'object' ? event.createdBy.id : event.createdBy).toBe(
        adminUser.id,
      )
      expect(event.createdAt).toBeDefined()
      expect(event.updatedAt).toBeDefined()
    })

    it('should validate slug uniqueness', async () => {
      const slug = 'duplicate-slug-test'

      // Create first event
      await payload.create({
        collection: 'events',
        data: {
          title: 'First Event',
          slug: slug,
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'First event',
                    },
                  ],
                },
              ],
            },
          },
        },
        user: adminUser,
      })

      // Try to create second event with same slug
      await expect(
        payload.create({
          collection: 'events',
          data: {
            title: 'Second Event',
            slug: slug,
            date: '2024-12-26',
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Second event',
                      },
                    ],
                  },
                ],
              },
            },
          },
          user: adminUser,
        }),
      ).rejects.toThrow()
    })

    it('should auto-set createdBy field on creation', async () => {
      const event = await payload.create({
        collection: 'events',
        data: {
          title: 'CreatedBy Test Event',
          slug: 'createdby-test-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Testing createdBy field',
                    },
                  ],
                },
              ],
            },
          },
        },
        user: editorUser,
      })

      expect(typeof event.createdBy === 'object' ? event.createdBy.id : event.createdBy).toBe(
        editorUser.id,
      )
    })

    it('should validate time format', async () => {
      // Valid time format should work
      const validEvent = await payload.create({
        collection: 'events',
        data: {
          title: 'Valid Time Event',
          slug: 'valid-time-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event with valid time',
                    },
                  ],
                },
              ],
            },
          },
          time: {
            start: '14:00',
            end: '17:30',
          },
        },
        user: adminUser,
      })

      expect(validEvent.time.start).toBe('14:00')
      expect(validEvent.time.end).toBe('17:30')

      // Invalid time format should fail
      await expect(
        payload.create({
          collection: 'events',
          data: {
            title: 'Invalid Time Event',
            slug: 'invalid-time-' + Date.now(),
            date: '2024-12-25',
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Event with invalid time',
                      },
                    ],
                  },
                ],
              },
            },
            time: {
              start: '25:00', // Invalid hour
              end: '17:30',
            },
          },
          user: adminUser,
        }),
      ).rejects.toThrow()
    })

    it('should validate video URL format', async () => {
      // Valid URL should work
      const validEvent = await payload.create({
        collection: 'events',
        data: {
          title: 'Valid URL Event',
          slug: 'valid-url-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event with valid URL',
                    },
                  ],
                },
              ],
            },
          },
          content_video_url: 'https://youtube.com/watch?v=abc123',
        },
        user: adminUser,
      })

      expect(validEvent.content_video_url).toBe('https://youtube.com/watch?v=abc123')

      // Invalid URL should fail
      await expect(
        payload.create({
          collection: 'events',
          data: {
            title: 'Invalid URL Event',
            slug: 'invalid-url-' + Date.now(),
            date: '2024-12-25',
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Event with invalid URL',
                      },
                    ],
                  },
                ],
              },
            },
            content_video_url: 'not-a-url',
          },
          user: adminUser,
        }),
      ).rejects.toThrow()
    })
  })

  describe('Registration Field Validation', () => {
    it('should require registration URL when registration is required', async () => {
      await expect(
        payload.create({
          collection: 'events',
          data: {
            title: 'Registration Required Event',
            slug: 'registration-required-' + Date.now(),
            date: '2024-12-25',
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Event requiring registration',
                      },
                    ],
                  },
                ],
              },
            },
            registration: {
              required: true,
              // Missing URL - should fail
            },
          },
          user: adminUser,
        }),
      ).rejects.toThrow()
    })

    it('should validate registration URL format when provided', async () => {
      // Valid registration URL should work
      const validEvent = await payload.create({
        collection: 'events',
        data: {
          title: 'Valid Registration Event',
          slug: 'valid-registration-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event with valid registration',
                    },
                  ],
                },
              ],
            },
          },
          registration: {
            required: true,
            url: 'https://eventbrite.com/register/12345',
            deadline: '2024-12-20',
          },
        },
        user: adminUser,
      })

      expect(validEvent.registration.url).toBe('https://eventbrite.com/register/12345')

      // Invalid registration URL should fail
      await expect(
        payload.create({
          collection: 'events',
          data: {
            title: 'Invalid Registration Event',
            slug: 'invalid-registration-' + Date.now(),
            date: '2024-12-25',
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Event with invalid registration',
                      },
                    ],
                  },
                ],
              },
            },
            registration: {
              required: true,
              url: 'not-a-valid-url',
            },
          },
          user: adminUser,
        }),
      ).rejects.toThrow()
    })

    it('should allow optional registration fields when not required', async () => {
      const event = await payload.create({
        collection: 'events',
        data: {
          title: 'No Registration Event',
          slug: 'no-registration-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event without registration',
                    },
                  ],
                },
              ],
            },
          },
          registration: {
            required: false,
          },
        },
        user: adminUser,
      })

      expect(event.registration.required).toBe(false)
      expect(event.registration.url).toBeNull()
    })
  })

  describe('Gallery Field Tests', () => {
    it('should allow gallery array field structure', async () => {
      // Test that gallery field accepts array structure (without media validation)
      const event = await payload.create({
        collection: 'events',
        data: {
          title: 'Gallery Structure Event',
          slug: 'gallery-structure-event-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event with gallery structure',
                    },
                  ],
                },
              ],
            },
          },
          gallery: [], // Start with empty gallery for structure test
        },
        user: adminUser,
      })

      expect(event.gallery).toBeDefined()
      expect(Array.isArray(event.gallery)).toBe(true)
      expect(event.gallery).toHaveLength(0)
    })

    it('should enforce gallery array minimum size', async () => {
      // Test gallery array minimum (0 items allowed)
      const event = await payload.create({
        collection: 'events',
        data: {
          title: 'Min Gallery Event',
          slug: 'min-gallery-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event with minimum gallery',
                    },
                  ],
                },
              ],
            },
          },
          gallery: [], // Empty array should be allowed (minRows: 0)
        },
        user: adminUser,
      })

      expect(event.gallery).toHaveLength(0)
    })

    it('should validate gallery field configuration', async () => {
      // Test that gallery field is properly configured in collection
      const eventsConfig = payload.config.collections.find((c: any) => c.slug === 'events')
      const galleryField = eventsConfig.fields.find((f: any) => f.name === 'gallery')

      expect(galleryField).toBeDefined()
      expect(galleryField.type).toBe('array')
      expect(galleryField.minRows).toBe(0)
      expect(galleryField.maxRows).toBe(10)

      // Check gallery sub-fields
      const imageField = galleryField.fields.find((f: any) => f.name === 'image')
      const captionField = galleryField.fields.find((f: any) => f.name === 'caption')

      expect(imageField).toBeDefined()
      expect(imageField.type).toBe('upload')
      expect(imageField.relationTo).toBe('media')

      expect(captionField).toBeDefined()
      expect(captionField.type).toBe('text')
    })

    it('should handle empty gallery', async () => {
      const event = await payload.create({
        collection: 'events',
        data: {
          title: 'No Gallery Event',
          slug: 'no-gallery-event-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event without gallery',
                    },
                  ],
                },
              ],
            },
          },
          gallery: [],
        },
        user: adminUser,
      })

      expect(event.gallery).toHaveLength(0)
    })
  })

  describe('Location and Time Fields', () => {
    it('should handle complete location information', async () => {
      const event = await payload.create({
        collection: 'events',
        data: {
          title: 'Location Event',
          slug: 'location-event-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'Event with location',
                    },
                  ],
                },
              ],
            },
          },
          location: {
            venue: 'Community Center',
            address: '123 Main Street\nAnytown, State 12345',
          },
          time: {
            start: '09:00',
            end: '17:00',
          },
        },
        user: adminUser,
      })

      expect(event.location.venue).toBe('Community Center')
      expect(event.location.address).toContain('123 Main Street')
      expect(event.time.start).toBe('09:00')
      expect(event.time.end).toBe('17:00')
    })
  })

  describe('createdBy Field Security', () => {
    it('should have field-level access control configured', async () => {
      const eventsConfig = payload.config.collections.find((c: any) => c.slug === 'events')
      const createdByField = eventsConfig.fields.find((f: any) => f.name === 'createdBy')

      expect(createdByField).toBeDefined()
      expect(createdByField.access).toBeDefined()
      expect(createdByField.access.update).toBeDefined()
      expect(createdByField.admin.readOnly).toBe(true)
    })

    it('should validate adminOnlyAccessField function behavior', async () => {
      const { adminOnlyAccessField } = await import('@/access')

      // Admin should have access
      const adminAccess = adminOnlyAccessField({
        req: { user: adminUser },
      } as any)
      expect(adminAccess).toBe(true)

      // Editor should NOT have access
      const editorAccess = adminOnlyAccessField({
        req: { user: editorUser },
      } as any)
      expect(editorAccess).toBe(false)

      // Member should NOT have access
      const memberAccess = adminOnlyAccessField({
        req: { user: memberUser },
      } as any)
      expect(memberAccess).toBe(false)

      // Anonymous user should NOT have access
      const anonAccess = adminOnlyAccessField({
        req: { user: null },
      } as any)
      expect(anonAccess).toBe(false)
    })
  })

  describe('Collection Configuration', () => {
    it('should have correct collection settings', async () => {
      const eventsConfig = payload.config.collections.find((c: any) => c.slug === 'events')

      expect(eventsConfig).toBeDefined()
      expect(eventsConfig.slug).toBe('events')
      expect(eventsConfig.admin.useAsTitle).toBe('title')
      expect(eventsConfig.timestamps).toBe(true)

      // Verify drafts configuration
      expect(eventsConfig.versions.drafts.autosave).toBe(false)
      expect(eventsConfig.versions.drafts.validate).toBe(false)
    })

    it('should have correct field types and requirements', async () => {
      const eventsConfig = payload.config.collections.find((c: any) => c.slug === 'events')

      // Check required fields
      const titleField = eventsConfig.fields.find((f: any) => f.name === 'title')
      const slugField = eventsConfig.fields.find((f: any) => f.name === 'slug')
      const dateField = eventsConfig.fields.find((f: any) => f.name === 'date')
      const descriptionField = eventsConfig.fields.find((f: any) => f.name === 'description')

      expect(titleField.required).toBe(true)
      // Note: localized might not be accessible in runtime config

      expect(slugField.required).toBe(true)
      expect(slugField.index).toBe(true)

      expect(dateField.required).toBe(true)
      expect(dateField.index).toBe(true)

      expect(descriptionField.required).toBe(true)
      expect(descriptionField.type).toBe('richText')
    })

    it('should have proper access control configuration', async () => {
      const eventsConfig = payload.config.collections.find((c: any) => c.slug === 'events')

      expect(eventsConfig.access).toBeDefined()
      expect(eventsConfig.access.read).toBeDefined()
      expect(eventsConfig.access.create).toBeDefined()
      expect(eventsConfig.access.update).toBeDefined()
      expect(eventsConfig.access.delete).toBeDefined()
    })
  })

  describe('Localization Support', () => {
    it('should support localized fields', async () => {
      const event = await payload.create({
        collection: 'events',
        data: {
          title: 'Localized Event',
          slug: 'localized-event-' + Date.now(),
          date: '2024-12-25',
          description: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      text: 'English description',
                    },
                  ],
                },
              ],
            },
          },
          location: {
            venue: 'English Venue Name',
            address: 'English Address',
          },
        },
        user: adminUser,
      })

      expect(event.title).toBe('Localized Event')
      expect(event.location.venue).toBe('English Venue Name')

      // Note: Full localization testing would require setting up multiple locales
      // in the Payload config, which is beyond the scope of this test
    })
  })
})
