
import { Expert } from '@/types/expert';

/**
 * Convert a database expert object to the UI format expected by the Admin page
 * This is a temporary solution until we standardize our types
 */
export const convertToExpertUIFormat = (expert: any): Expert => {
  return {
    id: expert.id,
    name: expert.name,
    email: expert.email || 'unknown@example.com', // Provide default for required field
    phone: expert.phone,
    address: expert.address,
    city: expert.city,
    state: expert.state,
    country: expert.country,
    specialization: expert.specialization,
    specialties: expert.specialties || [],
    experience: expert.experience || 0,
    bio: expert.bio,
    imageUrl: expert.imageUrl || expert.profile_picture,
    rating: expert.rating || expert.average_rating || 0,
    consultations: expert.consultations || expert.reviews_count || 0,
    price: expert.price || 0,
    waitTime: expert.waitTime || expert.wait_time || '15 minutes',
    online: expert.online || false,
    certificate_urls: expert.certificate_urls || [],
    profile_picture: expert.profile_picture,
    average_rating: expert.average_rating || expert.rating || 0,
    reviews_count: expert.reviews_count || expert.consultations || 0,
    selected_services: expert.selected_services || []
  };
};

/**
 * Convert Admin page temporary expert format to our standard Expert type
 */
export const convertAdminExpertsToStandard = (experts: any[]): Expert[] => {
  return experts.map(expert => ({
    id: expert.id,
    name: expert.name,
    email: 'contact@example.com', // Temporary email since Admin expects it
    experience: expert.experience,
    specialties: expert.specialties,
    rating: expert.rating,
    consultations: expert.consultations,
    price: expert.price,
    waitTime: expert.waitTime,
    imageUrl: expert.imageUrl,
    online: expert.online,
    average_rating: expert.rating,
    reviews_count: expert.consultations,
    // Add other required fields with defaults
    specialization: '',
    bio: ''
  }));
};
