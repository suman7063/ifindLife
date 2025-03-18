
import { 
  UserCourse, 
  UserReview, 
  UserReport, 
  Review, 
  Report 
} from '@/types/supabase';

// Adapter functions to convert DB format to UI format
export const adaptCoursesToUI = (courses: any[]): UserCourse[] => {
  return courses.map(course => ({
    id: course.id,
    userId: course.user_id,
    expertId: course.expert_id,
    expertName: course.expert_name,
    title: course.title,
    enrollmentDate: course.enrollment_date,
    completed: course.completed || false,
    progress: course.progress || 0,
    
    // DB fields for compatibility
    user_id: course.user_id,
    expert_id: course.expert_id,
    expert_name: course.expert_name,
    enrollment_date: course.enrollment_date
  }));
};

export const adaptReviewsToUI = (reviews: any[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    userId: review.user_id,
    userName: review.user_name || 'Anonymous',
    expertId: review.expert_id,
    rating: review.rating,
    comment: review.comment || '',
    date: review.date,
    verified: review.verified || false,
    
    // DB fields for compatibility
    user_id: review.user_id,
    expert_id: review.expert_id,
    user_name: review.user_name || 'Anonymous'
  }));
};

export const adaptReportsToUI = (reports: any[]): Report[] => {
  return reports.map(report => ({
    id: report.id,
    userId: report.user_id,
    expertId: report.expert_id,
    reason: report.reason,
    details: report.details || '',
    date: report.date,
    status: report.status,
    
    // DB fields for compatibility
    user_id: report.user_id,
    expert_id: report.expert_id
  }));
};

// Adapter functions to convert UI format to DB format
export const adaptCoursesToDB = (courses: UserCourse[]): any[] => {
  return courses.map(course => ({
    id: course.id,
    user_id: course.userId,
    expert_id: course.expertId,
    expert_name: course.expertName,
    title: course.title,
    enrollment_date: course.enrollmentDate,
    completed: course.completed,
    progress: course.progress
  }));
};

export const adaptReviewsToDB = (reviews: Review[]): any[] => {
  return reviews.map(review => ({
    id: review.id,
    user_id: review.userId,
    user_name: review.userName,
    expert_id: review.expertId,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    verified: review.verified
  }));
};

export const adaptReportsToDB = (reports: Report[]): any[] => {
  return reports.map(report => ({
    id: report.id,
    user_id: report.userId,
    expert_id: report.expertId,
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};
