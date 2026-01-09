import type { Access, FieldAccess } from 'payload'

/**
 * Public access control
 */
export const publicAccess: Access = () => true

export const publicAccessField: FieldAccess = () => true

/**
 * Authenticated access control
 */
export const authenticatedAccess: Access = ({ req: { user } }) => Boolean(user)

export const authenticatedAccessField: FieldAccess = ({ req: { user } }) => Boolean(user)

/**
 * Editor access control
 */
export const editorOrAdminAccess: Access = ({ req: { user } }) =>
  Boolean(user && (user.role === 'editor' || user.role === 'admin'))

export const editorOrAdminAccessField: FieldAccess = ({ req: { user } }) =>
  Boolean(user && (user.role === 'editor' || user.role === 'admin'))

/**
 * Admin access control
 */
export const adminOnlyAccess: Access = ({ req: { user } }) => Boolean(user && user.role === 'admin')

export const adminOnlyAccessField: FieldAccess = ({ req: { user } }) =>
  Boolean(user && user.role === 'admin')
