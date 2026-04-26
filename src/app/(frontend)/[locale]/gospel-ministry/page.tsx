import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLocale } from '@/lib'
import { Metadata } from 'next'

async function loadPage(locale: string) {
  return await fetchGlobal('gospel-ministry-page', validateLocale(locale))
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

export default async function GospelMinistryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await loadPage(locale)

  return (
    <main>
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

      <section className="bg-white my-12 sm:my-16 md:my-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 md:px-8 text-center">
          {page.intro && (
            <div className="mt-6 mx-auto max-w-4xl">
              <StyledText data={page.intro} />
            </div>
          )}
        </div>
      </section>

      <div className="bg-white pb-12 sm:pb-16 md:pb-20">
        {page.infoSections?.map((section, i) => (
          <section key={section.id} className="my-10 sm:my-14 md:my-16">
            <div className="container mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
                <div className={`w-full ${i % 2 !== 0 ? 'md:order-last' : ''}`}>
                  {section.image && typeof section.image === 'object' && (
                    <img
                      src={section.image.url}
                      alt={section.image.alt}
                      className="h-auto w-full rounded-xl object-cover shadow-lg"
                    />
                  )}
                </div>

                <div className="text-center md:text-left">
                  <StyledText data={section.content} />
                  {section.buttonText && section.buttonUrl && (
                    <a
                      href={
                        section.buttonUrl.startsWith('http')
                          ? section.buttonUrl
                          : `/${locale}${section.buttonUrl}`
                      }
                      target={section.buttonUrl.startsWith('http') ? '_blank' : '_self'}
                      rel={section.buttonUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="mt-6 sm:mt-7 md:mt-8 inline-block rounded-lg bg-[rgb(var(--website-theme-color1))] px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-white transition-colors duration-300 hover:bg-[rgb(var(--website-theme-color2))]"
                    >
                      {section.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}
