import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { getCloudflareContext, initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'
import { r2Storage } from '@payloadcms/storage-r2'

import { Users, Media, Events } from '@/collections'
import {
  SiteGlobal,
  HomePage,
  AboutPage,
  EventsPage,
  VolunteerPage,
  GivePage,
  SupportPage,
  FreshmanPage,
  PlanYourVisitPage,
  ThankYouPage,
} from '@/globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isProduction = process.env.NODE_ENV === 'production'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // Use PayloadLogger type when it's exported

if (!isProduction) await initOpenNextCloudflareForDev()
const cloudflare = await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Events],
  globals: [
    SiteGlobal,
    HomePage,
    AboutPage,
    EventsPage,
    VolunteerPage,
    GivePage,
    SupportPage,
    FreshmanPage,
    PlanYourVisitPage,
    ThankYouPage,
  ],
  localization: {
    locales: ['en', 'zh-Hans'],
    defaultLocale: 'en',
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
  }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})
