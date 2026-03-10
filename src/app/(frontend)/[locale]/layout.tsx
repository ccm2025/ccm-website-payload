import { LayoutClient } from '@/components/LayoutClient'
import { fetchGlobal, isAllowedLocale, validateLocale } from '@/lib'
import { MenuProvider } from '@/lib/MenuContext'
import { redirect } from 'next/navigation'

async function loadPage(locale: string) {
  return await fetchGlobal('global', validateLocale(locale))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isAllowedLocale(locale)) {
    return redirect('/en')
  }

  const page = await loadPage(locale)

  return (
    <MenuProvider>
      <LayoutClient locale={locale} data={page}>
        {children}
      </LayoutClient>
    </MenuProvider>
  )
}
