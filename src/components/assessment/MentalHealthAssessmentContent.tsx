
import React, { useState } from 'react';
import AssessmentIntro from './AssessmentIntro';
import AssessmentQuestions from './AssessmentQuestions';
import AssessmentResults from './AssessmentResults';
import { AssessmentData } from '@/types/assessment';

const MentalHealthAssessmentContent = () => {
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
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">Mental Health Assessment</h2>
              <p className="text-gray-600">
                A comprehensive evaluation to help you understand your current mental well-being
              </p>
            </div>
            <AssessmentIntro onStart={handleStartAssessment} />
          </div>
        );
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
        return (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">Mental Health Assessment</h2>
              <p className="text-gray-600">
                A comprehensive evaluation to help you understand your current mental well-being
              </p>
            </div>
            <AssessmentIntro onStart={handleStartAssessment} />
          </div>
        );
    }
  };

  return renderCurrentStep();
};

export default MentalHealthAssessmentContent;
