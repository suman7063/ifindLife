
import { ProgramDetail } from '@/types/programDetail';

export const programDetailData: Record<string, ProgramDetail> = {
  depression: {
    id: 'depression',
    title: 'Depression Management Program',
    description: 'Comprehensive support for managing depression symptoms and improving mood through evidence-based techniques.',
    overview: 'Our Depression Management Program provides evidence-based therapeutic support to help individuals overcome depression and regain emotional balance. Through personalized treatment plans, cognitive behavioral therapy techniques, and ongoing support, participants learn effective coping strategies and develop resilience.',
    benefits: [
      'Evidence-based therapeutic techniques',
      'Personalized treatment approach',
      'Mood tracking and monitoring',
      'Cognitive restructuring skills',
      '24/7 crisis support availability',
      'Group therapy sessions'
    ],
    features: [
      'Individual therapy sessions',
      'Cognitive Behavioral Therapy (CBT)',
      'Mindfulness-based interventions',
      'Mood tracking tools',
      'Crisis intervention support',
      'Progress monitoring dashboard'
    ],
    duration: '12 weeks',
    format: 'Individual & Group Sessions',
    price: '₹25,000',
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
    whatItCovers: [
      'Evidence-based therapeutic techniques',
      'Personalized treatment approach',
      '24/7 crisis support availability',
      'Progress tracking and monitoring',
      'Peer support group access',
      'Medication management guidance'
    ],
    expectedOutcomes: [
      'Improved understanding of depression',
      'Better sleep patterns and energy levels',
      'Reduced anxiety and mood swings',
      'Enhanced daily routine structure',
      'Significant mood improvement over time',
      'Better coping mechanisms and resilience'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2500,
        totalCost: 25000,
        packagePrice: 22500,
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
      ]
    }
  },
  anxiety: {
    id: 'anxiety',
    title: 'Anxiety Relief Program',
    description: 'Learn effective tools and techniques to help manage anxiety and worry through breathing exercises and cognitive restructuring.',
    overview: 'Our Anxiety Relief Program combines proven therapeutic approaches with practical coping strategies to help you manage anxiety effectively. Learn breathing techniques, cognitive restructuring, and mindfulness practices to reduce worry and panic.',
    benefits: [
      'Anxiety reduction techniques',
      'Breathing and relaxation exercises',
      'Cognitive restructuring skills',
      'Panic attack management',
      'Sleep improvement strategies',
      'Stress management tools'
    ],
    features: [
      'Guided breathing exercises',
      'Progressive muscle relaxation',
      'Exposure therapy techniques',
      'Mindfulness meditation',
      'Anxiety tracking app',
      'Emergency coping toolkit'
    ],
    duration: '10 weeks',
    format: 'Individual & Group Sessions',
    price: '₹20,000',
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
    whatItCovers: [
      'Anxiety trigger identification',
      'Panic attack prevention techniques',
      'Stress reduction strategies',
      'Confidence building exercises',
      'Sleep improvement methods',
      'Social anxiety support'
    ],
    expectedOutcomes: [
      'Reduced panic attack frequency',
      'Better anxiety awareness and control',
      'Improved breathing and relaxation techniques',
      'Enhanced social confidence',
      'Better stress management skills',
      'Improved sleep quality and patterns'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2200,
        totalCost: 20000,
        packagePrice: 18000,
        discount: {
          percentage: 10,
          conditions: 'Early bird discount'
        }
      }
    },
    reviews: {
      averageRating: 4.7,
      totalReviews: 96,
      reviews: [
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
  },
  stress: {
    id: 'stress',
    title: 'Stress Management Mastery',
    description: 'Develop effective strategies to cope with and reduce stress in your daily life using proven stress management techniques.',
    overview: 'Master the art of stress management through our comprehensive program that teaches practical techniques for identifying, managing, and reducing stress in all areas of life.',
    benefits: [
      'Stress identification techniques',
      'Time management skills',
      'Relaxation strategies',
      'Work-life balance improvement',
      'Energy management',
      'Resilience building'
    ],
    features: [
      'Stress assessment tools',
      'Time management workshops',
      'Relaxation training',
      'Lifestyle modification guidance',
      'Stress monitoring app',
      'Personal action plans'
    ],
    duration: '8 weeks',
    format: 'Individual & Group Sessions',
    price: '₹15,000',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'Stress Management Expert', 'Wellness Coach']
    },
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Stress',
          description: 'Learn about stress and its impact on your physical and mental health.',
          topics: ['Stress basics', 'Stress triggers', 'Physical effects', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Stress identification techniques',
      'Time management skills',
      'Relaxation strategies',
      'Work-life balance improvement',
      'Energy management',
      'Resilience building'
    ],
    expectedOutcomes: [
      'Better stress awareness and management',
      'Improved time management skills',
      'Enhanced relaxation abilities',
      'Better work-life balance',
      'Increased energy and productivity',
      'Greater resilience to daily stressors'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 1875,
        totalCost: 15000,
        packagePrice: 13500,
        discount: {
          percentage: 10,
          conditions: 'Full payment upfront'
        }
      }
    },
    reviews: {
      averageRating: 4.6,
      totalReviews: 78,
      reviews: [
        {
          id: '4',
          userName: 'John D.',
          rating: 5,
          comment: 'Great program for learning practical stress management techniques that actually work.',
          date: '1 month ago',
          verified: true
        }
      ]
    }
  },
  sleep: {
    id: 'sleep',
    title: 'Sleep Quality Improvement Program',
    description: 'Comprehensive program to help improve sleep quality and address insomnia through sleep hygiene education and behavioral modifications.',
    overview: 'Transform your sleep with our evidence-based program that addresses insomnia and poor sleep quality through behavioral interventions, sleep hygiene education, and relaxation techniques.',
    benefits: [
      'Better sleep quality',
      'Reduced sleep onset time',
      'Fewer nighttime awakenings',
      'Improved daytime energy',
      'Sleep hygiene education',
      'Natural sleep solutions'
    ],
    features: [
      'Sleep assessment and tracking',
      'Behavioral sleep interventions',
      'Sleep hygiene education',
      'Relaxation techniques',
      'Sleep environment optimization',
      'Progress monitoring'
    ],
    duration: '6 weeks',
    format: 'Individual Sessions',
    price: '₹10,000',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'Sleep Specialist', 'Behavioral Sleep Medicine']
    },
    courseStructure: {
      totalSessions: 6,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Sleep',
          description: 'Learn about sleep cycles and factors affecting sleep quality.',
          topics: ['Sleep science', 'Sleep disorders', 'Assessment tools', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Better sleep quality',
      'Reduced sleep onset time',
      'Fewer nighttime awakenings',
      'Improved daytime energy',
      'Sleep hygiene education',
      'Natural sleep solutions'
    ],
    expectedOutcomes: [
      'Significantly improved sleep quality',
      'Faster sleep onset times',
      'Reduced nighttime awakenings',
      'Better daytime energy and alertness',
      'Established healthy sleep routines',
      'Long-term sleep management skills'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 1667,
        totalCost: 10000,
        packagePrice: 9000,
        discount: {
          percentage: 10,
          conditions: 'Full payment upfront'
        }
      }
    },
    reviews: {
      averageRating: 4.5,
      totalReviews: 64,
      reviews: [
        {
          id: '5',
          userName: 'Lisa M.',
          rating: 5,
          comment: 'Finally getting consistent, quality sleep after years of insomnia. Highly recommend!',
          date: '2 months ago',
          verified: true
        }
      ]
    }
  },
  relationships: {
    id: 'relationships',
    title: 'Relationship Enhancement Program',
    description: 'Expert guidance for building healthy and fulfilling relationships through communication skills and emotional intelligence development.',
    overview: 'Strengthen your relationships with our comprehensive program focusing on communication skills, conflict resolution, and emotional intelligence development for healthier connections.',
    benefits: [
      'Improved communication skills',
      'Conflict resolution techniques',
      'Emotional intelligence development',
      'Trust building strategies',
      'Intimacy enhancement',
      'Boundary setting skills'
    ],
    features: [
      'Communication workshops',
      'Couples therapy sessions',
      'Conflict resolution training',
      'Emotional intelligence assessments',
      'Relationship coaching',
      'Interactive exercises'
    ],
    duration: '10 weeks',
    format: 'Individual & Couples Sessions',
    price: '₹25,000',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'Relationship Counselor', 'Emotional Intelligence Expert']
    },
    courseStructure: {
      totalSessions: 10,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Relationships',
          description: 'Learn about healthy relationship dynamics and communication patterns.',
          topics: ['Relationship basics', 'Communication styles', 'Attachment theory', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Improved communication skills',
      'Conflict resolution techniques',
      'Emotional intelligence development',
      'Trust building strategies',
      'Intimacy enhancement',
      'Boundary setting skills'
    ],
    expectedOutcomes: [
      'Enhanced communication with loved ones',
      'Better conflict resolution skills',
      'Increased emotional intelligence',
      'Stronger trust and intimacy',
      'Healthier relationship boundaries',
      'Improved overall relationship satisfaction'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2500,
        totalCost: 25000,
        packagePrice: 22500,
        discount: {
          percentage: 10,
          conditions: 'Full payment upfront'
        }
      }
    },
    reviews: {
      averageRating: 4.9,
      totalReviews: 112,
      reviews: [
        {
          id: '6',
          userName: 'Mark & Jenny T.',
          rating: 5,
          comment: 'This program saved our marriage. The communication techniques are life-changing.',
          date: '3 weeks ago',
          verified: true
        }
      ]
    }
  },
  trauma: {
    id: 'trauma',
    title: 'Trauma Recovery Program',
    description: 'Support for healing from trauma and managing PTSD symptoms through specialized therapeutic approaches.',
    overview: 'Our Trauma Recovery Program provides specialized support for individuals healing from traumatic experiences using evidence-based approaches like EMDR and trauma-focused CBT.',
    benefits: [
      'Trauma processing techniques',
      'PTSD symptom management',
      'Emotional regulation skills',
      'Safety and grounding techniques',
      'Resilience building',
      'Post-traumatic growth'
    ],
    features: [
      'EMDR therapy sessions',
      'Trauma-focused CBT',
      'Grounding techniques',
      'Safety planning',
      'Somatic interventions',
      'Support group access'
    ],
    duration: '16 weeks',
    format: 'Individual Sessions',
    price: '₹35,000',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'Trauma Specialist', 'EMDR Certified']
    },
    courseStructure: {
      totalSessions: 16,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Trauma',
          description: 'Learn about trauma responses and the healing process.',
          topics: ['Trauma basics', 'Trauma responses', 'Safety planning', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Trauma processing techniques',
      'PTSD symptom management',
      'Emotional regulation skills',
      'Safety and grounding techniques',
      'Resilience building',
      'Post-traumatic growth'
    ],
    expectedOutcomes: [
      'Reduced trauma symptoms',
      'Better emotional regulation',
      'Increased sense of safety',
      'Improved coping mechanisms',
      'Enhanced resilience and strength',
      'Post-traumatic growth and healing'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2188,
        totalCost: 35000,
        packagePrice: 31500,
        discount: {
          percentage: 10,
          conditions: 'Full payment upfront'
        }
      }
    },
    reviews: {
      averageRating: 4.8,
      totalReviews: 89,
      reviews: [
        {
          id: '7',
          userName: 'Anonymous',
          rating: 5,
          comment: 'This program helped me process years of trauma in a safe, supportive environment.',
          date: '1 month ago',
          verified: true
        }
      ]
    }
  },
  grief: {
    id: 'grief',
    title: 'Grief & Loss Support Program',
    description: 'Compassionate support for navigating grief and loss with understanding and healing.',
    overview: 'Navigate the journey of grief with compassionate support and evidence-based techniques to help you process loss and find meaning in your healing journey.',
    benefits: [
      'Grief processing support',
      'Emotional healing techniques',
      'Meaning-making activities',
      'Coping strategy development',
      'Social support integration',
      'Memorial and ritual guidance'
    ],
    features: [
      'Individual grief counseling',
      'Support group participation',
      'Bereavement education',
      'Creative expression therapy',
      'Ritual and ceremony guidance',
      'Family support sessions'
    ],
    duration: '12 weeks',
    format: 'Individual & Group Sessions',
    price: '₹22,000',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'Grief Counselor', 'Bereavement Specialist']
    },
    courseStructure: {
      totalSessions: 12,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Grief',
          description: 'Learn about the grief process and different types of loss.',
          topics: ['Grief basics', 'Types of loss', 'Grief stages', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Grief processing support',
      'Emotional healing techniques',
      'Meaning-making activities',
      'Coping strategy development',
      'Social support integration',
      'Memorial and ritual guidance'
    ],
    expectedOutcomes: [
      'Better understanding of grief process',
      'Improved emotional coping skills',
      'Finding meaning in loss',
      'Enhanced support system utilization',
      'Healthy memorial practices',
      'Long-term healing and growth'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 1833,
        totalCost: 22000,
        packagePrice: 19800,
        discount: {
          percentage: 10,
          conditions: 'Full payment upfront'
        }
      }
    },
    reviews: {
      averageRating: 4.7,
      totalReviews: 73,
      reviews: [
        {
          id: '8',
          userName: 'Robert S.',
          rating: 5,
          comment: 'Helped me navigate the most difficult time in my life with compassion and understanding.',
          date: '6 weeks ago',
          verified: true
        }
      ]
    }
  },
  'self-esteem': {
    id: 'self-esteem',
    title: 'Self-Esteem Building Program',
    description: 'Comprehensive program to help build confidence and improve self-image through self-awareness exercises and empowerment strategies.',
    overview: 'Build lasting self-confidence and positive self-image through our comprehensive program that combines cognitive restructuring, self-awareness exercises, and empowerment strategies.',
    benefits: [
      'Improved self-confidence',
      'Positive self-image development',
      'Self-worth recognition',
      'Assertiveness training',
      'Goal achievement skills',
      'Personal empowerment'
    ],
    features: [
      'Self-assessment tools',
      'Confidence building exercises',
      'Assertiveness training',
      'Goal setting workshops',
      'Personal achievement tracking',
      'Empowerment coaching'
    ],
    duration: '8 weeks',
    format: 'Individual & Group Sessions',
    price: '₹15,500',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience',
      credentials: ['Licensed Clinical Psychologist', 'Self-Esteem Coach', 'Empowerment Specialist']
    },
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Self-Esteem',
          description: 'Learn about self-esteem and factors that influence self-worth.',
          topics: ['Self-esteem basics', 'Self-awareness', 'Confidence factors', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Improved self-confidence',
      'Positive self-image development',
      'Self-worth recognition',
      'Assertiveness training',
      'Goal achievement skills',
      'Personal empowerment'
    ],
    expectedOutcomes: [
      'Significantly improved self-confidence',
      'Positive self-image and self-talk',
      'Better recognition of personal worth',
      'Enhanced assertiveness skills',
      'Improved goal-setting abilities',
      'Greater personal empowerment'
    ],
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 1938,
        totalCost: 15500,
        packagePrice: 13950,
        discount: {
          percentage: 10,
          conditions: 'Full payment upfront'
        }
      }
    },
    reviews: {
      averageRating: 4.6,
      totalReviews: 91,
      reviews: [
        {
          id: '9',
          userName: 'Maria C.',
          rating: 5,
          comment: 'This program helped me believe in myself again. My confidence has grown tremendously.',
          date: '2 weeks ago',
          verified: true
        }
      ]
    }
  }
};
