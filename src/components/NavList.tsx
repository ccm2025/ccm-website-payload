'use client'

import { type Global } from '@/payload-types'
import Link from 'next/link'

interface NavListProps {
  items: Global['navigation']['menuItems']
  locale: string
  onItemClick?: () => void
  columns?: number // number of columns to display items in, if not provided, all items will be in one column
  textColor?: string // custom text color class, if not provided, defaults to text-gray-300
}

export function NavList({
  items,
  locale,
  onItemClick,
  columns,
  textColor = 'text-white',
}: NavListProps) {
  if (!items || items.length === 0) {
    return null
  }

  if (!columns || columns === 1) {
    return (
      <>
        {items.map((item, idx) => (
          <Link
            key={item.id || idx}
            href={item.href.startsWith('/') ? `/${locale}${item.href}` : item.href}
            className={`block ${textColor} hover:text-white hover:underline`}
            onClick={onItemClick}
          >
            {item.label}
          </Link>
        ))}
      </>
    )
  }

  // Calculate items per column (distribute evenly)
  const itemsPerColumn = Math.ceil(items.length / columns)

  // Distribute items into columns
  const columnArrays: (typeof items)[] = []
  for (let i = 0; i < columns; i++) {
    const startIndex = i * itemsPerColumn
    const endIndex = startIndex + itemsPerColumn
    columnArrays.push(items.slice(startIndex, endIndex))
  }

  return (
    <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {columnArrays.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col space-y-1 sm:space-y-2">
          {column.map((item, idx) => (
            <Link
              key={item.id || `${colIndex}-${idx}`}
              href={item.href.startsWith('/') ? `/${locale}${item.href}` : item.href}
              className={`block ${textColor} hover:text-white hover:underline`}
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}
