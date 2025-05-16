
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import NotFound from './pages/NotFound';

// Import route components
import { 
  AdminRoutes,
  ContentRoutes, 
  ExpertRoutes, 
  ProgramRoutes, 
  PublicRoutes, 
  UserRoutes 
} from './routes';

/**
 * Main application routes component that organizes routes by category
 */
const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <PublicRoutes />
        
        {/* Content Routes (Blog, Services) */}
        <ContentRoutes />
        
        {/* Program Routes */}
        <ProgramRoutes />
        
        {/* Expert Routes (public and protected) */}
        <ExpertRoutes />
        
        {/* User Routes (protected) */}
        <UserRoutes />
        
        {/* Admin Routes (protected) */}
        <AdminRoutes />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default AppRoutes;
