import { StyledText } from '@/components/StyledText'
import { fetch, getMedia } from '@/lib'
import { getValidatedLang, getValidatedSlug } from '@/lib/validation'
import type { Event } from '@/payload-types'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function loadPage(lang: string, slug: string) {
  const res = await fetch<Event[]>({
    endpoint: 'events',
    params: {
      locale: lang,
      filters: { slug: { $eq: slug } },
    },
    callback: (data: any) => [
      {
        ...data[0],
        hero_image: getMedia(data[0].hero_image, 'Event image'),
        content_image: getMedia(data[0].content_image, 'Event content image'),
      },
    ],
  })

  if (!res || res.length === 0) return null
  return res[0]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const p = await params
  const lang = getValidatedLang(p)
  const slug = getValidatedSlug(p)
  const page = await loadPage(lang, slug)
  if (!page) return {}
  return { title: page.title }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const p = await params
  const lang = getValidatedLang(p)
  const slug = getValidatedSlug(p)
  const page = await loadPage(lang, slug)

  if (!page) return notFound()

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 items-center justify-center text-center text-white md:h-80">
        <div className="absolute inset-0">
          <Image
            src={page.hero_image.url}
            alt={page.hero_image.alt}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold uppercase tracking-tight md:text-6xl">{page.title}</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-8">
            <Link
              href={`/${lang}/events`}
              className="inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--website-theme-color1))] px-4 py-2 font-semibold text-white transition-colors duration-300 hover:bg-[rgb(var(--website-theme-color2))]"
            >
              ← {lang === 'zh-Hans' ? '返回' : 'Back'}
            </Link>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold uppercase tracking-tight md:text-4xl">
              {page.title}
            </h2>
          </div>

          <StyledText data={page.content} />

          {page.content_image && (
            <Image
              src={page.content_image.url}
              alt={page.content_image.alt}
              width={800}
              height={500}
              className="mt-8 w-full rounded-lg shadow-md"
            />
          )}

          {page.content_video_url && (
            <iframe
              src={page.content_video_url}
              title="Event Video"
              className="mt-8 aspect-video w-full rounded-lg shadow-md"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </section>
    </main>
  )
}
