import { defineStore } from 'pinia'
import { useDisplay } from 'vuetify'

export const useAdaptiveStore = defineStore('adaptive', () => {
  const display = useDisplay()

  return {
    // standart Vuetify breakpoints
    xs: display.xs,
    sm: display.sm,
    md: display.md,
    lg: display.lg,
    xl: display.xl,
    xxl: display.xxl,

    // custom flags
    isMobile: display.xs,
    isTablet: display.sm || display.md,
    isDesktop: display.lg || display.xl || display.xxl,

    isMobileList: display.xs,
    isMobileFilters: display.xs,
    isMobileHero: display.xs,
    isMobileLogin: display.mdAndDown,
    isMobileNav: display.xs,
    isMobileCreateHeader: display.xs,
    isMobileCommentList: display.xs,
    isMobileStudentTheme: display.xs,

    // additional adaptive data
    name: display.name,
    width: display.width,
    height: display.height,
  }
})
