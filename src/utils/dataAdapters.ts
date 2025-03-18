
import { 
  Course, 
  UserCourse, 
  UserReview, 
  UserReport 
} from '@/types/supabase';
import { 
  Review, 
  Report 
} from '@/types/supabase/reviews';
import { createAdapter } from './dataFormatters';
import { convertExpertIdToString } from '@/types/supabase/expertId';

// Create adapters for each type
const courseAdapter = createAdapter<UserCourse, Course>(
  // DB to UI transform
  (dbCourse: UserCourse): Course => ({
    id: dbCourse.id,
    title: dbCourse.title,
    expertId: dbCourse.expert_id?.toString(),
    expertName: dbCourse.expert_name,
    enrollmentDate: dbCourse.enrollment_date,
    progress: dbCourse.progress,
    completed: dbCourse.completed,
    // Ensure userId is properly mapped for consistency
    userId: dbCourse.user_id
  }),
  // UI to DB transform
  (uiCourse: Course): UserCourse => ({
    id: uiCourse.id,
    title: uiCourse.title,
    expert_id: parseInt(uiCourse.expertId),
    expert_name: uiCourse.expertName,
    enrollment_date: uiCourse.enrollmentDate,
    progress: uiCourse.progress,
    completed: uiCourse.completed,
    user_id: uiCourse.userId
  })
);

const reviewAdapter = createAdapter<UserReview, Review>(
  // DB to UI transform
  (dbReview: UserReview): Review => ({
    id: dbReview.id,
    expertId: convertExpertIdToString(dbReview.expert_id),
    rating: dbReview.rating,
    comment: dbReview.comment || '',
    date: dbReview.date,
    verified: dbReview.verified || false,
    userId: dbReview.user_id || '',
    userName: dbReview.user_name || `User ${dbReview.user_id?.slice(0, 8)}...` || 'Anonymous',
    expertName: 'Expert' // This will be filled in later when needed
  }),
  // UI to DB transform
  (uiReview: Review): UserReview => ({
    id: uiReview.id,
    expert_id: parseInt(uiReview.expertId),
    rating: uiReview.rating,
    comment: uiReview.comment,
    date: uiReview.date,
    verified: uiReview.verified,
    user_id: uiReview.userId,
    user_name: uiReview.userName
  })
);

const reportAdapter = createAdapter<UserReport, Report>(
  // DB to UI transform
  (dbReport: UserReport): Report => ({
    id: dbReport.id,
    expertId: convertExpertIdToString(dbReport.expert_id),
    reason: dbReport.reason,
    details: dbReport.details || '',
    date: dbReport.date,
    status: dbReport.status,
    userId: dbReport.user_id,
    userName: dbReport.user_id ? `User ${dbReport.user_id.slice(0, 8)}...` : 'Anonymous'
  }),
  // UI to DB transform
  (uiReport: Report): UserReport => ({
    id: uiReport.id,
    expert_id: parseInt(uiReport.expertId),
    reason: uiReport.reason,
    details: uiReport.details,
    date: uiReport.date,
    status: uiReport.status,
    user_id: uiReport.userId
  })
);

// Function to adapt database courses to UI format
export const adaptCoursesToUI = (courses: any[]): Course[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expertId: course.expert_id?.toString(),
    expertName: course.expert_name,
    enrollmentDate: course.enrollment_date,
    progress: course.progress,
    completed: course.completed,
    userId: course.user_id
  }));
};

// Function to adapt database reviews to UI format
export const adaptReviewsToUI = (reviews: any[]): Review[] => {
  return reviews.map(review => ({
    id: review.id,
    expertId: convertExpertIdToString(review.expert_id),
    rating: review.rating,
    comment: review.comment || '',
    date: review.date,
    verified: review.verified || false,
    userId: review.user_id || '',
    userName: review.user_name || `User ${review.user_id?.slice(0, 8)}...` || 'Anonymous',
    expertName: 'Expert'
  }));
};

// Function to adapt database reports to UI format
export const adaptReportsToUI = (reports: any[]): Report[] => {
  return reports.map(report => ({
    id: report.id,
    expertId: convertExpertIdToString(report.expert_id),
    reason: report.reason,
    details: report.details || '',
    date: report.date,
    status: report.status,
    userId: report.user_id,
    userName: report.user_id ? `User ${report.user_id.slice(0, 8)}...` : 'Anonymous'
  }));
};

// Function to convert UI format back to database format for courses
export const adaptCoursesToDB = (courses: Course[]): UserCourse[] => {
  return courses.map(course => ({
    id: course.id,
    title: course.title,
    expert_id: parseInt(course.expertId),
    expert_name: course.expertName,
    enrollment_date: course.enrollmentDate,
    progress: course.progress,
    completed: course.completed,
    user_id: course.userId
  }));
};

// Function to convert UI format back to database format for reviews
export const adaptReviewsToDB = (reviews: Review[]): UserReview[] => {
  return reviews.map(review => ({
    id: review.id,
    expert_id: parseInt(review.expertId),
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
    expert_id: parseInt(report.expertId),
    reason: report.reason,
    details: report.details,
    date: report.date,
    status: report.status,
    user_id: report.userId
  }));
};
