
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from 'next-themes'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light">
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)

// Add logo resize class to the logo after mount
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const logoElement = document.querySelector('img[alt="iFindLife"]');
    if (logoElement) {
      logoElement.classList.add('ifindlife-logo');
    }
  }, 100);
});
