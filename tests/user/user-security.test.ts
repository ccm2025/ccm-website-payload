import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import type { Payload } from 'payload'

describe('User Security Tests', () => {
  let payload: Payload
  let adminUser: any
  let editorUser: any
  let memberUser: any
  let victimUser: any

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create test users
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'sec-admin@test.com',
        password: 'password123',
        firstName: 'Security',
        lastName: 'Admin',
        role: 'admin' as const,
        isActive: true,
      },
    })

    editorUser = await payload.create({
      collection: 'users',
      data: {
        email: 'sec-editor@test.com',
        password: 'password123',
        firstName: 'Security',
        lastName: 'Editor',
        role: 'editor' as const,
        isActive: true,
      },
    })

    memberUser = await payload.create({
      collection: 'users',
      data: {
        email: 'sec-member@test.com',
        password: 'password123',
        firstName: 'Security',
        lastName: 'Member',
        role: 'member' as const,
        isActive: true,
      },
    })

    victimUser = await payload.create({
      collection: 'users',
      data: {
        email: 'victim@test.com',
        password: 'password123',
        firstName: 'Victim',
        lastName: 'User',
        role: 'member' as const,
        isActive: true,
      },
    })
  })

  afterAll(async () => {
    // Clean up test users
    const emails = [
      'sec-admin@test.com',
      'sec-editor@test.com',
      'sec-member@test.com',
      'victim@test.com',
    ]
    for (const email of emails) {
      try {
        await payload.delete({
          collection: 'users',
          where: { email: { equals: email } },
        })
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  })

  describe('Role Privilege Escalation Prevention', () => {
    it('should prevent member from escalating their own role', async () => {
      const originalRole = memberUser.role

      const result = await payload.update({
        collection: 'users',
        id: memberUser.id,
        data: { role: 'admin' as const },
        user: memberUser,
        overrideAccess: false,
      })

      // The update should succeed but the role should not change
      expect(result.role).toBe(originalRole)
      expect(result.role).not.toBe('admin')
    })

    it('should prevent editor from escalating their own role', async () => {
      const originalRole = editorUser.role

      const result = await payload.update({
        collection: 'users',
        id: editorUser.id,
        data: { role: 'admin' as const },
        user: editorUser,
        overrideAccess: false,
      })

      // The update should succeed but the role should not change
      expect(result.role).toBe(originalRole)
      expect(result.role).not.toBe('admin')
    })

    it('should prevent member from escalating other users roles', async () => {
      await expect(
        payload.update({
          collection: 'users',
          id: victimUser.id,
          data: { role: 'admin' },
          user: memberUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })

    it('should only allow admin to change user roles', async () => {
      const result = await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { role: 'editor' },
        user: adminUser,
        overrideAccess: false,
      })

      expect(result.role).toBe('editor')

      // Reset for other tests
      await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { role: 'member' },
      })
    })
  })

  describe('Account Status Manipulation Prevention', () => {
    it('should prevent non-admin from deactivating users', async () => {
      await expect(
        payload.update({
          collection: 'users',
          id: victimUser.id,
          data: { isActive: false },
          user: memberUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })

    it('should prevent non-admin from reactivating users', async () => {
      // First deactivate user as admin
      await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { isActive: false },
      })

      // Try to reactivate as member (should fail)
      await expect(
        payload.update({
          collection: 'users',
          id: victimUser.id,
          data: { isActive: true },
          user: memberUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow()

      // Reactivate as admin for cleanup
      await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { isActive: true },
      })
    })

    it('should allow admin to control user activation status', async () => {
      // Deactivate user
      const deactivatedResult = await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { isActive: false },
        user: adminUser,
        overrideAccess: false,
      })

      expect(deactivatedResult.isActive).toBe(false)

      // Reactivate user
      const reactivatedResult = await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { isActive: true },
        user: adminUser,
        overrideAccess: false,
      })

      expect(reactivatedResult.isActive).toBe(true)
    })
  })

  describe('Data Isolation', () => {
    it('should not allow member to see other users in list', async () => {
      const result = await payload.find({
        collection: 'users',
        user: memberUser,
        overrideAccess: false,
      })

      expect(result.docs).toHaveLength(1)
      expect(result.docs[0].id).toBe(memberUser.id)
    })

    it('should not allow editor to see other users in list', async () => {
      const result = await payload.find({
        collection: 'users',
        user: editorUser,
        overrideAccess: false,
      })

      expect(result.docs).toHaveLength(1)
      expect(result.docs[0].id).toBe(editorUser.id)
    })

    it('should allow admin to see all users', async () => {
      const result = await payload.find({
        collection: 'users',
        user: adminUser,
        overrideAccess: false,
      })

      expect(result.docs.length).toBeGreaterThanOrEqual(4)
    })
  })

  describe('Inactive User Security', () => {
    it('should deny access to deactivated users', async () => {
      // Deactivate victim user
      const updatedVictim = await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { isActive: false },
      })

      // Try to use deactivated user for operations - should throw error
      await expect(
        payload.find({
          collection: 'users',
          user: updatedVictim, // Use the updated user object with isActive: false
          overrideAccess: false,
        }),
      ).rejects.toThrow('You are not allowed to perform this action')

      // Reactivate for cleanup
      await payload.update({
        collection: 'users',
        id: victimUser.id,
        data: { isActive: true },
      })
    })
  })

  describe('Authentication Edge Cases', () => {
    it('should handle null user gracefully', async () => {
      await expect(
        payload.find({
          collection: 'users',
          user: null,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })

    it('should handle undefined user gracefully', async () => {
      await expect(
        payload.find({
          collection: 'users',
          user: undefined,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })

    it('should handle user without role gracefully', async () => {
      const userWithoutRole = { ...memberUser, role: undefined } as any

      await expect(
        payload.find({
          collection: 'users',
          user: userWithoutRole,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })
  })

  describe('Default Values Security', () => {
    it('should default new users to member role', async () => {
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: 'newuser@test.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
        } as any, // Intentionally omit role to test default,
      })

      expect(newUser.role).toBe('member')
      expect(newUser.isActive).toBe(true)

      // Cleanup
      await payload.delete({
        collection: 'users',
        id: newUser.id,
      })
    })

    it('should default new users to active status', async () => {
      const newUser = await payload.create({
        collection: 'users',
        data: {
          email: 'newuser2@test.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          role: 'member' as const,
        },
      })

      expect(newUser.isActive).toBe(true)

      // Cleanup
      await payload.delete({
        collection: 'users',
        id: newUser.id,
      })
    })
  })
})
