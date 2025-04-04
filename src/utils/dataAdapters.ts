
import { Course, UIEnrolledCourse } from '@/types/supabase/courses';
import { Referral } from '@/types/supabase/referral';

// Function to adapt raw course data to the UI format
export const adaptCoursesToUI = (rawCourses: any[]): UIEnrolledCourse[] => {
  return rawCourses.map(course => ({
    id: course.id,
    title: course.title,
    expertId: course.expert_id,
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date,
    progress: course.progress,
    completed: course.completed
  }));
};

// Function to adapt raw review data to UI format
export const adaptReviewsToUI = (rawReviews: any[]): any[] => {
  return rawReviews.map(review => ({
    id: review.id,
    expertId: review.expert_id,
    rating: review.rating,
    comment: review.comment || '',
    date: review.date,
    verified: review.verified || false
  }));
};

// Function to adapt raw report data to UI format
export const adaptReportsToUI = (rawReports: any[]): any[] => {
  return rawReports.map(report => ({
    id: report.id,
    expertId: report.expert_id,
    reason: report.reason,
    details: report.details || '',
    date: report.date,
    status: report.status || 'pending'
  }));
};

// Convert UI course format to database format
export const adaptUICoursesToDB = (courses: UIEnrolledCourse[]): any[] => {
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
