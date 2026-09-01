import type { UserOutput, UserUpdate } from '@/types/generated'

// Фиксированный пользователь заменяет запросы к backend на время разработки.
const defaultUser: UserOutput = {
  // Стабильный UID нужен для ссылок на профиль пользователя.
  uid: 'mock-user-xeno',
  // Имя отображается в шапке и профиле приложения.
  fullname: 'Пользователь xeno',
  // Этот email используется для входа в моковый аккаунт.
  email: 'user@xeno.local',
  // Дата нужна, чтобы соответствовать контракту UserOutput.
  registration_date: '2026-01-01T00:00:00Z',
  // Пустая дата показывает, что это тестовый локальный пользователь.
  last_login_date: null,
  // Дата нужна для совместимости с API-моделью.
  last_update_date: '2026-01-01T00:00:00Z',
  // Пустой список сохраняет модель, но не включает механику ролей.
  roles: [],
  // Локальный пользователь не связан с отдельной записью студента.
  student_uid: null,
  // Моковый пользователь не архивирован.
  is_archived: false,
}

// Текущее состояние сервиса хранится в памяти браузера.
let currentUser: UserOutput | null = { ...defaultUser }

// Копия защищает состояние сервиса от прямого изменения компонентами.
function cloneUser (user: UserOutput): UserOutput {
  return { ...user, roles: [...user.roles] }
}

// Возвращаем текущего пользователя без сетевого запроса.
export function getMockUser (): UserOutput | null {
  return currentUser ? cloneUser(currentUser) : null
}

// Создаём сессию для любого валидного email из формы входа.
export function loginMockUser (email: string): UserOutput {
  currentUser = cloneUser({
    ...defaultUser,
    email: email || defaultUser.email,
    last_login_date: new Date().toISOString(),
  })
  return cloneUser(currentUser)
}

// Обновляем доступные поля профиля локально.
export function updateMockUser (data: UserUpdate): UserOutput {
  currentUser = cloneUser({
    ...(currentUser ?? defaultUser),
    fullname: data.fullname ?? currentUser?.fullname ?? defaultUser.fullname,
    email: data.email ?? currentUser?.email ?? defaultUser.email,
    last_update_date: new Date().toISOString(),
  })
  return cloneUser(currentUser)
}

// Завершаем локальную сессию пользователя.
export function logoutMockUser (): void {
  currentUser = null
}
