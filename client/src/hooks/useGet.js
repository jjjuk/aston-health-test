import useSWR from 'swr'
import rest from '../utils/rest'

/**
 *
 * @param {string} path
 * @param {import('swr').SWRConfiguration} path
 * @returns {import('swr').SWRResponse>}
 */
export default function useGet(path, config = undefined) {
  return useSWR(path, (url) => rest.get(url).then((res) => res.data), config)
}
