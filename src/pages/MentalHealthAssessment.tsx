
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AssessmentIntro from '@/components/assessment/AssessmentIntro';
import AssessmentQuestions from '@/components/assessment/AssessmentQuestions';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import { AssessmentData } from '@/types/assessment';

const MentalHealthAssessment = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'results'>('intro');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    emotionalWellbeing: {
      depression: [0, 0],
      anxiety: [0, 0]
    },
    stressCoping: [0, 0, 0, 0],
    lifestyleHealth: [0, 0, 0],
    openEndedReflection: ""
  });

  const handleStartAssessment = () => {
    setCurrentStep('questions');
  };

  const handleAnswerChange = (section: keyof AssessmentData, index: number, value: number) => {
    setAssessmentData(prev => {
      const newData = { ...prev };
      if (section === "emotionalWellbeing") {
        if (index < 2) {
          newData.emotionalWellbeing.depression[index] = value;
        } else {
          newData.emotionalWellbeing.anxiety[index - 2] = value;
        }
      } else if (section === "stressCoping") {
        newData.stressCoping[index] = value;
      } else if (section === "lifestyleHealth") {
        newData.lifestyleHealth[index] = value;
      }
      return newData;
    });
  };

  const handleOpenEndedResponse = (text: string) => {
    setAssessmentData(prev => ({
      ...prev,
      openEndedReflection: text
    }));
  };

  const handleAssessmentSubmit = () => {
    setCurrentStep('results');
  };

  const handleRestartAssessment = () => {
    setCurrentStep('intro');
    setAssessmentData({
      emotionalWellbeing: {
        depression: [0, 0],
        anxiety: [0, 0]
      },
      stressCoping: [0, 0, 0, 0],
      lifestyleHealth: [0, 0, 0],
      openEndedReflection: ""
    });
  };

  const handleExitAssessment = () => {
    window.location.href = '/';
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return <AssessmentIntro onStart={handleStartAssessment} />;
      case 'questions':
        return (
          <AssessmentQuestions 
            assessmentData={assessmentData}
            onAnswerChange={handleAnswerChange}
            onOpenEndedResponse={handleOpenEndedResponse}
            onSubmit={handleAssessmentSubmit}
          />
        );
      case 'results':
        return (
          <AssessmentResults 
            assessmentData={assessmentData} 
            onRetake={handleRestartAssessment}
            onExit={handleExitAssessment}
          />
        );
      default:
        return <AssessmentIntro onStart={handleStartAssessment} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-ifind-charcoal mb-2">
                Mental Health Assessment
              </h1>
              <p className="text-ifind-charcoal/70">
                A comprehensive evaluation to help you understand your current mental well-being
              </p>
            </div>
            {renderCurrentStep()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentalHealthAssessment;
