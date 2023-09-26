import useSWR from 'swr'
import rest from '../utils/rest'

/**
 *
 * @param {string} path
 * @param {import('swr').SWRConfiguration} path
 * @returns {import('swr').SWRResponse>}
 */
export default function useGet(path) {
  return useSWR(path, (url) => rest.get(url).then((res) => res.data), {
    onErrorRetry: (error, _key, _config, revalidate, { retryCount }) => {
      // Never retry on 404 and 401.
      if (error.response.status === 404 || error.response.status === 401) return

      // Only retry up to 10 times.
      if (retryCount >= 5) return

      // Retry after 5 seconds.
      setTimeout(() => revalidate({ retryCount }), 5000)
    },
  })
}
