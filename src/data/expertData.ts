import { Expert } from '@/types/expert';
import { ExtendedExpert } from '@/types/programs';

// Sample data for experts
export const experts: ExtendedExpert[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1234567890",
    specialization: "Clinical Psychology",
    experience: "10 years",
    bio: "Dr. Sarah is a clinical psychologist specializing in anxiety and depression disorders.",
    profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
    specialties: ["Anxiety", "Depression", "Stress Management"],
    rating: 4.9,
    consultations: 120,
    price: 85,
    waitTime: "3 days",
    online: true
  },
  {
    id: "2",
    name: "Dr. Michael Rodriguez",
    email: "michael.rodriguez@example.com",
    phone: "+1234567891",
    specialization: "Couples Therapy",
    experience: "15 years",
    bio: "Dr. Rodriguez specializes in relationship counseling and family therapy.",
    profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
    specialties: ["Relationship Counseling", "Family Therapy", "Conflict Resolution"],
    rating: 4.8,
    consultations: 95,
    price: 90,
    waitTime: "1 week",
    online: false
  },
  {
    id: "3",
    name: "Dr. Emily Carter",
    email: "emily.carter@example.com",
    phone: "+1234567892",
    specialization: "Child Psychology",
    experience: "8 years",
    bio: "Dr. Carter focuses on child development and behavioral issues.",
    profilePicture: "https://randomuser.me/api/portraits/women/3.jpg",
    specialties: ["Child Development", "Behavioral Issues", "ADHD"],
    rating: 4.7,
    consultations: 110,
    price: 75,
    waitTime: "5 days",
    online: true
  },
  {
    id: "4",
    name: "Dr. David Lee",
    email: "david.lee@example.com",
    phone: "+1234567893",
    specialization: "Addiction Therapy",
    experience: "12 years",
    bio: "Dr. Lee is an expert in addiction recovery and substance abuse counseling.",
    profilePicture: "https://randomuser.me/api/portraits/men/4.jpg",
    specialties: ["Addiction Recovery", "Substance Abuse", "Relapse Prevention"],
    rating: 4.6,
    consultations: 80,
    price: 100,
    waitTime: "2 weeks",
    online: false
  },
  {
    id: "5",
    name: "Dr. Aisha Khan",
    email: "aisha.khan@example.com",
    phone: "+1234567894",
    specialization: "Geriatric Psychology",
    experience: "20 years",
    bio: "Dr. Khan specializes in the mental health of elderly patients.",
    profilePicture: "https://randomuser.me/api/portraits/women/5.jpg",
    specialties: ["Dementia", "Alzheimer's", "Elderly Care"],
    rating: 4.9,
    consultations: 150,
    price: 95,
    waitTime: "10 days",
    online: true
  },
  {
    id: "6",
    name: "Dr. James Wilson",
    email: "james.wilson@example.com",
    phone: "+1234567895",
    specialization: "Trauma Psychology",
    experience: "18 years",
    bio: "Dr. Wilson focuses on helping patients recover from traumatic experiences.",
    profilePicture: "https://randomuser.me/api/portraits/men/6.jpg",
    specialties: ["PTSD", "Trauma Recovery", "Abuse Counseling"],
    rating: 4.8,
    consultations: 130,
    price: 110,
    waitTime: "3 weeks",
    online: false
  }
];

export default experts;
