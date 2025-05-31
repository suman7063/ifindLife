
import { ProgramDetail } from '@/types/programDetail';

export const programDetailsData: Record<string, ProgramDetail> = {
  depression: {
    id: 'depression',
    title: 'Depression Management Program',
    description: 'Comprehensive support for managing depression symptoms and improving mood',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'CBT Specialist', 'Depression Treatment Expert']
    },
    courseStructure: {
      totalSessions: 12,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Depression',
          description: 'Learn about depression, its symptoms, and how it affects daily life.',
          topics: ['Depression basics', 'Symptom recognition', 'Impact assessment', 'Goal setting']
        },
        {
          week: 2,
          title: 'Cognitive Behavioral Techniques',
          description: 'Introduction to CBT methods for managing negative thought patterns.',
          topics: ['Thought identification', 'Cognitive restructuring', 'Behavioral activation', 'Mood tracking']
        }
      ]
    },
    coverage: {
      mainTopics: [
        'Understanding Depression Types and Symptoms',
        'Cognitive Behavioral Therapy Techniques',
        'Emotional Regulation Strategies',
        'Lifestyle Modification for Mental Health'
      ],
      techniques: [
        'Cognitive Restructuring',
        'Behavioral Activation',
        'Mindfulness-Based Interventions',
        'Problem-Solving Therapy'
      ],
      tools: [
        'Mood Tracking Apps',
        'Thought Records',
        'Activity Scheduling',
        'Relaxation Techniques'
      ],
      skills: [
        'Emotional Self-Awareness',
        'Coping Strategy Development',
        'Stress Management',
        'Communication Skills'
      ]
    },
    whatItCovers: [
      'Evidence-based therapeutic techniques',
      'Personalized treatment approach',
      '24/7 crisis support availability',
      'Progress tracking and monitoring',
      'Peer support group access',
      'Medication management guidance'
    ],
    expectedOutcomes: {
      shortTerm: [
        'Improved understanding of depression',
        'Better sleep patterns',
        'Reduced anxiety levels',
        'Enhanced daily routine structure'
      ],
      mediumTerm: [
        'Significant mood improvement',
        'Better coping mechanisms',
        'Increased social engagement',
        'Improved work/life productivity'
      ],
      longTerm: [
        'Sustained emotional well-being',
        'Strong relapse prevention skills',
        'Enhanced quality of life',
        'Healthy relationship patterns'
      ],
      successMetrics: [
        '80% reduction in depressive symptoms',
        'Improved quality of life scores',
        'Enhanced daily functioning',
        'Reduced medication dependency'
      ]
    },
    duration: {
      programLength: '12 weeks',
      timeCommitment: '2-3 hours per week',
      flexibility: 'Flexible scheduling available'
    },
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2500,
        totalCost: 30000,
        packagePrice: 27000,
        discount: {
          percentage: 10,
          conditions: 'Pay full amount upfront'
        }
      }
    },
    reviews: {
      averageRating: 4.8,
      totalReviews: 127,
      reviews: [
        {
          id: '1',
          userName: 'Sarah K.',
          rating: 5,
          comment: 'This program completely changed my life. Dr. Sharma is incredibly understanding and professional.',
          date: '2 weeks ago',
          verified: true
        }
      ],
      featured: [
        {
          id: '1',
          userName: 'Sarah K.',
          rating: 5,
          comment: 'This program completely changed my life. Dr. Sharma is incredibly understanding and professional.',
          date: '2 weeks ago',
          verified: true
        },
        {
          id: '2',
          userName: 'Michael R.',
          rating: 5,
          comment: 'The structured approach and regular sessions helped me develop effective coping strategies.',
          date: '1 month ago',
          verified: true
        }
      ]
    }
  },
  anxiety: {
    id: 'anxiety',
    title: 'Anxiety Management Program',
    description: 'Tools and techniques to help manage anxiety and worry effectively',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'Anxiety Specialist', 'Mindfulness Trainer']
    },
    courseStructure: {
      totalSessions: 10,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Anxiety',
          description: 'Learn about anxiety disorders and their impact on daily life.',
          topics: ['Anxiety basics', 'Trigger identification', 'Physical symptoms', 'Goal setting']
        }
      ]
    },
    coverage: {
      mainTopics: [
        'Anxiety Disorder Types and Symptoms',
        'Trigger Identification and Management',
        'Relaxation and Breathing Techniques',
        'Cognitive Restructuring for Anxiety'
      ],
      techniques: [
        'Progressive Muscle Relaxation',
        'Deep Breathing Exercises',
        'Exposure Therapy',
        'Grounding Techniques'
      ],
      tools: [
        'Anxiety Tracking Apps',
        'Breathing Exercise Guides',
        'Relaxation Audio Resources',
        'Emergency Coping Cards'
      ],
      skills: [
        'Anxiety Recognition',
        'Panic Attack Management',
        'Stress Reduction',
        'Confidence Building'
      ]
    },
    whatItCovers: [
      'Anxiety trigger identification',
      'Panic attack prevention techniques',
      'Stress reduction strategies',
      'Confidence building exercises',
      'Sleep improvement methods',
      'Social anxiety support'
    ],
    expectedOutcomes: {
      shortTerm: [
        'Reduced panic attack frequency',
        'Better anxiety awareness',
        'Improved breathing techniques',
        'Basic coping skills development'
      ],
      mediumTerm: [
        'Significant anxiety reduction',
        'Better stress management',
        'Improved sleep quality',
        'Enhanced social confidence'
      ],
      longTerm: [
        'Sustained anxiety control',
        'Strong self-management skills',
        'Improved life satisfaction',
        'Enhanced relationships'
      ],
      successMetrics: [
        '70% reduction in anxiety symptoms',
        'Decreased panic attack frequency',
        'Improved daily functioning',
        'Enhanced quality of life'
      ]
    },
    duration: {
      programLength: '10 weeks',
      timeCommitment: '2 hours per week',
      flexibility: 'Evening sessions available'
    },
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2200,
        totalCost: 22000,
        packagePrice: 20000,
        discount: {
          percentage: 9,
          conditions: 'Early bird discount'
        }
      }
    },
    reviews: {
      averageRating: 4.7,
      totalReviews: 96,
      reviews: [],
      featured: [
        {
          id: '3',
          userName: 'Emma L.',
          rating: 5,
          comment: 'The breathing techniques alone have made such a huge difference in my daily anxiety levels.',
          date: '3 weeks ago',
          verified: true
        }
      ]
    }
  }
};
