import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLocale } from '@/lib'
import { Metadata } from 'next'
import Link from 'next/link'

async function loadPage(locale: string) {
  return await fetchGlobal('home-page', validateLocale(locale))
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

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await loadPage(locale)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-[calc(100vh-80px)] min-h-125 items-center justify-center text-center text-white">
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
        <div className="relative z-10 px-4 sm:px-6 md:px-8 text-left">
          <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero.title}
          </h1>
          <StyledText data={page.hero.subtitle} />
          <Link
            className="mt-10 sm:mt-12 md:mt-14 inline-block rounded-full border-2 border-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-[rgb(var(--website-theme-color2))]"
            href={`/${locale}/plan-your-visit`}
            aria-label={page.hero.buttonText}
          >
            {page.hero.buttonText}
          </Link>
        </div>
      </section>

      {/* Intro Section Part 1 */}
      <section className="bg-white my-12 sm:my-16 md:my-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 text-center">
          <StyledText data={page.intro.part1} />
        </div>
      </section>

      {/* Video Section */}
      {page.intro.videoUrl && (
        <section className="bg-[rgb(var(--website-theme-color1))] my-12 sm:my-16 md:my-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mx-auto max-w-4xl rounded-lg border border-gray-700 bg-gray-900/80 p-3 sm:p-4 md:p-5 shadow-2xl backdrop-blur-sm">
              <div className="aspect-video overflow-hidden rounded-md bg-black/80">
                <iframe
                  loading="lazy"
                  className="aspect-video w-full"
                  src={page.intro.videoUrl}
                  title="YouTube video player"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Intro Section Part 2 */}
      <section className="bg-white my-12 sm:my-16 md:my-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 text-center">
          <StyledText data={page.intro.part2} />
        </div>
      </section>

      {/* Meet With Us Section */}
      <section className="bg-white my-12 sm:my-16 md:my-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider">
            {page.meet.title}
          </h2>
          <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {page.meet.cards.map((card) => (
              <Link
                key={card.id}
                href={`/${locale}/${card.slug}`}
                className="group relative flex h-56 sm:h-60 md:h-64 overflow-hidden rounded-lg shadow-lg"
              >
                <div className="absolute inset-0">
                  {typeof card.image === 'object' && (
                    <img
                      src={card.image.url}
                      alt={card.image.alt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <div className="relative flex h-full w-full flex-col items-center justify-center p-4 text-center text-white">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-widest">{card.title}</h3>
                  <div className="mt-4 rounded-full border-2 border-white px-6 py-2 text-sm font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Learn More
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-12 sm:mt-14 md:mt-16 text-center text-lg sm:text-xl md:text-2xl">
            <StyledText data={page.intro.conclusion} />
          </div>
        </div>
      </section>
    </main>
  )
}
