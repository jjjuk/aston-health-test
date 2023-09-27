import Button from '@mui/joy/Button'
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlined from '@mui/icons-material/LightModeOutlined'
import { useLocalStorage } from '../hooks/useLocalStorage'

/**
 *
 * @param {import('@mui/joy').ButtonProps} props
 * @returns {Button}
 */
export default function ModeToggle(props) {
  const [mode, setMode] = useLocalStorage('joy-mode')

  return (
    <Button
      {...props}
      variant="outlined"
      color="neutral"
      onClick={() => {
        setMode(mode === 'dark' ? 'light' : 'dark')
      }}
    >
      {mode === 'dark' ? <DarkModeOutlined /> : <LightModeOutlined />}
    </Button>
  )
}
