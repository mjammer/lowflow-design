import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { setupMock } from '@/mock'
import 'antd/dist/reset.css'
import '@/styles/index.scss'

// Setup mock API
setupMock()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/lowflow-design">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
