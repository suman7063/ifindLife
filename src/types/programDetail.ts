
export interface ProgramDetail {
  id: string;
  title: string;
  description: string;
  overview?: string;
  benefits?: string[];
  features?: string[];
  duration: string | {
    programLength: string;
    timeCommitment: string;
    flexibility: string;
  };
  format: string;
  price: string;
  expert: {
    name: string;
    photo: string;
    experience: string;
    credentials: string[];
  };
  courseStructure: {
    totalSessions: number;
    sessionDuration: string;
    frequency: string;
    format: string;
    weeklyBreakdown: Array<{
      week: number;
      title: string;
      description: string;
      topics: string[];
    }>;
    modules?: Array<{
      week: number;
      title: string;
      description: string;
      topics: string[];
    }>;
  };
  coverage?: {
    mainTopics: string[];
    techniques: string[];
    tools: string[];
    skills: string[];
  };
  whatItCovers: string[];
  expectedOutcomes: string[] | {
    shortTerm?: string[];
    mediumTerm?: string[];
    longTerm?: string[];
    successMetrics?: string[];
  };
  pricing: {
    currency: string;
    individual: {
      perSession: number;
      totalCost: number;
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
  reviews: {
    averageRating: number;
    totalReviews: number;
    reviews: Array<{
      id: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }>;
    featured?: Array<{
      id: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
      verified: boolean;
    }>;
  };
}
