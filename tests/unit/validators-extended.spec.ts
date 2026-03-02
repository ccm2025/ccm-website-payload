import { describe, it, expect } from 'vitest'
import { isAllowedLang, validateLang, validateLangStrict } from '@/lib/validators'

describe('Validators - Extended Tests', () => {
  describe('isAllowedLang', () => {
    it('should return true for valid languages', () => {
      expect(isAllowedLang('en')).toBe(true)
      expect(isAllowedLang('zh-Hans')).toBe(true)
    })

    it('should return false for invalid languages', () => {
      expect(isAllowedLang('fr')).toBe(false)
      expect(isAllowedLang('invalid')).toBe(false)
      expect(isAllowedLang('')).toBe(false)
    })

    it('should be case sensitive', () => {
      expect(isAllowedLang('EN')).toBe(false)
      expect(isAllowedLang('En')).toBe(false)
      expect(isAllowedLang('ZH-HANS')).toBe(false)
    })

    it('should handle edge cases', () => {
      expect(isAllowedLang(' en ')).toBe(false) // With spaces
      expect(isAllowedLang('en-US')).toBe(false) // Partial match
    })
  })

  describe('validateLang', () => {
    it('should return valid language when provided', () => {
      expect(validateLang('en')).toBe('en')
      expect(validateLang('zh-Hans')).toBe('zh-Hans') // Returns original case from ALLOWED_LANGS
    })

    it('should return default language for invalid string input', () => {
      expect(validateLang('fr')).toBe('en')
      expect(validateLang('invalid')).toBe('en')
      expect(validateLang('')).toBe('en')
    })

    it('should return default language for non-string input', () => {
      expect(validateLang(null)).toBe('en')
      expect(validateLang(undefined)).toBe('en')
      expect(validateLang(123)).toBe('en')
      expect(validateLang({})).toBe('en')
      expect(validateLang([])).toBe('en')
      expect(validateLang(true)).toBe('en')
    })

    it('should handle case sensitivity and whitespace', () => {
      expect(validateLang(' en ')).toBe('en')
      expect(validateLang('EN')).toBe('en')
      expect(validateLang('En')).toBe('en')
      expect(validateLang(' ZH-HANS ')).toBe('zh-Hans') // Returns original case from ALLOWED_LANGS
    })

    it('should handle partial matches', () => {
      expect(validateLang('en-US')).toBe('en')
      expect(validateLang('en-GB')).toBe('en')
      expect(validateLang('zh-hans-CN')).toBe('zh-Hans') // Returns original case from ALLOWED_LANGS
    })

    it('should handle edge cases in partial matching', () => {
      expect(validateLang('eng')).toBe('en') // Starts with 'en'
      expect(validateLang('zhh')).toBe('en') // Doesn't start with any valid lang
      expect(validateLang('x')).toBe('en') // Too short
    })
  })

  describe('validateLangStrict', () => {
    it('should return valid language when provided', () => {
      expect(validateLangStrict('en')).toBe('en')
      expect(validateLangStrict('zh-Hans')).toBe('zh-Hans')
    })

    it('should throw error for invalid string input', () => {
      expect(() => validateLangStrict('fr')).toThrow('Invalid language: fr')
      expect(() => validateLangStrict('invalid')).toThrow('Invalid language: invalid')
      expect(() => validateLangStrict('')).toThrow('Invalid language: ')
    })

    it('should throw error for non-string input', () => {
      expect(() => validateLangStrict(null)).toThrow('Invalid language: null')
      expect(() => validateLangStrict(undefined)).toThrow('Invalid language: undefined')
      expect(() => validateLangStrict(123)).toThrow('Invalid language: 123')
      expect(() => validateLangStrict({})).toThrow('Invalid language: [object Object]')
      expect(() => validateLangStrict([])).toThrow('Invalid language: ')
      expect(() => validateLangStrict(true)).toThrow('Invalid language: true')
    })

    it('should throw error for case mismatched input', () => {
      expect(() => validateLangStrict('EN')).toThrow('Invalid language: EN')
      expect(() => validateLangStrict('ZH-HANS')).toThrow('Invalid language: ZH-HANS')
    })

    it('should throw error for input with whitespace', () => {
      expect(() => validateLangStrict(' en ')).toThrow('Invalid language:  en ')
    })

    it('should not handle partial matches', () => {
      expect(() => validateLangStrict('en-US')).toThrow('Invalid language: en-US')
      expect(() => validateLangStrict('zh-hans-CN')).toThrow('Invalid language: zh-hans-CN')
    })
  })

  describe('Type narrowing behavior', () => {
    it('should properly narrow types with isAllowedLang', () => {
      const testLang = 'en' as string

      if (isAllowedLang(testLang)) {
        // This should be properly typed as Config['locale']
        const narrowedLang: 'en' | 'zh-Hans' = testLang
        expect(narrowedLang).toBe('en')
      }
    })

    it('should return properly typed values from validateLang', () => {
      const result = validateLang('en')
      // Should be typed as Config['locale']
      const typedResult: 'en' | 'zh-Hans' = result
      expect(typedResult).toBe('en')
    })

    it('should return properly typed values from validateLangStrict', () => {
      const result = validateLangStrict('zh-Hans')
      // Should be typed as Config['locale']
      const typedResult: 'en' | 'zh-Hans' = result
      expect(typedResult).toBe('zh-Hans')
    })
  })
})
