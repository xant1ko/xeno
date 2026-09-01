import { useNotify } from '@/composables/useNotify'

export function camelToKebab (s: string): string {
  return String(s).replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())
}

export function isValueFilled (value: any): boolean {
  return value !== null && value !== undefined && value !== ''
}

export function addPropertyIfExists (obj: Record<string, string>, property: any, propertyName: string): void {
  if (isValueFilled(property)) {
    obj[propertyName] = property
  }
}

export function getCountOfSelectedFilters (filter: any, defaultFilter: typeof filter): number {
  let count = 0

  for (const key of Object.keys(filter)) {
    if (
      key !== 'offset'
      && key !== 'page'
      && key !== 'sort_by'
      && key !== 'limit'
      && key !== 'search_str'
      && key !== 'sort_desc'
      && !(Array.isArray(filter[key]) && filter[key].length === 0)
      && filter[key] !== defaultFilter[key]
      && filter[key] !== null
    ) {
      count++
    }
  }
  return count
}

export function getPercentage (numberToSlice: number): string {
  return String(Math.floor(numberToSlice * 10_000) / 100)
}

export function parseErrorToAlert (errors: Array<any>): string {
  return String(errors.map(err => {
    if (err.msg == 'Field required') {
      return `Обязательное поле: ${err.loc[1]}`
    }
  }))
}

export type customSpeciality = {
  name: string
  uid: string
}

export function alertChooseElementFromList (): void {
  useNotify().info('Выберите элемент из списка')
}

export function getCustomNamesSpecialities (items: any): customSpeciality[] {
  const customItems: customSpeciality[] = []
  for (const item of items) {
    customItems.push({
      name: `${item.name} (${item.code})`,
      uid: item.uid,
    })
  }
  return customItems
}

export function checkObjToEmptyKeys (obj: any, valid?: boolean): boolean {
  valid = true

  if (typeof obj === 'object' && obj) {
    for (const key of Object.keys(obj)) {
      if (!obj[key] && key != 'is_archived') {
        valid = false
      } else if (key == 'is_archived' && (obj[key] == undefined || obj[key] == null)) {
        valid = false
      }
    }
    return valid
  }
  return valid
}

export function chechArrToEmptyKeys (arr: any, customKey: string): boolean {
  let valid = true

  if (Array.isArray(arr) && arr.length > 0) {
    for (const obj of arr) {
      if (!obj[customKey] || obj[customKey] == '') {
        valid = false
        break
      }
    }
    return valid
  }
  return valid
}

export const enAlphabet = 'abcdefghijklmnopqrstuvwxyz'

export function getCharByIndex (index: number): string | undefined {
  return enAlphabet[index]
}

export function getNextChar (c: string): string {
  const target_index = enAlphabet.indexOf(c)
  const nextChar = enAlphabet[target_index + 1] || ''
  return nextChar
}

export function getPrevChar (c: string): string {
  const target_index = enAlphabet.indexOf(c)
  const prevChar = enAlphabet[target_index + 1] || ''
  return prevChar as string
}

export const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function logEmptyKeys (obj: Record<string, any>): void {
  Object.keys(obj).forEach(el => {
    console.log(el, obj[el])
  })
}

export const offsetInMilliseconds: number = (new Date().getTimezoneOffset() * 60 * 1000)
