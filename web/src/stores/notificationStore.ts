import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationType = 'success' | 'info' | 'warning' | 'error'

export interface Notification {
  id: number
  type: NotificationType
  message?: string
  title?: string
  timeout: number
  closable?: boolean
}

export interface NotificationOptions {
  title?: string
  timeout?: number
  closable?: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])
  let nextId = 0

  function addNotification (
    type: NotificationType,
    message?: string,
    options?: NotificationOptions,
  ): number {
    const id = nextId++

    const notification: Notification = {
      id,
      type,
      message,
      title: options?.title,
      timeout: options?.timeout ?? 5000,
      closable: options?.closable ?? true,
    }

    notifications.value.push(notification)

    if (notification.timeout > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.timeout)
    }

    return id
  }

  function removeNotification (id: number): void {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    notifications,
    addNotification,
    removeNotification,
  }
})
