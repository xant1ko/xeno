import type { Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAdaptiveStore } from '@/stores'

export type Breakpoints = Record<
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | 'xxl'
  | 'isMobile'
  | 'isTablet'
  | 'isDesktop'
  | 'isMobileFilters'
  | 'isMobileList'
  | 'isMobileHero'
  | 'isMobileLogin'
  | 'isMobileNav'
  | 'isMobileCreateHeader'
  | 'isMobileCommentList'
  | 'isMobileStudentTheme',
  Ref<boolean>
>

export function useAdaptive (): Breakpoints {
  const displayStore = useAdaptiveStore()

  const {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    isMobile,
    isTablet,
    isDesktop,
    isMobileList,
    isMobileFilters,
    isMobileHero,
    isMobileLogin,
    isMobileNav,
    isMobileCreateHeader,
    isMobileCommentList,
    isMobileStudentTheme,
  } = storeToRefs(displayStore)

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    isMobile,
    isTablet,
    isDesktop,
    isMobileList,
    isMobileFilters,
    isMobileHero,
    isMobileLogin,
    isMobileNav,
    isMobileCreateHeader,
    isMobileCommentList,
    isMobileStudentTheme,
  }
}
