import axios from 'axios'

const rest = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
})

rest.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const catchRestError = (err) => {
  console.error(err)
  window.alert(err?.response?.data?.message || err?.message || 'error occurred')
}

export default rest
