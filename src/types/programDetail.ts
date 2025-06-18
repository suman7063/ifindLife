
export interface ProgramDetail {
  id: string;
  title: string;
  description: string;
  expert: {
    name: string;
    photo: string;
    experience: string;
    credentials?: string[];
  };
  courseStructure: {
    totalSessions: number;
    sessionDuration: string;
    frequency: string;
    format: string;
    weeklyBreakdown: {
      week: number;
      title: string;
      description: string;
      topics: string[];
    }[];
    modules?: {
      week: number;
      title: string;
      description: string;
      topics: string[];
    }[];
  };
  coverage?: {
    mainTopics: string[];
    techniques: string[];
    tools: string[];
    skills: string[];
  };
  whatItCovers: string[];
  expectedOutcomes: {
    shortTerm?: string[];
    mediumTerm?: string[];
    longTerm?: string[];
    successMetrics?: string[];
  } | string[];
  duration?: {
    programLength: string;
    timeCommitment: string;
    flexibility: string;
  };
  pricing: {
    currency?: string;
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
    reviews: {
      id: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
      verified?: boolean;
    }[];
    featured?: {
      id: string;
      userName: string;
      rating: number;
      comment: string;
      date: string;
      verified?: boolean;
    }[];
  };
}
