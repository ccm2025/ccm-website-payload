import { describe, it, expect } from 'vitest'
import {
  isValidEvent,
  isValidUser,
  isValidMedia,
  validateLanguage,
  getOptionalEnv,
  withErrorBoundary,
} from '@/lib/type-safety'

describe('Type Safety Utilities', () => {
  describe('Type Guards', () => {
    describe('isValidEvent', () => {
      it('should validate valid event objects', () => {
        const event = {
          title: 'Test Event',
          slug: 'test-event',
          date: '2024-01-01',
        }
        expect(isValidEvent(event)).toBe(true)
      })

      it('should reject invalid objects', () => {
        expect(isValidEvent(null)).toBe(false)
        expect(isValidEvent(undefined)).toBe(false)
        expect(isValidEvent({})).toBe(false)
        expect(isValidEvent({ title: 'test' })).toBe(false) // missing required fields
      })
    })

    describe('isValidUser', () => {
      it('should validate valid user objects', () => {
        const user = {
          email: 'test@test.com',
          role: 'admin',
        }
        expect(isValidUser(user)).toBe(true)
      })

      it('should reject invalid user objects', () => {
        expect(isValidUser(null)).toBe(false)
        expect(isValidUser({ email: 'test@test.com' })).toBe(false) // missing role
        expect(isValidUser({ role: 'admin' })).toBe(false) // missing email
      })
    })

    describe('isValidMedia', () => {
      it('should validate valid media objects', () => {
        const media = { url: '/test-image.jpg' }
        expect(isValidMedia(media)).toBe(true)
      })

      it('should reject invalid media objects', () => {
        expect(isValidMedia(null)).toBe(false)
        expect(isValidMedia({})).toBe(false)
      })
    })
  })

  describe('validateLanguage', () => {
    it('should validate supported languages', () => {
      expect(validateLanguage('en')).toBe('en')
      expect(validateLanguage('zh-Hans')).toBe('zh-Hans')
    })

    it('should fallback for unsupported languages', () => {
      expect(validateLanguage('fr')).toBe('en')
      expect(validateLanguage('')).toBe('en')
    })
  })

  describe('getOptionalEnv', () => {
    it('should return default value when env var is undefined', () => {
      expect(getOptionalEnv('NONEXISTENT_VAR', 'default')).toBe('default')
    })

    it('should use empty string as default when no default provided', () => {
      expect(getOptionalEnv('NONEXISTENT_VAR')).toBe('')
    })
  })

  describe('withErrorBoundary', () => {
    it('should return result from successful operation', async () => {
      const operation = async () => 'success'
      const result = await withErrorBoundary(operation, 'test error')
      expect(result).toBe('success')
    })

    it('should return fallback on error', async () => {
      const operation = async () => {
        throw new Error('test error')
      }
      const result = await withErrorBoundary(operation, 'test error', 'fallback')
      expect(result).toBe('fallback')
    })

    it('should return undefined when no fallback provided', async () => {
      const operation = async () => {
        throw new Error('test error')
      }
      const result = await withErrorBoundary(operation, 'test error')
      expect(result).toBeUndefined()
    })
  })
})
