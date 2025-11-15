import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ExpertLoginScreen } from './ExpertLoginScreen';
import { ExpertSignupScreen } from './ExpertSignupScreen';
import { ExpertServiceSelectionScreen } from './ExpertServiceSelectionScreen';
import { ExpertOnboardingFlow } from './onboarding';

/**
 * Expert Authentication Flow
 * Handles login, signup, service selection, and onboarding for expert users
 */
export const ExpertAuthFlow: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ExpertLoginScreen />} />
      <Route path="login" element={<ExpertLoginScreen />} />
      <Route path="signup" element={<ExpertSignupScreen />} />
      <Route path="onboarding" element={<ExpertOnboardingFlow />} />
      <Route path="select-services" element={<ExpertServiceSelectionScreen />} />
      <Route path="*" element={<Navigate to="/mobile-app/expert-auth/login" replace />} />
    </Routes>
  );
};
