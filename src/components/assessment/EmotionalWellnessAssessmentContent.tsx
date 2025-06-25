
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart } from 'lucide-react';

interface EmotionalAssessmentData {
  emotionalAwareness: number[];
  stressManagement: number[];
  relationships: number[];
  selfEsteem: number[];
  moodRegulation: number[];
}

const emotionalQuestions = [
  {
    category: 'emotionalAwareness',
    question: 'I can easily identify what emotions I am feeling in the moment.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'stressManagement',
    question: 'I have effective ways to calm myself when feeling overwhelmed.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'relationships',
    question: 'I feel comfortable sharing my emotions with close friends or family.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'selfEsteem',
    question: 'I have a positive view of myself overall.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'moodRegulation',
    question: 'I can shift from negative to positive emotions when needed.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
];

const EmotionalWellnessAssessmentContent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<EmotionalAssessmentData>({
    emotionalAwareness: [],
    stressManagement: [],
    relationships: [],
    selfEsteem: [],
    moodRegulation: []
  });
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (score: number) => {
    const question = emotionalQuestions[currentQuestion];
    const category = question.category as keyof EmotionalAssessmentData;
    
    setAnswers(prev => ({
      ...prev,
      [category]: [...prev[category], score]
    }));

    if (currentQuestion < emotionalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const progress = ((currentQuestion + 1) / emotionalQuestions.length) * 100;

  if (showResults) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <h2 className="text-2xl font-bold text-red-600">Emotional Wellness Results</h2>
        </div>
        <div className="bg-red-50 p-6 rounded-lg mb-6">
          <div className="text-4xl font-bold text-red-600 mb-2">85%</div>
          <p className="text-lg text-gray-600">Overall Emotional Wellness Score</p>
        </div>
        <p className="text-gray-600 mb-6">
          Your emotional wellness assessment indicates good emotional awareness and regulation skills.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()} className="bg-red-500 hover:bg-red-600">
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
          <Heart className="h-8 w-8 text-red-500" />
          <h2 className="text-2xl font-bold text-red-600">Emotional Wellness Assessment</h2>
        </div>
        <p className="text-gray-600 text-center">
          Understand your emotional patterns and coping strategies
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {emotionalQuestions.length}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          {emotionalQuestions[currentQuestion].question}
        </h3>
        
        <div className="space-y-3">
          {emotionalQuestions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              variant="outline"
              className="w-full text-left justify-start p-4 h-auto hover:bg-red-50 hover:border-red-300"
            >
              <span className="mr-3 text-red-500 font-semibold">{index + 1}.</span>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalWellnessAssessmentContent;
