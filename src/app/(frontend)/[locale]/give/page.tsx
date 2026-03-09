import { DonationForm } from '@/components/DonationForm'
import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLang } from '@/lib'
import { Download } from 'lucide-react'
import { Metadata } from 'next'

async function loadPage(lang: string) {
  return await fetchGlobal('give-page', validateLang(lang))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const page = await loadPage(lang)

  return {
    title: page.hero.hero_title,
  }
}

export default async function GivePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const page = await loadPage(lang)

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
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero.hero_title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8 text-center">
          <div className="max-w-none space-y-4 text-center text-base sm:text-lg">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-[rgb(var(--website-theme-color2))]">
              {page.content.introduction_subtitle}
            </h2>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
              {page.content.introduction_title}
            </h1>
            <StyledText data={page.content.introduction_content} />
          </div>
        </div>
      </section>

      {/* Donation Options Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
            <div className="space-y-8 sm:space-y-9 md:space-y-10">
              <div>
                <h3 className="mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(var(--website-theme-color1))]">
                  {page.payment_methods.zelle_title}
                </h3>
                <StyledText data={page.payment_methods.zelle_content} />
              </div>
              <div>
                <h3 className="mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(var(--website-theme-color1))]">
                  {page.payment_methods.check_title}
                </h3>
                <StyledText data={page.payment_methods.check_content} />
              </div>
            </div>
            <div className="space-y-8 sm:space-y-9 md:space-y-10">
              <DonationForm lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {/* PDF Section */}
      {page.resources.pdf_links &&
        page.resources.pdf_links.length > 1 &&
        typeof page.resources.pdf_links[0].file === 'object' &&
        typeof page.resources.pdf_links[1].file === 'object' && (
          <>
            <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
              <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
                <div className="aspect-video overflow-hidden rounded-lg shadow-lg md:aspect-17/11">
                  <iframe
                    src={
                      lang === 'zh-Hans'
                        ? page.resources.pdf_links[0].file.url
                        : page.resources.pdf_links[1].file.url
                    }
                    title="Featured PDF"
                    className="h-full w-full border-0"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            </section>

            <section className="bg-white py-12 sm:py-16 md:py-20">
              <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
                <ul className="space-y-4 sm:space-y-5">
                  {page.resources.pdf_links.map((link, idx) => {
                    if (typeof link.file !== 'object') return null
                    return (
                      <li key={idx}>
                        <a
                          href={link.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-gray-200 p-4 sm:p-5 transition-colors hover:bg-gray-50"
                        >
                          <span className="text-base sm:text-lg font-medium">{link.title}</span>
                          <Download size={20} className="text-gray-600" />
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </section>
          </>
        )}
    </main>
  )
}
