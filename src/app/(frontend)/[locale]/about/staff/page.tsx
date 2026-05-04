import { fetchGlobal, validateLocale } from '@/lib'
import { Metadata } from 'next'

async function loadPage(locale: string) {
  return await fetchGlobal('about-page', validateLocale(locale))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const page = await loadPage(locale)

  return {
    title: page.team.title,
  }
}

export default async function StaffPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await loadPage(locale)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 sm:h-72 md:h-80 items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {page.hero.backgroundImage instanceof Object && (
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

      {page.team.members && page.team.members.length > 0 && (
        <section className="bg-white my-12 sm:my-16 md:my-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(var(--website-theme-color2))]">
                {page.team.subtitle}
              </h2>
              <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
                {page.team.title}
              </p>
            </div>

            <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
              {page.team.members.map((member, idx) => {
                const hasPhoto =
                  member?.photo && typeof member.photo === 'object' && member.photo.url
                const isEmpty = !member?.name || !member?.position

                // On narrow screens (below lg) hide placeholder entries completely.
                // On lg+ screens show an empty grid cell for placeholders (no content).
                const wrapperClass = isEmpty ? 'hidden lg:block' : 'text-center'

                return (
                  <div key={member?.id ?? idx} className={wrapperClass}>
                    {!isEmpty && (
                      <>
                        {hasPhoto && member.photo instanceof Object && (
                          <img
                            src={member.photo.url}
                            alt={member.photo.alt}
                            className="mx-auto h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full border-4 border-white object-cover shadow-lg"
                          />
                        )}
                        {!hasPhoto && (
                          <img
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            alt={member.name}
                            className="mx-auto h-32 w-32 sm:h-36 sm:w-36 md:h-40 md:w-40 rounded-full border-4 border-white object-cover shadow-lg"
                          />
                        )}
                        <h3 className="mt-4 sm:mt-5 md:mt-6 text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[rgb(var(--website-theme-color1))]">
                          {member.name}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-[rgb(var(--website-theme-color2))]">
                          {member.position}
                        </p>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
