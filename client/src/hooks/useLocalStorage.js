import { useCallback, useSyncExternalStore } from 'react'

const subscribe = (cb) => {
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('storage', cb)
  }
}

/**
 * Local storage hook
 * @param {string} key
 * @returns {[string, (s: string) => void]}
 */
export default function useLocalStorage(key) {
  const setValue = useCallback(
    (value) => {
      localStorage.setItem(key, value)
    },
    [key]
  )

  const value = useSyncExternalStore(subscribe, () => localStorage.getItem(key))

  return [value, setValue]
}
