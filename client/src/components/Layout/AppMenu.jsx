import List from '@mui/joy/List'
import ListItem from '@mui/joy/ListItem'
import ListItemButton from '@mui/joy/ListItemButton'
import ListItemDecorator from '@mui/joy/ListItemDecorator'
import ListItemContent from '@mui/joy/ListItemContent'
import ListItemText from '@mui/material/ListItemText'

import Person2Outlined from '@mui/icons-material/Person2Outlined'
import ListAltOutlined from '@mui/icons-material/ListAltOutlined'
import MedicalInformation from '@mui/icons-material/MedicalInformation'
import ScienceOutlined from '@mui/icons-material/ScienceOutlined'
import { useContext } from 'react'
import { ListDivider } from '@mui/joy'
import { PageContext } from '../../context/PageContext'
import { pages } from '../../utils/constants'
import DriveEtaOutlined from '@mui/icons-material/HardwareOutlined'

export default function AppMenu({ onPageChange }) {
  const { page, setPage } = useContext(PageContext)

  return (
    <List>
      <ListItem>
        <ListItemText>Разделы</ListItemText>
      </ListItem>
      <ListDivider />
      <ListItem>
        <ListItemButton
          selected={page === pages.PATIENTS}
          onClick={() => {
            if (page !== pages.PATIENTS) {
              setPage(pages.PATIENTS)
              onPageChange()
            }
          }}
          variant="plain"
        >
          <ListItemDecorator>
            <Person2Outlined />
          </ListItemDecorator>
          <ListItemContent>Пациенты</ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          selected={page === pages.EDITS}
          onClick={() => {
            if (page !== pages.EDITS) {
              setPage(pages.EDITS)
              onPageChange()
            }
          }}
          variant="plain"
        >
          <ListItemDecorator>
            <ListAltOutlined />
          </ListItemDecorator>
          <ListItemContent>Действия</ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          selected={page === pages.DISEASES}
          onClick={() => {
            if (page !== pages.DISEASES) {
              setPage(pages.DISEASES)
              onPageChange()
            }
          }}
          variant="plain"
        >
          <ListItemDecorator>
            <MedicalInformation />
          </ListItemDecorator>
          <ListItemContent>Болезни</ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          selected={page === pages.ANALYSIS}
          onClick={() => {
            if (page !== pages.ANALYSIS) {
              setPage(pages.ANALYSIS)
              onPageChange()
            }
          }}
          variant="plain"
        >
          <ListItemDecorator>
            <ScienceOutlined />
          </ListItemDecorator>
          <ListItemContent>Анализы</ListItemContent>
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          selected={page === pages.SQL}
          onClick={() => {
            if (page !== pages.SQL) {
              setPage(pages.SQL)
              onPageChange()
            }
          }}
          variant="plain"
        >
          <ListItemDecorator>
            <DriveEtaOutlined />
          </ListItemDecorator>
          <ListItemContent>SQL</ListItemContent>
        </ListItemButton>
      </ListItem>
    </List>
  )
}
