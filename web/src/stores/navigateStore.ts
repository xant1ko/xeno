import type { RouteLocation } from 'vue-router'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import router from '@/router'

export interface BreadcrumbItem {
  title: string
  to?: string
  disabled?: boolean
}

export interface NavPage {
  id: string
  title: string
  path: string
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
        id: 'students',
        title: 'Финансы',
        icon: 'mdi-cash',
        items: [
          {
            id: 'potential-students',
            title: 'Расписание операций',
            path: '/operation-schedule',
          },
        ],
      }
    ]

    const filteredPages = computed(() =>
      pages
        .map(group => ({
          ...group,
          items: group.items,
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
