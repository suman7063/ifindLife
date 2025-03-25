
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

enum AssessmentStep {
  INTRO = 'intro',
  QUESTIONS = 'questions',
  RESULTS = 'results',
}

const MentalHealthAssessment = () => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>(AssessmentStep.INTRO);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  const handleStartAssessment = () => {
    setCurrentStep(AssessmentStep.QUESTIONS);
    window.scrollTo(0, 0);
  };

  const handleCompleteAssessment = (results: any) => {
    setAssessmentResults(results);
    setCurrentStep(AssessmentStep.RESULTS);
    window.scrollTo(0, 0);
  };

  const handleRestartAssessment = () => {
    setCurrentStep(AssessmentStep.INTRO);
    setAssessmentResults(null);
    window.scrollTo(0, 0);
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
                <AssessmentQuestions onComplete={handleCompleteAssessment} />
              )}
              
              {currentStep === AssessmentStep.RESULTS && assessmentResults && (
                <AssessmentResults 
                  results={assessmentResults} 
                  onRestart={handleRestartAssessment}
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
