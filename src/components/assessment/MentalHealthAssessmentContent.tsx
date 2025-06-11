
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain } from 'lucide-react';

interface MentalAssessmentData {
  depression: number[];
  anxiety: number[];
  stressCoping: number[];
  lifestyleHealth: number[];
  sleepQuality: number[];
}

const mentalHealthQuestions = [
  {
    category: 'depression',
    question: 'I feel down, depressed, or hopeless.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'depression',
    question: 'I have little interest or pleasure in doing things.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'anxiety',
    question: 'I feel nervous, anxious, or on edge.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'anxiety',
    question: 'I have trouble relaxing or sitting still.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'stressCoping',
    question: 'I feel overwhelmed by daily responsibilities.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'stressCoping',
    question: 'I have effective strategies to manage stress.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'lifestyleHealth',
    question: 'I maintain a healthy work-life balance.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'sleepQuality',
    question: 'I get quality sleep and feel rested.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
];

const MentalHealthAssessmentContent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<MentalAssessmentData>({
    depression: [],
    anxiety: [],
    stressCoping: [],
    lifestyleHealth: [],
    sleepQuality: []
  });
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (score: number) => {
    const question = mentalHealthQuestions[currentQuestion];
    const category = question.category as keyof MentalAssessmentData;
    
    setAnswers(prev => ({
      ...prev,
      [category]: [...prev[category], score]
    }));

    if (currentQuestion < mentalHealthQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const progress = ((currentQuestion + 1) / mentalHealthQuestions.length) * 100;

  if (showResults) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-600">Mental Health Results</h2>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="text-4xl font-bold text-blue-600 mb-2">72%</div>
          <p className="text-lg text-gray-600">Overall Mental Health Score</p>
        </div>
        <p className="text-gray-600 mb-6">
          Your mental health assessment shows areas for improvement in stress management and self-care.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()} className="bg-blue-500 hover:bg-blue-600">
            Retake Assessment
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-blue-600">Mental Health Assessment</h2>
        </div>
        <p className="text-gray-600 text-center">
          A comprehensive evaluation to help you understand your current mental well-being
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {mentalHealthQuestions.length}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          {mentalHealthQuestions[currentQuestion].question}
        </h3>
        
        <div className="space-y-3">
          {mentalHealthQuestions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              variant="outline"
              className="w-full text-left justify-start p-4 h-auto hover:bg-blue-50 hover:border-blue-300"
            >
              <span className="mr-3 text-blue-500 font-semibold">{index + 1}.</span>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MentalHealthAssessmentContent;
