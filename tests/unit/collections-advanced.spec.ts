import { describe, it, expect, vi } from 'vitest'
import { Events } from '@/collections/Events'
import { Media } from '@/collections/Media'
import { ValidationError } from 'payload'

// Mock the access functions
vi.mock('@/access', () => ({
  editorOrAdminAccess: vi.fn(),
  publicAccess: vi.fn(),
}))

// Mock the styled text field
vi.mock('@/fields', () => ({
  styledTextField: vi.fn(() => ({
    name: 'content',
    type: 'text',
    localized: true,
  })),
}))

describe('Collection Configurations - Advanced', () => {
  describe('Events Collection', () => {
    it('should have correct collection configuration', () => {
      expect(Events.slug).toBe('events')
      expect(Events.admin?.useAsTitle).toBe('title')
      expect(Events.admin?.defaultColumns).toEqual(['title', 'date', 'slug'])
      expect(Events.versions).toBeDefined()
      expect((Events.versions as any)?.drafts).toBe(true)
      expect(Events.timestamps).toBe(true)
    })

    it('should have correct labels', () => {
      expect(Events.labels?.singular).toBe('Event')
      expect(Events.labels?.plural).toBe('Events')
    })

    it('should have all required fields configured correctly', () => {
      const fields = Events.fields
      expect(fields).toBeDefined()

      // Check title field
      const titleField = fields?.find(field => 'name' in field && field.name === 'title')
      expect(titleField).toMatchObject({
        name: 'title',
        type: 'text',
        required: true,
        localized: true,
      })

      // Check slug field
      const slugField = fields?.find(field => 'name' in field && field.name === 'slug')
      expect(slugField).toMatchObject({
        name: 'slug',
        type: 'text',
        required: true,
        index: true,
      })

      // Check date field
      const dateField = fields?.find(field => 'name' in field && field.name === 'date')
      expect(dateField).toMatchObject({
        name: 'date',
        type: 'date',
        required: true,
        index: true,
      })

      // Check hero image field
      const heroImageField = fields?.find(field => 'name' in field && field.name === 'hero_image')
      expect(heroImageField).toMatchObject({
        name: 'hero_image',
        type: 'upload',
        relationTo: 'media',
        required: true,
      })

      // Check content image field
      const contentImageField = fields?.find(
        field => 'name' in field && field.name === 'content_image'
      )
      expect(contentImageField).toMatchObject({
        name: 'content_image',
        type: 'upload',
        relationTo: 'media',
        localized: true,
      })

      // Check content video URL field
      const videoUrlField = fields?.find(
        field => 'name' in field && field.name === 'content_video_url'
      )
      expect(videoUrlField).toMatchObject({
        name: 'content_video_url',
        type: 'text',
      })
    })

    it('should have beforeChange hook that validates slug uniqueness', async () => {
      const hooks = Events.hooks
      expect(hooks?.beforeChange).toBeDefined()
      expect(hooks?.beforeChange).toHaveLength(1)

      const beforeChangeHook = hooks?.beforeChange?.[0]
      expect(typeof beforeChangeHook).toBe('function')

      // Mock request payload
      const mockReq = {
        payload: {
          find: vi.fn(),
        },
        user: { id: 'user-1', roles: ['admin'] },
      }

      // Test hook when no existing event with same slug
      mockReq.payload.find.mockResolvedValue({ totalDocs: 0 })

      if (beforeChangeHook) {
        const data = { slug: 'new-event', title: 'New Event' }
        const result = await beforeChangeHook({
          collection: Events as any,
          context: {} as any,
          data,
          req: mockReq as any,
          operation: 'create',
        })
        expect(result).toEqual(data)
      }

      // Test hook when existing event with same slug exists
      mockReq.payload.find.mockResolvedValue({ totalDocs: 1 })

      if (beforeChangeHook) {
        const data = { slug: 'existing-event', title: 'Existing Event' }
        await expect(
          beforeChangeHook({
            collection: Events as any,
            context: {} as any,
            data,
            req: mockReq as any,
            operation: 'create',
          })
        ).rejects.toThrow(ValidationError)
      }
    })

    it('should reference access functions', () => {
      // Check that access functions are defined (they are mocked at the top)
      expect(Events.access?.read).toBeDefined()
      expect(Events.access?.create).toBeDefined()
      expect(Events.access?.update).toBeDefined()
      expect(Events.access?.delete).toBeDefined()
    })
  })

  describe('Media Collection', () => {
    it('should have correct collection configuration', () => {
      expect(Media.slug).toBe('media')
      expect(Media.admin?.useAsTitle).toBe('nickname')
      expect(Media.admin?.defaultColumns).toEqual(['nickname', 'mimeType', 'filesize', 'createdAt'])
    })

    it('should have upload configuration', () => {
      expect(Media.upload).toMatchObject({
        crop: false,
        focalPoint: false,
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
      })
    })

    it('should have correct fields', () => {
      const fields = Media.fields
      expect(fields).toBeDefined()

      // Check nickname field
      const nicknameField = fields?.find(field => 'name' in field && field.name === 'nickname')
      expect(nicknameField).toMatchObject({
        name: 'nickname',
        type: 'text',
        required: true,
      })

      // Check uploadedBy field
      const uploadedByField = fields?.find(field => 'name' in field && field.name === 'uploadedBy')
      expect(uploadedByField).toMatchObject({
        name: 'uploadedBy',
        type: 'relationship',
        relationTo: 'users',
        hidden: true,
      })
      expect((uploadedByField?.admin as any)?.readOnly).toBe(true)
    })

    it('should have beforeValidate hook for uploadedBy', () => {
      const hooks = Media.hooks
      expect(hooks?.beforeValidate).toBeDefined()
      expect(hooks?.beforeValidate).toHaveLength(1)

      const beforeValidateHook = hooks?.beforeValidate?.[0]
      expect(typeof beforeValidateHook).toBe('function')

      if (beforeValidateHook) {
        // Test with original doc having uploadedBy
        const result1 = beforeValidateHook({
          collection: Media as any,
          context: {} as any,
          req: { user: { id: 'user-1' } } as any,
          data: { nickname: 'Test' },
          operation: 'update' as any,
          originalDoc: { uploadedBy: 'original-user' },
        })
        expect(result1.uploadedBy).toBe('original-user')

        // Test with data having uploadedBy
        const result2 = beforeValidateHook({
          collection: Media as any,
          context: {} as any,
          req: { user: { id: 'user-1' } } as any,
          data: { nickname: 'Test', uploadedBy: 'data-user' },
          operation: 'create' as any,
          originalDoc: undefined,
        })
        expect(result2.uploadedBy).toBe('data-user')

        // Test fallback to req.user.id
        const result3 = beforeValidateHook({
          collection: Media as any,
          context: {} as any,
          req: { user: { id: 'current-user' } } as any,
          data: { nickname: 'Test' },
          operation: 'create' as any,
          originalDoc: undefined,
        })
        expect(result3.uploadedBy).toBe('current-user')

        // Test without any user
        const result4 = beforeValidateHook({
          collection: Media as any,
          context: {} as any,
          req: {} as any,
          data: { nickname: 'Test' },
          operation: 'create' as any,
          originalDoc: undefined,
        })
        expect(result4.uploadedBy).toBeUndefined()
      }
    })

    it('should reference access functions', () => {
      // Check that access functions are defined (they are mocked at the top)
      expect(Media.access?.read).toBeDefined()
      expect(Media.access?.create).toBeDefined()
      expect(Media.access?.update).toBeDefined()
      expect(Media.access?.delete).toBeDefined()
    })

    it('should handle various mime types', () => {
      const allowedTypes = (Media.upload as any)?.mimeTypes
      expect(allowedTypes).toContain('image/jpeg')
      expect(allowedTypes).toContain('image/png')
      expect(allowedTypes).toContain('image/webp')
      expect(allowedTypes).toContain('image/gif')
      expect(allowedTypes).toContain('application/pdf')
    })
  })
})
