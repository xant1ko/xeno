import type { StudentProgressPoint } from '@/types/generated'
import { computed, type Ref } from 'vue'

export type Period = 'monthly' | 'quarterly' | 'yearly'
export type ChartType = 'cumulative' | 'discrete'

export interface ChartPoint {
  day: string
  label: string
  themes: number
}

function formatDate (date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isDateInPeriod (date: Date, period: Period, now: Date): boolean {
  // `date` парсится из голой строки "YYYY-MM-DD" ("2026-08-29" -> UTC-полночь),
  // а `now` — реальный текущий момент в локальном часовом поясе. Это не одно
  // и то же "начало координат", поэтому сырое now.getTime() - date.getTime()
  // может уйти в минус для сегодняшнего дня (пока не наступит столько часов
  // локального времени, сколько составляет смещение от UTC). Приводим `now`
  // к такой же "UTC-полночи её календарного дня" через тот же formatDate(),
  // которым уже размечена сетка графика — тогда сравниваются сопоставимые
  // точки, независимо от времени суток и часового пояса пользователя.
  const normalizedNow = new Date(formatDate(now))
  const diff = normalizedNow.getTime() - date.getTime()
  switch (period) {
    case 'monthly': { return diff >= 0 && diff < 30 * 24 * 60 * 60 * 1000
    }
    case 'quarterly': { return diff >= 0 && diff < 90 * 24 * 60 * 60 * 1000
    }
    case 'yearly': { return diff >= 0 && diff < 365 * 24 * 60 * 60 * 1000
    }
    default: { return true
    }
  }
}

function filterByPeriod (
  data: StudentProgressPoint[],
  period: Period,
): StudentProgressPoint[] {
  if (data.length === 0) {
    return []
  }

  const now = new Date()

  const withParsed = data
    .filter(item => isDateInPeriod(new Date(item.day), period, now))
    .map(item => ({ item, date: new Date(item.day).getTime() }))

  withParsed.sort((a, b) => a.date - b.date)

  return withParsed.map(entry => entry.item)
}

function generatePeriodGrid (period: Period): ChartPoint[] {
  const now = new Date()

  switch (period) {
    case 'monthly': {
      return Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - (29 - i))
        const day = String(date.getDate()).padStart(2, '0')
        return {
          day: formatDate(date),
          label: `${day}`,
          themes: 0,
        }
      })
    }
    case 'quarterly': {
      const start = new Date(now)
      start.setDate(start.getDate() - 90)
      while (start.getDay() !== 1) {
        start.setDate(start.getDate() - 1)
      }

      const mondays: ChartPoint[] = []
      const current = new Date(start)

      while (current <= now) {
        const day = String(current.getDate()).padStart(2, '0')
        const month = String(current.getMonth() + 1).padStart(2, '0')
        mondays.push({
          day: formatDate(current),
          label: `${day}.${month}`,
          themes: 0,
        })
        current.setDate(current.getDate() + 7)
      }

      return mondays
    }
    case 'yearly': {
      const monthNames = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
        return {
          day: formatDate(date),
          label: monthNames[(now.getMonth() - 11 + i + 12) % 12] ?? `Месяц ${i + 1}`,
          themes: 0,
        }
      })
    }
    default: {
      return []
    }
  }
}

function getPreviousPeriodLastValue (
  data: StudentProgressPoint[],
  period: Period,
  now: Date,
): number | undefined {
  // Та же нормализация, что в isDateInPeriod — иначе "start"/"end" границы
  // окна тоже будут сдвинуты на часовой пояс относительно распарсенных
  // из строк дат в data.
  const nowMs = new Date(formatDate(now)).getTime()

  switch (period) {
    case 'monthly': {
      const start = new Date(nowMs - 60 * 24 * 60 * 60 * 1000)
      const end = new Date(nowMs - 30 * 24 * 60 * 60 * 1000)
      const prevData = data.filter(item => {
        const date = new Date(item.day).getTime()
        return date >= start.getTime() && date <= end.getTime()
      })
      return prevData.at(-1)?.themes
    }
    case 'quarterly': {
      const start = new Date(nowMs - 180 * 24 * 60 * 60 * 1000)
      const end = new Date(nowMs - 90 * 24 * 60 * 60 * 1000)
      const prevData = data.filter(item => {
        const date = new Date(item.day).getTime()
        return date >= start.getTime() && date <= end.getTime()
      })
      return prevData.at(-1)?.themes
    }
    case 'yearly': {
      const start = new Date(nowMs - 730 * 24 * 60 * 60 * 1000)
      const end = new Date(nowMs - 365 * 24 * 60 * 60 * 1000)
      const prevData = data.filter(item => {
        const date = new Date(item.day).getTime()
        return date >= start.getTime() && date <= end.getTime()
      })
      return prevData.at(-1)?.themes
    }
    default: {
      return undefined
    }
  }
}

