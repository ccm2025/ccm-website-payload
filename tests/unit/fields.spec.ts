import { describe, it, expect } from 'vitest'
import { styledTextField } from '@/fields'

describe('Field Utilities', () => {
  describe('styledTextField', () => {
    it('should create a styled text field with default options', () => {
      const field = styledTextField({ name: 'test' })

      expect(field.name).toBe('test')
      expect(field.type).toBe('array') // styledTextField returns an array field
    })

    it('should apply custom options', () => {
      const field = styledTextField({
        name: 'content',
        required: true,
        localized: true,
      })

      expect(field.name).toBe('content')
      expect(field.required).toBe(true)
      expect(field.localized).toBe(true)
    })

    it('should have proper field structure', () => {
      const field = styledTextField({ name: 'test' })

      expect(field.fields).toBeDefined()
      expect(Array.isArray(field.fields)).toBe(true)
      expect(field.labels).toBeDefined()
      expect(field.labels?.singular).toBe('Line')
      expect(field.labels?.plural).toBe('Lines')
    })
  })
})
