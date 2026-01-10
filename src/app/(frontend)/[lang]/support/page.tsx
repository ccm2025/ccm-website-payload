import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'

async function loadPage(lang: string) {
  return await fetchGlobal('support-page', validateLang(lang))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const page = await loadPage(lang)

  return {
    title: page.hero_title,
  }
}

export default async function SupportPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const page = await loadPage(lang)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 sm:h-72 md:h-80 items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {typeof page.hero_image === 'object' && (
            <img
              src={page.hero_image.url}
              alt={page.hero_image.nickname}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero_title}
          </h1>
        </div>
      </section>

      {/* Info Sections */}
      <div className="bg-white">
        {page.info_sections.map((section, i) => (
          <section key={section.id} className="py-10 sm:py-14 md:py-16\">
            <div className="container mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
                <div className={`w-full ${i % 2 !== 0 ? 'md:order-last' : ''}`}>
                  {typeof section.image === 'object' && (
                    <img
                      src={section.image.url}
                      alt={section.image.nickname}
                      className="h-auto w-full rounded-xl shadow-lg object-cover"
                    />
                  )}
                </div>

                <div className="text-center md:text-left">
                  <p className="text-sm sm:text-base md:text-base font-semibold text-[rgb(var(--website-theme-color2))] tracking-wide">
                    {section.title}
                  </p>
                  <h2 className="mt-2 mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
                    {section.subtitle}
                  </h2>
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
