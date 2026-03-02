import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  safelyFetchGlobal,
  safelyFetchCollection,
  validateLanguage,
  getRequiredEnv,
  getOptionalEnv,
  SupportedLanguage,
} from '@/lib/type-safety'

// Mock the lib imports
vi.mock('@/lib', () => ({
  fetchGlobal: vi.fn(),
  fetchCollection: vi.fn(),
}))

// Mock console methods
const originalConsoleError = console.error

describe('Type Safety - Extended Tests', () => {
  beforeEach(() => {
    console.error = vi.fn()
    vi.clearAllMocks()
  })

  afterEach(() => {
    console.error = originalConsoleError
  })

  describe('safelyFetchGlobal', () => {
    it('should return data on successful fetch', async () => {
      const mockData = {
        id: '1',
        hero_title: 'Home Page',
        hero_image: 'image.jpg',
        content_title: 'Welcome',
        title: 'Home Page',
        content: 'Welcome',
      } as any
      const { fetchGlobal } = await import('@/lib')
      vi.mocked(fetchGlobal).mockResolvedValue(mockData)

      const result = await safelyFetchGlobal('home-page', 'en')

      expect(result).toEqual(mockData)
      expect(fetchGlobal).toHaveBeenCalledWith('home-page', 'en')
    })

    it('should return fallback on error', async () => {
      const fallback = {
        id: '1',
        hero_title: 'Fallback Title',
        hero_image: 'fallback.jpg',
        content_title: 'Fallback Content',
        title: 'Fallback Page',
      } as any
      const { fetchGlobal } = await import('@/lib')
      vi.mocked(fetchGlobal).mockRejectedValue(new Error('Network error'))

      const result = await safelyFetchGlobal('home-page', 'en', fallback)

      expect(result).toEqual(fallback)
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch global: home-page',
        expect.any(Error)
      )
    })

    it('should return null when no fallback provided and error occurs', async () => {
      const { fetchGlobal } = await import('@/lib')
      vi.mocked(fetchGlobal).mockRejectedValue(new Error('Network error'))

      const result = await safelyFetchGlobal('home-page', 'en')

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch global: home-page',
        expect.any(Error)
      )
    })
  })

  describe('safelyFetchCollection', () => {
    it('should return collection data on successful fetch', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Event 1',
          slug: 'event-1',
          date: '2024-01-01',
          hero_image: 'image.jpg',
          updatedAt: '2024-01-01',
          createdAt: '2024-01-01',
        },
      ] as any[]
      const { fetchCollection } = await import('@/lib')
      vi.mocked(fetchCollection).mockResolvedValue(mockData)

      const options = { limit: 10, sort: 'title' }
      const result = await safelyFetchCollection('events', 'en', options)

      expect(result).toEqual(mockData)
      expect(fetchCollection).toHaveBeenCalledWith('events', 'en', options)
    })

    it('should return fallback array on error', async () => {
      const fallback = [
        {
          id: 'fallback',
          title: 'Fallback Event',
          slug: 'fallback-event',
          date: '2024-01-01',
          hero_image: 'fallback.jpg',
          updatedAt: '2024-01-01',
          createdAt: '2024-01-01',
        },
      ] as any[]
      const { fetchCollection } = await import('@/lib')
      vi.mocked(fetchCollection).mockRejectedValue(new Error('Database error'))

      const result = await safelyFetchCollection('events', 'en', {}, fallback)

      expect(result).toEqual(fallback)
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch collection: events',
        expect.any(Error)
      )
    })

    it('should return empty array when no fallback provided and error occurs', async () => {
      const { fetchCollection } = await import('@/lib')
      vi.mocked(fetchCollection).mockRejectedValue(new Error('Database error'))

      const result = await safelyFetchCollection('events', 'en')

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'Failed to fetch collection: events',
        expect.any(Error)
      )
    })

    it('should handle undefined options', async () => {
      const mockData = [
        {
          id: '1',
          title: 'Event 1',
          slug: 'event-1',
          date: '2024-01-01',
          hero_image: 'image.jpg',
          updatedAt: '2024-01-01',
          createdAt: '2024-01-01',
        },
      ] as any[]
      const { fetchCollection } = await import('@/lib')
      vi.mocked(fetchCollection).mockResolvedValue(mockData)

      const result = await safelyFetchCollection('events', 'en', undefined)

      expect(result).toEqual(mockData)
      expect(fetchCollection).toHaveBeenCalledWith('events', 'en', undefined)
    })
  })

  describe('validateLanguage', () => {
    it('should return valid language when provided', () => {
      expect(validateLanguage('en')).toBe('en')
      expect(validateLanguage('zh-Hans')).toBe('zh-Hans')
    })

    it('should return default language for invalid input', () => {
      expect(validateLanguage('fr')).toBe('en')
      expect(validateLanguage('invalid')).toBe('en')
      expect(validateLanguage('')).toBe('en')
    })

    it('should handle edge cases', () => {
      expect(validateLanguage('EN')).toBe('en') // Case sensitivity
      expect(validateLanguage('zh-hans')).toBe('en') // Case sensitivity
      expect(validateLanguage('zh')).toBe('en') // Partial match
    })

    it('should work with SupportedLanguage type', () => {
      const lang: SupportedLanguage = validateLanguage('en')
      expect(lang).toBe('en')

      const invalidLang: SupportedLanguage = validateLanguage('invalid')
      expect(invalidLang).toBe('en')
    })
  })

  describe('getRequiredEnv', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should return environment variable value when it exists', () => {
      process.env.TEST_REQUIRED_VAR = 'test-value'

      const result = getRequiredEnv('TEST_REQUIRED_VAR')

      expect(result).toBe('test-value')
    })

    it('should throw error when environment variable does not exist', () => {
      delete process.env.TEST_MISSING_VAR

      expect(() => getRequiredEnv('TEST_MISSING_VAR')).toThrow(
        'Required environment variable TEST_MISSING_VAR is missing'
      )
    })

    it('should throw error when environment variable is empty string', () => {
      process.env.TEST_EMPTY_VAR = ''

      expect(() => getRequiredEnv('TEST_EMPTY_VAR')).toThrow(
        'Required environment variable TEST_EMPTY_VAR is missing'
      )
    })
  })

  describe('getOptionalEnv', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should return environment variable value when it exists', () => {
      process.env.TEST_OPTIONAL_VAR = 'optional-value'

      const result = getOptionalEnv('TEST_OPTIONAL_VAR')

      expect(result).toBe('optional-value')
    })

    it('should return empty string when variable does not exist and no default provided', () => {
      delete process.env.TEST_MISSING_OPTIONAL

      const result = getOptionalEnv('TEST_MISSING_OPTIONAL')

      expect(result).toBe('')
    })

    it('should return default value when variable does not exist', () => {
      delete process.env.TEST_MISSING_OPTIONAL

      const result = getOptionalEnv('TEST_MISSING_OPTIONAL', 'default-value')

      expect(result).toBe('default-value')
    })

    it('should return environment variable value over default when it exists', () => {
      process.env.TEST_EXISTING_VAR = 'env-value'

      const result = getOptionalEnv('TEST_EXISTING_VAR', 'default-value')

      expect(result).toBe('env-value')
    })

    it('should handle empty string environment variable', () => {
      process.env.TEST_EMPTY_VAR = ''

      const result = getOptionalEnv('TEST_EMPTY_VAR', 'default-value')

      expect(result).toBe('default-value') // Empty string should use default
    })
  })
})
