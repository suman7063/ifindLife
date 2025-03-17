
import { Course, Review, Report } from '@/types/supabase';

// Function to adapt database courses to UI format
export const adaptCoursesToUI = (courses: any[]): Course[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expertId: course.expert_id,
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date,
    progress: course.progress,
    completed: course.completed
  }));
};

// Function to adapt database reviews to UI format
export const adaptReviewsToUI = (reviews: any[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    expertId: review.expert_id,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    verified: review.verified,
    userId: review.user_id,
    userName: review.user_name
  }));
};

// Function to adapt database reports to UI format
export const adaptReportsToUI = (reports: any[]): Report[] => {
  return reports.map(report => ({
    id: report.id,
    expertId: report.expert_id,
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};

// Function to convert UI format back to database format for courses
export const adaptCoursesToDB = (courses: Course[]): any[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expert_id: course.expertId,
    expert_name: course.expertName,
    enrollment_date: course.enrollmentDate,
    progress: course.progress,
    completed: course.completed
  }));
};

// Function to convert UI format back to database format for reviews
export const adaptReviewsToDB = (reviews: Review[]): any[] => {
  return reviews.map(review => ({
    id: review.id,
    expert_id: review.expertId,
    rating: review.rating,
    comment: review.comment,
    date: review.date,
    verified: review.verified,
    user_id: review.userId,
    user_name: review.userName
  }));
};

// Function to convert UI format back to database format for reports
export const adaptReportsToDB = (reports: Report[]): any[] => {
  return reports.map(report => ({
    id: report.id,
    expert_id: report.expertId,
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};
