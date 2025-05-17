
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
        {/* Render each route group - each group will provide Route components */}
        <PublicRoutes />
        <ContentRoutes />
        <ProgramRoutes />
        <ExpertRoutes />
        <UserRoutes />
        <AdminRoutes />

        {/* Fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
};

export default AppRoutes;
