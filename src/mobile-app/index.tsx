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

/**
 * Mobile App UI Flow
 * 
 * This is a complete mobile app interface demonstration based on the iFindLife PRD.
 * All screens follow the website's brand guidelines and design system.
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
        <Route path="/mobile-app" element={<SplashScreen />} />
        <Route path="/mobile-app/onboarding/*" element={<OnboardingFlow />} />
        <Route path="/mobile-app/auth/*" element={<AuthFlow />} />
        <Route path="/mobile-app/app/*" element={
          <MobileAppLayout>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/services" element={<ServicesScreen />} />
              <Route path="/services/:serviceId" element={<ServiceDetailScreen />} />
              <Route path="/experts" element={<ExpertsScreen />} />
              <Route path="/experts/:expertId" element={<ExpertProfileScreen />} />
              <Route path="/booking/*" element={<BookingFlow />} />
              <Route path="/call/:sessionId" element={<LiveCallScreen />} />
              <Route path="/chat/:sessionId" element={<ChatScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/notifications" element={<NotificationsScreen />} />
            </Routes>
          </MobileAppLayout>
        } />
      </Routes>
    </div>
  );
};