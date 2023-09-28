import Pages from './components/Pages'

import { SWRConfig } from 'swr'
import swrMiddleware from './swrMiddleware.js'
import CssBaseline from '@mui/joy/CssBaseline'

import UserContextProvider from './context/UserContext.jsx'

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles'

import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles'
import PageContextProvider from './context/PageContext'

const materialTheme = materialExtendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          paper: '#0b0d0e',
          default: '#0b0d0e',
          defaultChannel: '#0b0d0e',
        },
        TableCell: {
          border: '#32383e',
        },
      },
    },
    light: {
      palette: {
        TableCell: {
          border: '#cdd7e1',
        },
      },
    },
  },
})

export default function App() {
  return (
    <MaterialCssVarsProvider
      modeStorageKey="joy-mode"
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <JoyCssVarsProvider>
        <UserContextProvider>
          <PageContextProvider>
            <SWRConfig value={{ use: [swrMiddleware] }}>
              <CssBaseline />
              <Pages />
            </SWRConfig>
          </PageContextProvider>
        </UserContextProvider>
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  )
}
