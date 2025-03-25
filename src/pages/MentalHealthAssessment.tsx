
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AssessmentIntro from '@/components/assessment/AssessmentIntro';
import AssessmentQuestions from '@/components/assessment/AssessmentQuestions';
import AssessmentResults from '@/components/assessment/AssessmentResults';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AssessmentData } from '@/types/assessment';

enum AssessmentStep {
  INTRO = 'intro',
  QUESTIONS = 'questions',
  RESULTS = 'results',
}

const MentalHealthAssessment = () => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>(AssessmentStep.INTRO);
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    emotionalWellbeing: {
      depression: [0, 0],
      anxiety: [0, 0],
    },
    stressCoping: [0, 0, 0, 0],
    lifestyleHealth: [0, 0, 0],
    openEndedReflection: '',
  });

  const handleStartAssessment = () => {
    setCurrentStep(AssessmentStep.QUESTIONS);
    window.scrollTo(0, 0);
  };

  const handleAnswerChange = (section: keyof AssessmentData, index: number, value: number) => {
    setAssessmentData(prevData => {
      const newData = { ...prevData };
      
      if (section === 'emotionalWellbeing') {
        if (index < 2) {
          newData.emotionalWellbeing.depression[index] = value;
        } else {
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
    setAssessmentData(prevData => ({
      ...prevData,
      openEndedReflection: text
    }));
  };

  const handleCompleteAssessment = () => {
    setCurrentStep(AssessmentStep.RESULTS);
    window.scrollTo(0, 0);
  };

  const handleRetake = () => {
    setCurrentStep(AssessmentStep.INTRO);
    setAssessmentData({
      emotionalWellbeing: {
        depression: [0, 0],
        anxiety: [0, 0],
      },
      stressCoping: [0, 0, 0, 0],
      lifestyleHealth: [0, 0, 0],
      openEndedReflection: '',
    });
    window.scrollTo(0, 0);
  };

  const handleExit = () => {
    // Navigate to home page
    window.location.href = '/';
  };

  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 bg-gradient-to-b from-white to-gray-50">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8 flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-center flex-1 mr-16">Mental Health Assessment</h1>
          </div>

          <Card className="shadow-md border-ifind-teal/10">
            <CardContent className="p-6 md:p-8">
              {currentStep === AssessmentStep.INTRO && (
                <AssessmentIntro onStart={handleStartAssessment} />
              )}
              
              {currentStep === AssessmentStep.QUESTIONS && (
                <AssessmentQuestions 
                  assessmentData={assessmentData}
                  onAnswerChange={handleAnswerChange}
                  onOpenEndedResponse={handleOpenEndedResponse}
                  onSubmit={handleCompleteAssessment}
                />
              )}
              
              {currentStep === AssessmentStep.RESULTS && (
                <AssessmentResults 
                  assessmentData={assessmentData}
                  onRetake={handleRetake}
                  onExit={handleExit}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MentalHealthAssessment;
