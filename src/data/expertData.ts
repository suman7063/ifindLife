
import { ExtendedExpert } from '@/types/programs';

// Sample data for experts
export const expertData: ExtendedExpert[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    experience: "10+ years",
    profilePicture: "/lovable-uploads/2ce75196-58b1-4f39-b5cb-9b4a559c53b2.png",
    specialties: ["Anxiety", "Depression", "Stress Management"],
    rating: 4.9,
    consultations: 1250,
    price: 1500,
    waitTime: "24 hours",
    online: true,
    languages: ["English", "Spanish"]
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    experience: "8 years",
    profilePicture: "/lovable-uploads/279827ab-6ab5-47dc-a1af-213e53684caf.png",
    specialties: ["Cognitive Behavioral Therapy", "Relationship Issues", "Trauma"],
    rating: 4.7,
    consultations: 870,
    price: 1200,
    waitTime: "48 hours",
    online: false,
    languages: ["English", "Mandarin"]
  },
  {
    id: "3",
    name: "Dr. Emily Patel",
    experience: "12 years",
    profilePicture: "/lovable-uploads/ae4adda3-ac1f-4376-9e2b-081922120b00.png",
    specialties: ["Family Therapy", "Grief", "Life Transitions"],
    rating: 4.8,
    consultations: 1500,
    price: 1800,
    waitTime: "Same day",
    online: true,
    languages: ["English", "Hindi", "Gujarati"]
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    experience: "6 years",
    profilePicture: "/lovable-uploads/1debddfd-ebd1-41dd-98cb-90a9c97f0b3a.png",
    specialties: ["ADHD", "Career Counseling", "Self-Esteem"],
    rating: 4.5,
    consultations: 620,
    price: 1000,
    waitTime: "3 days",
    online: true,
    languages: ["English"]
  },
  {
    id: "5",
    name: "Dr. Sophia Rodriguez",
    experience: "15 years",
    profilePicture: "/lovable-uploads/cda89cc2-6ac2-4a32-b237-9d98a8b76e4e.png",
    specialties: ["Mindfulness", "Bipolar Disorder", "PTSD"],
    rating: 4.9,
    consultations: 2100,
    price: 2000,
    waitTime: "72 hours",
    online: true,
    languages: ["English", "Spanish", "Portuguese"]
  },
  {
    id: "6",
    name: "Dr. David Kim",
    experience: "9 years",
    profilePicture: "/lovable-uploads/1086590e-2848-41ea-a5f9-40b33666bb9d.png",
    specialties: ["Addiction", "Depression", "Sleep Issues"],
    rating: 4.6,
    consultations: 950,
    price: 1300,
    waitTime: "48 hours",
    online: false,
    languages: ["English", "Korean"]
  }
];

export default expertData;
