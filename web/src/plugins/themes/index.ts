import type { OrganizationConfig } from '@/config/types'
import { defaults } from './baseDefaults'

type VuetifyConfig = {
  defaults: typeof defaults
  theme: {
    defaultTheme: 'light' | 'dark'
    themes: Record<string, { dark: boolean, colors: Record<string, string> }>
  }
}

function createLightColors (org: OrganizationConfig): Record<string, string> {
  return {
    ...org.theme.colors,
    'background': '#F7F8FA',
    'surface': '#FFFFFF',
    'surfaceVariant': '#F1F3F5',
    'on-background': '#17191E',
    'on-surface': '#17191E',
    'on-surface-variant': '#6B7280',
    'border': '#E5E7EB',
    'divider': '#ECEEF1',
    'disabled': '#9CA3AF',
  }
}

// Создаёт light/dark палитры текущей организации для выбранной Vite-сборки.
export function createTheme (org: OrganizationConfig): VuetifyConfig {
  return {
    defaults,
    theme: {
      defaultTheme: org.theme.dark ? 'dark' : 'light',
      themes: {
        dark: {
          dark: true,
          colors: org.theme.colors,
        },
        light: {
          dark: false,
          colors: createLightColors(org),
        },
      },
    },
  }
}
