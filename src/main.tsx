
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { EnhancedUnifiedAuthProvider } from '@/contexts/auth/EnhancedUnifiedAuthContext'

// Debug React availability
console.log('main.tsx - React:', !!React);
console.log('main.tsx - ReactDOM:', !!ReactDOM);
console.log('main.tsx - React version:', React.version);

// Only log in development mode
if (import.meta.env.DEV) {
  console.log('Main.tsx is executing...')
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Add error handling for React 18 createRoot
try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <EnhancedUnifiedAuthProvider>
        <App />
      </EnhancedUnifiedAuthProvider>
    </React.StrictMode>
  );
  
  // Only log in development mode
  if (import.meta.env.DEV) {
    console.log('Root component rendered successfully');
  }
} catch (error) {
  console.error('Failed to render app:', error);
  
  // Last resort - direct DOM manipulation
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: #dc3545;">Application Failed to Load</h1>
      <p>There was a critical error loading the application.</p>
      <p>Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      <button onclick="window.location.reload()" style="
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      ">Reload Page</button>
    </div>
  `;
}
