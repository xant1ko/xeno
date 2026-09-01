export type Course = {
  uid?: string
  title: string
  description?: string | null
  order?: number
  is_archived?: boolean
  created_date?: string
}

export type CourseInput = {
  title: string
  description?: string | null
  order?: number
  is_archived?: boolean
}

export type CourseUpdate = {
  title?: string | null
  description?: string | null
  order?: number | null
  is_archived?: boolean | null
}

export type Student = {
  uid?: string
  fullname?: string
  github?: string | null
  telegram?: string | null
  phone_number?: string | null
  primary_course_uid?: string
  is_archived?: boolean
  created_date?: string
}

export type StudentInput = {
  fullname: string
  github?: string | null
  telegram?: string | null
  phone_number?: string | null
  primary_course_uid: string
  is_archived?: boolean
}

export type StudentUpdate = {
  fullname?: string | null
  github?: string | null
  telegram?: string | null
  phone_number?: string | null
  primary_course_uid?: string | null
  is_archived?: boolean | null
}

export type User = {
  uid?: string
  fullname: string
  email?: string | null
  registration_date?: string
  last_login_date?: string | null
  last_update_date?: string
  is_archived?: boolean
  roles: Array<{ uid: string, title: 'teacher' | 'admin' | 'manager' }>
}

export type UserUpdate = {
  fullname: string
  email: string
  password?: string | null
}

export function getHello (): string {
  return 'Hello, world!'
}
