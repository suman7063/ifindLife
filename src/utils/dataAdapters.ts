
import { Course, Review, Report } from '@/types/supabase';

// Adapters for converting database objects to UI-friendly objects
export const adaptCoursesToUI = (courses: any[]): Course[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expertId: course.expert_id.toString(),
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date,
    progress: course.progress,
    completed: course.completed
  }));
};

export const adaptReviewsToUI = (reviews: any[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    expertId: review.expert_id.toString(),
    rating: review.rating,
    comment: review.comment,
    date: review.date
  }));
};

export const adaptReportsToUI = (reports: any[]): Report[] => {
  return reports.map(report => ({
    id: report.id,
    expertId: report.expert_id.toString(),
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};

// Adapters for converting UI objects to database format
export const adaptCoursesToDB = (courses: Course[]): any[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expert_id: parseInt(course.expertId, 10),
    expert_name: course.expertName,
    enrollment_date: course.enrollmentDate,
    progress: course.progress,
    completed: course.completed
  }));
};

export const adaptReviewsToDB = (reviews: Review[]): any[] => {
  return reviews.map(review => ({
    id: review.id,
    expert_id: parseInt(review.expertId, 10),
    rating: review.rating,
    comment: review.comment,
    date: review.date
  }));
};

export const adaptReportsToDB = (reports: Report[]): any[] => {
  return reports.map(report => ({
    id: report.id,
    expert_id: parseInt(report.expertId, 10),
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status
  }));
};
