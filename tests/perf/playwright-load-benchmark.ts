import { request } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

type RouteWeight = {
  path: string
  method?: 'GET' | 'POST'
  weight: number
  body?: Record<string, unknown>
}

type RouteResult = {
  count: number
  errors: number
  latencies: number[]
}

const DEFAULT_ROUTE_WEIGHTS: RouteWeight[] = [
  { path: '/en', method: 'GET', weight: 30 },
  { path: '/zh-Hans', method: 'GET', weight: 15 },
  { path: '/en/events', method: 'GET', weight: 20 },
  { path: '/zh-Hans/events', method: 'GET', weight: 10 },
  { path: '/en/about', method: 'GET', weight: 10 },
  { path: '/zh-Hans/about', method: 'GET', weight: 5 },
  { path: '/en/gospel-ministry', method: 'GET', weight: 5 },
  { path: '/zh-Hans/gospel-ministry', method: 'GET', weight: 5 },
]

const BASE_URL = process.env.STAGING_URL || 'http://localhost:8787'
const TOTAL_REQUESTS = Number(process.env.PERF_TOTAL_REQUESTS || '5000')
const CONCURRENCY = Number(process.env.PERF_CONCURRENCY || '40')
const TIMEOUT_MS = Number(process.env.PERF_TIMEOUT_MS || '10000')
const ROUTE_WEIGHTS = parseRouteWeights(process.env.PERF_ROUTE_WEIGHTS)

function parseRouteWeights(raw: string | undefined): RouteWeight[] {
  if (!raw) return DEFAULT_ROUTE_WEIGHTS
  try {
    const parsed = JSON.parse(raw) as RouteWeight[]
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ROUTE_WEIGHTS
    return parsed
  } catch {
    return DEFAULT_ROUTE_WEIGHTS
  }
}

function chooseRoute(routes: RouteWeight[]): RouteWeight {
  const totalWeight = routes.reduce((sum, route) => sum + route.weight, 0)
  const randomValue = Math.random() * totalWeight
  let current = 0

  for (const route of routes) {
    current += route.weight
    if (randomValue <= current) return route
  }

  return routes[routes.length - 1]
}

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0
  const index = Math.ceil((p / 100) * sortedValues.length) - 1
  return sortedValues[Math.min(Math.max(index, 0), sortedValues.length - 1)]
}

function buildResultSummary(latencies: number[]) {
  const sorted = [...latencies].sort((a, b) => a - b)
  const sum = latencies.reduce((acc, value) => acc + value, 0)

  return {
    count: latencies.length,
    avgMs: latencies.length > 0 ? Number((sum / latencies.length).toFixed(2)) : 0,
    minMs: sorted[0] ?? 0,
    p50Ms: percentile(sorted, 50),
    p90Ms: percentile(sorted, 90),
    p95Ms: percentile(sorted, 95),
    p99Ms: percentile(sorted, 99),
    maxMs: sorted[sorted.length - 1] ?? 0,
  }
}

async function main() {
  const routeStats = new Map<string, RouteResult>()
  const allLatencies: number[] = []
  let completed = 0
  let errors = 0
  let cursor = 0

  const startedAt = new Date()
  const startedAtEpochMs = Date.now()

  console.log('Starting benchmark...')
  console.log(`Base URL: ${BASE_URL}`)
  console.log(`Total requests: ${TOTAL_REQUESTS}`)
  console.log(`Concurrency: ${CONCURRENCY}`)
  console.log(`Started at: ${startedAt.toISOString()}`)

  const context = await request.newContext({
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      'x-perf-test': 'playwright-load-benchmark',
    },
  })

  const worker = async () => {
    while (true) {
      const nextIndex = cursor
      if (nextIndex >= TOTAL_REQUESTS) break
      cursor += 1

      const route = chooseRoute(ROUTE_WEIGHTS)
      const routeKey = `${route.method || 'GET'} ${route.path}`
      const before = performance.now()

      try {
        const response =
          route.method === 'POST'
            ? await context.fetch(route.path, {
                method: 'POST',
                timeout: TIMEOUT_MS,
                data: route.body,
              })
            : await context.fetch(route.path, {
                method: route.method || 'GET',
                timeout: TIMEOUT_MS,
              })
        const elapsed = performance.now() - before

        const stats = routeStats.get(routeKey) ?? {
          count: 0,
          errors: 0,
          latencies: [],
        }

        stats.count += 1
        stats.latencies.push(elapsed)

        if (!response.ok()) {
          stats.errors += 1
          errors += 1
        } else {
          allLatencies.push(elapsed)
          completed += 1
        }

        routeStats.set(routeKey, stats)
      } catch {
        const stats = routeStats.get(routeKey) ?? {
          count: 0,
          errors: 0,
          latencies: [],
        }

        const elapsed = performance.now() - before
        stats.count += 1
        stats.errors += 1
        stats.latencies.push(elapsed)
        routeStats.set(routeKey, stats)

        errors += 1
      }

      const processed = completed + errors
      if (processed > 0 && processed % 5000 === 0) {
        console.log(`Progress: ${processed}/${TOTAL_REQUESTS} (ok=${completed}, err=${errors})`)
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker())
  await Promise.all(workers)
  await context.dispose()

  const endedAt = new Date()
  const endedAtEpochMs = Date.now()
  const durationMs = endedAtEpochMs - startedAtEpochMs
  const rps = durationMs > 0 ? Number((((completed + errors) / durationMs) * 1000).toFixed(2)) : 0

  const routeSummaries: Record<string, unknown> = {}
  for (const [route, stats] of routeStats.entries()) {
    routeSummaries[route] = {
      ...buildResultSummary(stats.latencies),
      errors: stats.errors,
      errorRate: stats.count > 0 ? Number(((stats.errors / stats.count) * 100).toFixed(2)) : 0,
    }
  }

  const summary = {
    baseUrl: BASE_URL,
    startedAt: startedAt.toISOString(),
    endedAt: endedAt.toISOString(),
    durationMs,
    totalRequestsPlanned: TOTAL_REQUESTS,
    totalRequestsSent: completed + errors,
    successfulRequests: completed,
    failedRequests: errors,
    errorRate:
      completed + errors > 0 ? Number(((errors / (completed + errors)) * 100).toFixed(2)) : 0,
    throughputRps: rps,
    latency: buildResultSummary(allLatencies),
    routes: routeSummaries,
    notes: {
      cloudflareRowsReadWindow: {
        from: startedAt.toISOString(),
        to: endedAt.toISOString(),
      },
      hint: 'Use this time window in Cloudflare D1 analytics to read Rows Read for this benchmark run.',
    },
  }

  const outDir = path.resolve(process.cwd(), 'tests/perf/results')
  await fs.mkdir(outDir, { recursive: true })

  const filename = `benchmark-${startedAt.toISOString().replace(/[:.]/g, '-')}.json`
  const outFile = path.join(outDir, filename)
  await fs.writeFile(outFile, JSON.stringify(summary, null, 2), 'utf8')

  console.log('')
  console.log('Benchmark complete')
  console.log(`Results file: ${outFile}`)
  console.log(`P50: ${summary.latency.p50Ms} ms`)
  console.log(`P99: ${summary.latency.p99Ms} ms`)
  console.log(`Error Rate: ${summary.errorRate}%`)
  console.log(`RPS: ${summary.throughputRps}`)
  console.log(
    `Rows Read window: ${summary.notes.cloudflareRowsReadWindow.from} -> ${summary.notes.cloudflareRowsReadWindow.to}`,
  )
}

void main()
