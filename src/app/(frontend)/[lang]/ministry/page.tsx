import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'
import Image from 'next/image'

async function loadPage(lang: string) {
  return await fetchGlobal('ministry-page', validateLang(lang))
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

export default async function MinistryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const page = await loadPage(lang)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 items-center justify-center text-center text-white md:h-80">
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
        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold uppercase tracking-tight md:text-6xl">
            {page.hero_title}
          </h1>
        </div>
      </section>

      {/* Info Sections */}
      <div className="bg-white">
        {page.info_sections.map((section, i) => (
          <section key={section.id} className="py-8 md:py-10">
            <div className="container mx-auto px-4">
              <div
                className={`grid gap-8 md:gap-12 ${
                  i % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-2 md:grid-flow-dense'
                }`}
              >
                <div className={i % 2 === 0 ? '' : 'md:col-span-1 md:col-start-2'}>
                  <Image
                    src={section.image.url}
                    alt={section.image.alt}
                    width={600}
                    height={400}
                    className="mx-auto rounded-lg shadow-lg"
                  />
                </div>

                <div className="text-center md:text-left">
                  <h2 className="mt-1 mb-6 text-3xl font-bold text-[rgb(var(--website-theme-color1))] md:text-4xl">
                    {section.title}
                  </h2>
                  <StyledText data={section.content} />

                  {section.button_text && section.button_url && (
                    <a
                      href={section.button_url}
                      rel="noopener noreferrer"
                      className="mt-6 inline-block rounded-lg bg-[rgb(var(--website-theme-color1))] px-8 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[rgb(var(--website-theme-color2))]"
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
