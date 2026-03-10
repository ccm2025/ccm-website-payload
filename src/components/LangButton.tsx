'use client'

import { supportedLocales } from '@/payload.config'
import { Languages } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface LangButtonProps {
  variant?: 'header' | 'menu'
}

export function LangButton({ variant = 'header' }: LangButtonProps) {
  const [currentLang, setCurrentLang] = useState<string>('')
  const [nextLangUrl, setNextLangUrl] = useState<string>('')

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]
    const lang = supportedLocales.includes(firstSegment) ? firstSegment : supportedLocales[0]
    setCurrentLang(lang)

    const nextLang = supportedLocales.find((l) => l !== lang) || supportedLocales[0]
    const url = `/${nextLang}${window.location.pathname.replace(new RegExp(`^\/(${supportedLocales.join('|')})`), '')}`
    setNextLangUrl(url)
  }, [])

  const langLabels: Record<string, string> = {
    en: 'EN',
    'zh-Hans': '中文',
  }

  const baseClasses =
    'group flex items-center justify-center rounded-lg font-semibold transition-all duration-300'

  const variantClasses = {
    header:
      'space-x-1.5 sm:space-x-2 border-2 border-[rgb(var(--website-theme-color1))] bg-white px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-[rgb(var(--website-theme-color1))] hover:bg-[rgb(var(--website-theme-color1))] hover:text-white',
    menu: 'w-full space-x-2 border-2 border-white bg-white/10 px-4 py-3 text-base text-white hover:bg-white hover:text-[rgb(var(--website-theme-color2))]',
  }

  const nextLang = supportedLocales.find((lang) => lang !== currentLang) || supportedLocales[0]

  return (
    <Link
      href={nextLangUrl}
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={`Switch to ${nextLang}`}
    >
      <Languages
        className={`transition-transform duration-300 group-hover:rotate-12 ${variant === 'header' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5'}`}
      />
      <span className={variant === 'header' ? 'hidden xs:inline sm:inline' : ''}>
        {langLabels[nextLang]}
      </span>
    </Link>
  )
}
