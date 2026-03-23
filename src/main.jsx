import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111',
            color: '#f0f0f0',
            border: '1px solid #1f1f1f',
            fontFamily: 'DM Sans',
            fontSize: '13px',
            borderRadius: '0',
          },
          success: {
            iconTheme: { primary: '#e8ff00', secondary: '#080808' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)