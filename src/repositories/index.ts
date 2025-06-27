
// repositories/index.ts - PROPER EXPORTS
import { UserRepository } from './userRepository';
import { ExpertRepository } from './expertRepository';

// Create and export instances (what components expect)
export const userRepository = new UserRepository();
export const expertRepository = new ExpertRepository();

// Also export the classes
export { UserRepository, ExpertRepository };

// Default exports for compatibility
export default {
  userRepository,
  expertRepository,
  UserRepository,
  ExpertRepository
};
