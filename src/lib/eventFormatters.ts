import { Event } from '@/payload-types'

export function getUILocale(locale: string): string {
  return locale === 'zh-Hans' ? 'zh-CN' : 'en-US'
}

export function formatEventDate(
  date: string,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return ''

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  }

  return new Intl.DateTimeFormat(getUILocale(locale), options || defaultOptions).format(
    new Date(date),
  )
}

export function formatEventDateLong(date: string, locale: string): string {
  return formatEventDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export function formatEventTimeRange(start?: string | null, end?: string | null): string | null {
  if (start && end) return `${start} - ${end}`
  if (start) return start
  if (end) return end
  return null
}

export type RegistrationInfo = Event['registration']

export interface RegistrationLabels {
  registrationNotRequired: string
  registrationLinkPending: string
  registrationRequired: string
  registrationDeadlinePrefix: string
  registrationDeadlinePassed?: string
}

function getStartOfToday(): Date {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

function getStartOfDate(date: string): Date {
  const parsed = new Date(date)
  parsed.setHours(0, 0, 0, 0)
  return parsed
}

export function isDateBeforeToday(date?: string | null): boolean {
  if (!date) return false
  return getStartOfDate(date).getTime() < getStartOfToday().getTime()
}

export function isEventOlderThanDays(eventDate: string, days: number): boolean {
  if (!eventDate || days < 0) return false

  const msPerDay = 24 * 60 * 60 * 1000
  const diffDays = (getStartOfToday().getTime() - getStartOfDate(eventDate).getTime()) / msPerDay

  return diffDays > days
}

export function getRegistrationLabel(
  registration: RegistrationInfo | null | undefined,
  locale: string,
  labels: RegistrationLabels,
): string {
  if (!registration?.required) {
    return labels.registrationNotRequired
  }

  if (!registration.url) {
    return labels.registrationLinkPending
  }

  if (isDateBeforeToday(registration.deadline)) {
    return (
      labels.registrationDeadlinePassed ||
      (locale === 'zh-Hans' ? '截止日期已过' : 'Deadline passed')
    )
  }

  if (registration.deadline) {
    const formattedDeadline = formatEventDate(registration.deadline, locale)
    return `${labels.registrationDeadlinePrefix}${formattedDeadline}`
  }

  return labels.registrationRequired
}
