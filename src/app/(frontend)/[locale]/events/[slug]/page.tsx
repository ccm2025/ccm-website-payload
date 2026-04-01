import { StyledText } from '@/components/StyledText'
import {
  fetchCollection,
  validateLocale,
  formatEventDateLong,
  formatEventTimeRange,
  getRegistrationLabel,
  isDateBeforeToday,
  isEventOlderThanDays,
  type RegistrationLabels,
} from '@/lib'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { cache } from 'react'

type EventDetailLabels = RegistrationLabels & {
  back: string
  date: string
  time: string
  location: string
  registration: string
  address: string
  registrationButtonText: string
}

const getEventDetailLabels = cache((locale: string): EventDetailLabels => {
  if (locale === 'zh-Hans') {
    return {
      back: '返回活动列表',
      date: '日期',
      time: '时间',
      location: '地点',
      registration: '报名信息',
      address: '地址',
      registrationNotRequired: '无需报名',
      registrationLinkPending: '需报名（链接待更新）',
      registrationRequired: '需要报名',
      registrationDeadlinePrefix: '截止日期：',
      registrationDeadlinePassed: '截止日期已过',
      registrationButtonText: '立即报名',
    }
  }

  return {
    back: 'Back to Events',
    date: 'Date',
    time: 'Time',
    location: 'Location',
    registration: 'Registration',
    address: 'Address',
    registrationNotRequired: 'No registration required',
    registrationLinkPending: 'Registration required (link pending)',
    registrationRequired: 'Registration required',
    registrationDeadlinePrefix: 'Registration deadline: ',
    registrationDeadlinePassed: 'Deadline passed',
    registrationButtonText: 'Register Now',
  }
})

async function loadPage(locale: string, slug: string) {
  const events = await fetchCollection('events', validateLocale(locale), {
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

  return { title: page?.title ?? 'Event Not Found' }
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const page = await loadPage(locale, slug)
  const labels = getEventDetailLabels(locale)

  if (!page) return notFound()

  const hideInfoCard = isEventOlderThanDays(page.date, 3)
  const registrationDeadlinePassed = isDateBeforeToday(page.registration?.deadline)

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex h-64 items-center justify-center text-center text-white md:h-80">
        <div className="absolute inset-0">
          {page.gallery && page.gallery.length > 0 && typeof page.gallery[0].image === 'object' && (
            <img
              src={page.gallery[0].image.url}
              alt={page.gallery[0].image.alt}
              className="h-full w-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl font-bold uppercase tracking-tight md:text-6xl">{page.title}</h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto max-w-4xl px-5 sm:px-6">
          {/* Back Link */}
          <Link
            href={`/${locale}/events`}
            className="mb-8 inline-flex items-center gap-2 rounded-lg bg-[rgb(var(--website-theme-color1))] px-4 py-2 font-semibold text-white transition-colors hover:bg-[rgb(var(--website-theme-color2))]"
          >
            ← {labels.back}
          </Link>

          {!hideInfoCard && (
            <div className="mb-12 rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="mb-6 text-2xl font-bold text-[rgb(var(--website-theme-color1))]">
                {labels.registration}
              </h2>

              <div className="mb-4 space-y-4">
                <div className="flex gap-3">
                  <span className="font-semibold text-gray-700">{labels.date}:</span>
                  <span className="text-gray-600">{formatEventDateLong(page.date, locale)}</span>
                </div>

                {formatEventTimeRange(page.time?.start, page.time?.end) && (
                  <div className="flex gap-3">
                    <span className="font-semibold text-gray-700">{labels.time}:</span>
                    <span className="text-gray-600">
                      {formatEventTimeRange(page.time?.start, page.time?.end)}
                    </span>
                  </div>
                )}

                {page.location?.venue && (
                  <div className="flex gap-3">
                    <span className="font-semibold text-gray-700">{labels.location}:</span>
                    <span className="text-gray-600">{page.location.venue}</span>
                  </div>
                )}

                {page.location?.address && (
                  <div className="flex gap-3">
                    <span className="font-semibold text-gray-700">{labels.address}:</span>
                    <span className="whitespace-pre-wrap text-gray-600">
                      {page.location.address}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-gray-200 pt-6">
                <p className="mb-4 flex gap-3">
                  <span className="text-gray-600">
                    {getRegistrationLabel(page.registration, locale, labels)}
                  </span>
                </p>

                {page.registration?.required &&
                  page.registration?.url &&
                  !registrationDeadlinePassed && (
                    <a
                      href={page.registration.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-[rgb(var(--website-theme-color1))] px-6 py-2 font-semibold text-white transition-colors hover:bg-[rgb(var(--website-theme-color2))]"
                    >
                      {labels.registrationButtonText}
                    </a>
                  )}
              </div>
            </div>
          )}

          <div className="prose prose-sm max-w-none mb-12">
            <StyledText data={page.description} />
          </div>

          {page.gallery && page.gallery.length > 0 && (
            <div className="mb-12">
              <div className="grid grid-cols-1 gap-4">
                {page.gallery.map(
                  (item) =>
                    typeof item.image === 'object' && (
                      <div key={item.id} className="rounded-lg overflow-hidden">
                        <img
                          src={item.image.url}
                          alt={item.image.alt}
                          className="w-full h-auto object-cover"
                        />
                        {item.caption && (
                          <p className="mt-2 text-center text-sm text-gray-600">{item.caption}</p>
                        )}
                      </div>
                    ),
                )}
              </div>
            </div>
          )}

          {page.content_video_url && (
            <div className="mb-12">
              <iframe
                src={page.content_video_url}
                title="Event Video"
                className="aspect-video w-full rounded-lg shadow-md"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
