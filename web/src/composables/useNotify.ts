import { useNotificationStore } from '@/stores'

interface NotifyReturn {
  success: (title: string, description?: string, timeout?: number) => void
  error: (title: string, description?: string, timeout?: number) => void
  warning: (title: string, description?: string, timeout?: number) => void
  info: (title: string, description?: string, timeout?: number) => void
}

export function useNotify (): NotifyReturn {
  const store = useNotificationStore()

  return {
    success: (title: string, description?: string, timeout?: number): number =>
      store.addNotification('success', description, { title, timeout }),

    error: (title: string, description?: string, timeout?: number): number =>
      store.addNotification('error', description, { title, timeout }),

    warning: (title: string, description?: string, timeout?: number): number =>
      store.addNotification('warning', description, { title, timeout }),

    info: (title: string, description?: string, timeout?: number): number =>
      store.addNotification('success', description, { title, timeout }),
  }
}
