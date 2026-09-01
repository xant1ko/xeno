export interface OrganizationTheme {
  dark: boolean
  colors: {
    'primary': string
    'secondary': string
    'accent'?: string
    'background': string
    'surface': string
    'surfaceVariant': string
    'on-background': string
    'on-surface': string
    'on-primary': string
    'on-secondary': string
    'success': string
    'warning': string
    'error': string
    'info': string
    'border': string
    'divider': string
  }
}

export interface OrganizationAssets {
  logo: {
    dark: string
    light: string
  }
  favicon: {
    dark: string
    light: string
  }
}

export interface OrganizationConfig {
  id: string
  name: string
  title: string
  theme: OrganizationTheme
  assets: OrganizationAssets
}
