
// Re-export the useExpertAuth hook and types from the refactored module
export { useExpertAuth, ExpertProfile } from './expert-auth';
export type { 
  ExpertAuthState, 
  UseExpertAuthReturn, 
  ExpertRegistrationData 
} from './expert-auth/types';
