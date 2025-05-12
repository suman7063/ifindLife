
import { Testimonial } from './types';

// Default testimonials for the application
export const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    location: 'ABC Corporation',
    text: 'Working with iFind Life has completely transformed my approach to stress management. The experts really listen and provide practical solutions.',
    rating: 5,
    imageUrl: '/lovable-uploads/3ba262c7-796f-46aa-92f7-23924bdc6a44.png'
  },
  {
    id: '2',
    name: 'Michael Johnson',
    location: 'Tech Innovations',
    text: 'I was skeptical about online counseling, but iFind Life proved me wrong. The platform is easy to use and the therapists are truly exceptional.',
    rating: 4,
    imageUrl: '/lovable-uploads/43d69b36-0616-44bf-8fd1-2aa35a40a945.png'
  },
  {
    id: '3',
    name: 'Sarah Williams',
    location: 'City Hospital',
    text: 'As someone who helps others daily, I needed support myself. iFind Life connected me with a coach who understood my unique challenges.',
    rating: 5,
    imageUrl: '/lovable-uploads/50267abc-f35e-4528-a0cf-90d80e5e5f84.png'
  }
];

// Function to get default testimonials
export const getDefaultTestimonials = (): Testimonial[] => {
  return defaultTestimonials;
};
