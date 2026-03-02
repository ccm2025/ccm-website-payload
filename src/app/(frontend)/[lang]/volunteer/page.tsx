import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'

async function loadPage(lang: string) {
  return await fetchGlobal('volunteer-page', validateLang(lang))
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

export default async function VolunteerPage({ params }: { params: Promise<{ lang: string }> }) {
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

      {/* Content Section */}
      <section className="bg-white py-10 sm:py-14 md:py-16">
        <div className="container mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16 text-center">
          <p className="text-sm sm:text-base md:text-base font-semibold text-[rgb(var(--website-theme-color2))] tracking-wide">
            {page.introduction_subtitle}
          </p>
          <p className="mt-2 mb-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
            {page.introduction_title}
          </p>

          <StyledText data={page.introduction_content} />

          {page.application_button_url && (
            <div className="mt-8 sm:mt-9 md:mt-10 flex flex-col items-center">
              <a
                href={page.application_button_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-[rgb(var(--website-theme-color1))] px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 text-base sm:text-lg md:text-lg font-semibold text-white shadow-lg transition-colors hover:bg-[rgb(var(--website-theme-color2))] hover:shadow-xl"
              >
                {page.application_button_text}
              </a>
            </div>
          )}

          <div className="mt-12 sm:mt-14 md:mt-16">
            <h2 className="mb-6 text-xl sm:text-2xl md:text-3xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
              {page.volunteer_title}
            </h2>
            <StyledText data={page.volunteer_content} />
          </div>
        </div>
      </section>
    </main>
  )
}
