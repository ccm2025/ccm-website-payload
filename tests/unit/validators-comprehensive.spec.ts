import { describe, it, expect } from 'vitest'

import { isAllowedLang, validateLang, validateLangStrict } from '@/lib/validators'
import { ALLOWED_LANGS } from '@/lib/constants'

describe('Language Validators - Comprehensive Tests', () => {
  describe('isAllowedLang', () => {
    it('should correctly identify allowed languages', () => {
      expect(isAllowedLang('en')).toBe(true)
      expect(isAllowedLang('zh-Hans')).toBe(true)
    })

    it('should reject disallowed languages', () => {
      expect(isAllowedLang('fr')).toBe(false)
      expect(isAllowedLang('de')).toBe(false)
      expect(isAllowedLang('es')).toBe(false)
    })

    it('should handle case sensitivity correctly', () => {
      expect(isAllowedLang('EN')).toBe(false) // Should be case-sensitive
      expect(isAllowedLang('Zh-Hans')).toBe(false)
      expect(isAllowedLang('zh-hans')).toBe(false)
    })

    it('should handle empty and invalid inputs', () => {
      expect(isAllowedLang('')).toBe(false)
      expect(isAllowedLang(' ')).toBe(false)
      expect(isAllowedLang('null')).toBe(false)
      expect(isAllowedLang('undefined')).toBe(false)
    })

    it('should handle partial matches', () => {
      expect(isAllowedLang('e')).toBe(false)
      expect(isAllowedLang('en-US')).toBe(false) // Should not match partial
      expect(isAllowedLang('zh')).toBe(false)
    })
  })

  describe('validateLang', () => {
    it('should return exact matches for allowed languages', () => {
      expect(validateLang('en')).toBe('en')
      expect(validateLang('zh-Hans')).toBe('zh-Hans')
    })

    it('should handle case variations and normalize to lowercase', () => {
      expect(validateLang('EN')).toBe('en')
      expect(validateLang('En')).toBe('en')
      expect(validateLang('ZH-HANS')).toBe('zh-Hans') // Actually matches lowercase variant
      expect(validateLang('Zh-Hans')).toBe('zh-Hans') // This matches through partial matching
    })

    it('should handle locale variations with region codes', () => {
      expect(validateLang('en-US')).toBe('en')
      expect(validateLang('en-GB')).toBe('en')
      expect(validateLang('zh-Hans-CN')).toBe('zh-Hans')
      expect(validateLang('zh-Hant')).toBe('en') // Falls back as not supported
    })

    it('should handle edge cases', () => {
      expect(validateLang('')).toBe('en')
      expect(validateLang(' ')).toBe('en')
      expect(validateLang('invalid')).toBe('en')
      expect(validateLang('123')).toBe('en')
      expect(validateLang(null)).toBe('en')
      expect(validateLang(undefined)).toBe('en')
      expect(validateLang(123)).toBe('en')
    })

    it('should handle language codes with underscores', () => {
      expect(validateLang('en_US')).toBe('en')
      expect(validateLang('zh_Hans')).toBe('en') // Note: Our locale uses hyphen
      expect(validateLang('fr_FR')).toBe('en')
    })

    it('should handle very long strings', () => {
      const longString = 'en-US-very-long-locale-identifier-that-should-still-work'
      expect(validateLang(longString)).toBe('en')
    })
  })

  describe('validateLangStrict', () => {
    it('should accept only exact allowed languages', () => {
      expect(() => validateLangStrict('en')).not.toThrow()
      expect(() => validateLangStrict('zh-Hans')).not.toThrow()
    })

    it('should throw for invalid languages', () => {
      expect(() => validateLangStrict('fr')).toThrow('Invalid language: fr')
      expect(() => validateLangStrict('EN')).toThrow('Invalid language: EN')
      expect(() => validateLangStrict('')).toThrow('Invalid language: ')
      expect(() => validateLangStrict('en-US')).toThrow('Invalid language: en-US')
      expect(() => validateLangStrict(null)).toThrow('Invalid language: null')
      expect(() => validateLangStrict(undefined)).toThrow('Invalid language: undefined')
    })

    it('should return the valid language when successful', () => {
      expect(validateLangStrict('en')).toBe('en')
      expect(validateLangStrict('zh-Hans')).toBe('zh-Hans')
    })
  })

  describe('Constants Integration', () => {
    it('should use the same allowed languages as constants', () => {
      // Test that our validators are consistent with the constants
      ALLOWED_LANGS.forEach(lang => {
        expect(isAllowedLang(lang)).toBe(true)
        expect(validateLang(lang)).toBe(lang)
        expect(validateLangStrict(lang)).toBe(lang)
      })
    })

    it('should handle all supported languages correctly', () => {
      const supportedLanguages = ['en', 'zh-Hans'] as const

      supportedLanguages.forEach(lang => {
        expect(ALLOWED_LANGS.includes(lang)).toBe(true)
        expect(isAllowedLang(lang)).toBe(true)
      })
    })
  })

  describe('Browser Compatibility', () => {
    it('should handle navigator.language format', () => {
      // Simulate browser language preferences
      const browserLanguages = [
        'en-US', // US English
        'en-GB', // UK English
        'zh-CN', // Simplified Chinese (should fallback)
        'fr-FR', // French (should fallback)
        'de-DE', // German (should fallback)
      ]

      browserLanguages.forEach(lang => {
        const normalized = validateLang(lang)
        expect(['en', 'zh-Hans'].includes(normalized)).toBe(true)
      })
    })

    it('should handle Accept-Language header format', () => {
      // Simulate HTTP Accept-Language scenarios
      const acceptLanguageValues = [
        'en-US,en;q=0.9',
        'zh-CN,zh;q=0.9,en;q=0.8',
        'fr-FR,fr;q=0.9,en;q=0.8',
      ]

      acceptLanguageValues.forEach(value => {
        const primaryLang = value.split(',')[0].split(';')[0]
        const normalized = validateLang(primaryLang)
        expect(typeof normalized).toBe('string')
        expect(['en', 'zh-Hans'].includes(normalized)).toBe(true)
      })
    })
  })
})
