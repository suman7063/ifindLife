
// Re-export the useExpertAuth hook and types from the refactored module
export { useExpertAuth } from './expert-auth';
export { ExpertProfile } from './expert-auth/types';
export type { 
  ExpertAuthState, 
  UseExpertAuthReturn, 
  ExpertRegistrationData 
} from './expert-auth/types';
