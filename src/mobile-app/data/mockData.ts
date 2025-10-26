/**
 * Mock Data for Mobile App Development
 * 
 * This file contains all mock/dummy data used throughout the mobile app.
 * 
 * TODO: Replace these with actual API calls when backend is integrated
 * 
 * Integration Points:
 * - Replace with Supabase queries
 * - Connect to real authentication
 * - Implement actual booking flow
 * - Add real-time data updates
 */

// ============================================
// EXPERT DATA
// ============================================

export interface Expert {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  image: string;
  availability: string;
  hourlyRate: number;
  experience: string;
  bio?: string;
  languages?: string[];
  certifications?: string[];
}

export const mockExperts: Expert[] = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Mental Health Counselor',
    rating: 4.9,
    reviews: 127,
    image: '/placeholder.svg',
    availability: 'Available Now',
    hourlyRate: 75,
    experience: '10 years',
    bio: 'Specializing in anxiety, depression, and relationship counseling.',
    languages: ['English', 'Spanish'],
    certifications: ['Licensed Clinical Social Worker', 'CBT Certified']
  },
  {
    id: 2,
    name: 'Michael Chen',
    specialty: 'Life Coach',
    rating: 4.8,
    reviews: 89,
    image: '/placeholder.svg',
    availability: 'Available in 30 mins',
    hourlyRate: 60,
    experience: '7 years',
    bio: 'Helping professionals achieve work-life balance and career goals.',
    languages: ['English', 'Mandarin'],
    certifications: ['ICF Certified Coach', 'NLP Practitioner']
  },
];

// ============================================
// APPOINTMENT DATA
// ============================================

export interface Appointment {
  id: number;
  clientName?: string;
  expertName?: string;
  date: string;
  time: string;
  type: 'Video Call' | 'Chat Session' | 'Voice Call';
  status: 'upcoming' | 'completed' | 'cancelled';
  duration?: number;
  price?: number;
}

export const mockAppointments: Appointment[] = [
  {
    id: 1,
    clientName: 'Sarah Wilson',
    time: '10:00 AM',
    date: '2025-10-26',
    type: 'Video Call',
    status: 'upcoming',
    duration: 60,
    price: 75
  },
  {
    id: 2,
    clientName: 'Michael Chen',
    time: '2:30 PM',
    date: '2025-10-26',
    type: 'Chat Session',
    status: 'upcoming',
    duration: 30,
    price: 35
  },
];

// ============================================
// SERVICE DATA
// ============================================

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  icon?: string;
  startingPrice: number;
  duration: number;
  expertCount?: number;
}

export const mockServices: Service[] = [
  {
    id: 1,
    name: 'Mental Health Counseling',
    description: 'Professional support for anxiety, depression, and stress management',
    category: 'Mental Health',
    startingPrice: 60,
    duration: 60,
    expertCount: 45
  },
  {
    id: 2,
    name: 'Life Coaching',
    description: 'Guidance for personal growth, career, and life transitions',
    category: 'Personal Development',
    startingPrice: 50,
    duration: 45,
    expertCount: 32
  },
];

// ============================================
// STATS DATA (for Expert Dashboard)
// ============================================

export interface DashboardStats {
  monthlyEarnings: number;
  totalClients: number;
  weeklySessions: number;
  rating: number;
  totalReviews: number;
}

export const mockDashboardStats: DashboardStats = {
  monthlyEarnings: 2450,
  totalClients: 42,
  weeklySessions: 18,
  rating: 4.9,
  totalReviews: 126
};

// ============================================
// EXPERT ACCOUNT DATA
// ============================================

export interface ExpertAccount {
  id: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  bio: string;
  hourlyRate: number;
  avatar?: string;
  certifications: string[];
  languages: string[];
  experience: number;
}

export const mockExpertAccount: ExpertAccount = {
  id: 1,
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@example.com',
  phone: '+1 (555) 123-4567',
  category: 'Mental Health Counselor',
  bio: 'Experienced mental health professional specializing in anxiety and depression.',
  hourlyRate: 75,
  certifications: ['Licensed Clinical Social Worker', 'CBT Certified'],
  languages: ['English', 'Spanish'],
  experience: 10
};

// ============================================
// NOTIFICATION DATA
// ============================================

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'appointment' | 'message' | 'payment' | 'review';
  timestamp: string;
  read: boolean;
}

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'New Appointment',
    message: 'Sarah Wilson booked a session for tomorrow at 10:00 AM',
    type: 'appointment',
    timestamp: '2 hours ago',
    read: false
  },
  {
    id: 2,
    title: 'Payment Received',
    message: 'You received $75 from Michael Chen',
    type: 'payment',
    timestamp: '5 hours ago',
    read: false
  },
];

// ============================================
// EXPORT ALL
// ============================================

export const mockData = {
  experts: mockExperts,
  appointments: mockAppointments,
  services: mockServices,
  dashboardStats: mockDashboardStats,
  expertAccount: mockExpertAccount,
  notifications: mockNotifications,
};
