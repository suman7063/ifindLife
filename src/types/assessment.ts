
export interface AssessmentData {
  emotionalWellbeing: {
    depression: [number, number]; // PHQ-2: 2 questions
    anxiety: [number, number];    // GAD-2: 2 questions
  };
  stressCoping: [number, number, number, number]; // 4 questions
  lifestyleHealth: [number, number, number]; // 3 questions
  openEndedReflection: string;
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
  resourceLinks: {
    title: string;
    description: string;
    url: string;
  }[];
}
