import '@fontsource/inter'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { SWRConfig } from 'swr'
import swrMiddleware from './swrMiddleware.js'
import CssBaseline from '@mui/joy/CssBaseline'
import App from './App.jsx'
import UserContextProvider from './context/UserContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserContextProvider>
      <SWRConfig value={{ use: [swrMiddleware] }}>
        <CssBaseline />
        <App />
      </SWRConfig>
    </UserContextProvider>
  </React.StrictMode>
)
