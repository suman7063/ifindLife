import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { OTPVerification } from './OTPVerification';
import { ForgotPassword } from './ForgotPassword';

export const AuthFlow: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/signup" element={<SignupScreen />} />
      <Route path="/otp" element={<OTPVerification />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
};