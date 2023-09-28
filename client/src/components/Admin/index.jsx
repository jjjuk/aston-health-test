import { useContext } from 'react'
import Patient from './Patient'
import { PageContext } from '../../context/PageContext'
import { pages } from '../../utils/constants'
import Edits from './Edits'
import Disease from './Diseases'
import Analysis from './Analysis'
import SqlStats from './SqlStats'

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
