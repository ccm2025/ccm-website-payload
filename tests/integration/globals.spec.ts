import { describe, it, expect } from 'vitest'

describe('Globals Configuration', () => {
  const globalTests = [
    { name: 'AboutPage', slug: 'about-page', module: '@/globals/AboutPage' },
    { name: 'HomePage', slug: 'home-page', module: '@/globals/HomePage' },
    { name: 'EventsPage', slug: 'events-page', module: '@/globals/EventsPage' },
    { name: 'GivePage', slug: 'give-page', module: '@/globals/GivePage' },
    { name: 'FreshmanPage', slug: 'freshman-page', module: '@/globals/FreshmanPage' },
    { name: 'SupportPage', slug: 'support-page', module: '@/globals/SupportPage' },
    { name: 'ThankYouPage', slug: 'thank-you-page', module: '@/globals/ThankYouPage' },
    { name: 'VolunteerPage', slug: 'volunteer-page', module: '@/globals/VolunteerPage' },
    {
      name: 'PlanYourVisitPage',
      slug: 'plan-your-visit-page',
      module: '@/globals/PlanYourVisitPage',
    },
    { name: 'Global', slug: 'global', module: '@/globals/Global' },
  ]

  describe('All Globals', () => {
    globalTests.forEach(({ name, slug, module }) => {
      describe(name, () => {
        it(`should export ${name} with correct slug`, async () => {
          const globalModule = await import(module)
          const globalConfig = globalModule[name]

          expect(globalConfig).toBeDefined()
          expect(globalConfig.slug).toBe(slug)
          expect(globalConfig.access).toBeDefined()
          expect(globalConfig.access?.read).toBeDefined()
          expect(globalConfig.access?.update).toBeDefined()
          expect(globalConfig.fields).toBeDefined()
          expect(Array.isArray(globalConfig.fields)).toBe(true)
        })
      })
    })
  })

  describe('Page-specific validations', () => {
    it('HomePage should have hero fields', async () => {
      const { HomePage } = await import('@/globals/HomePage')

      const fieldNames = HomePage.fields
        ?.map(field => ('name' in field ? field.name : null))
        .filter(Boolean)

      expect(fieldNames).toContain('hero_title')
      expect(fieldNames).toContain('hero_subtitle')
      expect(fieldNames).toContain('hero_button_text')
      expect(fieldNames).toContain('hero_background_image')
    })

    it('EventsPage should have events-specific fields', async () => {
      const { EventsPage } = await import('@/globals/EventsPage')

      const fieldNames = EventsPage.fields
        ?.map(field => ('name' in field ? field.name : null))
        .filter(Boolean)

      expect(fieldNames).toContain('hero_title')
      expect(fieldNames).toContain('upcoming_events_subtitle')
      expect(fieldNames).toContain('past_events_title')
      expect(fieldNames).toContain('default_event_image')
    })

    it('Global should have website-wide settings', async () => {
      const { Global } = await import('@/globals/Global')

      const fieldNames = Global.fields
        ?.map(field => ('name' in field ? field.name : null))
        .filter(Boolean)

      expect(fieldNames).toContain('website_title_cn')
      expect(fieldNames).toContain('website_title_en')
    })
  })

  describe('Localization support', () => {
    it('should have localized fields where appropriate', async () => {
      const { HomePage } = await import('@/globals/HomePage')

      const localizedFields = HomePage.fields?.filter(
        field => 'localized' in field && field.localized === true
      )

      expect(localizedFields?.length).toBeGreaterThan(0)
    })
  })
})
