import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

const MobileAppLayout = lazy(() => import('./components/layout/MobileAppLayout').then(m => ({ default: m.MobileAppLayout })));
const SplashScreen = lazy(() => import('./screens/SplashScreen').then(m => ({ default: m.SplashScreen })));
const OnboardingFlow = lazy(() => import('./screens/onboarding/OnboardingFlow').then(m => ({ default: m.OnboardingFlow })));
const AuthFlow = lazy(() => import('./screens/auth/AuthFlow').then(m => ({ default: m.AuthFlow })));
const HomeScreen = lazy(() => import('./screens/HomeScreen').then(m => ({ default: m.HomeScreen })));
const ServicesScreen = lazy(() => import('./screens/ServicesScreen').then(m => ({ default: m.ServicesScreen })));
const ServiceDetailScreen = lazy(() => import('./screens/ServiceDetailScreen').then(m => ({ default: m.ServiceDetailScreen })));
const ExpertsScreen = lazy(() => import('./screens/ExpertsScreen').then(m => ({ default: m.ExpertsScreen })));
const ExpertProfileScreen = lazy(() => import('./screens/ExpertProfileScreen').then(m => ({ default: m.ExpertProfileScreen })));
const BookingFlow = lazy(() => import('./screens/booking/BookingFlow').then(m => ({ default: m.BookingFlow })));
const LiveCallScreen = lazy(() => import('./screens/LiveCallScreen').then(m => ({ default: m.LiveCallScreen })));
const ChatScreen = lazy(() => import('./screens/ChatScreen').then(m => ({ default: m.ChatScreen })));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen').then(m => ({ default: m.ProfileScreen })));
const MySessionsScreen = lazy(() => import('./screens/MySessionsScreen').then(m => ({ default: m.MySessionsScreen })));
const FavoriteExpertsScreen = lazy(() => import('./screens/FavoriteExpertsScreen').then(m => ({ default: m.FavoriteExpertsScreen })));
const WalletScreen = lazy(() => import('./screens/WalletScreen').then(m => ({ default: m.WalletScreen })));
const PaymentScreen = lazy(() => import('./screens/PaymentScreen').then(m => ({ default: m.PaymentScreen })));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen').then(m => ({ default: m.SettingsScreen })));
const NotificationsScreen = lazy(() => import('./screens/NotificationsScreen').then(m => ({ default: m.NotificationsScreen })));
const BreathingActivityScreen = lazy(() => import('./screens/BreathingActivityScreen').then(m => ({ default: m.BreathingActivityScreen })));
const MeditationActivityScreen = lazy(() => import('./screens/MeditationActivityScreen').then(m => ({ default: m.MeditationActivityScreen })));
const ExpertAuthFlow = lazy(() => import('./screens/expert/ExpertAuthFlow').then(m => ({ default: m.ExpertAuthFlow })));
const ExpertDashboardScreen = lazy(() => import('./screens/expert/ExpertDashboardScreen').then(m => ({ default: m.ExpertDashboardScreen })));
const ExpertAppointmentsScreen = lazy(() => import('./screens/expert/ExpertAppointmentsScreen').then(m => ({ default: m.ExpertAppointmentsScreen })));
const ExpertAvailabilityScreen = lazy(() => import('./screens/expert/ExpertAvailabilityScreen').then(m => ({ default: m.ExpertAvailabilityScreen })));
const ExpertEarningsScreen = lazy(() => import('./screens/expert/ExpertEarningsScreen').then(m => ({ default: m.ExpertEarningsScreen })));
const ExpertProfileManageScreen = lazy(() => import('./screens/expert/ExpertProfileManageScreen').then(m => ({ default: m.ExpertProfileManageScreen })));
const ExpertNotificationsScreen = lazy(() => import('./screens/expert/ExpertNotificationsScreen').then(m => ({ default: m.ExpertNotificationsScreen })));
const ExpertRatingsReviewsScreen = lazy(() => import('./screens/expert/ExpertRatingsReviewsScreen').then(m => ({ default: m.ExpertRatingsReviewsScreen })));
const ExpertBottomNavigation = lazy(() => import('./components/layout/ExpertBottomNavigation').then(m => ({ default: m.ExpertBottomNavigation })));

const Loader: React.FC = () => (
  <div className="p-6 text-center text-muted-foreground">Loading…</div>
);


/**
 * Mobile App UI Flow
 * 
 * This is a complete mobile app interface demonstration based on the iFindLife PRD.
 * All screens follow the website's brand guidelines and design system.
 * 
 * Includes both User and Expert mobile interfaces.
 * 
 * Navigation Structure:
 * - Splash Screen (First load)
 * - Onboarding Flow (New users)
 * - Authentication Flow (Login/Signup/OTP)
 * - Main App with Bottom Navigation
 * - Service Discovery & Expert Matching
 * - Booking & Payment Flow
 * - Live Call & Chat Interface
 * - User Profile & Settings
 */
export const MobileAppDemo: React.FC = () => {
  return (
    <div className="mobile-app-demo max-w-sm mx-auto bg-background min-h-screen border-x border-border shadow-2xl">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route index element={<SplashScreen />} />
          <Route path="onboarding/*" element={<OnboardingFlow />} />
          <Route path="auth/*" element={<AuthFlow />} />
          
          {/* User App Routes */}
          <Route path="app/*" element={
            <MobileAppLayout>
              <Routes>
                <Route index element={<HomeScreen />} />
                <Route path="services" element={<ServicesScreen />} />
                <Route path="services/:serviceId" element={<ServiceDetailScreen />} />
                <Route path="experts" element={<ExpertsScreen />} />
                <Route path="experts/:expertId" element={<ExpertProfileScreen />} />
                <Route path="booking/*" element={<BookingFlow />} />
                <Route path="call/:sessionId" element={<LiveCallScreen />} />
                <Route path="chat/:sessionId" element={<ChatScreen />} />
                <Route path="profile" element={<ProfileScreen />} />
                <Route path="my-sessions" element={<MySessionsScreen />} />
                <Route path="favorite-experts" element={<FavoriteExpertsScreen />} />
                <Route path="wallet" element={<WalletScreen />} />
                <Route path="payment" element={<PaymentScreen />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="notifications" element={<NotificationsScreen />} />
                <Route path="activity/breathing" element={<BreathingActivityScreen />} />
                <Route path="activity/meditation" element={<MeditationActivityScreen />} />
              </Routes>
            </MobileAppLayout>
          } />

          {/* Expert Auth Routes */}
          <Route path="expert-auth/*" element={<ExpertAuthFlow />} />

          {/* Expert App Routes */}
          <Route path="expert-app/*" element={
            <div className="flex flex-col h-screen bg-background">
              <Suspense fallback={<Loader />}>
                {React.createElement(lazy(() => import('./components/layout/ExpertMobileHeader').then(m => ({ default: m.ExpertMobileHeader }))))}
              </Suspense>
              <div className="flex-1 overflow-y-auto pb-20">
                <Routes>
                  <Route index element={<ExpertDashboardScreen />} />
                  <Route path="appointments" element={<ExpertAppointmentsScreen />} />
                  <Route path="availability" element={<ExpertAvailabilityScreen />} />
                  <Route path="earnings" element={<ExpertEarningsScreen />} />
                  <Route path="profile" element={<ExpertProfileManageScreen />} />
                  <Route path="notifications" element={<ExpertNotificationsScreen />} />
                  <Route path="ratings-reviews" element={<ExpertRatingsReviewsScreen />} />
                </Routes>
              </div>
              <ExpertBottomNavigation />
            </div>
          } />
        </Routes>
      </Suspense>
    </div>
  );
};