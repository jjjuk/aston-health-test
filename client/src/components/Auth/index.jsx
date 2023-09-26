import Sheet from '@mui/joy/Sheet'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import Stack from '@mui/joy/Stack'
import Tabs from '@mui/joy/Tabs'
import TabList from '@mui/joy/TabList'
import Tab from '@mui/joy/Tab'

import { useState } from 'react'
import rest, { catchRestError } from '../../utils/rest'

export default function Auth() {
  const [kind, setKind] = useState('Login')

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 360,
          px: 3,
          pb: 3,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Tabs
          defaultValue={'Login'}
          onChange={(_, val) => setKind(val)}
          sx={{ mb: 3, width: '100%' }}
        >
          <TabList tabFlex="auto" disableUnderline>
            <Tab
              sx={{ borderRadius: '0px 0px 0px 8px' }}
              value={'Login'}
              variant="plain"
              color="neutral"
              indicatorInset
            >
              Login
            </Tab>
            <Tab
              sx={{ borderRadius: '0px 0px 8px 0px' }}
              value={'Signup'}
              variant="plain"
              color="neutral"
              indicatorInset
            >
              Signup
            </Tab>
          </TabList>
        </Tabs>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const formData = new FormData(event.currentTarget)
            const data = Object.fromEntries(formData.entries())
            rest
              .post(`/auth/${kind.toLowerCase()}`, data)
              .then((res) => {
                localStorage.setItem('token', res.data)
                window.location.reload()
              })
              .catch(catchRestError)
          }}
        >
          <Stack spacing={2}>
            <Input
              name="email"
              type="email"
              placeholder="your@email.com"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="••••••••••••••"
              required
            />
            <Button type="submit">{kind}</Button>
          </Stack>
        </form>
      </Sheet>
    </div>
  )
}
