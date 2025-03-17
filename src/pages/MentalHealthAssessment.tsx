
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AssessmentIntro from '@/components/assessment/AssessmentIntro';
import AssessmentQuestions from '@/components/assessment/AssessmentQuestions';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import { AssessmentData } from '@/types/assessment';

const MentalHealthAssessment = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    emotionalWellbeing: {
      depression: [0, 0],
      anxiety: [0, 0]
    },
    stressCoping: [0, 0, 0, 0],
    lifestyleHealth: [0, 0, 0],
    openEndedReflection: ""
  });

  const totalSteps = 3; // Intro, Questions, Results
  const progress = ((currentStep) / (totalSteps - 1)) * 100;

  const handleStart = () => {
    setCurrentStep(1);
  };

  const handleAnswerChange = (section: keyof AssessmentData, index: number, value: number) => {
    setAssessmentData(prev => {
      const newData = { ...prev };
      
      if (section === 'emotionalWellbeing') {
        if (index < 2) {
          // Depression questions (indices 0-1)
          newData.emotionalWellbeing.depression[index] = value;
        } else {
          // Anxiety questions (indices 2-3, but stored as 0-1)
          newData.emotionalWellbeing.anxiety[index - 2] = value;
        }
      } else if (section === 'stressCoping') {
        newData.stressCoping[index] = value;
      } else if (section === 'lifestyleHealth') {
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

  const handleSubmit = () => {
    setCurrentStep(2);
    // In a real application, you might want to save the results to a database
  };

  const handleRetakeAssessment = () => {
    setAssessmentData({
      emotionalWellbeing: {
        depression: [0, 0],
        anxiety: [0, 0]
      },
      stressCoping: [0, 0, 0, 0],
      lifestyleHealth: [0, 0, 0],
      openEndedReflection: ""
    });
    setCurrentStep(0);
  };

  const handleExitAssessment = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-background to-ifind-offwhite/30 py-8">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-ifind-charcoal mb-2">
                Mental Well-Being Assessment
              </h1>
              
              {currentStep > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-ifind-charcoal/70">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>

            {currentStep === 0 && (
              <AssessmentIntro onStart={handleStart} />
            )}

            {currentStep === 1 && (
              <AssessmentQuestions 
                assessmentData={assessmentData}
                onAnswerChange={handleAnswerChange}
                onOpenEndedResponse={handleOpenEndedResponse}
                onSubmit={handleSubmit}
              />
            )}

            {currentStep === 2 && (
              <AssessmentResults 
                assessmentData={assessmentData}
                onRetake={handleRetakeAssessment}
                onExit={handleExitAssessment}
              />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MentalHealthAssessment;
