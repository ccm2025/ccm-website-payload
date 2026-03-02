import { describe, it, expect } from 'vitest'

describe('Collections Configuration', () => {
  describe('Users Collection', () => {
    it('should have correct configuration', async () => {
      const { Users } = await import('@/collections/Users')

      expect(Users.slug).toBe('users')
      expect(Users.auth).toBe(true)
      expect(Users.admin?.useAsTitle).toBe('email')
      expect(Users.access?.read).toBeDefined()
      expect(Users.fields).toBeDefined()
      expect(Users.fields?.length).toBeGreaterThan(0)
    })

    it('should have role field with correct options', async () => {
      const { Users } = await import('@/collections/Users')

      const roleField = Users.fields?.find(field => 'name' in field && field.name === 'role')

      expect(roleField).toBeDefined()
      expect(roleField?.type).toBe('select')

      if ('options' in roleField!) {
        expect(roleField.options).toContain('admin')
        expect(roleField.options).toContain('editor')
        expect(roleField.options).toContain('user')
      }
    })
  })

  describe('Events Collection', () => {
    it('should have correct configuration', async () => {
      const { Events } = await import('@/collections/Events')

      expect(Events.slug).toBe('events')
      expect(Events.admin?.useAsTitle).toBe('title')
      expect(Events.versions).toBeDefined()
      expect((Events.versions as any)?.drafts).toBe(true)
      expect(Events.access?.read).toBeDefined()
      expect(Events.access?.create).toBeDefined()
    })

    it('should have required fields', async () => {
      const { Events } = await import('@/collections/Events')

      const fieldNames = Events.fields
        ?.map(field => ('name' in field ? field.name : null))
        .filter(Boolean)

      expect(fieldNames).toContain('title')
      expect(fieldNames).toContain('slug')
      expect(fieldNames).toContain('date')
      expect(fieldNames).toContain('hero_image')
    })

    it('should have slug validation hook', async () => {
      const { Events } = await import('@/collections/Events')

      expect(Events.hooks).toBeDefined()
      expect(Events.hooks?.beforeChange).toBeDefined()
      expect(Array.isArray(Events.hooks?.beforeChange)).toBe(true)
      expect(Events.hooks?.beforeChange?.length).toBeGreaterThan(0)
    })
  })

  describe('Media Collection', () => {
    it('should have correct configuration', async () => {
      const { Media } = await import('@/collections/Media')

      expect(Media.slug).toBe('media')
      expect(Media.upload).toBeDefined()
      expect(Media.access?.read).toBeDefined()
    })
  })
})
