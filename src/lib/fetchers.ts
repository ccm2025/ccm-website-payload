import type { Config } from '@/payload-types'
import payloadConfig from '@payload-config'
import { DataFromGlobalSlug, getPayload, GlobalSlug } from 'payload'

let payloadPromise: ReturnType<typeof getPayload> | null = null

function getPayloadClient() {
  if (!payloadPromise) {
    payloadPromise = getPayload({ config: payloadConfig })
  }
  return payloadPromise
}

export async function fetchGlobal<TSlug extends GlobalSlug>(
  slug: TSlug,
  locale: Config['locale'],
  options?: {
    depth?: number
  },
): Promise<DataFromGlobalSlug<TSlug>> {
  const payload = await getPayloadClient()
  const global = await payload.findGlobal({
    slug,
    overrideAccess: false,
    locale,
    depth: 1,
    ...options,
  })
  return global
}

export async function fetchCollection<TSlug extends keyof Config['collections']>(
  slug: TSlug,
  locale: Config['locale'],
  options?: {
    depth?: number
    where?: Record<string, unknown>
    limit?: number
    sort?: Array<string> | string
  },
): Promise<Config['collections'][TSlug][]> {
  const payload = await getPayloadClient()
  const results = await payload.find({
    collection: slug,
    locale,
    overrideAccess: false,
    ...options,
  })
  return results.docs
}
