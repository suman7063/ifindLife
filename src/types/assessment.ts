
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

export interface AssessmentFeedback {
  phq2Feedback: string;
  gad2Feedback: string;
  phq4Feedback: string;
  stressFeedback: string;
  lifestyleFeedback: string;
  overallFeedback: string;
  recommendations: string[];
  resources: string[];
  seekProfessionalHelp: boolean;
}
