import fs from 'node:fs/promises'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

type PlanRow = {
  id: number
  parent: number
  notused: number
  detail: string
}

type QueryCase = {
  name: string
  sql: string
}

type QueryReport = {
  name: string
  sql: string
  plan: PlanRow[]
  scans: string[]
  searches: string[]
  tempBtreeSteps: string[]
  estimatedScanRows: number
  risk: 'low' | 'medium' | 'high'
}

const DEFAULT_DB_GLOB = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject'

const QUERY_CASES: QueryCase[] = [
  {
    name: 'home page global by locale',
    sql: `SELECT home_page.id
        FROM home_page
        LEFT JOIN home_page_locales
      ON home_page_locales._parent_id = home_page.id AND home_page_locales._locale = 'en'
          LIMIT 1;`,
  },
  {
    name: 'site global by locale',
    sql: `SELECT global.id
        FROM global
        LEFT JOIN global_locales
      ON global_locales._parent_id = global.id AND global_locales._locale = 'en'
          LIMIT 1;`,
  },
  {
    name: 'events upcoming list by date',
    sql: `SELECT events.id, events.date
        FROM events
        WHERE events.date >= datetime('now')
        ORDER BY events.date ASC
          LIMIT 20;`,
  },
  {
    name: 'events past list by date',
    sql: `SELECT events.id, events.date
        FROM events
        WHERE events.date < datetime('now')
        ORDER BY events.date DESC
          LIMIT 20;`,
  },
  {
    name: 'event detail by slug',
    sql: `SELECT events.id, events.slug
        FROM events
        WHERE events.slug = 'sample-slug'
          LIMIT 1;`,
  },
  {
    name: 'events localized row lookup',
    sql: `SELECT events_locales.id
        FROM events_locales
        WHERE events_locales._parent_id = 1 AND events_locales._locale = 'en'
          LIMIT 1;`,
  },
  {
    name: 'ministry detail by slug',
    sql: `SELECT ministries.id, ministries.slug
        FROM ministries
        WHERE ministries.slug = 'gospel-ministry'
          LIMIT 1;`,
  },
  {
    name: 'ministries localized row lookup',
    sql: `SELECT ministries_locales.id
        FROM ministries_locales
        WHERE ministries_locales._parent_id = 1 AND ministries_locales._locale = 'en'
          LIMIT 1;`,
  },
  {
    name: 'media list by uploader',
    sql: `SELECT media.id
        FROM media
        WHERE media.uploaded_by_id = 1
        ORDER BY media.created_at DESC
          LIMIT 20;`,
  },
  {
    name: 'user auth by email',
    sql: `SELECT users.id
        FROM users
        WHERE users.email = 'perf-check@example.com'
          LIMIT 1;`,
  },
]

function runSqliteJson<T>(dbPath: string, sql: string): T {
  const stdout = execFileSync('sqlite3', ['-json', dbPath, sql], {
    encoding: 'utf8',
  }).trim()

  if (!stdout) return [] as unknown as T
  return JSON.parse(stdout) as T
}

