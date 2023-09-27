import { useSyncExternalStore } from 'react'

/**
 * Local storage hook
 * @param {string} key
 * @returns {[string, (s: string) => void]}
 */
export function useLocalStorage(key) {
  const value = useSyncExternalStore(subscribe, () =>
    window.localStorage.getItem(key)
  )

  return [
    value,
    function (value) {
      return setStorageValue(key, value)
    },
  ]
}
/**
 * Set storage with event
 * @param {string} key
 * @param {string} value
 * @returns {void}
 */
export function setStorageValue(key, value) {
  const prev = window.localStorage.getItem(key)
  window.localStorage.setItem(key, value)
  window.dispatchEvent(
    new StorageEvent('storage', {
      storageArea: window.localStorage,
      key,
      oldValue: prev,
      newValue: value,
      url: window.location.href,
    })
  )
}

function subscribe(cb) {
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener('storage', cb)
  }
}
