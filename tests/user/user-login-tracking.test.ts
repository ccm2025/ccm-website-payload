import { getPayload } from 'payload'
import config from '@payload-config'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'

describe('Users Login Tracking Tests', () => {
  let payload: any
  let testUser: any

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create a test user
    testUser = await payload.create({
      collection: 'users',
      data: {
        email: 'login-tracking@test.com',
        password: 'password123',
        firstName: 'Login',
        lastName: 'Test',
        role: 'member',
        isActive: true,
      } as any,
    })
  })

  afterAll(async () => {
    // Cleanup
    await payload.delete({ collection: 'users', where: { email: { contains: 'login-tracking@' } } })
  })

  it('should automatically update lastLoginAt on successful login', async () => {
    // Check initial lastLoginAt (should be null)
    const initialUser = await payload.findByID({
      collection: 'users',
      id: testUser.id,
    })

    expect(initialUser.lastLoginAt).toBeNull()

    // Perform login
    const loginResult = await payload.login({
      collection: 'users',
      data: {
        email: 'login-tracking@test.com',
        password: 'password123',
      },
    })

    expect(loginResult.token).toBeDefined()

    // Check if lastLoginAt was updated
    const updatedUser = await payload.findByID({
      collection: 'users',
      id: testUser.id,
    })

    expect(updatedUser.lastLoginAt).toBeDefined()
    expect(updatedUser.lastLoginAt).not.toBeNull()

    // Verify it's a recent timestamp (within the last minute)
    const lastLogin = new Date(updatedUser.lastLoginAt)
    const now = new Date()
    const diffMs = now.getTime() - lastLogin.getTime()
    const diffMinutes = diffMs / (1000 * 60)

    expect(diffMinutes).toBeLessThan(1) // Should be very recent
  })

  it('should update lastLoginAt on subsequent logins', async () => {
    // First login
    await payload.login({
      collection: 'users',
      data: {
        email: 'login-tracking@test.com',
        password: 'password123',
      },
    })

    const firstLoginUser = await payload.findByID({
      collection: 'users',
      id: testUser.id,
    })

    const firstLoginTime = firstLoginUser.lastLoginAt

    // Wait a moment
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Second login
    await payload.login({
      collection: 'users',
      data: {
        email: 'login-tracking@test.com',
        password: 'password123',
      },
    })

    const secondLoginUser = await payload.findByID({
      collection: 'users',
      id: testUser.id,
    })

    const secondLoginTime = secondLoginUser.lastLoginAt

    // Second login time should be different (newer) than first
    expect(new Date(secondLoginTime).getTime()).toBeGreaterThan(new Date(firstLoginTime).getTime())
  })

  it('should have lastLoginAt field configured correctly', async () => {
    const usersConfig = payload.config.collections.find((c: any) => c.slug === 'users')
    const lastLoginAtField = usersConfig.fields.find((f: any) => f.name === 'lastLoginAt')

    expect(lastLoginAtField).toBeDefined()
    expect(lastLoginAtField.type).toBe('date')
    expect(lastLoginAtField.admin.readOnly).toBe(true)

    // Check if hooks are properly configured
    expect(usersConfig.hooks).toBeDefined()
    expect(usersConfig.hooks.afterLogin).toBeDefined()
    expect(usersConfig.hooks.afterLogin).toHaveLength(1)
  })
})
