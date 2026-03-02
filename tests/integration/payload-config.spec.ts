import { describe, it, expect } from 'vitest'

describe('Payload Configuration', () => {
  it('should export a valid configuration', async () => {
    const config = await import('@/payload.config')
    expect(config.default).toBeDefined()
  })

  it('should have all required collections configured', async () => {
    // Test that all collections can be imported
    const collections = {
      Users: await import('@/collections/Users'),
      Media: await import('@/collections/Media'),
      Events: await import('@/collections/Events'),
    }

    expect(collections.Users.Users).toBeDefined()
    expect(collections.Media.Media).toBeDefined()
    expect(collections.Events.Events).toBeDefined()
  })

  it('should have all required globals configured', async () => {
    // Test that all globals can be imported
    const globals = {
      AboutPage: await import('@/globals/AboutPage'),
      HomePage: await import('@/globals/HomePage'),
      EventsPage: await import('@/globals/EventsPage'),
      GivePage: await import('@/globals/GivePage'),
      Global: await import('@/globals/Global'),
    }

    Object.values(globals).forEach(globalModule => {
      const exportedGlobal = Object.values(globalModule)[0]
      expect(exportedGlobal).toBeDefined()
      expect(exportedGlobal).toHaveProperty('slug')
      expect(exportedGlobal).toHaveProperty('fields')
    })
  })

  it('should have TypeScript types file available', async () => {
    // Test that types file can be imported (even if types are interfaces)
    const typesModule = await import('@/payload-types')
    expect(typesModule).toBeDefined()
    // Types are interfaces so they won't be runtime values
    // This test just ensures the file imports successfully
  })

  describe('Configuration structure validation', () => {
    it('should have proper field type validation', async () => {
      // Test that field definitions are properly typed
      const { Users } = await import('@/collections/Users')

      if (Users.fields) {
        Users.fields.forEach(field => {
          expect(field).toHaveProperty('type')
          if ('name' in field) {
            expect(typeof field.name).toBe('string')
          }
        })
      }
    })

    it('should have consistent access pattern', async () => {
      const { AboutPage } = await import('@/globals/AboutPage')
      const { Users } = await import('@/collections/Users')
      const { Events } = await import('@/collections/Events')

      // All should have access defined
      expect(AboutPage.access).toBeDefined()
      expect(Users.access).toBeDefined()
      expect(Events.access).toBeDefined()

      // All should have read access defined
      expect(AboutPage.access?.read).toBeDefined()
      expect(Users.access?.read).toBeDefined()
      expect(Events.access?.read).toBeDefined()
    })
  })
})
