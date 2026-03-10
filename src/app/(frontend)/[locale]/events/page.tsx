import { StyledText } from '@/components/StyledText'
import { fetchCollection, fetchGlobal, validateLocale } from '@/lib'
import { Metadata } from 'next'
import Link from 'next/link'

async function loadPage(locale: string) {
  const page = await fetchGlobal('events-page', validateLocale(locale))
  const upcomingEvents = await fetchCollection('events', validateLocale(locale), {
    where: {
      date: {
        greater_than_or_equal_to: new Date().toISOString(),
      },
    },
    sort: '-date',
  })
  const pastEvents = await fetchCollection('events', validateLocale(locale), {
    where: {
      date: {
        less_than: new Date().toISOString(),
      },
    },
    sort: '-date',
    limit: 20,
  })

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
    title: page.hero.hero_title,
  }
}

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await loadPage(locale)

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
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight">
            {page.hero.hero_title}
          </h1>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-10 sm:py-14 md:py-16">
        <div className="container mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm sm:text-base md:text-base font-semibold text-[rgb(var(--website-theme-color2))] tracking-wide">
              {page.upcomingEvents.upcoming_events_subtitle}
            </p>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
              {page.upcomingEvents.upcoming_events_title}
            </p>
          </div>

          {page.upcoming_events.length > 0 ? (
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:gap-8 md:gap-10">
              {page.upcoming_events.map((event) => (
                <Link key={event.id} href={`/${locale}/events/${event.slug}`}>
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-5 md:gap-8">
                    <div className="md:col-span-2">
                      {event.gallery &&
                        event.gallery.length > 0 &&
                        typeof event.gallery[0].image === 'object' && (
                          <img
                            src={event.gallery[0].image.url}
                            alt={event.gallery[0].image.alt}
                            className="h-auto w-full rounded-lg object-cover shadow-md"
                          />
                        )}
                    </div>
                    <div className="md:col-span-3">
                      <h3 className="text-2xl font-bold text-[rgb(var(--website-theme-color1))]">
                        {event.title}
                      </h3>
                      <p className="mt-2 mb-4 font-semibold text-[rgb(var(--website-theme-color2))]">
                        {event.date}
                      </p>
                      <StyledText data={event.description} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-3xl">{page.upcomingEvents.no_events_message}</p>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-white py-10 sm:py-14 md:py-16">
        <div className="container mx-auto max-w-6xl px-6 sm:px-8 md:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm sm:text-base md:text-base font-semibold text-[rgb(var(--website-theme-color2))] tracking-wide">
              {page.pastEvents.past_events_subtitle}
            </p>
            <p className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))]">
              {page.pastEvents.past_events_title}
            </p>
          </div>

          {page.past_events.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
              {page.past_events.map((event) => (
                <Link
                  key={event.id}
                  href={`/${locale}/events/${event.slug}`}
                  className="group relative block h-56 overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    {event.gallery &&
                      event.gallery.length > 0 &&
                      typeof event.gallery[0].image === 'object' && (
                        <img
                          src={event.gallery[0].image.url}
                          alt={event.gallery[0].image.alt}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
                  </div>
                  <div className="relative flex h-full flex-col items-start justify-end p-4">
                    <h3 className="text-xl font-bold text-[rgb(var(--website-theme-color2))]">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[rgb(var(--website-theme-color2))]">{event.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-3xl">{page.pastEvents.past_events_empty_text}</p>
          )}
        </div>
      </section>
    </main>
  )
}
