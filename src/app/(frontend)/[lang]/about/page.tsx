import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'
import { Fragment } from 'react'

async function loadPage(lang: string) {
  return await fetchGlobal('about-page', validateLang(lang))
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

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
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

      {/* Introduction Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 md:px-8 text-center">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(var(--website-theme-color2))]">
            {page.introduction_subtitle}
          </h2>
          <p className="mt-2 mb-6 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-[rgb(var(--website-theme-color1))]">
            {page.introduction_title}
          </p>
          <StyledText data={page.introduction_content} />
        </div>
      </section>

      {/* History Section */}
      {page.history_section && page.history_section.length > 0 && (
        <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(var(--website-theme-color2))]">
                {page.history_subtitle}
              </h2>
              <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
                {page.history_title}
              </p>
            </div>
            <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-12">
              {page.history_section.map((section) => (
                <Fragment key={section.id}>
                  <div className="w-full">
                    {typeof section.image === 'object' && (
                      <img
                        src={section.image.url}
                        alt={section.image.nickname}
                        className="h-auto w-full rounded-lg object-cover shadow-md"
                      />
                    )}
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-6 md:p-8">
                    <StyledText data={section.content} />
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {page.team_section && page.team_section.length > 0 && (
        <section className="bg-white py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(var(--website-theme-color2))]">
                {page.team_subtitle}
              </h2>
              <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
                {page.team_title}
              </p>
            </div>

            <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
              {page.team_section.map((member) => (
                <div key={member.id} className="text-center">
                  {typeof member.avatar === 'object' && (
                    <img
                      src={member.avatar.url}
                      alt={member.avatar.nickname}
                      className="mx-auto h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                  )}
                  <h3 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[rgb(var(--website-theme-color1))]">
                    {member.name}
                  </h3>
                  <p className="mt-2 text-sm sm:text-base text-[rgb(var(--website-theme-color2))]">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
