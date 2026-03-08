import { describe, it, expect } from 'vitest'
import {
  hasMinimumRole,
  createMinimumRoleAccess,
  contentManagerAccess,
  memberAndAboveAccess,
  selfOrAdminAccess,
} from '../../src/access'

describe('Role Hierarchy System', () => {
  describe('hasMinimumRole helper', () => {
    it('should validate role hierarchy correctly', () => {
      // Test valid roles
      expect(hasMinimumRole('admin', 'member')).toBe(true)
      expect(hasMinimumRole('admin', 'editor')).toBe(true)
      expect(hasMinimumRole('admin', 'admin')).toBe(true)

      expect(hasMinimumRole('editor', 'member')).toBe(true)
      expect(hasMinimumRole('editor', 'editor')).toBe(true)
      expect(hasMinimumRole('editor', 'admin')).toBe(false)

      expect(hasMinimumRole('member', 'member')).toBe(true)
      expect(hasMinimumRole('member', 'editor')).toBe(false)
      expect(hasMinimumRole('member', 'admin')).toBe(false)

      // Test invalid roles
      expect(hasMinimumRole('invalid', 'member')).toBe(false)
      expect(hasMinimumRole('member', 'invalid')).toBe(false)
    })
  })

  describe('createMinimumRoleAccess factory', () => {
    it('should create correct access functions for different roles', () => {
      const memberAccess = createMinimumRoleAccess('member')
      const editorAccess = createMinimumRoleAccess('editor')
      const adminAccess = createMinimumRoleAccess('admin')

      // Test admin user
      const adminContext: any = { req: { user: { role: 'admin' as const, isActive: true } } }
      expect(memberAccess(adminContext)).toBe(true)
      expect(editorAccess(adminContext)).toBe(true)
      expect(adminAccess(adminContext)).toBe(true)

      // Test editor user
      const editorContext: any = { req: { user: { role: 'editor' as const, isActive: true } } }
      expect(memberAccess(editorContext)).toBe(true)
      expect(editorAccess(editorContext)).toBe(true)
      expect(adminAccess(editorContext)).toBe(false)

      // Test member user
      const memberContext: any = { req: { user: { role: 'member' as const, isActive: true } } }
      expect(memberAccess(memberContext)).toBe(true)
      expect(editorAccess(memberContext)).toBe(false)
      expect(adminAccess(memberContext)).toBe(false)

      // Test inactive user
      const inactiveContext: any = { req: { user: { role: 'admin' as const, isActive: false } } }
      expect(memberAccess(inactiveContext)).toBe(false)
      expect(editorAccess(inactiveContext)).toBe(false)
      expect(adminAccess(inactiveContext)).toBe(false)
    })
  })

  describe('Content Manager Access', () => {
    it('should allow admin and editor access', () => {
      const adminContext: any = { req: { user: { role: 'admin' as const, isActive: true } } }
      const editorContext: any = { req: { user: { role: 'editor' as const, isActive: true } } }
      const memberContext: any = { req: { user: { role: 'member' as const, isActive: true } } }

      expect(contentManagerAccess(adminContext)).toBe(true)
      expect(contentManagerAccess(editorContext)).toBe(true)
      expect(contentManagerAccess(memberContext)).toBe(false)
    })

    it('should deny access to inactive users', () => {
      const inactiveAdminContext: any = {
        req: { user: { role: 'admin' as const, isActive: false } },
      }
      const inactiveEditorContext: any = {
        req: { user: { role: 'editor' as const, isActive: false } },
      }

      expect(contentManagerAccess(inactiveAdminContext)).toBe(false)
      expect(contentManagerAccess(inactiveEditorContext)).toBe(false)
    })
  })

  describe('Member and Above Access', () => {
    it('should allow all registered users access', () => {
      const adminContext: any = { req: { user: { role: 'admin' as const, isActive: true } } }
      const editorContext: any = { req: { user: { role: 'editor' as const, isActive: true } } }
      const memberContext: any = { req: { user: { role: 'member' as const, isActive: true } } }

      expect(memberAndAboveAccess(adminContext)).toBe(true)
      expect(memberAndAboveAccess(editorContext)).toBe(true)
      expect(memberAndAboveAccess(memberContext)).toBe(true)
    })

    it('should deny access to non-authenticated users', () => {
      const noUserContext: any = { req: { user: null } }
      const undefinedContext: any = { req: { user: undefined } }

      expect(memberAndAboveAccess(noUserContext)).toBe(false)
      expect(memberAndAboveAccess(undefinedContext)).toBe(false)
    })
  })

  describe('Self or Admin Access', () => {
    const adminId = 'admin-user-id'
    const userId = 'regular-user-id'
    const otherUserId = 'other-user-id'

    it('should allow admin to access everything', () => {
      const adminContext: any = {
        req: {
          user: {
            id: adminId,
            role: 'admin' as const,
            isActive: true,
          },
        },
      }

      const result = selfOrAdminAccess(adminContext)
      expect(result).toBe(true)
    })

    it('should allow user to access their own data', () => {
      const userContext: any = {
        req: {
          user: {
            id: userId,
            role: 'member' as const,
            isActive: true,
          },
        },
      }

      const result = selfOrAdminAccess(userContext)
      expect(result).toEqual({ id: { equals: userId } })
    })

    it('should deny inactive users', () => {
      const inactiveContext: any = {
        req: {
          user: {
            id: userId,
            role: 'member' as const,
            isActive: false,
          },
        },
      }

      const result = selfOrAdminAccess(inactiveContext)
      expect(result).toBe(false)
    })

    it('should deny unauthenticated users', () => {
      const noUserContext: any = { req: { user: null } }

      const result = selfOrAdminAccess(noUserContext)
      expect(result).toBe(false)
    })
  })

  describe('Role Consistency', () => {
    it('should maintain consistent role hierarchy across functions', () => {
      const roles = ['member', 'editor', 'admin'] as const

      // Test that each role has appropriate access to lower-level functions
      roles.forEach((role, index) => {
        const context: any = { req: { user: { role, isActive: true } } }

        // Member and above should always be accessible for all roles
        expect(memberAndAboveAccess(context)).toBe(true)

        // Content manager should only be accessible for editor and admin
        expect(contentManagerAccess(context)).toBe(index >= 1)
      })
    })
  })
})
