
import { Expert } from '@/components/admin/experts/types';
import { ExtendedExpert } from '@/types/expert';

/**
 * Converts ExtendedExpert type to Expert type format
 * @param extendedExperts Array of ExtendedExpert objects
 * @returns Array of Expert objects
 */
export const convertToExpertFormat = (extendedExperts: ExtendedExpert[]): Expert[] => {
  return extendedExperts.map(exp => ({
    id: typeof exp.id === 'string' ? parseInt(exp.id) : exp.id as number,
    name: exp.name,
    experience: typeof exp.experience === 'string' ? parseInt(exp.experience) : (exp.experience as number || 0),
    specialties: exp.specialties || [],
    rating: exp.rating || 4.5,
    consultations: exp.sessionCount || 0,
    price: exp.pricing?.consultation_fee || 0,
    waitTime: "Available",
    imageUrl: exp.profile_picture || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1780&auto=format&fit=crop",
    online: true,
    languages: exp.languages || [],
    bio: exp.bio || "",
    email: exp.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: ""
  }));
};
