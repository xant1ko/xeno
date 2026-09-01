import type { AgentChatCreate, AgentChatFilter, AgentChatListItemOutput, AgentChatOutput, AgentTaskOutput } from '@/types/generated'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useNotify } from '@/composables/useNotify'
import {
  createAgentChatApiV1AgentChatCreatePost as createAgentChatApi,
  getAgentChatApiV1AgentChatGetUidGet as getAgentChatApi,
  getAgentChatListApiV1AgentChatGetListPost as getAgentChatListApi,
  sendAgentChatMessageApiV1AgentChatUidMessagePost as sendAgentChatMessageApi,
} from '@/types/generated'
import { showVariableAlert } from '@/utils/alertErrorsUtils'

export type AgentChatItem = AgentChatListItemOutput

export const useAgentChatsStore = defineStore('agentChats', () => {
  const notify = useNotify()
  const chatList = ref<AgentChatItem[]>([])
  const detailChat = ref<AgentChatOutput>()
  const loadingList = ref(false)
  const loadingForm = ref(false)
  const loadingMessage = ref(false)
  const error = ref<unknown | null>(null)
  const totalItems = ref(0)

  async function fetchDetailChat (uid: string): Promise<void> {
    loadingForm.value = true
    error.value = null

    try {
      const { data } = await getAgentChatApi<true>({
        path: { uid },
        throwOnError: true,
      })

      detailChat.value = data
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  async function sendMessage (uid: string, content: string): Promise<AgentTaskOutput> {
    loadingMessage.value = true
    error.value = null

    try {
      const { data } = await sendAgentChatMessageApi<true>({
        path: { uid },
        body: { content },
        throwOnError: true,
      })

      return data
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingMessage.value = false
    }
  }

  async function fetchList (request: AgentChatFilter): Promise<void> {
    if (loadingList.value) {
      return
    }

    loadingList.value = true
    error.value = null

    try {
      const { data } = await getAgentChatListApi<true>({
        body: request,
        throwOnError: true,
      })

      chatList.value = data.items
      totalItems.value = data.count
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
    } finally {
      loadingList.value = false
    }
  }

  async function createChat (data: AgentChatCreate): Promise<AgentChatOutput> {
    loadingForm.value = true
    error.value = null

    try {
      const { data: chat } = await createAgentChatApi<true>({
        body: data,
        throwOnError: true,
      })

      notify.success('Чат с агентом создан')
      return chat
    } catch (error_) {
      error.value = error_
      showVariableAlert(error_)
      throw error_
    } finally {
      loadingForm.value = false
    }
  }

  return {
    chatList,
    detailChat,
    loadingList,
    loadingForm,
    loadingMessage,
    error,
    totalItems,

    fetchList,
    fetchDetailChat,
    sendMessage,
    createChat,
  }
})
