import { describe, it, expect } from 'vitest'
import { validateLang } from '@/lib'
import { ALLOWED_LANGS } from '@/lib/constants'

describe('Library Functions', () => {
  describe('validateLang', () => {
    it('should accept valid languages', () => {
      expect(validateLang('en')).toBe('en')
      expect(validateLang('zh-Hans')).toBe('zh-Hans')
    })

    it('should fallback to default for invalid languages', () => {
      expect(validateLang('invalid')).toBe('en')
      expect(validateLang('')).toBe('en')
      expect(validateLang(undefined as any)).toBe('en')
      expect(validateLang(null as any)).toBe('en')
    })

    it('should handle edge cases', () => {
      expect(validateLang('EN')).toBe('en') // case sensitivity
      expect(validateLang(' en ')).toBe('en') // whitespace
      expect(validateLang('en-US')).toBe('en') // partial match fallback
    })
  })

  describe('Constants', () => {
    it('should have correct allowed languages', () => {
      expect(ALLOWED_LANGS).toEqual(['en', 'zh-Hans'])
      expect(ALLOWED_LANGS.length).toBe(2)
    })
  })
})
