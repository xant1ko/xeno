import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'

type AppTheme = 'light' | 'dark'

export const useAppThemeStore = defineStore(
  'appTheme',
  () => {
    const theme = useTheme()

    const themeName = ref<AppTheme>(theme.global.name.value as AppTheme)

    function isDark (): boolean {
      return theme.global.current.value.dark
    }

    function setTheme (name: AppTheme): void {
      themeName.value = name
    }

    watch(
      themeName,
      name => {
        theme.global.name.value = name
      },
      { immediate: true },
    )

    return {
      themeName,
      isDark,
      setTheme,
    }
  },
  {
    persist: true,
  },
)
