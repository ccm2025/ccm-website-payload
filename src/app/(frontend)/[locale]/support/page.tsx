import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLocale } from '@/lib'
import { Metadata } from 'next'

async function loadPage(locale: string) {
  return await fetchGlobal('support-page', validateLocale(locale))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = await loadPage(locale)

  return {
    title: page.hero.title,
  }
}

export default async function SupportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await loadPage(locale)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 sm:h-72 md:h-80 items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {typeof page.hero.backgroundImage === 'object' && (
            <img
              src={page.hero.backgroundImage.url}
              alt={page.hero.backgroundImage.alt}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero.title}
          </h1>
        </div>
      </section>

      {/* Info Sections */}
      <div className="bg-white">
        {page.infoSections.map((section, i) => (
          <section key={section.id} className="my-10 sm:my-14 md:my-16">
            <div className="container mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
                <div className={`w-full ${i % 2 !== 0 ? 'md:order-last' : ''}`}>
                  {section.image && typeof section.image === 'object' && (
                    <img
                      src={section.image.url}
                      alt={section.image.alt}
                      className="h-auto w-full rounded-xl shadow-lg object-cover"
                    />
                  )}
                </div>

                <div className="text-center md:text-left">
                  <StyledText data={section.content} />
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
