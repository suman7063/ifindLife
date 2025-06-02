
import { ProgramDetail } from '@/types/programDetail';

export const programDetailData: Record<string, ProgramDetail> = {
  depression: {
    id: 'depression',
    title: 'Depression Management Program',
    description: 'Comprehensive support for managing depression symptoms and improving mood through evidence-based techniques.',
    expert: {
      name: 'Dr. Sarah Johnson',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      experience: '8+ years in Clinical Psychology'
    },
    courseStructure: {
      totalSessions: 16,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Depression',
          description: 'Learn about depression symptoms, causes, and treatment approaches',
          topics: ['Depression basics', 'Symptom identification', 'Treatment overview']
        },
        {
          week: 2,
          title: 'Cognitive Behavioral Techniques',
          description: 'Introduction to CBT methods for managing negative thoughts',
          topics: ['Thought patterns', 'Cognitive restructuring', 'Behavioral activation']
        },
        {
          week: 3,
          title: 'Mindfulness and Mood',
          description: 'Mindfulness practices to improve emotional regulation',
          topics: ['Mindfulness meditation', 'Emotional awareness', 'Present moment focus']
        },
        {
          week: 4,
          title: 'Building Resilience',
          description: 'Developing coping strategies and resilience skills',
          topics: ['Stress management', 'Problem-solving', 'Support systems']
        }
      ]
    },
    whatItCovers: [
      'Understanding depression and its impact',
      'Cognitive behavioral therapy techniques',
      'Mindfulness and meditation practices',
      'Mood tracking and management',
      'Lifestyle modifications for mental health',
      'Building support networks',
      'Relapse prevention strategies'
    ],
    expectedOutcomes: [
      'Improved mood and emotional regulation',
      'Better understanding of depression triggers',
      'Effective coping strategies',
      'Enhanced daily functioning',
      'Improved sleep and energy levels',
      'Stronger support systems',
      'Long-term mental wellness plan'
    ],
    pricing: {
      individual: {
        perSession: 180,
        totalCost: 2880
      }
    },
    reviews: {
      averageRating: 4.8,
      totalReviews: 245,
      reviews: [
        {
          id: '1',
          userName: 'Anonymous User',
          rating: 5,
          comment: 'This program completely changed my life. The techniques I learned here helped me overcome my depression.',
          date: '2024-11-15'
        },
        {
          id: '2',
          userName: 'M. Singh',
          rating: 4,
          comment: 'Very helpful sessions with practical techniques that I use daily.',
          date: '2024-11-10'
        }
      ]
    }
  },
  anxiety: {
    id: 'anxiety',
    title: 'Anxiety Relief Program',
    description: 'Learn effective tools and techniques to help manage anxiety and worry.',
    expert: {
      name: 'Dr. Michael Chen',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      experience: '10+ years in Anxiety Disorders'
    },
    courseStructure: {
      totalSessions: 12,
      sessionDuration: '50 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Anxiety',
          description: 'Learn about anxiety disorders and their manifestations',
          topics: ['Types of anxiety', 'Physical symptoms', 'Anxiety triggers']
        },
        {
          week: 2,
          title: 'Breathing Techniques',
          description: 'Master breathing exercises for immediate anxiety relief',
          topics: ['Deep breathing', 'Box breathing', 'Progressive muscle relaxation']
        },
        {
          week: 3,
          title: 'Cognitive Restructuring',
          description: 'Challenge and change anxious thought patterns',
          topics: ['Thought challenging', 'Evidence examination', 'Balanced thinking']
        }
      ]
    },
    whatItCovers: [
      'Understanding anxiety and panic',
      'Breathing and relaxation techniques',
      'Cognitive restructuring methods',
      'Exposure therapy principles',
      'Lifestyle modifications',
      'Emergency coping strategies'
    ],
    expectedOutcomes: [
      'Reduced anxiety symptoms',
      'Better stress management',
      'Improved confidence',
      'Enhanced daily functioning',
      'Better sleep quality',
      'Effective coping tools'
    ],
    pricing: {
      individual: {
        perSession: 160,
        totalCost: 1920
      }
    },
    reviews: {
      averageRating: 4.7,
      totalReviews: 312,
      reviews: [
        {
          id: '1',
          userName: 'R. Patel',
          rating: 5,
          comment: 'The breathing techniques alone have made such a difference in my daily anxiety levels.',
          date: '2024-11-12'
        }
      ]
    }
  },
  stress: {
    id: 'stress',
    title: 'Stress Management Mastery',
    description: 'Develop effective strategies to cope with and reduce stress in your daily life.',
    expert: {
      name: 'Dr. Aisha Patel',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
      experience: '12+ years in Stress Management'
    },
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '45 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Stress Assessment',
          description: 'Identify your stress triggers and patterns',
          topics: ['Stress identification', 'Personal stress triggers', 'Stress response']
        },
        {
          week: 2,
          title: 'Time Management',
          description: 'Learn effective time management and prioritization',
          topics: ['Priority setting', 'Time blocking', 'Delegation skills']
        }
      ]
    },
    whatItCovers: [
      'Stress identification and assessment',
      'Time management techniques',
      'Relaxation and mindfulness',
      'Work-life balance strategies',
      'Physical stress management',
      'Communication skills'
    ],
    expectedOutcomes: [
      'Better stress awareness',
      'Improved time management',
      'Enhanced work-life balance',
      'Better physical health',
      'Improved relationships',
      'Sustainable stress management'
    ],
    pricing: {
      individual: {
        perSession: 140,
        totalCost: 1120
      }
    },
    reviews: {
      averageRating: 4.6,
      totalReviews: 189,
      reviews: [
        {
          id: '1',
          userName: 'K. Sharma',
          rating: 4,
          comment: 'Great practical techniques for managing work stress.',
          date: '2024-11-08'
        }
      ]
    }
  }
};
