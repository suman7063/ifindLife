
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingScreen from './components/auth/LoadingScreen';
import { useAuth } from './contexts/auth/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminProtectedRoute from './components/ProtectedRoute';
import { routes } from './App.routes'; // Import routes from consolidated file

// Import directly to avoid any loading issues
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';

console.log('AppRoutes component loading...');

// Lazy load other pages for better performance
const Index = lazy(() => {
  console.log('Lazy loading Index component');
  return import('./pages/Index');
});

const AppRoutes: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  
  useEffect(() => {
    console.log('AppRoutes component mounted');
    console.log('Auth state:', { isAuthenticated, role });
  }, [isAuthenticated, role]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} /> 

        {/* Map all routes from the consolidated routes array */}
        {routes.map((route) => {
          const { element, path, requiredRole } = route;
          
          // Handle protected routes
          if (requiredRole) {
            return (
              <Route 
                key={path} 
                path={path} 
                element={
                  requiredRole === 'admin' ? (
                    <AdminProtectedRoute>{element}</AdminProtectedRoute>
                  ) : (
                    <ProtectedRoute allowedRoles={[requiredRole]}>
                      {element}
                    </ProtectedRoute>
                  )
                } 
              />
            );
          }
          
          // Handle regular routes
          return <Route key={path} path={path} element={element} />;
        })}
        
        {/* Fallback route for 404 */}
        <Route path="*" element={<Index />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
