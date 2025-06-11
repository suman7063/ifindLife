
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Share2, User } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

interface SpiritualAssessmentData {
  purpose: number[];
  connection: number[];
  innerPeace: number[];
  transcendence: number[];
  values: number[];
}

interface SpiritualAssessmentResult {
  overallScore: number;
  purposeScore: number;
  connectionScore: number;
  innerPeaceScore: number;
  transcendenceScore: number;
  valuesScore: number;
  recommendations: string[];
  suggestedPrograms: string[];
  suggestedExperts: string[];
}

const spiritualQuestions = [
  // Purpose & Meaning (5 questions)
  {
    category: 'purpose',
    question: 'I have a clear sense of purpose in my life.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'purpose',
    question: 'I feel that my life has meaning and significance.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'purpose',
    question: 'I understand what gives my life direction and meaning.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'purpose',
    question: 'I feel my actions align with my deeper purpose.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'purpose',
    question: 'I believe my life contributes to something greater than myself.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  
  // Connection (5 questions)
  {
    category: 'connection',
    question: 'I feel connected to nature and the world around me.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'connection',
    question: 'I have a sense of connection to something greater than myself.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'connection',
    question: 'I feel a deep connection with other people.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'connection',
    question: 'I experience moments of feeling one with the universe.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'connection',
    question: 'I find spiritual connection through various practices or beliefs.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  
  // Inner Peace (5 questions)
  {
    category: 'innerPeace',
    question: 'I regularly experience feelings of inner peace and calm.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'innerPeace',
    question: 'I can find tranquility even during stressful times.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'innerPeace',
    question: 'I practice meditation, prayer, or other mindfulness activities.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'innerPeace',
    question: 'I can quiet my mind when I need to.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'innerPeace',
    question: 'I feel at peace with who I am.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  
  // Transcendence (5 questions)
  {
    category: 'transcendence',
    question: 'I have experienced moments that felt sacred or transcendent.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'transcendence',
    question: 'I feel there is more to existence than what we can see or measure.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'transcendence',
    question: 'I am open to spiritual or mystical experiences.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'transcendence',
    question: 'I believe in the possibility of personal transformation.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'transcendence',
    question: 'I feel I can access wisdom beyond my everyday thinking.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  
  // Values & Ethics (5 questions)
  {
    category: 'values',
    question: 'I live according to my core values and beliefs.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'values',
    question: 'I treat others with compassion and kindness.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'values',
    question: 'I strive to make ethical choices in my daily life.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'values',
    question: 'I practice forgiveness toward myself and others.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  },
  {
    category: 'values',
    question: 'I feel guided by principles that are greater than personal gain.',
    options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree']
  }
];

const SpiritualWellnessAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<SpiritualAssessmentData>({
    purpose: [],
    connection: [],
    innerPeace: [],
    transcendence: [],
    values: []
  });
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<SpiritualAssessmentResult | null>(null);

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
      calculateResults();
    }
  };

  const calculateResults = () => {
    const updatedAnswers = { ...answers };
    const question = spiritualQuestions[currentQuestion];
    const category = question.category as keyof SpiritualAssessmentData;
    updatedAnswers[category] = [...updatedAnswers[category], 0]; // placeholder for last answer

    const purposeScore = Math.round((updatedAnswers.purpose.reduce((a, b) => a + b, 0) / (updatedAnswers.purpose.length * 4)) * 100);
    const connectionScore = Math.round((updatedAnswers.connection.reduce((a, b) => a + b, 0) / (updatedAnswers.connection.length * 4)) * 100);
    const innerPeaceScore = Math.round((updatedAnswers.innerPeace.reduce((a, b) => a + b, 0) / (updatedAnswers.innerPeace.length * 4)) * 100);
    const transcendenceScore = Math.round((updatedAnswers.transcendence.reduce((a, b) => a + b, 0) / (updatedAnswers.transcendence.length * 4)) * 100);
    const valuesScore = Math.round((updatedAnswers.values.reduce((a, b) => a + b, 0) / (updatedAnswers.values.length * 4)) * 100);
    const overallScore = Math.round((purposeScore + connectionScore + innerPeaceScore + transcendenceScore + valuesScore) / 5);

    const recommendations = generateRecommendations(overallScore, purposeScore, connectionScore, innerPeaceScore, transcendenceScore, valuesScore);

    setResults({
      overallScore,
      purposeScore,
      connectionScore,
      innerPeaceScore,
      transcendenceScore,
      valuesScore,
      recommendations,
      suggestedPrograms: ['Mindfulness Meditation Program', 'Purpose Discovery Workshop', 'Spiritual Growth Journey'],
      suggestedExperts: ['Dr. Maya Patel', 'Rev. James Williams', 'Dr. Lisa Thompson']
    });
    setShowResults(true);
  };

  const generateRecommendations = (overall: number, purpose: number, connection: number, peace: number, transcendence: number, values: number): string[] => {
    const recommendations = [];

    if (overall >= 80) {
      recommendations.push('Excellent spiritual wellness! You have a strong foundation for continued growth.');
    } else if (overall >= 60) {
      recommendations.push('Good spiritual wellness with opportunities for deeper exploration.');
    } else if (overall >= 40) {
      recommendations.push('Moderate spiritual wellness. Consider exploring practices that resonate with you.');
    } else {
      recommendations.push('Your spiritual wellness could benefit from exploration and development.');
    }

    if (purpose < 60) recommendations.push('Explore activities and reflection practices to discover your life purpose.');
    if (connection < 60) recommendations.push('Spend time in nature or engage in community activities to feel more connected.');
    if (peace < 60) recommendations.push('Try meditation, prayer, or other mindfulness practices for inner peace.');
    if (transcendence < 60) recommendations.push('Be open to new experiences that might expand your spiritual awareness.');
    if (values < 60) recommendations.push('Reflect on your core values and how you can live more authentically.');

    return recommendations;
  };

  const handleShareStory = () => {
    toast.success('Thank you for wanting to share your spiritual journey! A team member will contact you soon.');
  };

  const progress = ((currentQuestion + 1) / spiritualQuestions.length) * 100;

  if (showResults && results) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
          <Container className="max-w-4xl">
            <Card className="shadow-lg">
              <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-8 w-8" />
                  <CardTitle className="text-2xl font-bold">Your Spiritual Wellness Results</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">{results.overallScore}%</div>
                    <p className="text-lg text-gray-600">Overall Spiritual Wellness Score</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-700">Purpose & Meaning</h4>
                      <div className="text-2xl font-bold text-purple-600">{results.purposeScore}%</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-indigo-700">Connection</h4>
                      <div className="text-2xl font-bold text-indigo-600">{results.connectionScore}%</div>
                    </div>
                    <div className="bg-violet-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-violet-700">Inner Peace</h4>
                      <div className="text-2xl font-bold text-violet-600">{results.innerPeaceScore}%</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-700">Transcendence</h4>
                      <div className="text-2xl font-bold text-purple-600">{results.transcendenceScore}%</div>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg md:col-span-2">
                      <h4 className="font-semibold text-indigo-700">Values & Ethics</h4>
                      <div className="text-2xl font-bold text-indigo-600">{results.valuesScore}%</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
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
                            className="block bg-purple-50 hover:bg-purple-100 p-3 rounded-lg transition-colors"
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
                            className="flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 p-3 rounded-lg transition-colors"
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
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Your Story
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        Help others by sharing your spiritual wellness journey
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 py-12">
        <Container className="max-w-3xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-t-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-8 w-8" />
                <CardTitle className="text-2xl font-bold">Spiritual Wellness Assessment</CardTitle>
              </div>
              <p className="text-purple-100">Explore your spiritual connections and inner peace</p>
            </CardHeader>
            
            <CardContent className="p-8">
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

export default SpiritualWellnessAssessment;
