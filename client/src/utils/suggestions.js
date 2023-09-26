import axios from 'axios'
import throttle from 'lodash/throttle'

const dadata = axios.create({
  baseURL: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: 'Token ' + import.meta.env.VITE_DADATA_PUBLIC_KEY,
  },
})

export const getAddressSuggestions = throttle((q) => {
  return dadata.post('/address', { query: q })
}, 500)
