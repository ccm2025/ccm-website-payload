import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

async function loadPage(lang: string) {
  return await fetchGlobal('home-page', validateLang(lang))
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

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const page = await loadPage(lang)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-[calc(100vh-80px)] min-h-125 items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {typeof page.hero_background_image === 'object' && (
            <Image
              src={page.hero_background_image.url}
              alt={page.hero_background_image.nickname}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-4 sm:px-6 md:px-8 text-left">
          <h1 className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero_title}
          </h1>
          <StyledText data={page.hero_subtitle} as="h2" />
          <Link
            className="mt-10 sm:mt-12 md:mt-14 inline-block rounded-full border-2 border-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold transition-all duration-300 hover:bg-white hover:text-[rgb(var(--website-theme-color2))]"
            href={`/${lang}/plan-your-visit`}
            aria-label={page.hero_button_text}
          >
            {page.hero_button_text}
          </Link>
        </div>
      </section>

      {/* Intro Section Part 1 */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 text-center">
          <StyledText data={page.introduction_part1} as="p" gap={16} />
        </div>
      </section>

      {/* Video Section */}
      {page.introduction_video_url && (
        <section className="bg-[rgb(var(--website-theme-color1))] py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <div className="mx-auto max-w-4xl rounded-lg border border-gray-700 bg-gray-900/80 p-3 sm:p-4 md:p-5 shadow-2xl backdrop-blur-sm">
              <div className="aspect-video overflow-hidden rounded-md bg-black/80">
                <iframe
                  loading="lazy"
                  className="aspect-video w-full"
                  src={page.introduction_video_url}
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
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8 text-center">
          <StyledText data={page.introduction_part2} as="p" gap={12} />
        </div>
      </section>

      {/* Meet With Us Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider">
            {page.meet_title}
          </h2>
          <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {page.meet_cards.map((card) => (
              <Link
                key={card.id}
                href={`/${lang}/${card.slug}`}
                className="group relative flex h-56 sm:h-60 md:h-64 overflow-hidden rounded-lg shadow-lg"
              >
                <div className="absolute inset-0">
                  {typeof card.image === 'object' && (
                    <Image
                      src={card.image.url}
                      alt={card.image.nickname}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
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
            <StyledText data={page.conclusion} />
          </div>
        </div>
      </section>
    </main>
  )
}
