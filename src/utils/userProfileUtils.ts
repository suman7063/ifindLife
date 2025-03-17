
// Re-export all functions from the refactored files
// This file is maintained for backward compatibility

import { convertUserToUserProfile } from './profileConverters';
import { 
  adaptCoursesToUI, 
  adaptReviewsToUI, 
  adaptReportsToUI,
  adaptCoursesToDB,
  adaptReviewsToDB,
  adaptReportsToDB
} from './dataAdapters';
import { fetchUserProfile, fetchUserReviews, fetchUserReports } from './profileFetcher';
import { updateUserProfile, updateProfilePicture } from './profileUpdater';

export {
  // From profileConverters.ts
  convertUserToUserProfile,
  
  // From dataAdapters.ts
  adaptCoursesToUI,
  adaptReviewsToUI,
  adaptReportsToUI,
  adaptCoursesToDB,
  adaptReviewsToDB,
  adaptReportsToDB,
  
  // From profileFetcher.ts
  fetchUserProfile,
  fetchUserReviews,
  fetchUserReports,
  
  // From profileUpdater.ts
  updateUserProfile,
  updateProfilePicture
};
