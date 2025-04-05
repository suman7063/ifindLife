
import { ExtendedExpert } from "@/types/programs";

// Mock data for experts
const expertData: ExtendedExpert[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    experience: "10 years",
    profile_picture: "/images/experts/expert1.jpg",
    specialties: ["Depression", "Anxiety", "Stress Management"],
    rating: 4.8,
    reviewCount: 124,
    pricing: {
      consultation_fee: 120
    },
    availability: ["Mon", "Wed", "Fri"],
    languages: ["English", "Spanish"],
    specialization: "Clinical Psychology"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    email: "michael.chen@example.com",
    experience: "15 years",
    profile_picture: "/images/experts/expert2.jpg",
    specialties: ["Relationship Issues", "Trauma", "PTSD"],
    rating: 4.9,
    reviewCount: 98,
    pricing: {
      consultation_fee: 150
    },
    availability: ["Tue", "Thu", "Sat"],
    languages: ["English", "Mandarin"],
    specialization: "Relationship Therapy"
  },
  {
    id: "3",
    name: "Dr. Aisha Patel",
    email: "aisha.patel@example.com",
    experience: "8 years",
    profile_picture: "/images/experts/expert3.jpg",
    specialties: ["Depression", "Anxiety", "Child Psychology"],
    rating: 4.7,
    reviewCount: 82,
    pricing: {
      consultation_fee: 110
    },
    availability: ["Mon", "Tue", "Wed", "Fri"],
    languages: ["English", "Hindi", "Gujarati"],
    specialization: "Child Psychology"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    experience: "12 years",
    profile_picture: "/images/experts/expert4.jpg",
    specialties: ["Addiction", "Depression", "Mindfulness"],
    rating: 4.6,
    reviewCount: 76,
    pricing: {
      consultation_fee: 130
    },
    availability: ["Wed", "Thu", "Fri", "Sat"],
    languages: ["English", "French"],
    specialization: "Addiction Counseling"
  },
  {
    id: "5",
    name: "Dr. Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    experience: "7 years",
    profile_picture: "/images/experts/expert5.jpg",
    specialties: ["Anxiety", "Grief", "Life Transitions"],
    rating: 4.8,
    reviewCount: 64,
    pricing: {
      consultation_fee: 115
    },
    availability: ["Mon", "Tue", "Thu", "Sat"],
    languages: ["English", "Spanish", "Portuguese"],
    specialization: "Grief Counseling"
  },
  {
    id: "6",
    name: "Dr. David Kim",
    email: "david.kim@example.com",
    experience: "9 years",
    profile_picture: "/images/experts/expert6.jpg",
    specialties: ["Stress", "Work-Life Balance", "Career Counseling"],
    rating: 4.7,
    reviewCount: 58,
    pricing: {
      consultation_fee: 125
    },
    availability: ["Tue", "Wed", "Fri", "Sun"],
    languages: ["English", "Korean"],
    specialization: "Career Counseling"
  }
];

export default expertData;
