import { createContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import useGet from '../hooks/useGet'

export const UserContext = createContext(null)

export default function UserContextProvider({ children }) {
  const [token] = useLocalStorage('token')
  const { data } = useGet(token ? '/user/me' : null)

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>
}
