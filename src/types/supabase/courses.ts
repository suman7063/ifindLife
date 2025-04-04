
export interface Course {
  id: string | number;
  title: string;
  description: string;
  price: number;
  duration: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  
  // Additional fields needed by the UI
  expertId?: string | number;
  expertName?: string;
  enrollmentDate?: string;
  progress?: number;
  completed?: boolean;
}

export interface UIEnrolledCourse {
  id: string | number;
  title: string;
  expertId: string | number;
  expertName: string;
  enrollmentDate: string;
  progress?: number;
  completed?: boolean;
}
