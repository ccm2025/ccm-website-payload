import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLocale } from '@/lib'
import { Metadata } from 'next'

async function loadPage(locale: string) {
  return await fetchGlobal('volunteer-page', validateLocale(locale))
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

export default async function VolunteerPage({ params }: { params: Promise<{ locale: string }> }) {
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

      {/* Content Section */}
      <section className="bg-white my-8 sm:my-12 md:my-16 lg:my-20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          {page.infoSections.map((section, i) => (
            <div
              key={i}
              className={`text-center ${i > 0 ? 'mt-12 sm:mt-16 md:mt-20 lg:mt-24' : ''}`}
            >
              <div className="max-w-4xl mx-auto">
                <StyledText data={section.content} />
              </div>

              {section.buttonText && section.buttonUrl && (
                <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                  <a
                    href={section.buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 sm:px-8 sm:py-3.5 md:px-10 md:py-4 lg:px-12 lg:py-4 text-sm sm:text-base md:text-lg font-semibold text-white bg-[rgb(var(--website-theme-color1))] rounded-lg shadow-lg transition-all duration-200 ease-in-out hover:bg-[rgb(var(--website-theme-color2))] hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--website-theme-color1))] active:scale-95"
                  >
                    {section.buttonText}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
