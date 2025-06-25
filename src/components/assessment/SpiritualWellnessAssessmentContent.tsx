
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles } from 'lucide-react';

interface SpiritualAssessmentData {
  purpose: number[];
  connection: number[];
  values: number[];
  mindfulness: number[];
  gratitude: number[];
}

const spiritualQuestions = [
  {
    category: 'purpose',
    question: 'I have a clear sense of purpose and meaning in my life.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'connection',
    question: 'I feel connected to something greater than myself.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'values',
    question: 'I live according to my core values and beliefs.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'mindfulness',
    question: 'I regularly practice mindfulness or meditation.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'gratitude',
    question: 'I regularly reflect on what I am grateful for.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
];

const SpiritualWellnessAssessmentContent = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<SpiritualAssessmentData>({
    purpose: [],
    connection: [],
    values: [],
    mindfulness: [],
    gratitude: []
  });
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (score: number) => {
    const question = spiritualQuestions[currentQuestion];
    const category = question.category as keyof SpiritualAssessmentData;
    
    setAnswers(prev => ({
      ...prev,
      [category]: [...prev[category], score]
    }));

    if (currentQuestion < spiritualQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const progress = ((currentQuestion + 1) / spiritualQuestions.length) * 100;

  if (showResults) {
    return (
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600">Spiritual Wellness Results</h2>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg mb-6">
          <div className="text-4xl font-bold text-purple-600 mb-2">78%</div>
          <p className="text-lg text-gray-600">Overall Spiritual Wellness Score</p>
        </div>
        <p className="text-gray-600 mb-6">
          Your spiritual wellness assessment shows good connection to your values and sense of purpose.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()} className="bg-purple-500 hover:bg-purple-600">
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
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-purple-600">Spiritual Wellness Assessment</h2>
        </div>
        <p className="text-gray-600 text-center">
          Explore your spiritual connections and inner peace
        </p>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {spiritualQuestions.length}
          </span>
          <span className="text-sm text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          {spiritualQuestions[currentQuestion].question}
        </h3>
        
        <div className="space-y-3">
          {spiritualQuestions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(index)}
              variant="outline"
              className="w-full text-left justify-start p-4 h-auto hover:bg-purple-50 hover:border-purple-300"
            >
              <span className="mr-3 text-purple-500 font-semibold">{index + 1}.</span>
              {option}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiritualWellnessAssessmentContent;
