
// User course related types
export interface UserCourse {
  id: string;
  userId: string;
  expertId: string;
  expertName: string;
  title: string;
  enrollmentDate: string;
  completed: boolean;
  progress: number;
  
  // DB fields for compatibility
  user_id: string;
  expert_id: string;
  expert_name: string;
  enrollment_date: string;
}

// User review related types
export interface UserReview {
  id: string;
  userId: string;
  expertId: string;
  rating: number;
  comment?: string;
  date: string;
  verified: boolean;
  
  // DB fields for compatibility
  user_id: string;
  expert_id: string;
}

// User report related types
export interface UserReport {
  id: string;
  userId: string;
  expertId: string;
  reason: string;
  details?: string;
  date: string;
  status: string;
  
  // DB fields for compatibility
  user_id: string;
  expert_id: string;
}
