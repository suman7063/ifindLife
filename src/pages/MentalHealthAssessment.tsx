
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AssessmentIntro } from '@/components/assessment/AssessmentIntro';
import { AssessmentQuestions } from '@/components/assessment/AssessmentQuestions';
import { AssessmentResults } from '@/components/assessment/AssessmentResults';

const MentalHealthAssessment = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [assessmentData, setAssessmentData] = useState<any>(null);

  const handleStartAssessment = () => {
    setCurrentStep('questions');
  };

  const handleAssessmentComplete = (data: any) => {
    setAssessmentData(data);
    setCurrentStep('results');
  };

  const handleRestartAssessment = () => {
    setCurrentStep('intro');
    setAssessmentData(null);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return <AssessmentIntro onStart={handleStartAssessment} />;
      case 'questions':
        return <AssessmentQuestions onComplete={handleAssessmentComplete} />;
      case 'results':
        return <AssessmentResults data={assessmentData} onRestart={handleRestartAssessment} />;
      default:
        return <AssessmentIntro onStart={handleStartAssessment} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {renderCurrentStep()}
      </main>
      <Footer />
    </div>
  );
};

export default MentalHealthAssessment;
