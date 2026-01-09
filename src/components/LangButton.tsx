'use client'

import { useLang } from '@/lib/LangContext'
import { Languages } from 'lucide-react'
import Link from 'next/link'

interface LangButtonProps {
  variant?: 'header' | 'menu'
}

export function LangButton({ variant = 'header' }: LangButtonProps) {
  const { otherLang, buildHref } = useLang()

  if (!otherLang) return null

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
      href={buildHref(otherLang)}
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={`Switch to ${langLabels[otherLang]}`}
    >
      <Languages
        className={`transition-transform duration-300 group-hover:rotate-12 ${variant === 'header' ? 'w-4 h-4 sm:w-5 sm:h-5' : 'w-5 h-5'}`}
      />
      <span className={variant === 'header' ? 'hidden xs:inline sm:inline' : ''}>
        {langLabels[otherLang]}
      </span>
    </Link>
  )
}
