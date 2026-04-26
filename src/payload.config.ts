import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import {
  CloudflareContext,
  getCloudflareContext,
  initOpenNextCloudflareForDev,
} from '@opennextjs/cloudflare'
import { r2Storage } from '@payloadcms/storage-r2'

import * as Collections from '@/collections'
import * as Globals from '@/globals'

import TextColorFeature from './features/TextColor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isDev = process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.startsWith('dev')

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'debug',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // Use PayloadLogger type when it's exported

if (isDev) await initOpenNextCloudflareForDev()
const cloudflare: CloudflareContext = await getCloudflareContext({ async: true })

export const supportedLocales = ['en', 'zh-Hans']

export default buildConfig({
  admin: {
    user: Collections.Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Collections.Users, Collections.Media, Collections.Events, Collections.Ministries],
  globals: [
    Globals.SiteGlobal,
    Globals.HomePage,
    Globals.AboutPage,
    Globals.EventsPage,
    Globals.VolunteerPage,
    Globals.GivePage,
    Globals.SupportPage,
    Globals.FreshmanPage,
    Globals.PlanYourVisitPage,
    Globals.ThankYouPage,
    Globals.GospelMinistryPage,
  ],
  localization: {
    locales: supportedLocales,
    defaultLocale: supportedLocales[0],
    fallback: true,
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, TextColorFeature],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
  }),
  logger: cloudflareLogger,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})
