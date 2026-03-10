'use client'

import { useMenu } from '@/components/MenuContext'
import type { Global, Media } from '@/payload-types'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { LangButton } from './LangButton'
import { NavList } from './NavList'
import { StyledText } from './StyledText'

interface LayoutClientProps {
  locale: string
  data: Global | null
  children: React.ReactNode
}

export function LayoutClient({ locale, data, children }: LayoutClientProps) {
  const { isMenuOpen, toggleMenu } = useMenu()

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        toggleMenu()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen, toggleMenu])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const nav = data?.navigation
  const footer = data?.footer
  const logoUrl =
    nav?.logo && typeof nav.logo === 'object' ? ((nav.logo as Media).url ?? undefined) : undefined

  const siteTitle = 'CCM' // You can add this to Global config later
  const siteTitleEn = 'Campus Christian Movement'

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex h-20 sm:h-24 md:h-25 items-center justify-between">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center space-x-2 sm:space-x-3">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={siteTitleEn}
                  className="rounded-full"
                  style={{ width: '120px', height: '120px' }}
                />
              ) : (
                <img
                  src="/logo.jpg"
                  alt={siteTitleEn}
                  className="rounded-full"
                  style={{ width: '120px', height: '120px' }}
                />
              )}
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-medium tracking-wider text-[rgb(var(--website-theme-color1))]">
                  {locale === 'zh-Hans' ? '学园传道会' : siteTitle}
                </div>
                <div className="text-[10px] sm:text-xs font-medium tracking-wider text-[rgb(var(--website-theme-color1))]">
                  {siteTitleEn}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center space-x-8 md:space-x-12 lg:space-x-16 md:flex">
              <LangButton />
              <button
                className="flex items-center space-x-2 text-xl md:text-2xl font-bold text-[rgb(var(--website-theme-color1))] transition-colors duration-300 hover:text-[rgb(var(--website-theme-color1)/0.8)]"
                onClick={toggleMenu}
                aria-label="Open menu"
              >
                <span>Menu</span>
                <Menu className="w-9 h-9 md:w-11 md:h-11" />
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <nav className="items-center space-x-16 md:hidden">
              <button
                className="flex items-center space-x-2 text-xl font-bold text-[rgb(var(--website-theme-color1))] transition-colors duration-300 hover:text-[rgb(var(--website-theme-color1)/0.8)]"
                onClick={toggleMenu}
                aria-label="Open menu"
              >
                <Menu className="w-9 h-9" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {children}

      {/* Footer */}
      <footer className="bg-[rgb(var(--website-theme-color1))] text-gray-200">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-14">
          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:gap-12 text-center md:grid-cols-2 md:text-left lg:grid-cols-4">
            <div className="flex flex-col items-center md:items-start">
              <Link href={`/${locale}`} className="flex items-center space-x-3">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={siteTitleEn}
                    className="rounded-full bg-white"
                    width="40"
                    height="40"
                  />
                ) : (
                  <img
                    src="/logo.jpg"
                    alt={siteTitleEn}
                    className="rounded-full bg-white"
                    width="40"
                    height="40"
                  />
                )}
                <div>
                  <div className="text-lg font-bold leading-tight text-white">
                    {locale === 'zh-Hans' ? '学园传道会' : siteTitle}
                  </div>
                  <div className="text-xs font-medium tracking-wider text-gray-200">
                    {siteTitleEn}
                  </div>
                </div>
              </Link>
              <div className="mb-6 mt-4 h-1 w-24 rounded bg-[rgb(var(--website-theme-color2))]"></div>

              {/* Social Media Icons */}
              {footer?.socialMedia && footer.socialMedia.length > 0 && (
                <div className="flex space-x-4">
                  {footer.socialMedia.map((item) => {
                    const iconClass =
                      'flex h-12 w-12 items-center justify-center rounded-full text-white transition-opacity hover:opacity-90'
                    const instagramClass = `${iconClass} bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600`
                    const youtubeClass = `${iconClass} bg-red-600`
                    const facebookClass = `${iconClass} bg-blue-600`
                    const twitterClass = `${iconClass} bg-blue-400`
                    const linkedinClass = `${iconClass} bg-blue-700`

                    return (
                      <a
                        key={item.id ?? item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.platform}
                        className={
                          item.platform === 'instagram'
                            ? instagramClass
                            : item.platform === 'youtube'
                              ? youtubeClass
                              : item.platform === 'facebook'
                                ? facebookClass
                                : item.platform === 'twitter'
                                  ? twitterClass
                                  : item.platform === 'linkedin'
                                    ? linkedinClass
                                    : iconClass
                        }
                      >
                        {item.platform === 'instagram' && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                          </svg>
                        )}
                        {item.platform === 'youtube' && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
                          </svg>
                        )}
                        {item.platform === 'facebook' && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        )}
                        {item.platform === 'twitter' && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        )}
                        {item.platform === 'linkedin' && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        )}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer Description */}
            {footer?.description && (
              <div>
                <h3 className="mb-4 text-xl font-bold text-white">About</h3>
                <div className="text-gray-300">
                  <StyledText data={footer.description} />
                </div>
              </div>
            )}

            {/* Contact Info */}
            {footer?.contactInfo && (
              <div>
                <h3 className="mb-4 text-xl font-bold text-white">Contact</h3>
                <div className="space-y-2 text-gray-300">
                  {footer.contactInfo.address && <p>{footer.contactInfo.address}</p>}
                  {footer.contactInfo.phone && <p>{footer.contactInfo.phone}</p>}
                  {footer.contactInfo.email && (
                    <p>
                      <a
                        href={`mailto:${footer.contactInfo.email}`}
                        className="hover:text-white hover:underline"
                      >
                        {footer.contactInfo.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Links */}
            {nav?.menuItems && nav.menuItems.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-bold text-white">Navigation</h3>
                <nav className="space-y-2">
                  <NavList items={nav.menuItems} locale={locale} />
                </nav>
              </div>
            )}
          </div>

          {/* Copyright */}
          {footer?.copyrightText && (
            <div className="mt-8 border-t border-gray-600 pt-8 text-center text-gray-300">
              <p>{footer.copyrightText}</p>
            </div>
          )}
        </div>
      </footer>

      {/* Side Menu Overlay */}
      {isMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu overlay"
            className="fixed inset-0 z-40 cursor-default bg-black/40"
            onClick={toggleMenu}
            tabIndex={0}
          />

          {/* Mobile Menu (slides from top) */}
          <div className="fixed left-0 right-0 top-0 z-50 transform bg-[rgb(var(--website-theme-color2))] shadow-lg transition-transform duration-300 ease-in-out md:hidden">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-end">
                <button onClick={toggleMenu} className="p-2 text-white" aria-label="Close menu">
                  <X className="w-9 h-9" />
                </button>
              </div>

              <LangButton variant="menu" />

              <hr className="my-4 sm:my-5" />

              <nav className="flex flex-col space-y-3 sm:space-y-4 text-xl sm:text-2xl text-white">
                <NavList items={nav?.menuItems} locale={locale} onItemClick={toggleMenu} />
              </nav>
            </div>
          </div>

          {/* Desktop Menu (slides from right) */}
          <div className="fixed right-0 top-0 z-50 hidden h-full w-80 max-w-sm bg-[rgb(var(--website-theme-color2))] md:block">
            <div className="p-8 lg:p-12">
              <div className="mb-2 flex items-center justify-end">
                <button onClick={toggleMenu} className="p-2 text-white" aria-label="Close menu">
                  <X className="w-11 h-11" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4 text-xl lg:text-2xl text-white">
                <NavList items={nav?.menuItems} locale={locale} onItemClick={toggleMenu} />
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
