
import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { Toaster } from 'sonner';
import { UnifiedAuthProvider } from './contexts/auth/UnifiedAuthContext';
import EmergencyFallback from './components/EmergencyFallback';

// Add React debugging at app level
console.log('App.tsx - React version:', React.version);
console.log('App.tsx - React available:', !!React);

const App: React.FC = () => {
  return (
    <EmergencyFallback>
      <Router>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <UnifiedAuthProvider>
            <AppRoutes />
            <Toaster position="top-right" />
          </UnifiedAuthProvider>
        </Suspense>
      </Router>
    </EmergencyFallback>
  );
};

export default App;
