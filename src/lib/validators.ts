import { ALLOWED_LANGS } from '@/lib/constants'
import { Config } from '@/payload-types'

/**
 * Return if a given language is allowed
 */
export function isAllowedLang(lang: string): lang is Config['locale'] {
  return (ALLOWED_LANGS as readonly string[]).includes(lang)
}

/**
 * Validate language with fallback to default
 */
export function validateLang(lang: unknown): Config['locale'] {
  if (typeof lang !== 'string') {
    return 'en'
  }

  // Handle case sensitivity and whitespace
  const cleanLang = lang.trim().toLowerCase()

  // Check for exact match
  if ((ALLOWED_LANGS as readonly string[]).includes(cleanLang)) {
    return cleanLang as Config['locale']
  }

  // Check for partial match (e.g., 'en-US' -> 'en')
  const matchingLang = ALLOWED_LANGS.find(allowed => cleanLang.startsWith(allowed.toLowerCase()))

  if (matchingLang) {
    return matchingLang
  }
  return 'en' as const
}

/**
 * Strict validation - throws if invalid
 */
export function validateLangStrict(lang: unknown): Config['locale'] {
  if (typeof lang !== 'string' || !isAllowedLang(lang)) {
    throw new Error(`Invalid language: ${lang}`)
  }
  return lang
}
