
export interface Testimonial {
  id: string;
  name: string;
  text: string; // The actual testimonial content
  content?: string; // Alias for text for backward compatibility
  company?: string; // Alias for location for backward compatibility
  location?: string; // Where the testimonial is from
  rating: number;
  imageUrl: string;
  date?: string;
}
