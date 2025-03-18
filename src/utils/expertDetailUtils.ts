
import { Expert } from '@/types/expert';

export const normalizeExpertData = (expert: any): Expert => {
  if (!expert) return {} as Expert;
  
  return {
    ...expert,
    // Add missing properties with defaults
    average_rating: expert.average_rating || 0,
    reviews_count: expert.reviews_count || 0,
    selected_services: expert.selected_services || [],
    // Make sure all required fields exist
    bio: expert.bio || '',
    name: expert.name || 'Anonymous Expert',
    specialties: expert.specialties || [],
    wait_time: expert.wait_time || '1-2 days',
    city: expert.city || '',
    country: expert.country || '',
    image_url: expert.image_url || '/placeholder.svg',
    languages: expert.languages || ['English'],
    license_number: expert.license_number || '',
    id: expert.id || '0',
    education: expert.education || [],
    experience: expert.experience || 0,
    consultations: expert.consultations || 0,
    rate: expert.rate || 0
  };
};

export const getExpertAvailability = (expertId: string) => {
  // This would be replaced with a real API call to get expert availability
  return {
    monday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
    tuesday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
    wednesday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
    thursday: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'],
    friday: ['9:00 AM - 12:00 PM'],
    saturday: [],
    sunday: []
  };
};

export default {
  normalizeExpertData,
  getExpertAvailability
};
