
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Toaster } from 'sonner';
import { UserAuthProvider } from '@/contexts/UserAuthContext';
import { ExpertAuthProvider } from '@/contexts/ExpertAuthContext/index';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserAuthProvider>
        <ExpertAuthProvider>
          <App />
          <Toaster position="top-right" />
        </ExpertAuthProvider>
      </UserAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
