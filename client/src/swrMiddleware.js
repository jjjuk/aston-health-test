export default function swrMiddleware(useSWRNext) {
  return (key, fetcher, config) => {
    const swr = useSWRNext(key, fetcher, config)
    if (swr.error?.response.status === 401) {
      localStorage.setItem('token', '')
    }
    return swr
  }
}
