<template>
  <div class="notification-container">
    <TransitionGroup
      name="notification" tag="div"
      class="notification-list"
    >
      <v-alert
        v-for="notification in notifications"
        :key="notification.id"
        @click:close="removeNotification(notification.id)"
        :type="notification.type"
        :color="getAlertConfig(notification).color"
        :title="notification.title"
        :closable="notification.closable"
        variant="flat"
        class="notification-item"
      >
        {{ notification.message }}
      </v-alert>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import type { Notification } from '@/stores/notificationStore'
import { storeToRefs } from 'pinia'
import { useNotificationStore } from '@/stores'

const notificationStore = useNotificationStore()
const { notifications } = storeToRefs(notificationStore)
const { removeNotification } = notificationStore

function getAlertConfig (notification: Notification): {
  icon: string
  color: string
} {
  switch (notification.type) {
    case 'success': {
      return {
        icon: 'mdi-check-circle',
        color: '#00E67680',
      }
    }
    case 'error': {
      return {
        icon: 'mdi-alert-circle',
        color: '#FF174480',
      }
    }
    case 'warning': {
      return {
        icon: 'mdi-alert',
        color: '#FFC40080',
      }
    }
    default: {
      return {
        icon: 'mdi-information',
        color: '#00B0FF80',
      }
    }
  }
}

</script>

<style scoped>
.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 400px;
    width: 100%;
    pointer-events: none;
}

.notification-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.notification-item {
    pointer-events: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
}

/* Анимации */
.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from {
    opacity: 0;
    transform: translateX(100px);
}

.notification-leave-to {
    opacity: 0;
    transform: translateX(100px);
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@media (max-width: 600px) {
    .notification-container {
        top: 10px;
        right: 10px;
        left: 10px;
        max-width: none;
        width: auto;
    }
}
</style>
