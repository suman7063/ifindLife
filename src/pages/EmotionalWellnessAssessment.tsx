
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Share2, User } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

interface EmotionalAssessmentData {
  emotionalAwareness: number[];
  stressManagement: number[];
  relationships: number[];
  selfEsteem: number[];
  moodRegulation: number[];
}

interface EmotionalAssessmentResult {
  overallScore: number;
  emotionalAwarenessScore: number;
  stressManagementScore: number;
  relationshipsScore: number;
  selfEsteemScore: number;
  moodRegulationScore: number;
  recommendations: string[];
  suggestedPrograms: string[];
  suggestedExperts: string[];
}

const emotionalQuestions = [
  // Emotional Awareness (5 questions)
  {
    category: 'emotionalAwareness',
    question: 'I can easily identify what emotions I am feeling in the moment.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'emotionalAwareness',
    question: 'I understand what triggers my different emotions.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'emotionalAwareness',
    question: 'I can express my feelings clearly to others.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'emotionalAwareness',
    question: 'I notice changes in my emotional state throughout the day.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'emotionalAwareness',
    question: 'I can distinguish between different emotions (sad vs disappointed, angry vs frustrated).',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  
  // Stress Management (5 questions)
  {
    category: 'stressManagement',
    question: 'I have effective ways to calm myself when feeling overwhelmed.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'stressManagement',
    question: 'I can handle stressful situations without losing control.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'stressManagement',
    question: 'I practice stress-reduction techniques regularly.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'stressManagement',
    question: 'I know when to take breaks to prevent emotional burnout.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'stressManagement',
    question: 'I can maintain perspective during challenging times.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  
  // Relationships (5 questions)
  {
    category: 'relationships',
    question: 'I feel comfortable sharing my emotions with close friends or family.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'relationships',
    question: 'I can empathize with others and understand their feelings.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'relationships',
    question: 'I handle conflicts in relationships constructively.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'relationships',
    question: 'I maintain healthy boundaries in my relationships.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'relationships',
    question: 'I feel supported by the people in my life.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  
  // Self-Esteem (5 questions)
  {
    category: 'selfEsteem',
    question: 'I have a positive view of myself overall.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'selfEsteem',
    question: 'I can accept compliments from others gracefully.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'selfEsteem',
    question: 'I believe in my ability to handle challenges.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'selfEsteem',
    question: 'I practice self-compassion when I make mistakes.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'selfEsteem',
    question: 'I celebrate my achievements and strengths.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  
  // Mood Regulation (5 questions)
  {
    category: 'moodRegulation',
    question: 'I can shift from negative to positive emotions when needed.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'moodRegulation',
    question: 'I use healthy activities to improve my mood.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'moodRegulation',
    question: 'I can tolerate uncomfortable emotions without avoiding them.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'moodRegulation',
    question: 'I maintain emotional stability throughout the day.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  },
  {
    category: 'moodRegulation',
    question: 'I can find silver linings or lessons in difficult situations.',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
  }
];

const EmotionalWellnessAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<EmotionalAssessmentData>({
    emotionalAwareness: [],
    stressManagement: [],
    relationships: [],
    selfEsteem: [],
    moodRegulation: []
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<EmotionalAssessmentResult | null>(null);

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
      calculateResults();
    }
  };

  const calculateResults = () => {
    const updatedAnswers = { ...answers };
    const question = emotionalQuestions[currentQuestion];
    const category = question.category as keyof EmotionalAssessmentData;
    updatedAnswers[category] = [...updatedAnswers[category], 0]; // placeholder for last answer

    const emotionalAwarenessScore = Math.round((updatedAnswers.emotionalAwareness.reduce((a, b) => a + b, 0) / (updatedAnswers.emotionalAwareness.length * 4)) * 100);
    const stressManagementScore = Math.round((updatedAnswers.stressManagement.reduce((a, b) => a + b, 0) / (updatedAnswers.stressManagement.length * 4)) * 100);
    const relationshipsScore = Math.round((updatedAnswers.relationships.reduce((a, b) => a + b, 0) / (updatedAnswers.relationships.length * 4)) * 100);
    const selfEsteemScore = Math.round((updatedAnswers.selfEsteem.reduce((a, b) => a + b, 0) / (updatedAnswers.selfEsteem.length * 4)) * 100);
    const moodRegulationScore = Math.round((updatedAnswers.moodRegulation.reduce((a, b) => a + b, 0) / (updatedAnswers.moodRegulation.length * 4)) * 100);
    const overallScore = Math.round((emotionalAwarenessScore + stressManagementScore + relationshipsScore + selfEsteemScore + moodRegulationScore) / 5);

    const recommendations = generateRecommendations(overallScore, emotionalAwarenessScore, stressManagementScore, relationshipsScore, selfEsteemScore, moodRegulationScore);

    setResults({
      overallScore,
      emotionalAwarenessScore,
      stressManagementScore,
      relationshipsScore,
      selfEsteemScore,
      moodRegulationScore,
      recommendations,
      suggestedPrograms: ['Self-Esteem Building Program', 'Stress Management Mastery', 'Relationship Enhancement Program'],
      suggestedExperts: ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Rodriguez']
    });
    setShowResults(true);
  };

  const generateRecommendations = (overall: number, awareness: number, stress: number, relationships: number, selfEsteem: number, mood: number): string[] => {
    const recommendations = [];

    if (overall >= 80) {
      recommendations.push('Excellent emotional wellness! Continue your current practices and consider mentoring others.');
    } else if (overall >= 60) {
      recommendations.push('Good emotional wellness with room for growth. Focus on areas that scored lower.');
    } else if (overall >= 40) {
      recommendations.push('Moderate emotional wellness. Consider developing specific emotional skills.');
    } else {
      recommendations.push('Your emotional wellness could benefit from focused attention and professional support.');
    }

    if (awareness < 60) recommendations.push('Practice mindfulness and emotional journaling to increase self-awareness.');
    if (stress < 60) recommendations.push('Learn stress management techniques like deep breathing and progressive muscle relaxation.');
    if (relationships < 60) recommendations.push('Focus on improving communication skills and building stronger social connections.');
    if (selfEsteem < 60) recommendations.push('Work on building self-confidence through positive self-talk and achievements.');
    if (mood < 60) recommendations.push('Develop healthy coping strategies and consider professional support for mood regulation.');

    return recommendations;
  };

  const handleShareStory = () => {
    toast.success('Thank you for wanting to share your story! A team member will contact you soon.');
  };

  const progress = ((currentQuestion + 1) / emotionalQuestions.length) * 100;

  if (showResults && results) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-12">
          <Container className="max-w-4xl">
            <Card className="shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-t-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="h-8 w-8" />
                  <CardTitle className="text-2xl font-bold">Your Emotional Wellness Results</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600 mb-2">{results.overallScore}%</div>
                    <p className="text-lg text-gray-600">Overall Emotional Wellness Score</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-pink-700">Emotional Awareness</h4>
                      <div className="text-2xl font-bold text-pink-600">{results.emotionalAwarenessScore}%</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-red-700">Stress Management</h4>
                      <div className="text-2xl font-bold text-red-600">{results.stressManagementScore}%</div>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-rose-700">Relationships</h4>
                      <div className="text-2xl font-bold text-rose-600">{results.relationshipsScore}%</div>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-pink-700">Self-Esteem</h4>
                      <div className="text-2xl font-bold text-pink-600">{results.selfEsteemScore}%</div>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg md:col-span-2">
                      <h4 className="font-semibold text-red-700">Mood Regulation</h4>
                      <div className="text-2xl font-bold text-red-600">{results.moodRegulationScore}%</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Suggested Programs</h4>
                      <div className="space-y-2">
                        {results.suggestedPrograms.map((program, index) => (
                          <Link
                            key={index}
                            to="/programs"
                            className="block bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors"
                          >
                            {program}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Connect with Experts</h4>
                      <div className="space-y-2">
                        {results.suggestedExperts.map((expert, index) => (
                          <Link
                            key={index}
                            to="/experts"
                            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 p-3 rounded-lg transition-colors"
                          >
                            <User className="h-4 w-4" />
                            {expert}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <h4 className="font-semibold mb-3">Share Your Journey</h4>
                      <Button
                        onClick={handleShareStory}
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Your Story
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        Help others by sharing your emotional wellness journey
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Container>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-12">
        <Container className="max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="h-8 w-8" />
                <CardTitle className="text-2xl font-bold">Emotional Wellness Assessment</CardTitle>
              </div>
              <p className="text-pink-100">Understand your emotional patterns and coping strategies</p>
            </CardHeader>
            
            <CardContent className="p-8">
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

              <div className="text-center text-sm text-gray-500">
                This assessment takes approximately 10-15 minutes to complete
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default EmotionalWellnessAssessment;
