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
  const value = useSyncExternalStore(subscribe, () => localStorage.getItem(key))

  const setValue = useCallback(
    (newValue) => {
      localStorage.setItem(key, value)
      window.dispatchEvent(
        new StorageEvent('storage', {
          storageArea: window.localStorage,
          key,
          oldValue: value,
          newValue,
          url: window.location.href,
        })
      )
    },
    [key, value]
  )
  return [value, setValue]
}
