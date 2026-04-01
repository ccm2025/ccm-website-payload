import { StyledText } from '@/components/StyledText'
import {
  fetchCollection,
  fetchGlobal,
  validateLocale,
  formatEventDate,
  formatEventTimeRange,
  getRegistrationLabel,
  type RegistrationLabels,
} from '@/lib'
import { Metadata } from 'next'
import Link from 'next/link'
import { cache } from 'react'

type EventPageLabels = RegistrationLabels & {
  location: string
  time: string
  registration: string
}

const getEventPageLabels = cache((locale: string): EventPageLabels => {
  if (locale === 'zh-Hans') {
    return {
      location: '地点',
      time: '时间',
      registration: '报名',
      registrationNotRequired: '无需报名',
      registrationLinkPending: '需报名（链接待更新）',
      registrationRequired: '需要报名',
      registrationDeadlinePrefix: '报名截止：',
    }
  }

  return {
    location: 'Location',
    time: 'Time',
    registration: 'Registration',
    registrationNotRequired: 'No registration required',
    registrationLinkPending: 'Registration required (link pending)',
    registrationRequired: 'Registration required',
    registrationDeadlinePrefix: 'Registration deadline: ',
  }
})

async function loadPage(locale: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const validatedLocale = validateLocale(locale)

  const [page, upcomingEvents, pastEvents] = await Promise.all([
    fetchGlobal('events-page', validatedLocale),
    fetchCollection('events', validatedLocale, {
      where: {
        date: {
          greater_than_equal: today.toISOString(),
        },
      },
      sort: 'date',
    }),
    fetchCollection('events', validatedLocale, {
      where: {
        date: {
          less_than: today.toISOString(),
        },
      },
      sort: '-date',
      limit: 20,
    }),
  ])

  return {
    ...page,
    upcoming_events: upcomingEvents,
    past_events: pastEvents,
  }
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

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await loadPage(locale)
  const labels = getEventPageLabels(locale)

  return (
    <main>
      <section className="relative flex h-56 items-center justify-center text-center text-white sm:h-64 md:h-72">
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
          <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl">
            {page.hero.title}
          </h1>
        </div>
      </section>

      <section className="bg-gray-50 py-10 sm:py-14">
        <div className="container mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center">
            <StyledText data={page.upcomingEvents.title} />
          </div>

          {page.upcoming_events.length > 0 ? (
            <div className="mt-10 space-y-5">
              {page.upcoming_events.map((event) => (
                <Link
                  key={event.id}
                  href={`/${locale}/events/${event.slug}`}
                  className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="md:col-span-2">
                      {event.gallery &&
                        event.gallery.length > 0 &&
                        typeof event.gallery[0].image === 'object' && (
                          <img
                            src={event.gallery[0].image.url}
                            alt={event.gallery[0].image.alt}
                            className="h-auto w-full rounded-lg object-cover"
                          />
                        )}
                    </div>
                    <div className="md:col-span-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-xl font-bold text-[rgb(var(--website-theme-color1))] sm:text-2xl">
                          {event.title}
                        </h3>
                      </div>

                      <div className="space-y-1 text-sm text-gray-700 sm:text-base">
                        <p>
                          <span className="font-semibold">
                            {formatEventDate(event.date, locale)}
                          </span>
                        </p>

                        {formatEventTimeRange(event.time?.start, event.time?.end) && (
                          <p>
                            <span className="font-medium">{labels.time}: </span>
                            {formatEventTimeRange(event.time?.start, event.time?.end)}
                          </p>
                        )}

                        {event.location?.venue && (
                          <p>
                            <span className="font-medium">{labels.location}: </span>
                            {event.location.venue}
                          </p>
                        )}

                        <u>{getRegistrationLabel(event.registration, locale, labels)}</u>
                      </div>

                      <div className="mt-4 line-clamp-4 text-sm text-gray-700">
                        <StyledText data={event.description} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-3xl">{page.upcomingEvents.empty_message}</p>
          )}
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14">
        <div className="container mx-auto max-w-5xl px-5 sm:px-8">
          <div className="text-center">
            <StyledText data={page.pastEvents.title} />
          </div>

          {page.past_events.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.past_events.map((event) => (
                <Link
                  key={event.id}
                  href={`/${locale}/events/${event.slug}`}
                  className="group rounded-lg border border-gray-200 p-4 transition hover:border-[rgb(var(--website-theme-color1))]/50 hover:shadow-sm"
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-[rgb(var(--website-theme-color1))] group-hover:underline">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    {formatEventDate(event.date, locale)}
                  </p>

                  {event.location?.venue && (
                    <p className="mt-1 text-sm text-gray-600">{event.location.venue}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-3xl">{page.pastEvents.empty_message}</p>
          )}
        </div>
      </section>
    </main>
  )
}
