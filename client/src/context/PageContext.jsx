import { createContext, useState } from 'react'

export const PageContext = createContext('main')

export default function PageContextProvider({ children }) {
  const [page, setPage] = useState('main')

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  )
}
