import cronstrue from 'cronstrue'
import 'cronstrue/locales/ru'

export function cronToRussian (cron: string, alternatestringToReturn?: string): string {
  try {
    return cronstrue.toString(cron, {
      locale: 'ru',
    })
  } catch {
    if (alternatestringToReturn) {
      return alternatestringToReturn
    }
    return cron
  }
}
