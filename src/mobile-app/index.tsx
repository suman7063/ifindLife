import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MobileAppLayout } from './components/layout/MobileAppLayout';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingFlow } from './screens/onboarding/OnboardingFlow';
import { AuthFlow } from './screens/auth/AuthFlow';
import { HomeScreen } from './screens/HomeScreen';
import { ServicesScreen } from './screens/ServicesScreen';
import { ServiceDetailScreen } from './screens/ServiceDetailScreen';
import { ExpertsScreen } from './screens/ExpertsScreen';
import { ExpertProfileScreen } from './screens/ExpertProfileScreen';
import { BookingFlow } from './screens/booking/BookingFlow';
import { LiveCallScreen } from './screens/LiveCallScreen';
import { ChatScreen } from './screens/ChatScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { BreathingActivityScreen } from './screens/BreathingActivityScreen';
import { MeditationActivityScreen } from './screens/MeditationActivityScreen';
import { ExpertAuthFlow } from './screens/expert/ExpertAuthFlow';
import { ExpertDashboardScreen } from './screens/expert/ExpertDashboardScreen';
import { ExpertAppointmentsScreen } from './screens/expert/ExpertAppointmentsScreen';
import { ExpertAvailabilityScreen } from './screens/expert/ExpertAvailabilityScreen';
import { ExpertEarningsScreen } from './screens/expert/ExpertEarningsScreen';
import { ExpertProfileManageScreen } from './screens/expert/ExpertProfileManageScreen';
import { ExpertNotificationsScreen } from './screens/expert/ExpertNotificationsScreen';
import { ExpertRatingsReviewsScreen } from './screens/expert/ExpertRatingsReviewsScreen';
import { ExpertBottomNavigation } from './components/layout/ExpertBottomNavigation';

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
            <div className="flex-1 overflow-y-auto">
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
    </div>
  );
};