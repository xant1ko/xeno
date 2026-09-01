import type { RouteLocation } from 'vue-router'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { entityPermissions, type UserRole } from '@/config/permissions'
import router from '@/router'
import { useUserStore } from './userStore'

export interface BreadcrumbItem {
  title: string
  to?: string
  disabled?: boolean
}

export interface NavPage {
  id: string
  title: string
  path: string
  roles: readonly UserRole[]
  icon: string
}

export interface NavGroup {
  id: string
  title: string
  icon: string
  items: NavPage[]
}

export const useNavigateStore = defineStore(
  'navigate',
  () => {
    const currentRoute = ref<RouteLocation>()
    const detailEntityItem = ref<{ uid: string, title: string } | null>(null)
    // Полный путь (с query) последнего визита на каждую страницу-список из
    // бокового меню — чтобы крошка "назад" на детальной странице могла
    // восстановить фильтры, а не просто отрезать последний сегмент пути.
    const lastFullPathByPath = ref<Record<string, string>>({})
    const isDrawerRail = ref(true)

    const allRoutes = router.getRoutes()

    const pages: NavGroup[] = [
      {
        id: 'education',
        title: 'Обучение',
        icon: 'mdi-school-outline',
        items: [
          {
            id: 'directions',
            title: 'Направления',
            path: '/directions',
            roles: entityPermissions.directions.read,
            icon: 'mdi-arrow-expand-all',
          },
          {
            id: 'courses',
            title: 'Курсы',
            path: '/courses',
            roles: entityPermissions.courses.read,
            icon: 'mdi-book-multiple',
          },
          {
            id: 'themes',
            title: 'Темы',
            path: '/themes',
            roles: entityPermissions.themes.read,
            icon: 'mdi-book-open-variant',
          },
        ],
      },
      {
        id: 'students',
        title: 'Студенты',
        icon: 'mdi-account-school-outline',
        items: [
          {
            id: 'students',
            title: 'Студенты',
            path: '/students',
            roles: entityPermissions.students.read,
            icon: 'mdi-school',
          },
          {
            id: 'progress',
            title: 'Прогресс студентов',
            path: '/progress',
            roles: entityPermissions.studentProgress.read,
            icon: 'mdi-chart-line',
          },
          {
            id: 'counter',
            title: 'Поступление студентов',
            path: '/counter',
            roles: entityPermissions.counter.read,
            icon: 'mdi-chart-scatter-plot',
          },
          {
            id: 'potential-students',
            title: 'Потенциальные студенты',
            path: '/potential-students',
            roles: entityPermissions.potentialStudents.read,
            icon: 'mdi-account-question',
          },
        ],
      },
      {
        id: 'agent',
        title: 'Агент',
        icon: 'mdi-robot-outline',
        items: [
          {
            id: 'agent-chats',
            title: 'Чаты с агентом',
            path: '/agent-chats',
            roles: entityPermissions.agentChats.read,
            icon: 'mdi-robot',
          },
          {
            id: 'agent-schedules',
            title: 'Расписания агента',
            path: '/agent-schedules',
            roles: entityPermissions.agentSchedules.read,
            icon: 'mdi-calendar-clock',
          },
        ],
      },
      {
        id: 'administration',
        title: 'Администрирование',
        icon: 'mdi-cog-outline',
        items: [
          {
            id: 'users',
            title: 'Пользователи',
            path: '/users',
            roles: entityPermissions.users.read,
            icon: 'mdi-account-multiple',
          },
          {
            id: 'likes',
            title: 'Типы лайков',
            path: '/likes',
            roles: entityPermissions.likes.read,
            icon: 'mdi-emoticon-outline',
          },
        ],
      },
    ]

    const filteredPages = computed(() =>
      pages
        .map(group => ({
          ...group,
          items: group.items.filter(page =>
            page.roles.length === 0 || page.roles.some(role => useUserStore().isHasRole(role)),
          ),
        }))
        .filter(group => group.items.length > 0),
    )

    // Каждая навигация (в т.ч. смена фильтров на странице-списке — для
    // vue-router это тоже навигация, т.к. меняется query) обновляет
    // currentRoute. Если это одна из страниц-списков — запоминаем её полный
    // путь с актуальным query.
    watch(currentRoute, route => {
      if (!route) {
        return
      }
      const isListPage = pages.some(group => group.items.some(page => page.path === route.path))
      if (isListPage) {
        lastFullPathByPath.value[route.path] = route.fullPath
      }
    })

    const absolutePathMap = computed((): BreadcrumbItem[] => {
      if (!currentRoute.value) {
        return []
      }

      const route = currentRoute.value

      if (route.path === '/') {
        return []
      }

      if (detailEntityItem.value?.title) {
        const parentPath
          = '/' + route.path.split('/').filter(Boolean).slice(0, -1).join('/')
        const parentRoute = allRoutes.find(r => r.path === parentPath)

        return [
          {
            title: parentRoute?.name
              ? String(parentRoute.name)
              : String(route.name || ''),
            to: lastFullPathByPath.value[parentPath] ?? parentPath,
            disabled: false,
          },
          {
            title: detailEntityItem.value.title,
            to: route.fullPath,
            disabled: true,
          },
        ]
      }

      return [
        {
          title: String(route.name || ''),
          to: route.path,
          disabled: true,
        },
      ]
    })

    function setDetailItem (uid: string, title: string): void {
      detailEntityItem.value = { uid, title }
    }

    return {
      currentRoute,
      detailEntityItem,
      lastFullPathByPath,
      isDrawerRail,
      absolutePathMap,
      setDetailItem,
      pages,
      filteredPages,
    }
  },
  {
    persist: true,
  },
)
