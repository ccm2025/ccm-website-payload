'use client'

import React from 'react'
import Link from 'next/link'

interface NavListProps {
  data: { text: string; slug: string }[]
  lang: string
  onItemClick?: () => void
}

export function NavList({ data, lang, onItemClick }: NavListProps) {
  return (
    <>
      {data.map(({ text, slug }, index) => (
        <Link
          key={index}
          href={`/${lang}/${slug[0] === '/' ? slug.slice(1) : slug}`}
          onClick={onItemClick}
          className="hover:text-[rgb(var(--website-theme-color1))]"
        >
          {text}
        </Link>
      ))}
    </>
  )
}
