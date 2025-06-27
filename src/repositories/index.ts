
// Export repository classes and create instances
import { UserRepository } from './userRepository';
import { ExpertRepository } from './expertRepository';

// Create instances for backward compatibility
export const userRepository = new UserRepository();
export const expertRepository = new ExpertRepository();

// Also export the classes directly
export { UserRepository, ExpertRepository };
