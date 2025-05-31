
export interface ProgramDetail {
  id: string;
  title: string;
  description: string;
  expert: {
    name: string;
    photo: string;
    experience: string;
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
  };
  whatItCovers: string[];
  expectedOutcomes: string[];
  pricing: {
    individual: {
      perSession: number;
      totalCost: number;
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
    }[];
  };
}
