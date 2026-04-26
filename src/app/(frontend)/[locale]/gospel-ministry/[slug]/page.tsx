import { StyledText } from '@/components/StyledText'
import { fetchCollection, validateLocale } from '@/lib'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function loadPage(locale: string, slug: string) {
  const events = await fetchCollection('ministries', validateLocale(locale), {
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })
  if (events.length === 0) return null
  return events[0]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await loadPage(locale, slug)

  return {
    title: page?.hero.title ?? 'Gospel Ministry',
  }
}

export default async function MinistryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const page = await loadPage(locale, slug)

  if (!page) return notFound()

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
          {/* Back Link */}
          <Link
            href={`/${locale}/gospel-ministry`}
            className="mb-8 inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--website-theme-color1))] px-4 py-2 font-semibold text-white transition-colors hover:bg-[rgb(var(--website-theme-color2))]"
          >
            ← {locale === 'zh-Hans' ? '返回' : 'Back'}
          </Link>

          {page.intro && (
            <div className="mt-6 mx-auto max-w-4xl">
              <StyledText data={page.intro} />
            </div>
          )}
        </div>
      </section>

      <div className="bg-white pb-12 sm:pb-16 md:pb-20">
        {page.infoSections?.map((section) => (
          <section key={section.id} className="my-10 sm:my-14 md:my-16">
            <div className="container mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
              <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
                <div className="w-full">
                  {section.image && typeof section.image === 'object' && (
                    <img
                      src={section.image.url}
                      alt={section.image.alt}
                      className="h-auto w-full rounded-xl object-cover shadow-lg"
                    />
                  )}
                </div>

                <div className="text-center md:text-left">
                  {section.content && <StyledText data={section.content} />}
                  {section.hasButton && section.buttonText && section.buttonUrl && (
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
