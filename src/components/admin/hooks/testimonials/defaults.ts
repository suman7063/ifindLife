
import { Testimonial } from './types';

/**
 * Get default testimonials for seeding the database
 */
export const getDefaultTestimonials = (): Testimonial[] => {
  return [
    {
      name: "Rebecca T.",
      location: "New York",
      rating: 5,
      text: "After months of struggling with anxiety, my sessions have been life-changing. I've learned techniques that help me manage stressful situations effectively.",
      date: "2 weeks ago",
      imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
    },
    {
      name: "Mark L.",
      location: "Chicago",
      rating: 5,
      text: "The counseling helped my wife and I improve our communication in ways we never thought possible. Our relationship is stronger than ever.",
      date: "1 month ago",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
    },
    {
      name: "Samantha J.",
      location: "Los Angeles",
      rating: 5,
      text: "The mindfulness techniques I learned have completely transformed how I handle stress at work. I'm more productive and happier than I've been in years.",
      date: "3 weeks ago",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
    }
  ];
};
