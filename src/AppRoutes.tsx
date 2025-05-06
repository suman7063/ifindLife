
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
import ExpertLogin from './pages/ExpertLogin'; // Import directly

// Only log in development environment
if (import.meta.env.DEV) {
  console.log('AppRoutes component loading...');
}

// Lazy load other pages for better performance
const Index = lazy(() => {
  // Only log in development environment
  if (import.meta.env.DEV) {
    console.log('Lazy loading Index component');
  }
  return import('./pages/Index');
});

const AppRoutes: React.FC = () => {
  const { isAuthenticated, role } = useAuth();
  
  useEffect(() => {
    // Only log in development environment 
    if (import.meta.env.DEV) {
      console.log('AppRoutes component mounted');
      console.log('Auth state:', { isAuthenticated, role });
    }
  }, [isAuthenticated, role]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/expert-login" element={<ExpertLogin />} />

        {/* Admin routes need to handle all sub-routes */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        } />

        {/* Map all routes from the consolidated routes array except admin and expert-login */}
        {routes.filter(route => !route.path.startsWith('/admin') && route.path !== '/expert-login').map((route) => {
          const { element, path, requiredRole } = route;
          
          // Handle protected routes
          if (requiredRole && requiredRole !== 'admin') {
            return (
              <Route 
                key={path} 
                path={path} 
                element={
                  <ProtectedRoute allowedRoles={[requiredRole]}>
                    {element}
                  </ProtectedRoute>
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

// Import the Admin component here to avoid circular dependencies
const Admin = lazy(() => import('./pages/Admin'));

export default AppRoutes;
