
import { Expert, ExtendedExpert } from '@/types/expert';

// This function converts expert data from various formats to a consistent ExtendedExpert format
export function convertToExpertFormat(expertData: any[]): ExtendedExpert[] {
  return expertData.map(expert => {
    // Ensure id is always a string
    const id = expert.auth_id ? String(expert.auth_id) : '';
    
    return {
      ...expert,
      id, // Replace with string version
      // Ensure all required fields are present
      name: expert.name || '',
      email: expert.email || '',
      bio: expert.bio || '',
      specialization: expert.specialization || '',
      average_rating: expert.average_rating || 0,
      // Add any other required fields and conversions
    } as ExtendedExpert;
  });
}
