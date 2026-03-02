import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import {
  isValidEvent,
  isValidUser,
  isValidMedia,
  validateLanguage,
  getRequiredEnv,
  getOptionalEnv,
} from '@/lib/type-safety'

describe('Type Safety - Advanced Utilities', () => {
  let originalEnv: NodeJS.ProcessEnv

  beforeEach(() => {
    originalEnv = { ...process.env }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Type Guards', () => {
    describe('isValidEvent', () => {
      it('should return true for valid event objects', () => {
        const validEvent = {
          id: '1',
          title: 'Test Event',
          slug: 'test-event',
          date: '2024-01-01',
          hero_image: 'image.jpg',
          content_title: 'Content Title',
          content_subtitle: 'Content Subtitle',
          updatedAt: '2024-01-01T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
        }

        expect(isValidEvent(validEvent)).toBe(true)
      })

      it('should return false for invalid objects', () => {
        expect(isValidEvent(null)).toBe(false)
        expect(isValidEvent(undefined)).toBe(false)
        expect(isValidEvent({})).toBe(false)
        expect(isValidEvent({ title: 'Only Title' })).toBe(false)
        expect(isValidEvent({ title: 'Title', slug: 'slug' })).toBe(false)
        expect(isValidEvent('string')).toBe(false)
        expect(isValidEvent(123)).toBe(false)
      })
    })

    describe('isValidUser', () => {
      it('should return true for valid user objects', () => {
        const validUser = {
          id: '1',
          email: 'user@example.com',
          role: 'admin',
          updatedAt: '2024-01-01T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
        }

        expect(isValidUser(validUser)).toBe(true)
      })

      it('should return false for invalid objects', () => {
        expect(isValidUser(null)).toBe(false)
        expect(isValidUser({})).toBe(false)
        expect(isValidUser({ email: 'email@example.com' })).toBe(false)
        expect(isValidUser({ role: 'admin' })).toBe(false)
      })
    })

    describe('isValidMedia', () => {
      it('should return true for valid media objects', () => {
        const validMedia = {
          id: '1',
          url: '/uploads/image.jpg',
          filename: 'image.jpg',
          mimeType: 'image/jpeg',
          filesize: 123456,
          width: 800,
          height: 600,
          updatedAt: '2024-01-01T00:00:00.000Z',
          createdAt: '2024-01-01T00:00:00.000Z',
        }

        expect(isValidMedia(validMedia)).toBe(true)
      })

      it('should return false for invalid objects', () => {
        expect(isValidMedia(null)).toBe(false)
        expect(isValidMedia({})).toBe(false)
        expect(isValidMedia({ filename: 'image.jpg' })).toBe(false)
      })
    })
  })

  describe('Language Validation', () => {
    it('should return valid language for supported languages', () => {
      expect(validateLanguage('en')).toBe('en')
      expect(validateLanguage('zh-Hans')).toBe('zh-Hans')
    })

    it('should return default language for unsupported languages', () => {
      expect(validateLanguage('fr')).toBe('en')
      expect(validateLanguage('de')).toBe('en')
      expect(validateLanguage('')).toBe('en')
      expect(validateLanguage('invalid')).toBe('en')
    })

    it('should handle edge cases', () => {
      expect(validateLanguage('EN')).toBe('en') // case normalization handled by array
      expect(validateLanguage('zh-hans')).toBe('en') // exact match required
    })
  })

  describe('Environment Variable Utilities', () => {
    describe('getRequiredEnv', () => {
      it('should return environment variable value when it exists', () => {
        process.env.TEST_VAR = 'test-value'
        expect(getRequiredEnv('TEST_VAR')).toBe('test-value')
      })

      it('should throw error when environment variable is missing', () => {
        delete process.env.MISSING_VAR
        expect(() => getRequiredEnv('MISSING_VAR')).toThrow(
          'Required environment variable MISSING_VAR is missing'
        )
      })

      it('should throw error when environment variable is empty string', () => {
        process.env.EMPTY_VAR = ''
        expect(() => getRequiredEnv('EMPTY_VAR')).toThrow(
          'Required environment variable EMPTY_VAR is missing'
        )
      })
    })

    describe('getOptionalEnv', () => {
      it('should return environment variable value when it exists', () => {
        process.env.OPTIONAL_VAR = 'optional-value'
        expect(getOptionalEnv('OPTIONAL_VAR')).toBe('optional-value')
      })

      it('should return empty string as default when variable is missing', () => {
        delete process.env.MISSING_OPTIONAL
        expect(getOptionalEnv('MISSING_OPTIONAL')).toBe('')
      })

      it('should return custom default value when provided', () => {
        delete process.env.MISSING_WITH_DEFAULT
        expect(getOptionalEnv('MISSING_WITH_DEFAULT', 'custom-default')).toBe('custom-default')
      })

      it('should return actual value even when default is provided', () => {
        process.env.EXISTING_WITH_DEFAULT = 'actual-value'
        expect(getOptionalEnv('EXISTING_WITH_DEFAULT', 'default')).toBe('actual-value')
      })
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle non-string inputs gracefully in type guards', () => {
      const testCases = [42, true, false, [], {}, Symbol('test'), new Date(), /regex/]

      testCases.forEach(testCase => {
        expect(isValidEvent(testCase)).toBe(false)
        expect(isValidUser(testCase)).toBe(false)
        expect(isValidMedia(testCase)).toBe(false)
      })
    })

    it('should preserve object structure in type guards', () => {
      const eventWithExtraProps = {
        title: 'Event',
        slug: 'event',
        date: '2024-01-01',
        extraProp: 'should be preserved',
        anotherExtra: 123,
      }

      expect(isValidEvent(eventWithExtraProps)).toBe(true)
    })
  })
})
