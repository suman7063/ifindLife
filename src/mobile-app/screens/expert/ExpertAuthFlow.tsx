import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ExpertLoginScreen } from './ExpertLoginScreen';
import { ExpertSignupScreen } from './ExpertSignupScreen';
import { ExpertServiceSelectionScreen } from './ExpertServiceSelectionScreen';

/**
 * Expert Authentication Flow
 * Handles login, signup, and service selection for expert users
 */
export const ExpertAuthFlow: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ExpertLoginScreen />} />
      <Route path="login" element={<ExpertLoginScreen />} />
      <Route path="signup" element={<ExpertSignupScreen />} />
      <Route path="select-services" element={<ExpertServiceSelectionScreen />} />
    </Routes>
  );
};
