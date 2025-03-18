
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
    expertId: dbCourse.expert_id.toString(),
    expertName: dbCourse.expert_name,
    enrollmentDate: dbCourse.enrollment_date,
    progress: dbCourse.progress,
    completed: dbCourse.completed
  }),
  // UI to DB transform
  (uiCourse: Course): UserCourse => ({
    id: uiCourse.id,
    title: uiCourse.title,
    expert_id: parseInt(uiCourse.expertId),
    expert_name: uiCourse.expertName,
    enrollment_date: uiCourse.enrollmentDate,
    progress: uiCourse.progress,
    completed: uiCourse.completed
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
export const adaptCoursesToUI = (courses: UserCourse[]): Course[] => {
  return courseAdapter.toUiList(courses);
};

// Function to adapt database reviews to UI format
export const adaptReviewsToUI = (reviews: UserReview[]): Review[] => {
  return reviewAdapter.toUiList(reviews);
};

// Function to adapt database reports to UI format
export const adaptReportsToUI = (reports: UserReport[]): Report[] => {
  return reportAdapter.toUiList(reports);
};

// Function to convert UI format back to database format for courses
export const adaptCoursesToDB = (courses: Course[]): UserCourse[] => {
  return courseAdapter.toDbList(courses);
};

// Function to convert UI format back to database format for reviews
export const adaptReviewsToDB = (reviews: Review[]): UserReview[] => {
  return reviewAdapter.toDbList(reviews);
};

// Function to convert UI format back to database format for reports
export const adaptReportsToDB = (reports: Report[]): UserReport[] => {
  return reportAdapter.toDbList(reports);
};
