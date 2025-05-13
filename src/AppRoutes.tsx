
import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from './components/auth/LoadingScreen';
import { useAuth } from './contexts/auth/AuthContext';
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminProtectedRoute from './components/ProtectedRoute';
import { routes } from './App.routes'; // Import routes from consolidated file
import NotFound from './pages/NotFound'; // Import NotFound page for 404 handling
import AboutUs from './pages/AboutUs'; // Direct import for critical page

// Import critical routes directly to prevent loading issues
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import ExpertLogin from './pages/ExpertLogin';

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

// Import test page for hero banner mockup - now pointing to the original index
const IndexOriginal = lazy(() => import('./pages/IndexOriginal'));

// Import the new expert dashboard
const NewExpertDashboard = lazy(() => import('./pages/NewExpertDashboard'));

const AppRoutes: React.FC = () => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Only log in development environment 
    if (import.meta.env.DEV) {
      console.log('AppRoutes component mounted');
      console.log('Auth state:', { isAuthenticated, role, isLoading });
    }
  }, [isAuthenticated, role, isLoading]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/expert-login" element={<ExpertLogin />} />
        
        {/* New route for the original homepage version */}
        <Route path="/hero-test" element={<IndexOriginal />} />
        
        {/* Define AboutUs route directly without lazy loading */}
        <Route path="/about" element={<AboutUs />} />

        {/* Admin routes with proper protection */}
        <Route path="/admin/*" element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        } />
        
        {/* Expert Dashboard with proper protection - Handle all sub-routes */}
        <Route 
          path="/expert-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={['expert']}>
              <NewExpertDashboard />
            </ProtectedRoute>
          } 
        />

        {/* User Dashboard with proper protection */}
        <Route 
          path="/user-dashboard/*" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Map all routes from the consolidated routes array except admin, expert and user dashboard routes */}
        {routes.filter(route => 
          !route.path.startsWith('/admin') && 
          !route.path.startsWith('/expert-dashboard') && 
          !route.path.startsWith('/user-dashboard') && 
          route.path !== '/expert-login' &&
          route.path !== '/about' // Skip /about since we're directly defining it
        ).map((route) => {
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
        
        {/* Fallback route for 404 - replace the old Navigate with NotFound component */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

// Import the Admin component here to avoid circular dependencies
const Admin = lazy(() => import('./pages/Admin'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));

export default AppRoutes;
