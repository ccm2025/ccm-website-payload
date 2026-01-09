import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'
import Image from 'next/image'

async function loadPage(lang: string) {
  return await fetchGlobal('freshman-page', validateLang(lang))
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

export default async function FreshmanPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const page = await loadPage(lang)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 sm:h-72 md:h-80 items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {typeof page.hero_image === 'object' && (
            <Image
              src={page.hero_image.url}
              alt={page.hero_image.nickname}
              fill
              className="object-cover"
              priority
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
          <section key={section.id} className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 md:px-8">
              <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                <div className={`w-full ${i % 2 !== 0 ? 'md:order-last' : ''}`}>
                  {typeof section.image === 'object' && (
                    <Image
                      src={section.image.url}
                      alt={section.image.nickname}
                      width={600}
                      height={400}
                      className="h-auto w-full rounded-lg object-cover shadow-lg"
                    />
                  )}
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(var(--website-theme-color2))]">
                    {section.subtitle}
                  </h3>
                  <h2 className="mt-1 mb-4 sm:mb-5 md:mb-6 text-2xl sm:text-3xl md:text-4xl font-bold text-[rgb(var(--website-theme-color1))]">
                    {section.title}
                  </h2>
                  <StyledText data={section.content} />

                  {section.button_text && section.button_url && (
                    <a
                      href={section.button_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 sm:mt-7 md:mt-8 inline-block rounded-lg bg-[rgb(var(--website-theme-color1))] px-6 py-2.5 sm:px-8 sm:py-3 text-sm sm:text-base font-semibold text-white transition-colors duration-300 hover:bg-[rgb(var(--website-theme-color2))]"
                    >
                      {section.button_text}
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
