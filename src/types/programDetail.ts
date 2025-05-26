
export interface ProgramDetail {
  id: string;
  title: string;
  description: string;
  category: 'issue-based' | 'wellness' | 'resilience' | 'quickease';
  
  courseStructure: {
    totalSessions: number;
    sessionDuration: string;
    frequency: string;
    format: 'individual' | 'group' | 'hybrid';
    modules: Array<{
      week: number;
      title: string;
      description: string;
      topics: string[];
    }>;
  };
  
  coverage: {
    mainTopics: string[];
    techniques: string[];
    tools: string[];
    skills: string[];
  };
  
  expectedOutcomes: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    successMetrics: string[];
  };
  
  pricing: {
    currency: 'INR' | 'USD';
    individual: {
      perSession: number;
      packagePrice?: number;
      discount?: {
        percentage: number;
        conditions: string;
      };
    };
    group?: {
      perPerson: number;
      minParticipants: number;
    };
  };
  
  duration: {
    programLength: string;
    timeCommitment: string;
    flexibility: string;
  };
  
  reviews: {
    averageRating: number;
    totalReviews: number;
    featured: Array<{
      id: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }>;
  };
  
  expert: {
    name: string;
    credentials: string[];
    experience: string;
    specialization: string[];
    photo?: string;
  };
}
