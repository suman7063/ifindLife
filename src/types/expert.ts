
// Define the base Expert type
export interface Expert {
  id: string;
  name: string;
  email: string;
  phone?: string;
  experience?: string;
  bio?: string;
  specialization?: string;
  expertise?: string; 
  qualifications?: string[];
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePicture?: string;
  certificate_urls?: string[];
  auth_id?: string;
  created_at?: string;
  updated_at?: string;
}
