import type { Event, User, Media, Config } from '@/payload-types'
import type { GlobalSlug, DataFromGlobalSlug } from 'payload'

// Type guard utilities for runtime type checking
export function isValidEvent(obj: unknown): obj is Event {
  return typeof obj === 'object' && obj !== null && 'title' in obj && 'slug' in obj && 'date' in obj
}

export function isValidUser(obj: unknown): obj is User {
  return typeof obj === 'object' && obj !== null && 'email' in obj && 'role' in obj
}

export function isValidMedia(obj: unknown): obj is Media {
  return typeof obj === 'object' && obj !== null && 'url' in obj
}

// Safe fetch utilities with error handling
export async function safelyFetchGlobal<TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Config['locale'],
  fallback?: DataFromGlobalSlug<TSlug>
): Promise<DataFromGlobalSlug<TSlug> | null> {
  try {
    const { fetchGlobal } = await import('@/lib')
    return await fetchGlobal(slug, locale)
  } catch (error) {
    console.error(`Failed to fetch global: ${slug}`, error)
    return fallback || null
  }
}

export async function safelyFetchCollection<TSlug extends keyof Config['collections']>(
  slug: TSlug,
  locale: Config['locale'],
  options?: Record<string, unknown>,
  fallback?: Config['collections'][TSlug][]
): Promise<Config['collections'][TSlug][]> {
  try {
    const { fetchCollection } = await import('@/lib')
    return await fetchCollection(slug, locale, options)
  } catch (error) {
    console.error(`Failed to fetch collection: ${slug}`, error)
    return fallback || []
  }
}

// Language validation with strict typing
export type SupportedLanguage = 'en' | 'zh-Hans'

export function validateLanguage(lang: string): SupportedLanguage {
  const supportedLanguages: SupportedLanguage[] = ['en', 'zh-Hans']
  return supportedLanguages.includes(lang as SupportedLanguage) ? (lang as SupportedLanguage) : 'en'
}

// Error boundary helper for async operations
export async function withErrorBoundary<T>(
  operation: () => Promise<T>,
  errorMessage: string,
  fallback?: T
): Promise<T | undefined> {
  try {
    return await operation()
  } catch (error) {
    console.error(errorMessage, error)
    return fallback
  }
}

// Type-safe environment variable helper
export function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Required environment variable ${key} is missing`)
  }
  return value
}

export function getOptionalEnv(key: string, defaultValue = ''): string {
  return process.env[key] || defaultValue
}
