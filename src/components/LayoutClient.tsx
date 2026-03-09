'use client'

import type { Global, Media } from '@/payload-types'
import Link from 'next/link'
import { useMenu } from '@/lib/MenuContext'
import { StyledText } from './StyledText'

interface LayoutClientProps {
  lang: string
  data: Global | null
  children: React.ReactNode
}

export function LayoutClient({ lang, data, children }: LayoutClientProps) {
  const { isMenuOpen, toggleMenu } = useMenu()

  const nav = data?.navigation
  const footer = data?.footer
  const logoUrl =
    nav?.logo && typeof nav.logo === 'object' ? ((nav.logo as Media).url ?? undefined) : undefined

  return (
    <>
      <header>
        <nav>
          <Link href={`/${lang}`}>
            {logoUrl ? (
              <img src={logoUrl} alt="Site logo" style={{ height: 40 }} />
            ) : (
              <span>CCM</span>
            )}
          </Link>

          <button onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen ? '✕' : '☰'}
          </button>

          <ul style={{ display: isMenuOpen ? 'flex' : undefined }}>
            {nav?.menuItems?.map((item) => (
              <li key={item.id ?? item.href}>
                <Link
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        {footer?.description && (
          <StyledText data={footer.description as Parameters<typeof StyledText>[0]['data']} />
        )}

        {footer?.contactInfo && (
          <div>
            {footer.contactInfo.address && <p>{footer.contactInfo.address}</p>}
            {footer.contactInfo.phone && <p>{footer.contactInfo.phone}</p>}
            {footer.contactInfo.email && (
              <p>
                <a href={`mailto:${footer.contactInfo.email}`}>{footer.contactInfo.email}</a>
              </p>
            )}
          </div>
        )}

        {footer?.socialMedia && footer.socialMedia.length > 0 && (
          <ul>
            {footer.socialMedia.map((item) => (
              <li key={item.id ?? item.url}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.platform}
                </a>
              </li>
            ))}
          </ul>
        )}

        {footer?.copyrightText && <p>{footer.copyrightText}</p>}
      </footer>
    </>
  )
}