function runExplainPlan(dbPath: string, sql: string): PlanRow[] {
  const stdout = execFileSync('sqlite3', [dbPath, `EXPLAIN QUERY PLAN ${sql}`], {
    encoding: 'utf8',
  }).trim()

  if (!stdout) return []

  const lines = stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => line !== 'QUERY PLAN')

  return lines.map((line, index) => {
    // sqlite CLI may render a tree prefix like "|--" or "`--".
    const detail = line.replace(/^([`|\\-\s])+/g, '').trim()
    return {
      id: index,
      parent: 0,
      notused: 0,
      detail,
    }
  })
}

function runShell(command: string): string {
  return execFileSync('zsh', ['-lc', command], {
    encoding: 'utf8',
  }).trim()
}

function findLocalDbPath(): string {
  if (process.env.PERF_D1_PATH) return process.env.PERF_D1_PATH

  const command = `find ${DEFAULT_DB_GLOB} -type f -name '*.sqlite' | grep -v metadata.sqlite | head -n 1`
  const found = runShell(command)
  if (!found) {
    throw new Error(
      'No local D1 sqlite file found. Ensure local D1 has been initialized under .wrangler/state.',
    )
  }
  return found
}

function parsePlan(plan: PlanRow[]) {
  const scans: string[] = []
  const searches: string[] = []
  const tempBtreeSteps: string[] = []

  for (const row of plan) {
    const detail = row.detail || ''
    if (detail.includes('SCAN ')) scans.push(detail)
    if (detail.includes('SEARCH ')) searches.push(detail)
    if (detail.includes('USE TEMP B-TREE')) tempBtreeSteps.push(detail)
  }

  return { scans, searches, tempBtreeSteps }
}

function extractTableFromDetail(detail: string): string | null {
  const match = detail.match(/\b(?:SCAN|SEARCH)\s+([\w_]+)/)
  return match?.[1] ?? null
}

function classifyRisk(scanCount: number, tempBtreeCount: number): 'low' | 'medium' | 'high' {
  if (scanCount >= 2 || tempBtreeCount >= 1) return 'high'
  if (scanCount === 1) return 'medium'
  return 'low'
}

async function main() {
  const startedAt = new Date()
  const dbPath = findLocalDbPath()

  const tableCounts = runSqliteJson<Array<{ name: string }>>(
    dbPath,
    `SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`,
  )

  const rowCountByTable = new Map<string, number>()
  for (const row of tableCounts) {
    const table = row.name
    if (!table || table.startsWith('sqlite_')) continue

    const countRows = runSqliteJson<Array<{ count: number }>>(
      dbPath,
      `SELECT COUNT(*) AS count FROM \"${table}\";`,
    )
    rowCountByTable.set(table, countRows[0]?.count ?? 0)
  }

  const reports: QueryReport[] = []

  for (const query of QUERY_CASES) {
    const plan = runExplainPlan(dbPath, query.sql)
    const { scans, searches, tempBtreeSteps } = parsePlan(plan)

    let estimatedScanRows = 0
    for (const detail of scans) {
      const table = extractTableFromDetail(detail)
      if (table && rowCountByTable.has(table)) {
        estimatedScanRows += rowCountByTable.get(table) ?? 0
      }
    }

    reports.push({
      name: query.name,
      sql: query.sql,
      plan,
      scans,
      searches,
      tempBtreeSteps,
      estimatedScanRows,
      risk: classifyRisk(scans.length, tempBtreeSteps.length),
    })
  }

  const highRisk = reports.filter((r) => r.risk === 'high')
  const mediumRisk = reports.filter((r) => r.risk === 'medium')
  const totalEstimatedScanRows = reports.reduce((sum, r) => sum + r.estimatedScanRows, 0)

  const summary = {
    generatedAt: startedAt.toISOString(),
    dbPath,
    queryCount: reports.length,
    riskDistribution: {
      high: highRisk.length,
      medium: mediumRisk.length,
      low: reports.length - highRisk.length - mediumRisk.length,
    },
    totalEstimatedScanRows,
    totalTables: rowCountByTable.size,
    keyTableRows: {
      events: rowCountByTable.get('events') ?? 0,
      events_locales: rowCountByTable.get('events_locales') ?? 0,
      ministries: rowCountByTable.get('ministries') ?? 0,
      ministries_locales: rowCountByTable.get('ministries_locales') ?? 0,
      media: rowCountByTable.get('media') ?? 0,
      users: rowCountByTable.get('users') ?? 0,
    },
  }

  const output = {
    summary,
    queries: reports,
    notes: {
      purpose:
        'Local proxy for read amplification. This is not Cloudflare official Rows Read, but helps detect full scans and index miss patterns.',
      interpretation: [
        'If risk is high and scans include large tables, likely high read amplification under load.',
        'SEARCH ... USING INDEX is generally good; SCAN on large tables is risky.',
        'USE TEMP B-TREE often indicates sort/hash work that can increase CPU time.',
      ],
    },
  }

  const outDir = path.resolve(process.cwd(), 'tests/perf/results')
  await fs.mkdir(outDir, { recursive: true })

  const fileName = `local-d1-read-report-${startedAt.toISOString().replace(/[:.]/g, '-')}.json`
  const outPath = path.join(outDir, fileName)
  await fs.writeFile(outPath, JSON.stringify(output, null, 2), 'utf8')

  console.log('Local D1 read-amplification report generated')
  console.log(`DB: ${dbPath}`)
  console.log(`Report: ${outPath}`)
  console.log(`High risk queries: ${summary.riskDistribution.high}`)
  console.log(`Medium risk queries: ${summary.riskDistribution.medium}`)
  console.log(`Estimated scan rows (sum): ${summary.totalEstimatedScanRows}`)
}

void main()
