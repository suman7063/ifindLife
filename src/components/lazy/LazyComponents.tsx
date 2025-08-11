import { lazy } from 'react';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import React, { Suspense } from 'react';

// Lazy load non-critical components for better performance
export const LazyTopTherapistsSection = lazy(() => import('@/components/TopTherapistsSection'));
export const LazyTestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
export const LazyWhyChooseUsSection = lazy(() => import('@/components/WhyChooseUsSection'));
export const LazyCTASection = lazy(() => import('@/components/CTASection'));
export const LazyFooter = lazy(() => import('@/components/Footer'));
export const LazyBlogSection = lazy(() => import('@/components/BlogSection'));
export const LazyStayInTouchSection = lazy(() => import('@/components/StayInTouchSection'));

// Admin components
export const LazyEnhancedAdminMetrics = lazy(() => import('@/components/admin/dashboard/EnhancedAdminMetrics'));
export const LazyExpertApprovalWorkflow = lazy(() => import('@/components/admin/experts/ExpertApprovalWorkflow'));
export const LazyAdminAnalytics = lazy(() => import('@/components/admin/analytics/AdminAnalytics'));

// Expert components
export const LazyEnhancedExpertSearch = lazy(() => import('@/components/expert/EnhancedExpertSearch'));
export const LazyExpertDashboard = lazy(() => import('@/components/expert/dashboard/ExpertOnboardingFlow'));

// User components  
export const LazyUserDashboard = lazy(() => import('@/components/user/UserDashboard'));
export const LazyFavoritesManager = lazy(() => import('@/components/favorites/FavoritesManager'));
export const LazyNotificationCenter = lazy(() => import('@/components/notifications/NotificationCenter'));

// Call/communication components
export const LazyAgoraCallModal = lazy(() => import('@/components/call/LazyAgoraCallModal'));
export const LazyAgoraChatModal = lazy(() => import('@/components/chat/LazyAgoraChatModal'));

// HOC for wrapping lazy components with Suspense
export const withLazySuspense = <P extends object>(Component: React.ComponentType<P>, fallback?: React.ReactNode) => {
  const WrappedComponent = (props: P) => (
    <Suspense fallback={fallback || <LoadingFallback />}>
      <Component {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = `withLazySuspense(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Pre-wrapped lazy components
export const TopTherapistsSection = withLazySuspense(LazyTopTherapistsSection);
export const TestimonialsSection = withLazySuspense(LazyTestimonialsSection);
export const WhyChooseUsSection = withLazySuspense(LazyWhyChooseUsSection);
export const CTASection = withLazySuspense(LazyCTASection);
export const Footer = withLazySuspense(LazyFooter);
export const BlogSection = withLazySuspense(LazyBlogSection);
export const StayInTouchSection = withLazySuspense(LazyStayInTouchSection);

export const EnhancedAdminMetrics = withLazySuspense(LazyEnhancedAdminMetrics);
export const ExpertApprovalWorkflow = withLazySuspense(LazyExpertApprovalWorkflow);
export const AdminAnalytics = withLazySuspense(LazyAdminAnalytics);

export const EnhancedExpertSearch = withLazySuspense(LazyEnhancedExpertSearch);
export const ExpertDashboard = withLazySuspense(LazyExpertDashboard);

export const UserDashboard = withLazySuspense(LazyUserDashboard);
export const FavoritesManager = withLazySuspense(LazyFavoritesManager);
export const NotificationCenter = withLazySuspense(LazyNotificationCenter);

export const AgoraCallModal = withLazySuspense(LazyAgoraCallModal);
export const AgoraChatModal = withLazySuspense(LazyAgoraChatModal);