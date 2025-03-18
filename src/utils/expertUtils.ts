
import { Expert } from "@/types/expert";

export function convertDBExpertToUI(dbExpert: any): Expert {
  return {
    id: dbExpert.id,
    name: dbExpert.name || "",
    email: dbExpert.email || "",
    phone: dbExpert.phone,
    address: dbExpert.address,
    city: dbExpert.city,
    state: dbExpert.state,
    country: dbExpert.country,
    specialization: dbExpert.specialization,
    specialties: dbExpert.specialties || [],
    experience: dbExpert.experience || 0,
    bio: dbExpert.bio,
    imageUrl: dbExpert.image_url,
    profile_picture: dbExpert.profile_picture,
    rating: dbExpert.rating || dbExpert.average_rating || 0,
    reviews_count: dbExpert.reviews_count || 0,
    average_rating: dbExpert.average_rating || 0,
    certificate_urls: dbExpert.certificate_urls || [],
    selected_services: dbExpert.selected_services || [],
    languages: dbExpert.languages || [],
    consultations: dbExpert.consultations || 0,
    price: dbExpert.price || 0,
    waitTime: dbExpert.wait_time || "0 min",
    online: dbExpert.online || false
  };
}

// Convert UI format to DB format for expert
export function convertUIExpertToDB(uiExpert: Expert): any {
  return {
    id: uiExpert.id,
    name: uiExpert.name,
    email: uiExpert.email,
    phone: uiExpert.phone,
    address: uiExpert.address,
    city: uiExpert.city,
    state: uiExpert.state,
    country: uiExpert.country,
    specialization: uiExpert.specialization,
    specialties: uiExpert.specialties,
    experience: uiExpert.experience,
    bio: uiExpert.bio,
    profile_picture: uiExpert.profile_picture || uiExpert.imageUrl,
    rating: uiExpert.rating,
    average_rating: uiExpert.average_rating || uiExpert.rating,
    reviews_count: uiExpert.reviews_count,
    certificate_urls: uiExpert.certificate_urls,
    selected_services: uiExpert.selected_services,
    languages: uiExpert.languages,
    consultations: uiExpert.consultations,
    price: uiExpert.price,
    wait_time: uiExpert.waitTime,
    online: uiExpert.online
  };
}
