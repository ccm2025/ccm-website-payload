import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLocale } from '@/lib'
import { Metadata } from 'next'

async function loadPage(locale: string) {
  return await fetchGlobal('plan-your-visit-page', validateLocale(locale))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = await loadPage(locale)

  return {
    title: page.hero.hero_title,
  }
}

export default async function PlanYourVisitPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const page = await loadPage(locale)

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

      {/* Intro Section */}
      <section className="bg-white py-8 sm:py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 md:px-8 text-center">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(var(--website-theme-color2))]">
              {page.introduction.introduction_subtitle}
            </h2>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
              {page.introduction.introduction_title}
            </p>
          </div>
          {page.introduction.introduction_content.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10"
            >
              <div className="space-y-2 sm:space-y-3 md:space-y-4 md:col-span-3">
                <StyledText data={item.content} />
              </div>
              <div className="flex justify-center md:justify-end md:col-span-2">
                {typeof item.image === 'object' && (
                  <img
                    src={item.image.url}
                    alt={item.image.alt}
                    className="h-auto w-full rounded-xl shadow-lg object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-[rgb(var(--website-theme-color1))] text-white">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="h-auto w-full">
            <iframe
              src={page.location.location_map_link}
              style={{ border: 0, width: '100%', aspectRatio: '1' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16">
            <StyledText data={page.location.location_description} />
          </div>
        </div>
      </section>

      {/* Hours Section */}
      <section className="bg-white py-12 sm:py-16 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
            {page.hours.hours_title}
          </h2>
          <div className="mx-auto mt-12 sm:mt-14 md:mt-16 space-y-12 sm:space-y-14 md:space-y-16">
            {page.hours.hours_content.map((item, i) => (
              <div
                key={item.id}
                className="grid grid-cols-1 md:grid-cols-5 items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10"
              >
                <div
                  className={`flex justify-center md:col-span-2 ${i % 2 === 1 ? 'md:order-2' : ''}`}
                >
                  {typeof item.image === 'object' && (
                    <img
                      src={item.image.url}
                      alt={item.image.alt}
                      className="h-auto w-full rounded-xl shadow-lg object-cover"
                    />
                  )}
                </div>
                <div
                  className={`space-y-2 sm:space-y-3 md:space-y-4 md:col-span-3 ${i % 2 === 1 ? 'md:order-1' : ''}`}
                >
                  <StyledText data={item.content} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
