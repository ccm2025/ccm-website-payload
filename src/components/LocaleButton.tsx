'use client'

import { Languages } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const supportedLocales = ['en', 'zh-Hans']

interface LangButtonProps {
  variant?: 'header' | 'menu'
}

export function LocaleButton({ variant = 'header' }: LangButtonProps) {
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState<string>('en')
  const [mounted, setMounted] = useState(false)

  // 同步pathname到currentLocale状态，避免hydration mismatch和路由不同步
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]
    const locale = supportedLocales.includes(firstSegment) ? firstSegment : supportedLocales[0]
    setCurrentLocale(locale)
    setMounted(true)
  }, [pathname])

  const getNextLocale = () => {
    return supportedLocales.find((l) => l !== currentLocale) || supportedLocales[0]
  }

  const getLangUrl = (locale: string) => {
    // 从pathname中移除locale前缀，再添加新的locale
    const pathWithoutLocale =
      pathname.replace(new RegExp(`^\/(${supportedLocales.join('|')})`), '') || '/'
    return `/${locale}${pathWithoutLocale}`
  }

  // 防止hydration mismatch，等待客户端mount后再渲染
  if (!mounted) {
    return null
  }

  const nextLocale = getNextLocale()
  const nextLocaleUrl = getLangUrl(nextLocale)

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

  return (
    <Link
      href={nextLocaleUrl}
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={`Switch to ${nextLocale}`}
    >
      <Languages
        className={`transition-transform duration-300 group-hover:rotate-12 ${variant === 'header' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5'}`}
      />
      <span className={variant === 'header' ? 'hidden xs:inline sm:inline' : ''}>
        {langLabels[nextLocale]}
      </span>
    </Link>
  )
}
