import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import type { Payload } from 'payload'

describe('User Access Control', () => {
  let payload: Payload
  let adminUser: any
  let editorUser: any
  let memberUser: any
  let inactiveUser: any

  beforeAll(async () => {
    payload = await getPayload({ config })

    // Create test users with different roles
    adminUser = await payload.create({
      collection: 'users',
      data: {
        email: 'admin@test.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin' as const,
        isActive: true,
      },
    })

    editorUser = await payload.create({
      collection: 'users',
      data: {
        email: 'editor@test.com',
        password: 'password123',
        firstName: 'Editor',
        lastName: 'User',
        role: 'editor' as const,
        isActive: true,
      },
    })

    memberUser = await payload.create({
      collection: 'users',
      data: {
        email: 'member@test.com',
        password: 'password123',
        firstName: 'Member',
        lastName: 'User',
        role: 'member' as const,
        isActive: true,
      },
    })

    inactiveUser = await payload.create({
      collection: 'users',
      data: {
        email: 'inactive@test.com',
        password: 'password123',
        firstName: 'Inactive',
        lastName: 'User',
        role: 'member' as const,
        isActive: false,
      },
    })
  })

  afterAll(async () => {
    // Clean up test users
    const emails = ['admin@test.com', 'editor@test.com', 'member@test.com', 'inactive@test.com']
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

  describe('User Creation Access', () => {
    it('should allow admin to create users', async () => {
      const result = await payload.create({
        collection: 'users',
        data: {
          email: 'test.admin.create@test.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
          role: 'member' as const,
        },
        user: adminUser,
        overrideAccess: false,
      })

      expect(result.email).toBe('test.admin.create@test.com')

      // Cleanup
      await payload.delete({
        collection: 'users',
        where: { email: { equals: 'test.admin.create@test.com' } },
      })
    })

    it('should deny editor from creating users', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: {
            email: 'test.editor.create@test.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            role: 'member' as const,
          },
          user: editorUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })

    it('should deny member from creating users', async () => {
      await expect(
        payload.create({
          collection: 'users',
          data: {
            email: 'test.member.create@test.com',
            password: 'password123',
            firstName: 'Test',
            lastName: 'User',
            role: 'member' as const,
          },
          user: memberUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })
  })

  describe('User Reading Access', () => {
    it('should allow admin to read all users', async () => {
      const result = await payload.find({
        collection: 'users',
        user: adminUser,
        overrideAccess: false,
      })

      expect(result.docs.length).toBeGreaterThanOrEqual(4) // at least our test users
    })

    it('should allow user to read only their own profile', async () => {
      const result = await payload.find({
        collection: 'users',
        user: memberUser,
        overrideAccess: false,
      })

      expect(result.docs).toHaveLength(1)
      expect(result.docs[0].email).toBe('member@test.com')
    })

    it('should deny access to inactive users', async () => {
      await expect(
        payload.find({
          collection: 'users',
          user: inactiveUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow('You are not allowed to perform this action')
    })
  })

  describe('User Update Access', () => {
    it('should allow admin to update any user', async () => {
      const result = await payload.update({
        collection: 'users',
        id: memberUser.id,
        data: { firstName: 'Updated Member' },
        user: adminUser,
        overrideAccess: false,
      })

      expect(result.firstName).toBe('Updated Member')

      // Reset for other tests
      await payload.update({
        collection: 'users',
        id: memberUser.id,
        data: { firstName: 'Member' },
      })
    })

    it('should allow user to update their own profile', async () => {
      const result = await payload.update({
        collection: 'users',
        id: memberUser.id,
        data: { firstName: 'Self Updated' },
        user: memberUser,
        overrideAccess: false,
      })

      expect(result.firstName).toBe('Self Updated')

      // Reset for other tests
      await payload.update({
        collection: 'users',
        id: memberUser.id,
        data: { firstName: 'Member' },
      })
    })

    it('should deny user from updating other users', async () => {
      await expect(
        payload.update({
          collection: 'users',
          id: editorUser.id,
          data: { firstName: 'Hacked' },
          user: memberUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })
  })

  describe('User Deletion Access', () => {
    it('should allow admin to delete users', async () => {
      // Create a user to delete
      const userToDelete = await payload.create({
        collection: 'users',
        data: {
          email: 'to-delete@test.com',
          password: 'password123',
          firstName: 'To',
          lastName: 'Delete',
          role: 'member' as const,
        },
      })

      await expect(
        payload.delete({
          collection: 'users',
          id: userToDelete.id,
          user: adminUser,
          overrideAccess: false,
        }),
      ).resolves.not.toThrow()
    })

    it('should deny non-admin from deleting users', async () => {
      await expect(
        payload.delete({
          collection: 'users',
          id: memberUser.id,
          user: editorUser,
          overrideAccess: false,
        }),
      ).rejects.toThrow()
    })
  })
})
