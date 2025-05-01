
// This file contains initial data for admin sections

export const initialHeroSettings = {
  title: "You Are Not Alone!",
  subtitle: "Is there a situation, you need immediate help with?",
  description: "Connect with our currently online experts through an instant call",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0"
};

export const initialExperts = [
  {
    id: "1", // Updated to string
    name: "Dr. Sarah Johnson",
    experience: 10,
    specialties: ["Depression", "Anxiety", "Therapy"],
    rating: 4.9,
    consultations: 253,
    price: 35,
    waitTime: "Available Now",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    online: true
  },
  {
    id: "2", // Updated to string
    name: "Dr. Michael Chen",
    experience: 8,
    specialties: ["Relationships", "Family Therapy"],
    rating: 4.7,
    consultations: 187,
    price: 30,
    waitTime: "Available in 10 minutes",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
    online: true
  }
];

export const initialServices = [
  {
    icon: "🧠",
    title: "Mental Health",
    description: "Depression, Anxiety, and other mental health issues",
    href: "/services/mental-health",
    color: "bg-ifind-aqua/10"
  },
  {
    icon: "💭",
    title: "Relationship Issues",
    description: "Dating, Marriage problems, Divorce",
    href: "/services/relationships",
    color: "bg-ifind-purple/10"
  },
  {
    icon: "✨",
    title: "Self-Improvement",
    description: "Confidence, Personal growth, Motivation",
    href: "/services/self-improvement",
    color: "bg-ifind-teal/10"
  }
];

export const initialTestimonials = [
  {
    name: "Sarah Johnson",
    location: "New York",
    rating: 5,
    text: "I've struggled with anxiety for years and finally found the help I needed here.",
    date: "2 weeks ago",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
  },
  {
    name: "Michael Chen",
    location: "Chicago",
    rating: 5,
    text: "The advice I received completely transformed my relationship with my partner.",
    date: "1 month ago",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop"
  },
  {
    name: "Emma Rodriguez",
    location: "Los Angeles",
    rating: 4,
    text: "After just a few sessions, I've developed much healthier coping mechanisms.",
    date: "3 months ago",
    imageUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=1889&auto=format&fit=crop"
  }
];
