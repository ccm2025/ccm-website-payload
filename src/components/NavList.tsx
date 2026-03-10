'use client'

import { type Global } from '@/payload-types'
import Link from 'next/link'

interface NavListProps {
  items: Global['navigation']['menuItems']
  locale: string
  onItemClick?: () => void
}

export function NavList({ items, locale, onItemClick }: NavListProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <>
      {items.map((item, idx) => (
        <Link
          key={item.id || idx}
          href={item.href.startsWith('/') ? `/${locale}${item.href}` : item.href}
          className="block text-gray-300 hover:text-white hover:underline"
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
          onClick={onItemClick}
        >
          {item.label}
        </Link>
      ))}
    </>
  )
}
