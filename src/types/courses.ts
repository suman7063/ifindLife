
export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: string; // Duration in "mm:ss" format
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  introVideoUrl: string;
  thumbnailUrl: string;
  color: string; // For styling consistency with session cards
  icon: string; // For consistency with session icons
  price: number;
  duration: string; // Total duration (e.g., "45 minutes")
  totalModules: number;
  outcomes: string[];
  modules: CourseModule[];
  enrollmentCount?: number;
  rating?: number;
  instructorName?: string;
  instructorTitle?: string;
  instructorImageUrl?: string;
  category: string;
  href: string; // URL path for course
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollmentDate: string;
  lastAccessDate?: string;
  completedModules: string[]; // IDs of completed modules
  currentModuleId?: string;
  progress: number; // Percentage 0-100
  completed: boolean;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentMethod: 'wallet' | 'gateway' | string;
}
