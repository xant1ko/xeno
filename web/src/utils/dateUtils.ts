import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/ru'

export const DATE_INPUT_FORMAT = 'DD.MM.YYYY'

/** Принимает дату API или Date, возвращает объект Date. */
export function parseApiDate (value: string | Date): Date {
  if (value instanceof Date) {
    return value
  }
  const hasTimezone = /(Z|[+-]\d{2}:\d{2})$/.test(value)
  return new Date(hasTimezone ? value : value + 'Z')
}

/** Принимает дату API или Date, возвращает локализованную дату-время либо undefined. */
export function getLocaleString (dateToPars: string | Date | undefined): undefined | string {
  if (!dateToPars) {
    return undefined
  }
  const dateToFormat = parseApiDate(dateToPars)
  return dateToFormat.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

/** Принимает дату и разделитель, возвращает строку даты либо null. */
export function dateToString (date: Date | string | null,
  separator?: string | null | undefined): string | null {
  if (date === null) {
    return null
  } else {
    const d = parseApiDate(date)
    const year = String(d.getFullYear())
    let month = String(d.getMonth() + 1)
    if (month.length < 2) {
      month = '0' + month
    }
    let day = String(d.getDate())
    if (day.length < 2) {
      day = '0' + day
    }
    if (separator === null || separator === undefined) {
      separator = '-'
    }
    return `${year}${separator}${month}${separator}${day}`
  }
}

/** Принимает строку в формате DATE_INPUT_FORMAT, возвращает Date либо null. */
export function parseManualDate (value: string): Date | null {
  const parsedDate = dayjs(value.trim(), DATE_INPUT_FORMAT, true)

  return parsedDate.isValid() ? parsedDate.toDate() : null
}

/** Принимает Date или строку даты, возвращает строку для поля ввода. */
export function formatDateForInput (value: Date | string): string {
  return dayjs(value).format(DATE_INPUT_FORMAT)
}

/** Принимает Date, возвращает строку в формате API date-time. */
export function dateToApiDateTime (date: Date): string {
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss')
}

/** Принимает дату и необязательные границы, возвращает попадание даты в диапазон. */
export function isDateInRange (date: Date, min?: Date, max?: Date): boolean {
  const dateTimestamp = dayjs(date).startOf('day').valueOf()
  const minTimestamp = min ? dayjs(min).startOf('day').valueOf() : undefined
  const maxTimestamp = max ? dayjs(max).startOf('day').valueOf() : undefined

  return (minTimestamp === undefined || dateTimestamp >= minTimestamp)
    && (maxTimestamp === undefined || dateTimestamp <= maxTimestamp)
}

/** Принимает две даты, возвращает разницу между ними в днях. */
export function getDayDifference (date1: Date, date2: Date): number {
  const diffTime = date2.getTime() - date1.getTime()
  return Math.round(diffTime / (1000 * 3600 * 24))
}

/** Принимает строку даты API, возвращает локализованную дату и время. */
export function formatDateTime (value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parseApiDate(value))
}

/** Принимает строку даты API, возвращает локализованную дату с названием месяца. */
export function formatDateLong (value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parseApiDate(value))
}

/** Принимает строку даты API, возвращает короткую локализованную дату. */
export function formatDateShort (value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
  }).format(parseApiDate(value))
}

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(relativeTime)
dayjs.locale('ru')

/** Принимает даты создания и обновления, возвращает описание последнего изменения либо null. */
export function formatRelativeDateInfo (
  createdDate: string | Date | undefined,
  updatedDate: string | Date | undefined,
): string | null {
  if (!createdDate && !updatedDate) {
    return null
  }

  const created = createdDate ? dayjs.utc(parseApiDate(createdDate)) : null
  const updated = updatedDate ? dayjs.utc(parseApiDate(updatedDate)) : null

  let isUpdated = false
  let latest: dayjs.Dayjs | null = null

  if (updated && (!created || updated.isAfter(created))) {
    latest = updated
    isUpdated = true
  } else if (created) {
    latest = created
    isUpdated = false
  } else if (updated) {
    latest = updated
    isUpdated = true
  }

  if (!latest) {
    return null
  }

  const now = dayjs.utc()
  const diffDays = now.diff(latest, 'day')
  const action = isUpdated ? 'обновлено' : 'создано'

  if (diffDays > 30) {
    return `${action} ${formatDateTime(latest.toISOString())}`
  }

  const relative = latest.from(dayjs.utc())
  return `${action} ${relative}`
}
