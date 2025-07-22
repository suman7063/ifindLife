
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Debug React availability
console.log('main.tsx - React:', !!React);
console.log('main.tsx - ReactDOM:', !!ReactDOM);
console.log('main.tsx - React version:', React.version);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
