import type { Access, FieldAccess } from 'payload'

/**
 * Public access control - 任何人可访问
 */
export const publicAccess: Access = () => true
export const publicAccessField: FieldAccess = () => true

/**
 * Authenticated access control - 需要登录
 */
export const authenticatedAccess: Access = ({ req: { user } }) =>
  Boolean(user?.isActive !== false && user?.role)

export const authenticatedAccessField: FieldAccess = ({ req: { user } }) =>
  Boolean(user?.isActive !== false && user?.role)

/**
 * Self or admin access - 用户只能访问自己的数据，管理员可访问所有
 */
export const selfOrAdminAccess: Access = ({ req: { user } }) => {
  // 检查用户是否存在、是否活跃、是否有有效角色
  if (!user || user.isActive === false || !user.role) return false
  if (user.role === 'admin') return true
  return { id: { equals: user.id } }
}

/**
 * Admin only access - 仅管理员
 */
export const adminOnlyAccess: Access = ({ req: { user } }) =>
  Boolean(user?.isActive !== false && user?.role === 'admin')

export const adminOnlyAccessField: FieldAccess = ({ req: { user } }) =>
  Boolean(user?.isActive !== false && user?.role === 'admin')

/**
 * Content management access - 内容编辑及以上权限
 * 适用于：内容发布、编辑文章等
 */
export const contentManagerAccess: Access = ({ req: { user } }) => {
  if (!user || user.isActive === false || !user.role) return false
  return ['admin', 'editor'].includes(user.role)
}

export const contentManagerAccessField: FieldAccess = ({ req: { user } }) => {
  if (!user || user.isActive === false || !user.role) return false
  return ['admin', 'editor'].includes(user.role)
}

/**
 * Member and above access - 会员及以上权限
 * 适用于：查看会员专区内容、参与讨论等
 */
export const memberAndAboveAccess: Access = ({ req: { user } }) => {
  if (!user || user.isActive === false || !user.role) return false
  return ['admin', 'editor', 'member'].includes(user.role)
}

export const memberAndAboveAccessField: FieldAccess = ({ req: { user } }) => {
  if (!user || user.isActive === false || !user.role) return false
  return ['admin', 'editor', 'member'].includes(user.role)
}

/**
 * Published or privileged access - 已发布的公开内容 或 有权限用户可查看草稿
 * 适用于：内容展示，公开查看已发布内容，编辑者可查看草稿
 */
export const publishedOrPrivilegedAccess: Access = ({ req: { user } }) => {
  // 有编辑权限的用户可以查看所有内容（包括草稿）
  if (user?.isActive !== false && ['admin', 'editor'].includes(user?.role)) {
    return true
  }
  // 其他用户只能查看已发布内容
  return { _status: { equals: 'published' } }
}

/**
 * Role hierarchy helper - 角色层级检查工具
 */
const roleHierarchy = ['member', 'editor', 'admin']

export const validateRole = (role: string): boolean => roleHierarchy.includes(role)

export const hasMinimumRole = (userRole: string, minimumRole: string): boolean => {
  const userLevel = roleHierarchy.indexOf(userRole)
  const minLevel = roleHierarchy.indexOf(minimumRole)
  return userLevel >= minLevel && userLevel !== -1 && minLevel !== -1
}

/**
 * Minimum role access factory - 创建最小角色权限检查函数
 */
export const createMinimumRoleAccess =
  (minimumRole: string): Access =>
  ({ req: { user } }) => {
    if (!user || user.isActive === false) return false
    return hasMinimumRole(user.role, minimumRole)
  }

export const createMinimumRoleAccessField =
  (minimumRole: string): FieldAccess =>
  ({ req: { user } }) => {
    if (!user || user.isActive === false) return false
    return hasMinimumRole(user.role, minimumRole)
  }
