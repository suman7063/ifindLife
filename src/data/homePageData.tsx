
// Using string icons (emojis) instead of React Elements for better type compatibility

export const categoryData = [
  {
    icon: "🧠",
    title: "Anxiety & Stress Management",
    description: "Learn effective techniques to manage anxiety and reduce stress in your daily life.",
    href: "/services/anxiety",
    color: "bg-ifind-aqua/10"
  },
  {
    icon: "❤️",
    title: "Relationship Counseling",
    description: "Improve communication and resolve conflicts in your personal relationships.",
    href: "/services/relationships",
    color: "bg-ifind-purple/10"
  },
  {
    icon: "👨‍👩‍👧‍👦",
    title: "Family Therapy",
    description: "Address family conflicts and strengthen bonds through guided sessions.",
    href: "/services/family",
    color: "bg-ifind-teal/10"
  },
  {
    icon: "↗️",
    title: "Personal Growth",
    description: "Discover your potential and develop strategies for self-improvement and resilience.",
    href: "/services/personal-growth",
    color: "bg-ifind-charcoal/10"
  }
];

export const therapistData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    experience: 12,
    specialties: ["Anxiety", "Depression", "CBT"],
    rating: 4.9,
    consultations: 1500,
    price: 35,
    waitTime: "Available",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop",
    online: true
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    experience: 8,
    specialties: ["Trauma", "Couples Therapy", "EMDR"],
    rating: 4.7,
    consultations: 1200,
    price: 32,
    waitTime: "5 min",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    online: true
  },
  {
    id: 3,
    name: "Dr. Lisa Patel",
    experience: 15,
    specialties: ["Mindfulness", "Depression", "Family Therapy"],
    rating: 4.8,
    consultations: 2100,
    price: 40,
    waitTime: "10 min",
    imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    online: false
  }
];

export const testimonialData = [
  {
    name: "Rebecca T.",
    location: "New York",
    rating: 5,
    text: "After months of struggling with anxiety, my sessions with Dr. Johnson have been life-changing. I've learned techniques that help me manage stressful situations effectively.",
    date: "2 weeks ago",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
  },
  {
    name: "Mark L.",
    location: "Chicago",
    rating: 5,
    text: "Dr. Chen helped my wife and I improve our communication in ways we never thought possible. Our relationship is stronger than ever because of his guidance.",
    date: "1 month ago",
    imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Samantha J.",
    location: "Los Angeles",
    rating: 5,
    text: "The mindfulness techniques Dr. Patel taught me have completely transformed how I handle stress at work. I'm more productive and happier than I've been in years.",
    date: "3 weeks ago",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop"
  }
];
