import { LayoutClient } from '@/components/LayoutClient'
import { fetchGlobal, isAllowedLang, validateLang } from '@/lib'
import { LangProvider } from '@/lib/LangContext'
import { MenuProvider } from '@/lib/MenuContext'
import { redirect } from 'next/navigation'

async function loadPage(lang: string) {
  return await fetchGlobal('global', validateLang(lang))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  if (!isAllowedLang(lang)) {
    return redirect('/en')
  }

  const page = await loadPage(lang)

  return (
    <MenuProvider>
      <LangProvider lang={lang}>
        <LayoutClient lang={lang} data={page}>
          {children}
        </LayoutClient>
      </LangProvider>
    </MenuProvider>
  )
}
