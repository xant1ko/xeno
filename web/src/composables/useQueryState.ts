// composables/useQueryState.ts
import { computed, type ComputedRef, nextTick, type Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { FilterParseType } from '@/utils/filterConstants'
import { getCountOfSelectedFilters } from '@/utils/generalUtils'
import {
  getSortDesc,
  mapObjectFromURL,
  mapObjectToURL,
  mapPaginationFromURL,
  mapPaginationToURL,
  mapSortFromURL,
  mapSortToURL,
} from '@/utils/urlMappingUtils'

// ========== Общие поля фильтров ==========
// Поля, которые присутствуют во всех списках. useQueryState мёржит их
// с индивидуальными полями, переданными вьюхой (см. individualFilterDefaults).
export const COMMON_FILTER_DEFAULTS = {
  search_str: undefined as string | undefined,
  is_archived: false as boolean | undefined | null,
} as const

export const COMMON_FILTER_TYPES = {
  search_str: FilterParseType.String,
  is_archived: FilterParseType.BooleanOrNull,
} as const

// ========== Общие поля пагинации ==========
// Дефолтные значения пагинации, общие для всех списков (см. DEFAULT_TABLE_PARAMS).
export const COMMON_PAGINATION_DEFAULTS = {
  page: 1,
  itemsPerPage: 10,
} as const

// ========== Типы ==========
export interface PaginationState {
  page: number
  itemsPerPage: number
  totalItems: number // только для хранения общего количества, не синхронизируется с URL
}

export interface SortItem {
  key: string
  order: 'asc' | 'desc' | undefined
}

export interface UseQueryStateOptions<TFilter> {
  // Индивидуальные (для конкретной вьюхи) начальные значения фильтров.
  // Мёржатся с COMMON_FILTER_DEFAULTS (search_str, is_archived).
  individualFilterDefaults: TFilter
  // Индивидуальные типы парсинга для полей фильтра (см. mapObjectToURL/FromURL).
  // Мёржатся с COMMON_FILTER_TYPES.
  individualFilterParsingTypes: Record<keyof TFilter, string>
  // Начальные значения сортировки (массив из одного или нескольких полей)
  sortDefaults: SortItem[]
  // Префикс для ключей фильтров в URL (по умолчанию ''). Если нужен, например, 'f_'
  prefix?: string
  // Задержка (мс) для debounced наблюдения за текстовым поиском (search_str). По умолчанию 300.
  debounceMs?: number
  // Добавлять общие фильтры search_str и is_archived (по умолчанию true).
  includeCommonFilters?: boolean
  // Автоматически обновлять URL при изменении состояния? (по умолчанию true)
  autoSync?: boolean
  // Колбэк, вызываемый при изменении фильтров/пагинации/сортировки.
  // search_str отслеживается с debounce (debounceMs), остальные фильтры и
  // пагинация/сортировка — мгновенно. НЕ вызывается при первичной синхронизации
  // из URL (её view обрабатывает сама, например в onMounted).
  onFetch?: () => Promise<void> | void
}

// ========== Композабл ==========
export function useQueryState<TFilter extends Record<string, any>> (
  options: UseQueryStateOptions<TFilter>,
): {
  filters: Ref<TFilter & typeof COMMON_FILTER_DEFAULTS>
  pagination: Ref<PaginationState>
  sortBy: Ref<SortItem[]>
  countOfSelectedFilters: ComputedRef<number>
  updateFilters: (partial: Partial<TFilter>) => void
  resetFilters: () => void
  syncAllFromRoute: () => void
  pushAllToRoute: (replace?: boolean) => Promise<void>
  getNormalizedFilters: () => TFilter
  getRequestParams: () => Record<string, any>
} {
  const route = useRoute()
  const router = useRouter()
  const {
    individualFilterDefaults,
    individualFilterParsingTypes,
    sortDefaults,
    prefix = '',
    debounceMs = 300,
    includeCommonFilters = true,
    autoSync = true,
    onFetch,
  } = options

  // ----- Мёрж общих и индивидуальных полей фильтров -----
  const filterDefaults = {
    ...(includeCommonFilters ? COMMON_FILTER_DEFAULTS : {}),
    ...individualFilterDefaults,
  }

  const filterParsingTypes = {
    ...(includeCommonFilters ? COMMON_FILTER_TYPES : {}),
    ...individualFilterParsingTypes,
  }

  // ----- Реактивное состояние -----
  const filters = ref<TFilter>({ ...filterDefaults } as TFilter)
  const pagination = ref<PaginationState>({
    page: COMMON_PAGINATION_DEFAULTS.page,
    itemsPerPage: COMMON_PAGINATION_DEFAULTS.itemsPerPage,
    totalItems: 0,
  })
  const sortBy = ref<SortItem[]>([...sortDefaults])

  // Количество выбранных (не дефолтных) фильтров. Только для UI, не синхронизируется с URL.
  const countOfSelectedFilters = computed(() => (
    getCountOfSelectedFilters(filters.value, filterDefaults)
  ))

  // ===== 1. Фильтры (работа с URL через mapObjectToURL/FromURL) =====
  function syncFiltersFromRoute (): void {
    const query = route.query as Record<string, string>
    const temp = { ...filterDefaults }
    mapObjectFromURL(query, temp, prefix, filterDefaults, filterParsingTypes)
    filters.value = temp as TFilter
  }

  function getNormalizedFilters (): TFilter {
    const normalized = { ...filters.value }
    for (const key in filterParsingTypes) {
      // Пустая строка для строковых фильтров → undefined
      if (filterParsingTypes[key] === 'string' && normalized[key] === '') {
        (normalized as any)[key] = undefined
      }
      // Пустой массив (для stringArray и т.п.) → undefined
      if (Array.isArray(normalized[key]) && normalized[key].length === 0) {
        (normalized as any)[key] = undefined
      }
    }
    return normalized
  }

  function pushFiltersToQuery (existingQuery: Record<string, any> = {}): Record<string, any> {
    const filterQuery = {}
    const normalizedFilters = getNormalizedFilters()
    mapObjectToURL(filterQuery, normalizedFilters, prefix, filterDefaults, filterParsingTypes)
    return { ...existingQuery, ...filterQuery }
  }

  // ===== 2. Пагинация =====
  function syncPaginationFromRoute (): void {
    const query = route.query as Record<string, string>
    const pag = { page: pagination.value.page, itemsPerPage: pagination.value.itemsPerPage }
    mapPaginationFromURL(query, pag, COMMON_PAGINATION_DEFAULTS)
    pagination.value.page = pag.page
    pagination.value.itemsPerPage = pag.itemsPerPage
  }

  function pushPaginationToQuery (existingQuery: Record<string, any> = {}): Record<string, any> {
    const paginationQuery = {}
    mapPaginationToURL(paginationQuery, pagination.value, COMMON_PAGINATION_DEFAULTS)
    return { ...existingQuery, ...paginationQuery }
  }

  // ===== 3. Сортировка =====
  function syncSortFromRoute (): void {
    const query = route.query as Record<string, string>
    const sort = [...sortBy.value]
    mapSortFromURL(query, sort, sortDefaults)
    sortBy.value = sort
  }

  function pushSortToQuery (existingQuery: Record<string, any> = {}): Record<string, any> {
    const sortQuery = {}
    mapSortToURL(sortQuery, sortBy.value, sortDefaults)
    return { ...existingQuery, ...sortQuery }
  }

  // ===== 4. Общая синхронизация из URL → состояние =====
  function syncAllFromRoute (): void {
    syncFiltersFromRoute()
    syncPaginationFromRoute()
    syncSortFromRoute()
  }

  // ===== 5. Запись состояния → URL =====
  async function pushAllToRoute (replace = true): Promise<void> {
    let query = {}
    query = pushFiltersToQuery(query)
    query = pushPaginationToQuery(query)
    query = pushSortToQuery(query)
    const method = replace ? router.replace : router.push
    await method({ query })
  }

  // ===== 6. Публичные методы для управления фильтрами =====
  function updateFilters (partial: Partial<TFilter>): void {
    filters.value = { ...filters.value, ...partial }
  }

  function resetFilters (): void {
    filters.value = { ...filterDefaults } as TFilter
  }

  // ===== 6.1. Формирование параметров запроса для API =====
  // Собирает из текущего состояния фильтров/пагинации/сортировки объект,
  // который можно передать в store.fetchList как body.
  function getRequestParams (): Record<string, any> {
    return {
      ...getNormalizedFilters(),
      limit: pagination.value.itemsPerPage,
      offset: pagination.value.itemsPerPage * (pagination.value.page - 1),
      sort_by: sortBy.value[0]?.key,
      sort_desc: getSortDesc(sortBy.value[0]?.order),
    }
  }

  // ===== 7. Наблюдение за изменениями состояния =====
  // Флаг, подавляющий onFetch при первичной синхронизации из URL (см. ниже).
  let isInitialSync = true

  // Сбрасывает пагинацию на первую страницу при изменении фильтров.
  function resetPageOnFilterChange (): void {
    if (pagination.value.page !== 1) {
      pagination.value.page = 1
    }
    pagination.value.totalItems = 0
  }

  // Текстовый поиск — с debounce (debounceMs).
  let searchTimer: ReturnType<typeof setTimeout> | null = null
  function triggerSearchFetch (): void {
    if (isInitialSync) {
      return
    }
    resetPageOnFilterChange()
    if (searchTimer) {
      clearTimeout(searchTimer)
    }
    searchTimer = setTimeout(() => {
      pushAllToRoute()
      if (onFetch) {
        onFetch()
      }
    }, debounceMs)
  }

  // Остальные фильтры (кроме search_str) — мгновенно.
  function triggerFiltersFetch (): void {
    if (isInitialSync) {
      return
    }
    resetPageOnFilterChange()
    pushAllToRoute()
    if (onFetch) {
      onFetch()
    }
  }

  // Пагинация и сортировка — мгновенно.
  function triggerPaginationFetch (): void {
    if (isInitialSync) {
      return
    }
    pushAllToRoute()
    if (onFetch) {
      onFetch()
    }
  }

  if (autoSync) {
    watch(
      () => (filters.value as any).search_str,
      () => {
        triggerSearchFetch()
      },
    )

    // Остальные фильтры (все ключи, кроме search_str) отслеживаем глубоко.
    watch(
      filters,
      (newFilters, oldFilters) => {
        const searchChanged = newFilters.search_str !== oldFilters.search_str
        if (searchChanged) {
          return // обрабатывается triggerSearchFetch
        }
        triggerFiltersFetch()
      },
      { deep: true },
    )

    watch(pagination, () => {
      triggerPaginationFetch()
    }, { deep: true })

    watch(sortBy, () => {
      triggerPaginationFetch()
    }, { deep: true })
  }

  // Инициализация: читаем состояние из URL. После этого watcher'ы начинают
  // реагировать на пользовательские изменения (первичная синхронизация игнорируется).
  syncAllFromRoute()

  // Сбрасываем флаг в следующем тике, чтобы запланированные watcher'ы от
  // syncAllFromRoute() не вызвали onFetch.
  void nextTick(() => {
    isInitialSync = false
  })

  // ===== 8. Возвращаемое API =====
  return {
    filters: filters as Ref<TFilter & typeof COMMON_FILTER_DEFAULTS>,
    pagination: pagination as Ref<PaginationState>,
    sortBy: sortBy as Ref<SortItem[]>,
    countOfSelectedFilters,
    updateFilters,
    resetFilters,
    syncAllFromRoute,
    pushAllToRoute,
    getNormalizedFilters,
    getRequestParams,
  }
}
