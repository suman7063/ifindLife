
// Main index file re-exporting all types from the specialized files

export * from './tables';
export * from './user';
export * from './expert';
export * from './referral';

// For backward compatibility
import { Expert } from './tables';
export type ExpertProfile = Expert;
