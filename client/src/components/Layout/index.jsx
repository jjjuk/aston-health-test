import { useContext, useState } from 'react'

import Menu from '@mui/icons-material/Menu'
import Sheet from '@mui/joy/Sheet'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'
import Drawer from '@mui/joy/Drawer'
import { UserContext } from '../../context/UserContext'
import { LogoutOutlined } from '@mui/icons-material'
import ModeToggle from '../ModeToggle'
import { useLocalStorage } from '../../hooks/useLocalStorage'

export default function Layout({ children }) {
  const [drawer, setDrawer] = useState(false)
  const [token, setToken] = useLocalStorage('token')
  const user = useContext(UserContext)

  console.log('logout', token)

  return (
    <div>
      <Sheet variant="outlined" sx={{ py: 2, px: 1 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={3} alignItems="center">
            <Button onClick={() => setDrawer(true)} variant="plain">
              <Menu />
            </Button>
            <Typography level="h4">Patients App</Typography>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography color="primary">{user.data.email}</Typography>
            <ModeToggle />
            <Button
              color="danger"
              variant="outlined"
              onClick={() => setToken('')}
            >
              <LogoutOutlined />
            </Button>
          </Stack>
        </Stack>
      </Sheet>
      <Drawer open={drawer} onClose={() => setDrawer(false)} size="md" />
      {children}
    </div>
  )
}
