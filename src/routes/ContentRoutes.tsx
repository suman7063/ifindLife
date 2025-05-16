
import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import LoadingScreen from '@/components/auth/LoadingScreen';

// Lazy-loaded content components
const Blog = lazy(() => import('@/pages/Blog'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Services = lazy(() => import('@/pages/Services'));
const ServiceDetailPage = lazy(() => import('@/pages/service/ServiceDetailPage'));

/**
 * Routes related to content pages like blog and services
 */
export const ContentRoutes: React.FC = () => {
  return (
    <>
      <Route path="/blog" element={
        <Suspense fallback={<LoadingScreen />}>
          <Blog />
        </Suspense>
      } />
      <Route path="/blog/:slug" element={
        <Suspense fallback={<LoadingScreen />}>
          <BlogPost />
        </Suspense>
      } />
      <Route path="/services" element={
        <Suspense fallback={<LoadingScreen />}>
          <Services />
        </Suspense>
      } />
      <Route path="/services/:serviceId" element={
        <Suspense fallback={<LoadingScreen />}>
          <ServiceDetailPage />
        </Suspense>
      } />
    </>
  );
};
