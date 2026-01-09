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

/**
 * Validate slug format (alphanumeric, hyphens, underscores only)
 * Returns true if valid, false otherwise
 */
export function isValidSlug(slug: unknown): slug is string {
  if (typeof slug !== 'string') return false
  // Allow: letters, numbers, hyphens, underscores
  return /^[a-zA-Z0-9_-]+$/.test(slug) && slug.length > 0 && slug.length <= 255
}

/**
 * Validate slug, throw if invalid
 */
export function validateSlug(slug: unknown): string {
  if (!isValidSlug(slug)) {
    throw new Error(`Invalid slug format: ${slug}`)
  }
  return slug
}

/**
 * Safe wrapper to get slug param with validation
 */
export function getValidatedSlug(params: Record<string, unknown>): string {
  return validateSlug(params.slug)
}
