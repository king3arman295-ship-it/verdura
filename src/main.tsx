import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2600,
          style: {
            borderRadius: '9999px',
            background: '#2c3d2a',
            color: '#fdfbf6',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#adc7a6', secondary: '#fdfbf6' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fdfbf6' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
)
