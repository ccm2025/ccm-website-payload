import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'

async function loadPage(lang: string) {
  return await fetchGlobal('thank-you-page', validateLang(lang))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const page = await loadPage(lang)

  return {
    title: page.hero.hero_title,
  }
}

export default async function ThankYouPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const page = await loadPage(lang)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 sm:h-72 md:h-80 items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {typeof page.hero.hero_image === 'object' && (
            <img
              src={page.hero.hero_image.url}
              alt={page.hero.hero_image.alt}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero.hero_title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8 text-center">
          <div className="max-w-none space-y-4 text-center text-base sm:text-lg">
            <h1 className="mb-8 sm:mb-9 md:mb-10 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
              {page.content.content_title}
            </h1>
            <StyledText data={page.content.content} />
          </div>
        </div>
      </section>
    </main>
  )
}
