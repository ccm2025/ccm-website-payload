import { Config } from '@/payload-types'
import { supportedLocales } from '@/payload.config'

/**
 * Return if a given locale is allowed
 */
export function isAllowedLocale(locale: string): locale is Config['locale'] {
  return supportedLocales.includes(locale)
}

/**
 * Validate locale, throw if invalid
 */
export function validateLocale(locale: unknown): Config['locale'] {
  if (typeof locale !== 'string' || !isAllowedLocale(locale)) {
    return supportedLocales[0] as Config['locale'] // Return default locale if invalid
  }
  return locale
}
