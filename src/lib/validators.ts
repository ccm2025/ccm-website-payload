import { Config } from '@/payload-types'
import { ALLOWED_LANGS } from '@/payload.config'

/**
 * Return if a given language is allowed
 */
export function isAllowedLang(lang: string): lang is Config['locale'] {
  return ALLOWED_LANGS.includes(lang)
}

/**
 * Validate language, throw if invalid
 */
export function validateLang(lang: unknown): Config['locale'] {
  if (typeof lang !== 'string' || !isAllowedLang(lang)) {
    throw new Error(`Invalid language: ${lang}`)
  }
  return lang
}
