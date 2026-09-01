import type { EntityName, Permission } from '@/config/permissions'
import { computed, reactive } from 'vue'
import { canAccessPermission } from '@/config/permissions'
import { useUserStore } from '@/stores/userStore'

/**
 * Состояние разрешений, запрошенных компонентом.
 *
 * Объект содержит только те разрешения, которые были переданы
 * в `useEntityPermissions`.
 */
export type EntityPermissionState<Permissions extends readonly Permission[]> = {
  [PermissionName in Permissions[number]]: boolean
}

/**
 * Возвращает реактивные разрешения текущего пользователя для указанной сущности.
 *
 * Передавайте только те разрешения, которые реально используются в компоненте:
 *
 * const permissions = useEntityPermissions('courses', ['read', 'update'])
 *
 * В результате будут доступны только запрошенные разрешения:
 *
 * permissions.read
 * permissions.update
 *
 * Если компоненту требуется одно разрешение:
 *
 * const permissions = useEntityPermissions('courses', ['read'])
 *
 * Контекстные правила, например проверка владельца комментария,
 * должны обрабатываться специализированными composable или утилитами,
 * а не этим composable.
 *
 * @param entity Сущность, для которой проверяются разрешения.
 * @param requestedPermissions Список разрешений, необходимых компоненту.
 * @returns Реактивный объект только с запрошенными разрешениями.
 */
export function useEntityPermissions<const Permissions extends readonly Permission[]> (
  entity: EntityName,
  requestedPermissions: Permissions,
): EntityPermissionState<Permissions> {
  const userStore = useUserStore()

  const permissions = Object.fromEntries(
    requestedPermissions.map(permission => [
      permission,
      computed(() => canAccessPermission(entity, permission, role => userStore.isHasRole(role))),
    ]),
  )

  return reactive(permissions) as unknown as EntityPermissionState<Permissions>
}
