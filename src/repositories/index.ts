
// Export repository classes
import { UserRepository } from './userRepository';
import { ExpertRepository } from './expertRepository';

// Create instances for backward compatibility
export const userRepository = UserRepository;
export const expertRepository = ExpertRepository;

// Also export the classes directly
export { UserRepository, ExpertRepository };
