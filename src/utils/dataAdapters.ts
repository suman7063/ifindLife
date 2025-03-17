import { Course, UserCourse, UserReview, UserReport } from '@/types/supabase';
import { ReviewUI as Review, ReportUI as Report } from '@/types/supabase/reviews';

// Function to adapt database courses to UI format
export const adaptCoursesToUI = (courses: UserCourse[]): Course[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expertId: course.expert_id.toString(), // Convert number to string
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date,
    progress: course.progress,
    completed: course.completed
  }));
};

// Function to adapt database reviews to UI format
export const adaptReviewsToUI = (reviews: UserReview[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    expertId: review.expert_id.toString(), // Convert number to string
    rating: review.rating,
    comment: review.comment || '',
    date: review.date,
    verified: review.verified,
    userId: review.user_id,
    userName: review.user_name
  }));
};

// Function to adapt database reports to UI format
export const adaptReportsToUI = (reports: UserReport[]): Report[] => {
  return reports.map(report => ({
    id: report.id,
    expertId: report.expert_id.toString(), // Convert number to string
    reason: report.reason,
    details: report.details || '',
    date: report.date,
    status: report.status
  }));
};

// Function to convert UI format back to database format for courses
export const adaptCoursesToDB = (courses: Course[]): UserCourse[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expert_id: parseInt(course.expertId), // Convert string to number
    expert_name: course.expertName,
    enrollment_date: course.enrollmentDate,
    progress: course.progress,
    completed: course.completed
  }));
};

// Function to convert UI format back to database format for reviews
export const adaptReviewsToDB = (reviews: Review[]): UserReview[] => {
  return reviews.map(review => ({
    id: review.id,
    expert_id: parseInt(review.expertId), // Convert string to number
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    verified: review.verified,
    user_id: review.userId,
    user_name: review.userName
  }));
};

// Function to convert UI format back to database format for reports
export const adaptReportsToDB = (reports: Report[]): UserReport[] => {
  return reports.map(report => ({
    id: report.id,
    expert_id: parseInt(report.expertId), // Convert string to number
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};
