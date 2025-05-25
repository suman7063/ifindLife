export interface AssessmentData {
  emotionalWellbeing: {
    depression: [number, number];
    anxiety: [number, number];
  };
  stressCoping: [number, number, number, number];
  lifestyleHealth: [number, number, number];
  openEndedReflection: string;
}

export interface AssessmentScores {
  phq2Score: number;
  gad2Score: number;
  phq4TotalScore: number;
  stressScore: number;
  lifestyleScore: number;
  overallScore: number;
}

export interface AssessmentScore {
  phq2Score: number;
  gad2Score: number;
  phq4TotalScore: number;
  stressCopingScore: number;
  lifestyleHealthScore: number;
  totalScore: number;
}

export interface AssessmentFeedback {
  depressionFeedback?: string;
  anxietyFeedback?: string;
  overallMentalHealthFeedback?: string;
  stressFeedback?: string;
  lifestyleFeedback?: string;
  generalRecommendations: string[];
  resourceLinks: Array<{
    title: string;
    description: string;
    url: string;
  }>;
  phq2Feedback?: string;
  gad2Feedback?: string;
  phq4Feedback?: string;
  overallFeedback?: string;
  recommendations?: string[];
  resources?: string[];
  seekProfessionalHelp?: boolean;
}
