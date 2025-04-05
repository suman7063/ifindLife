
import React from 'react';

// Sample data for services
export const initialServices = [
  {
    icon: <span className="text-3xl">🧠</span>,
    title: "Mental Health Counseling",
    description: "Professional guidance for emotional well-being and mental health challenges",
    href: "/services/mental-health",
    color: "bg-ifind-teal/10"
  },
  {
    icon: <span className="text-3xl">💭</span>,
    title: "Cognitive Behavioral Therapy",
    description: "Evidence-based approach to identify and change negative thought patterns",
    href: "/services/cbt",
    color: "bg-ifind-purple/10"
  },
  {
    icon: <span className="text-3xl">🌱</span>,
    title: "Personal Growth",
    description: "Guidance for self-improvement, confidence building, and personal development",
    href: "/services/personal-growth",
    color: "bg-ifind-aqua/10"
  },
];

// Sample data for hero section
export const initialHeroSettings = {
  title: "Discover Mental Wellness Solutions",
  subtitle: "Professional Support When You Need It",
  description: "Connect with experienced therapists and wellness experts for personalized guidance to improve your mental well-being and lead a more balanced life.",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
};

// Sample data for testimonials
export const initialTestimonials = [
  {
    name: "Sarah Johnson",
    location: "New York",
    rating: 5,
    text: "The guidance I received was transformative. My therapist helped me develop coping strategies that I use every day.",
    date: "2 months ago",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
  {
    name: "Michael Lee",
    location: "San Francisco",
    rating: 4,
    text: "After just a few sessions, I noticed a significant improvement in my anxiety levels. Highly recommend.",
    date: "1 month ago",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80"
  },
];
