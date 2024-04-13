import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { CssBaseline, ThemeProvider } from '@mui/material'

import '@fontsource/roboto'
import '@fontsource/rubik'

import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
)
