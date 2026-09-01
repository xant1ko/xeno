import { computed, type Ref, type WritableComputedRef } from 'vue'

export function useStatusFilter (archived: Ref<boolean | null | undefined>): WritableComputedRef<string> {
  return computed({
    get: () => {
      if (archived.value === undefined || archived.value === null) {
        return 'all'
      }
      return archived.value ? 'archived' : 'active'
    },
    set: (value: string) => {
      switch (value) {
        case 'all': {
          archived.value = undefined
          break
        }
        case 'active': {
          archived.value = false
          break
        }
        case 'archived': {
          archived.value = true
          break
        }
      }
    },
  })
}
