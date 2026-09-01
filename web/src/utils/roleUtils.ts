export const roleLabels: Record<string, string> = {
  teacher: 'Преподаватель',
  admin: 'Администратор',
  manager: 'Менеджер',
  promoter: 'Промоутер',
  salesman: 'МОП',
  student: 'Студент',
}

export function getRoleLabel (role: string): string {
  return roleLabels[role] || role
}
