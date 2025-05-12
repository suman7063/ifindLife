
import { Testimonial } from './types';

// Function to get default testimonials 
export const getDefaultTestimonials = (): Testimonial[] => [
  {
    id: '1',
    name: 'Sarah Johnson',
    location: 'New York, USA',
    rating: 5,
    text: "Finding iFindLife was a turning point in my journey to better mental health. The platform connected me with a therapist who truly understands my needs.",
    date: '2023-06-15',
    image_url: '/lovable-uploads/3ba262c7-796f-46aa-92f7-23924bdc6a44.png'
  },
  {
    id: '2',
    name: 'Michael Chen',
    location: 'Toronto, Canada',
    rating: 5,
    text: "The experts at iFindLife helped me develop strategies to manage my anxiety. I'm now sleeping better and feeling more in control.",
    date: '2023-05-22',
    image_url: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    location: 'Miami, USA',
    rating: 4,
    text: "I was skeptical about online counseling, but the quality of care I received through iFindLife exceeded my expectations.",
    date: '2023-04-18',
    image_url: '/lovable-uploads/d119547a-bdfc-45f2-b432-5da3d389dcf7.png'
  }
];

// For backward compatibility
export const DEFAULT_TESTIMONIALS = getDefaultTestimonials();