function mergeMonthly (
  emptyData: ChartPoint[],
  realData: StudentProgressPoint[],
): ChartPoint[] {
  const dataMap = new Map<string, number>()

  for (const item of realData) {
    dataMap.set(item.day, (dataMap.get(item.day) || 0) + item.themes)
  }

  return emptyData.map(item => ({
    ...item,
    themes: dataMap.get(item.day) || 0,
  }))
}

function getWeekData (
  weekStartDate: string,
  realData: StudentProgressPoint[],
): StudentProgressPoint[] {
  const weekStart = new Date(weekStartDate)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)

  return realData.filter(item => {
    const itemDate = new Date(item.day)
    return itemDate >= weekStart && itemDate <= weekEnd
  })
}

function mergeQuarterly (
  emptyData: ChartPoint[],
  realData: StudentProgressPoint[],
  isCumulative_: boolean,
): ChartPoint[] {
  return emptyData.map(point => {
    const weekData = getWeekData(point.day, realData)

    let weekValue: number

    if (weekData.length > 0) {
      if (isCumulative_) {
        weekValue = Math.max(...weekData.map(item => item.themes))
      } else {
        weekValue = weekData.reduce((sum, item) => sum + item.themes, 0)
      }
    } else {
      weekValue = 0
    }

    return {
      day: point.day,
      label: point.label,
      themes: weekValue,
    }
  })
}

function mergeYearly (
  emptyData: ChartPoint[],
  realData: StudentProgressPoint[],
  isCumulative_: boolean,
): ChartPoint[] {
  const monthMap = new Map<string, StudentProgressPoint[]>()

  for (const point of realData) {
    const d = new Date(point.day)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = monthMap.get(key) || []
    bucket.push(point)
    monthMap.set(key, bucket)
  }

  return emptyData.map(item => {
    const d = new Date(item.day)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const monthData = monthMap.get(key) || []

    let monthValue: number

    if (monthData.length > 0) {
      if (isCumulative_) {
        monthValue = Math.max(...monthData.map(point => point.themes))
      } else {
        monthValue = monthData.reduce(
          (sum, point) => sum + point.themes,
          0,
        )
      }
    } else {
      monthValue = 0
    }

    return {
      day: item.day,
      label: item.label,
      themes: monthValue,
    }
  })
}

function mergeData (
  emptyData: ChartPoint[],
  realData: StudentProgressPoint[],
  period: Period,
  isCumulative_: boolean,
): ChartPoint[] {
  if (realData.length === 0) {
    return emptyData
  }

  switch (period) {
    case 'monthly': {
      return mergeMonthly(emptyData, realData)
    }
    case 'quarterly': {
      return mergeQuarterly(emptyData, realData, isCumulative_)
    }
    case 'yearly': {
      return mergeYearly(emptyData, realData, isCumulative_)
    }
    default: {
      return emptyData
    }
  }
}

export function useStudentProgressGraphData (
  rawData: Ref<StudentProgressPoint[] | undefined>,
  period: Ref<Period>,
  chartType: Ref<ChartType>,
): { chartData: Ref<ChartPoint[]>, isCumulative: Ref<boolean>, localMax: Ref<number> } {
  const isCumulative = computed(() => chartType.value === 'cumulative')

  const chartData = computed((): ChartPoint[] => {
    if (!rawData.value || rawData.value.length === 0) {
      return generatePeriodGrid(period.value)
    }

    const filteredData = filterByPeriod(rawData.value, period.value)
    const emptyData = generatePeriodGrid(period.value)

    let data = mergeData(
      emptyData,
      filteredData,
      period.value,
      isCumulative.value,
    )

    if (isCumulative.value) {
      const now = new Date()
      const seed = getPreviousPeriodLastValue(rawData.value, period.value, now) ?? 0
      let maxValue = seed
      data = data.map(point => {
        if (point.themes > maxValue) {
          maxValue = point.themes
        }

        return {
          ...point,
          themes: maxValue,
        }
      })
    }

    return data
  })

  const localMax = computed(() => {
    const values = chartData.value.map(p => p.themes)
    return values.length > 0 ? Math.max(...values) : 0
  })

  return { chartData, isCumulative, localMax }
}
