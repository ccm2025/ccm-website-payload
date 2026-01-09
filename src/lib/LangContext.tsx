'use client'

import { ALLOWED_LANGS } from '@/lib/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createContext, useContext, useMemo, type ReactNode } from 'react'

interface LangContextValue {
  currentLang: string
  otherLang: string | null
  buildHref: (targetLang?: string) => string
  switchLang: (targetLang?: string) => void
}

const LangContext = createContext<LangContextValue | undefined>(undefined)

interface LangProviderProps {
  lang: string
  children: ReactNode
}

export function LangProvider({ lang, children }: LangProviderProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const otherLang = useMemo(() => {
    return ALLOWED_LANGS.find((candidate) => candidate !== lang) ?? null
  }, [lang])

  const queryString = searchParams.toString()

  const value = useMemo<LangContextValue>(() => {
    const buildHref = (targetLang = otherLang ?? lang) => {
      const segments = pathname.split('/').filter(Boolean)
      if (segments[0] && ALLOWED_LANGS.includes(segments[0] as (typeof ALLOWED_LANGS)[number])) {
        segments[0] = targetLang
      } else {
        segments.unshift(targetLang)
      }
      const targetPath = `/${segments.join('/')}` || `/${targetLang}`
      return queryString ? `${targetPath}?${queryString}` : targetPath
    }

    const switchLang = (targetLang = otherLang ?? lang) => {
      router.push(buildHref(targetLang))
    }

    return {
      currentLang: lang,
      otherLang,
      buildHref,
      switchLang,
    }
  }, [lang, otherLang, pathname, queryString, router])

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const context = useContext(LangContext)
  if (!context) {
    throw new Error('useLang must be used within a LangProvider')
  }
  return context
}
