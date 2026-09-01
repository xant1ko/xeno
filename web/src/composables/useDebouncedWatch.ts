import { onUnmounted, watch, type WatchSource } from 'vue'

export function useDebouncedWatch (): { watchDebounced: <T>(source: WatchSource<T> | WatchSource<unknown>[], delay: number, callback: () => void) => void } {
  const cleanup: (() => void)[] = []

  onUnmounted(() => {
    cleanup.forEach(fn => fn())
  })

  function watchDebounced<T> (
    source: WatchSource<T> | WatchSource<unknown>[],
    delay: number,
    callback: () => void,
  ): void {
    let timer: number | undefined
    const sources = Array.isArray(source) ? source : [source]
    const watchStop = watch(sources, () => {
      clearTimeout(timer)
      timer = window.setTimeout(callback, delay)
    }, {
      deep: true,
    })

    cleanup.push(() => {
      clearTimeout(timer)
      watchStop()
    })
  }

  return { watchDebounced }
}
