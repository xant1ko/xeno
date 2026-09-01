import type { Role } from '@/stores/userStore'

export type UserRole = Role['title']
export type Permission = 'read' | 'create' | 'update' | 'delete' | 'visibility'

const allRoles: readonly UserRole[] = [
  'student',
  'teacher',
  'admin',
  'manager',
  'promoter',
  'salesman',
]

const staffRoles: readonly UserRole[] = ['teacher', 'admin', 'manager']
const potentialStudentReadRoles: readonly UserRole[] = [
  'teacher',
  'admin',
  'promoter',
  'salesman',
]
const employeeRoles: readonly UserRole[] = allRoles.filter(role => role !== 'student')

export const entityPermissions = {
  courses: {
    read: allRoles,
    create: ['teacher'],
    update: ['teacher'],
    delete: ['teacher'],
  },
  directions: {
    read: allRoles,
    create: ['teacher'],
    update: ['teacher'],
    delete: ['teacher'],
  },
  themes: {
    read: allRoles,
    create: ['teacher'],
    update: ['teacher'],
    delete: ['teacher'],
  },
  students: {
    read: employeeRoles,
    create: ['admin'],
    update: ['admin'],
    delete: ['admin'],
  },
  studentProgress: {
    read: ['student', 'teacher', 'admin', 'manager'],
  },
  potentialStudents: {
    read: potentialStudentReadRoles,
    create: ['promoter', 'salesman', 'admin'],
    update: ['promoter', 'salesman', 'admin'],
    delete: ['admin'],
  },
  users: {
    read: staffRoles,
    update: ['manager'],
  },
  agentSchedules: {
    read: staffRoles,
    create: staffRoles,
    update: staffRoles,
    delete: staffRoles,
  },
  agentChats: {
    read: staffRoles,
    create: staffRoles,
    update: staffRoles,
    delete: staffRoles,
  },
  counter: {
    read: staffRoles,
  },
  likes: {
    read: ['manager'],
    create: ['manager'],
    update: ['manager'],
    delete: ['manager'],
  },
  comments: {
    create: ['student', 'teacher', 'admin', 'manager'],
    update: ['student', 'teacher', 'admin', 'manager'],
    visibility: ['teacher', 'admin', 'manager'],
  },
  files: {
    create: ['admin'],
  },
} as const satisfies Record<string, Partial<Record<Permission, readonly UserRole[]>>>

export type EntityName = keyof typeof entityPermissions

export function canAccessPermission (
  entity: EntityName,
  permission: Permission,
  hasRole: (role: UserRole) => boolean,
): boolean {
  const roles = (entityPermissions[entity] as Partial<Record<Permission, readonly UserRole[]>>)[permission]
  return !roles?.length || roles.some(role => hasRole(role))
}
