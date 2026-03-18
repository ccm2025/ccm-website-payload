import { DonationForm } from '@/components/DonationForm'
import { StyledText } from '@/components/StyledText'
import { fetchGlobal, validateLocale } from '@/lib'
import { Download } from 'lucide-react'
import { Metadata } from 'next'

async function loadPage(locale: string) {
  return await fetchGlobal('give-page', validateLocale(locale))
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

export default async function GivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await loadPage(locale)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 sm:h-72 md:h-80 items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {typeof page.hero.backgroundImage === 'object' && (
            <img
              src={page.hero.backgroundImage.url}
              alt={page.hero.backgroundImage.alt}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero.title}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white my-12 sm:my-16 md:my-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8 text-center">
          <div className="max-w-none space-y-4 text-center text-base sm:text-lg">
            <StyledText data={page.intro} />
          </div>
        </div>
      </section>

      {/* Donation Options Section */}
      <section className="bg-white my-12 sm:my-16 md:my-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-2 md:gap-12 lg:gap-14">
            <div className="space-y-8 sm:space-y-9 md:space-y-10">
              <StyledText data={page.payment_methods} />
            </div>
            <div className="space-y-8 sm:space-y-9 md:space-y-10">
              <DonationForm lang={locale} />
            </div>
          </div>
        </div>
      </section>

      {/* PDF Section */}
      {page.letters &&
        page.letters.pdfs.length > 1 &&
        typeof page.letters.pdfs[0].file === 'object' &&
        typeof page.letters.pdfs[1].file === 'object' && (
          <>
            <section className="bg-gray-50 py-12 sm:py-16 md:py-20">
              <div className="container mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
                <div className="aspect-video overflow-hidden rounded-lg shadow-lg md:aspect-17/11">
                  <iframe
                    src={
                      locale === 'zh-Hans'
                        ? page.letters.pdfs[0].file.url
                        : page.letters.pdfs[1].file.url
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
                  {page.letters.pdfs.map((pdf, idx) => {
                    if (typeof pdf.file !== 'object') return null
                    return (
                      <li key={idx}>
                        <a
                          href={pdf.file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-lg border border-gray-200 p-4 sm:p-5 transition-colors hover:bg-gray-50"
                        >
                          <span className="text-base sm:text-lg font-medium">{pdf.title}</span>
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
