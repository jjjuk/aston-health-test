import { createContext, useState } from 'react'
import { pages } from '../utils/constants'

export const PageContext = createContext({
  page: pages.PATIENTS,
  setPage: () => {},
})

export default function PageContextProvider({ children }) {
  const [page, setPage] = useState(pages.PATIENTS)

  return (
    <PageContext.Provider value={{ page, setPage }}>
      {children}
    </PageContext.Provider>
  )
}
