import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import type { Payload } from 'payload'

describe('User Authentication Tests', () => {
  let payload: Payload
  let testUserData: any

  beforeAll(async () => {
    payload = await getPayload({ config })

    testUserData = {
      email: 'auth-test@test.com',
      password: 'ValidPassword123!',
      firstName: 'Auth',
      lastName: 'Test',
      role: 'member' as const,
      isActive: true,
    }
  })

  afterAll(async () => {
    // Clean up test user
    try {
      await payload.delete({
        collection: 'users',
        where: { email: { equals: testUserData.email } },
      })
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  describe('User Registration', () => {
    it('should create a new user with required fields', async () => {
      const user = await payload.create({
        collection: 'users',
        data: testUserData,
      })

      expect(user.email).toBe(testUserData.email)
      expect(user.firstName).toBe(testUserData.firstName)
      expect(user.lastName).toBe(testUserData.lastName)
      expect(user.role).toBe('member')
      expect(user.isActive).toBe(true)
      expect(user.id).toBeDefined()
      expect(user.password).toBeUndefined() // Password should not be returned
    })

    it('should prevent duplicate email registration', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: testUserData,
        }),
      ).rejects.toThrow()
    })

    it('should require email field', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: {
            password: 'password123',
            firstName: 'No',
            lastName: 'Email',
            role: 'member' as const,
          } as any, // 故意缺少email来测试验证
        }),
      ).rejects.toThrow()
    })

    it('should require password field', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: {
            email: 'no-password@test.com',
            firstName: 'No',
            lastName: 'Password',
            role: 'member' as const,
          } as any, // 故意缺少password来测试验证
        }),
      ).rejects.toThrow()
    })

    it('should require firstName field', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: {
            email: 'no-firstname@test.com',
            password: 'password123',
            lastName: 'Name',
            role: 'member' as const,
          } as any, // 故意缺少firstName来测试验证
        }),
      ).rejects.toThrow()
    })

    it('should require lastName field', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: {
            email: 'no-lastname@test.com',
            password: 'password123',
            firstName: 'No',
            role: 'member' as const,
          } as any, // 故意缺少lastName来测试验证
        }),
      ).rejects.toThrow()
    })
  })

  describe('User Display and Admin Features', () => {
    it('should use firstName as display title', async () => {
      // Test the actual Users configuration directly
      const configPromise = await config
      const Users = configPromise.collections?.find((c: any) => c.slug === 'users') as any
      expect(Users?.admin?.useAsTitle).toBe('firstName')
    })

    it('should show correct default columns in admin', async () => {
      // Test the actual Users configuration directly
      const configPromise = await config
      const Users = configPromise.collections?.find((c: any) => c.slug === 'users') as any
      expect(Users?.admin?.defaultColumns).toEqual([
        'firstName',
        'lastName',
        'email',
        'role',
        'isActive',
      ])
    })
  })
})
