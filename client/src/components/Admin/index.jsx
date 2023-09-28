import { lazy, useContext } from 'react'
import { PageContext } from '../../context/PageContext'
import { pages } from '../../utils/constants'

const Patient = lazy(() => import('./Patient'))
const Edits = lazy(() => import('./Edits'))
const Disease = lazy(() => import('./Diseases'))
const Analysis = lazy(() => import('./Analysis'))
const SqlStats = lazy(() => import('./SqlStats'))

export default function Admin() {
  const { page } = useContext(PageContext)

  switch (page) {
    case pages.PATIENTS:
      return <Patient />
    case pages.EDITS:
      return <Edits />
    case pages.DISEASES:
      return <Disease />
    case pages.ANALYSIS:
      return <Analysis />
    case pages.SQL:
      return <SqlStats />
    default:
      return <></>
  }
}
