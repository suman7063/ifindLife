import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { OnboardingWelcome } from './OnboardingWelcome';
import { OnboardingPersonalization } from './OnboardingPersonalization';
import { OnboardingFeatures } from './OnboardingFeatures';
import { OnboardingComplete } from './OnboardingComplete';

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPreferences, setUserPreferences] = useState({
    interests: [] as string[],
    experience: '',
    goals: [] as string[]
  });

  return (
    <Routes>
      <Route path="/" element={<OnboardingWelcome />} />
      <Route path="/personalize" element={
        <OnboardingPersonalization 
          preferences={userPreferences}
          setPreferences={setUserPreferences}
        />
      } />
      <Route path="/features" element={<OnboardingFeatures />} />
      <Route path="/complete" element={<OnboardingComplete />} />
    </Routes>
  );
};