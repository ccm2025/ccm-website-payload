'use client'

import { useMenu } from '@/lib/MenuContext'
import type { Config, Global } from '@/payload-types'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { LangButton } from './LangButton'
import { NavList } from './NavList'

interface LayoutClientProps {
  lang: Config['locale']
  data: Global
  children: React.ReactNode
}

export function LayoutClient({ lang, data, children }: LayoutClientProps) {
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

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex h-20 sm:h-24 md:h-25 items-center justify-between">
            {/* Logo */}
            <Link href={`/${lang}`} className="flex items-center space-x-2 sm:space-x-3">
              <img
                src="/logo.jpg"
                alt={data.website_title_en}
                className="rounded-full"
                width="120"
                height="120"
              />
              <div>
                <div className="text-lg sm:text-xl md:text-2xl font-medium tracking-wider text-[rgb(var(--website-theme-color1))]">
                  {data.website_title_cn}
                </div>
                <div className="text-[10px] sm:text-xs font-medium tracking-wider text-[rgb(var(--website-theme-color1))]">
                  {data.website_title_en}
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
              <Link href={`/${lang}`} className="flex items-center space-x-3">
                <img
                  src="/logo.jpg"
                  alt={data.website_title_en}
                  className="rounded-full bg-white"
                  width="40"
                  height="40"
                />
                <div>
                  <div className="text-lg font-bold leading-tight text-white">
                    {data.website_title_cn}
                  </div>
                  <div className="text-xs font-medium tracking-wider text-gray-200">
                    {data.website_title_en}
                  </div>
                </div>
              </Link>
              <div className="mb-6 mt-4 h-1 w-24 rounded bg-[rgb(var(--website-theme-color2))]"></div>
              <div className="flex space-x-4">
                <a
                  href={data.instagram_url || '/'}
                  aria-label="Instagram"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-yellow-400 via-red-500 to-purple-600 text-white transition-opacity hover:opacity-90"
                >
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
                </a>
                <a
                  href={data.youtube_url || '/'}
                  aria-label="YouTube"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white transition-opacity hover:opacity-90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">{data.contact_title}</h3>
              <div className="space-y-2 text-gray-300">
                <p>{data.address}</p>
                <p>{data.email}</p>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">{data.nav_title}</h3>
              <nav className="space-y-2">
                {data.nav.slice(0, 4).map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/${lang}/${item.slug[0] === '/' ? item.slug.slice(1) : item.slug}`}
                    className="block text-gray-300 hover:text-white hover:underline"
                  >
                    {item.text}
                  </Link>
                ))}
              </nav>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-bold text-white">{data.involve_title}</h3>
              <nav className="space-y-2">
                {data.nav.slice(4, 8).map((item, idx) => (
                  <Link
                    key={idx}
                    href={`/${lang}/${item.slug[0] === '/' ? item.slug.slice(1) : item.slug}`}
                    className="block text-gray-300 hover:text-white hover:underline"
                  >
                    {item.text}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
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
                <button onClick={toggleMenu} className="p-2" aria-label="Close menu">
                  <X className="w-9 h-9" />
                </button>
              </div>

              <LangButton variant="menu" />

              <hr className="my-4 sm:my-5" />

              <nav className="flex flex-col space-y-3 sm:space-y-4 text-xl sm:text-2xl text-white">
                <NavList data={data.nav} lang={lang} onItemClick={toggleMenu} />
              </nav>
            </div>
          </div>

          {/* Desktop Menu (slides from right) */}
          <div className="fixed right-0 top-0 z-50 hidden h-full w-80 max-w-sm bg-[rgb(var(--website-theme-color2))] md:block">
            <div className="p-8 lg:p-12">
              <div className="mb-2 flex items-center justify-end">
                <button onClick={toggleMenu} className="p-2" aria-label="Close menu">
                  <X className="w-11 h-11" />
                </button>
              </div>
              <nav className="flex flex-col space-y-4 text-xl lg:text-2xl text-white">
                <NavList data={data.nav} lang={lang} onItemClick={toggleMenu} />
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
