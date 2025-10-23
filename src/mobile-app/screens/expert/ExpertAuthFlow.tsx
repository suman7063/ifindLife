import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ExpertLoginScreen } from './ExpertLoginScreen';
import { ExpertSignupScreen } from './ExpertSignupScreen';

/**
 * Expert Authentication Flow
 * Handles login and signup for expert users
 */
export const ExpertAuthFlow: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ExpertLoginScreen />} />
      <Route path="login" element={<ExpertLoginScreen />} />
      <Route path="signup" element={<ExpertSignupScreen />} />
    </Routes>
  );
};
