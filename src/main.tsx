
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Only log in development mode
if (import.meta.env.DEV) {
  console.log('Main.tsx is executing...')
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Only log in development mode
if (import.meta.env.DEV) {
  console.log('Root component rendered')
}
