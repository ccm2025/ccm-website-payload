import { execSync } from 'node:child_process'

interface WranglerQueryResult {
  results: Array<{ name: string }>
  success: boolean
  meta?: {
    duration: number
  }
}

function validateTableName(name: string): boolean {
  // Only allow alphanumeric characters and underscores for safety
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)
}

function fetchTables(): string[] {
  try {
    const result = execSync(
      `wrangler d1 execute D1 --command "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '_cf_%';" --remote`,
      { encoding: 'utf8', timeout: 30000 },
    )

    // Parse JSON response from wrangler
    const jsonResult: WranglerQueryResult = JSON.parse(result.slice(result.indexOf('[')))[0]

    // Extract table names from the results array
    const tables: string[] = []
    if (jsonResult.results && Array.isArray(jsonResult.results)) {
      for (const row of jsonResult.results) {
        if (row.name && typeof row.name === 'string') {
          tables.push(row.name)
        }
      }
    }

    return tables.filter(validateTableName)
  } catch (error) {
    throw new Error(
      `Failed to fetch tables: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

function dropTable(tableName: string): void {
  try {
    console.log(`  Dropping table: ${tableName}`)
    execSync(`wrangler d1 execute D1 --command "DROP TABLE IF EXISTS \'${tableName}\';" --remote`, {
      stdio: 'pipe',
      timeout: 15000,
    })
  } catch (error) {
    throw new Error(
      `Failed to drop table ${tableName}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

function main(): void {
  console.log(`🗑️  Dropping all tables from remote D1...`)

  try {
    const tables = fetchTables()

    if (tables.length === 0) {
      console.log('✅ No user tables found to drop.')
      return
    }

    console.log(`Found ${tables.length} table(s):`, tables)
    console.log('\n⚠️  This will permanently delete all data in these tables!')

    // Drop tables in reverse dependency order
    for (const table of tables.reverse()) {
      dropTable(table)
    }

    console.log('\n✅ All user tables dropped successfully!')
  } catch (error) {
    console.error('❌ Operation failed:', error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

// Only run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
