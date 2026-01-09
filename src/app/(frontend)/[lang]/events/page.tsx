import { StyledText } from '@/components/StyledText'
import { fetchCollection, fetchGlobal, validateLang } from '@/lib'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

async function loadPage(lang: string) {
  const page = await fetchGlobal('events-page', validateLang(lang))
  const upcomingEvents = await fetchCollection('events', validateLang(lang), {
    where: {
      date: {
        greater_than_or_equal_to: new Date().toISOString(),
      },
    },
    sort: '-date',
  })
  const pastEvents = await fetchCollection('events', validateLang(lang), {
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
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const page = await loadPage(lang)

  return {
    title: page.hero_title,
  }
}

export default async function EventsPage({ params }: { params: Promise<{ lang: string }> }) {
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

      {/* Upcoming Events */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-lg font-semibold text-[rgb(var(--website-theme-color2))] md:text-xl">
              {page.upcoming_events_subtitle}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))] md:text-4xl">
              {page.upcoming_events_title}
            </p>
          </div>

          {page.upcoming_events.length > 0 ? (
            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6">
              {page.upcoming_events.map((event) => (
                <Link key={event.id} href={`/${lang}/events/${event.slug}`}>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:gap-6">
                    <div className="md:col-span-1">
                      {typeof event.hero_image === 'object' && (
                        <Image
                          src={event.hero_image.url}
                          alt={event.hero_image.nickname}
                          width={300}
                          height={200}
                          className="h-auto w-full rounded-lg object-cover shadow-md"
                        />
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="text-2xl font-bold text-[rgb(var(--website-theme-color1))]">
                        {event.title}
                      </h3>
                      <p className="mt-2 mb-4 font-semibold text-[rgb(var(--website-theme-color2))]">
                        {event.date}
                      </p>
                      <StyledText data={event.content} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-3xl">{page.upcoming_events_empty_text}</p>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-lg font-semibold text-[rgb(var(--website-theme-color2))] md:text-xl">
              {page.past_events_subtitle}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-wider text-[rgb(var(--website-theme-color1))] md:text-4xl">
              {page.past_events_title}
            </p>
          </div>

          {page.past_events.length > 0 ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {page.past_events.map((event) => (
                <Link
                  key={event.id}
                  href={`/${lang}/events/${event.slug}`}
                  className="group relative block h-56 overflow-hidden rounded-lg shadow-lg"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    {typeof event.hero_image === 'object' && (
                      <Image
                        src={event.hero_image.url}
                        alt={event.hero_image.nickname}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
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
            <p className="mt-12 text-center text-3xl">{page.past_events_empty_text}</p>
          )}
        </div>
      </section>
    </main>
  )
}
