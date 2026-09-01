import { useNotify } from '@/composables/useNotify'

type BackendError = {
  status?: number
  message?: string
  response?: {
    status?: number
    data?: {
      detail?: unknown
    }
  }
}

function getErrorDetail (error: unknown): string | undefined {
  if (!error || typeof error !== 'object') {
    return undefined
  }

  const backendError = error as BackendError
  const detail = backendError.response?.data?.detail

  if (typeof detail === 'string' && detail.length > 0) {
    return detail
  }

  if (Array.isArray(detail) && detail.length > 0) {
    return detail
      .map(item => {
        if (typeof item === 'string') {
          return item
        }
        if (item && typeof item === 'object' && 'msg' in item) {
          return String(item.msg)
        }
        return JSON.stringify(item)
      })
      .join('; ')
  }

  if (backendError.message) {
    return backendError.message
  }
  return undefined
}

export function showVariableAlert (error: unknown): void {
  const notify = useNotify()
  const backendError = error as BackendError | null
  const status = backendError?.response?.status ?? backendError?.status
  const detail = getErrorDetail(error)

  if (detail) {
    notify.error(detail)
    return
  }

  if (status) {
    notify.error(String(status))
    return
  }

  notify.error('Request failed')
}
