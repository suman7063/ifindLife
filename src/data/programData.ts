import { ProgramDetail } from '@/types/programDetail';

export const programDetailData: Record<string, ProgramDetail> = {
  depression: {
    id: 'depression',
    title: 'Depression Management Program',
    description: 'Comprehensive support for managing depression symptoms and improving mood',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience'
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
      'Improved mood regulation and emotional stability',
      'Enhanced coping strategies for daily challenges',
      'Better understanding of depression triggers',
      'Increased motivation and energy levels',
      'Stronger social connections and support network'
    ],
    pricing: {
      individual: {
        perSession: 2500,
        totalCost: 30000
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
          date: '2 weeks ago'
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
      experience: '8 years experience'
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
      'Reduced anxiety levels and panic attacks',
      'Better stress management skills',
      'Improved sleep quality',
      'Enhanced social confidence',
      'Effective coping mechanisms'
    ],
    pricing: {
      individual: {
        perSession: 2200,
        totalCost: 22000
      }
    },
    reviews: {
      averageRating: 4.7,
      totalReviews: 96,
      reviews: []
    }
  },
  stress: {
    id: 'stress',
    title: 'Stress Management Program',
    description: 'Effective strategies to cope with and reduce stress in daily life',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience'
    },
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Stress Assessment',
          description: 'Identify stress sources and understand their impact.',
          topics: ['Stress identification', 'Impact assessment', 'Coping evaluation', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Stress identification and assessment',
      'Time management optimization',
      'Work-life balance strategies',
      'Physical stress relief techniques',
      'Emotional regulation skills',
      'Burnout prevention methods'
    ],
    expectedOutcomes: [
      'Better stress management skills',
      'Improved work-life balance',
      'Enhanced emotional regulation',
      'Increased productivity',
      'Better physical health'
    ],
    pricing: {
      individual: {
        perSession: 2000,
        totalCost: 16000
      }
    },
    reviews: {
      averageRating: 4.6,
      totalReviews: 84,
      reviews: []
    }
  },
  sleep: {
    id: 'sleep',
    title: 'Sleep Improvement Program',
    description: 'Help with improving sleep quality and addressing insomnia',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience'
    },
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Sleep Assessment',
          description: 'Evaluate current sleep patterns and identify issues.',
          topics: ['Sleep diary', 'Pattern analysis', 'Issue identification', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Sleep pattern analysis',
      'Insomnia treatment protocols',
      'Sleep hygiene education',
      'Relaxation technique training',
      'Sleep environment optimization',
      'Circadian rhythm regulation'
    ],
    expectedOutcomes: [
      'Improved sleep quality and duration',
      'Reduced time to fall asleep',
      'Better energy levels during the day',
      'Enhanced mood and cognitive function',
      'Healthier sleep habits'
    ],
    pricing: {
      individual: {
        perSession: 2300,
        totalCost: 18400
      }
    },
    reviews: {
      averageRating: 4.8,
      totalReviews: 67,
      reviews: []
    }
  },
  relationships: {
    id: 'relationships',
    title: 'Relationship Counseling Program',
    description: 'Guidance for building healthy and fulfilling relationships',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience'
    },
    courseStructure: {
      totalSessions: 12,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Relationship Assessment',
          description: 'Evaluate current relationship patterns and communication styles.',
          topics: ['Relationship evaluation', 'Communication assessment', 'Conflict analysis', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Communication skill development',
      'Conflict resolution strategies',
      'Trust building exercises',
      'Emotional intimacy enhancement',
      'Boundary setting techniques',
      'Relationship maintenance tools'
    ],
    expectedOutcomes: [
      'Improved communication with partners',
      'Better conflict resolution skills',
      'Stronger emotional connections',
      'Healthier relationship boundaries',
      'Enhanced relationship satisfaction'
    ],
    pricing: {
      individual: {
        perSession: 2800,
        totalCost: 33600
      }
    },
    reviews: {
      averageRating: 4.9,
      totalReviews: 112,
      reviews: []
    }
  },
  trauma: {
    id: 'trauma',
    title: 'Trauma & PTSD Recovery Program',
    description: 'Support for healing from trauma and managing PTSD symptoms',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience'
    },
    courseStructure: {
      totalSessions: 16,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Trauma Understanding',
          description: 'Understand trauma responses and begin healing journey.',
          topics: ['Trauma education', 'Safety establishment', 'Coping skills', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Trauma-informed therapeutic approaches',
      'PTSD symptom management',
      'Safety and grounding techniques',
      'Memory processing support',
      'Emotional regulation training',
      'Post-traumatic growth facilitation'
    ],
    expectedOutcomes: [
      'Reduced trauma symptoms',
      'Improved emotional regulation',
      'Better coping mechanisms',
      'Enhanced sense of safety',
      'Post-traumatic growth'
    ],
    pricing: {
      individual: {
        perSession: 3200,
        totalCost: 51200
      }
    },
    reviews: {
      averageRating: 4.8,
      totalReviews: 43,
      reviews: []
    }
  },
  grief: {
    id: 'grief',
    title: 'Grief & Loss Support Program',
    description: 'Compassionate support for navigating grief and loss',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience'
    },
    courseStructure: {
      totalSessions: 10,
      sessionDuration: '60 minutes',
      frequency: 'Bi-weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Understanding Grief',
          description: 'Learn about the grief process and different types of loss.',
          topics: ['Grief stages', 'Loss types', 'Emotional processing', 'Support planning']
        }
      ]
    },
    whatItCovers: [
      'Grief stage understanding',
      'Emotional processing support',
      'Memorial and ritual guidance',
      'Complicated grief treatment',
      'Support group participation',
      'Meaning-making assistance'
    ],
    expectedOutcomes: [
      'Healthy grief processing',
      'Emotional healing and acceptance',
      'Meaningful memorial practices',
      'Renewed sense of purpose',
      'Stronger support networks'
    ],
    pricing: {
      individual: {
        perSession: 2600,
        totalCost: 26000
      }
    },
    reviews: {
      averageRating: 4.9,
      totalReviews: 78,
      reviews: []
    }
  },
  'self-esteem': {
    id: 'self-esteem',
    title: 'Self-Esteem Building Program',
    description: 'Help with building confidence and improving self-image',
    expert: {
      name: 'Dr. Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80',
      experience: '8 years experience'
    },
    courseStructure: {
      totalSessions: 10,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'Individual',
      weeklyBreakdown: [
        {
          week: 1,
          title: 'Self-Assessment',
          description: 'Evaluate current self-esteem levels and identify areas for growth.',
          topics: ['Self-evaluation', 'Strength identification', 'Challenge assessment', 'Goal setting']
        }
      ]
    },
    whatItCovers: [
      'Self-awareness development',
      'Negative thought pattern interruption',
      'Confidence building exercises',
      'Self-compassion training',
      'Personal strength identification',
      'Goal setting and achievement'
    ],
    expectedOutcomes: [
      'Improved self-confidence',
      'Better self-image and acceptance',
      'Enhanced assertiveness skills',
      'Stronger sense of self-worth',
      'Increased motivation and drive'
    ],
    pricing: {
      individual: {
        perSession: 2400,
        totalCost: 24000
      }
    },
    reviews: {
      averageRating: 4.7,
      totalReviews: 92,
      reviews: []
    }
  }
};

// Keep the old data structure for backward compatibility
export const programData = {
  depression: {
    title: "Depression Support Program",
    description: "Comprehensive support for managing depression symptoms and improving mood",
    overview: "Our Depression Support Program provides evidence-based therapeutic approaches to help you understand, manage, and overcome depression. Through personalized sessions with qualified mental health professionals, you'll develop coping strategies and tools for long-term wellness.",
    benefits: [
      "Evidence-based therapeutic techniques",
      "Personalized treatment approach",
      "24/7 crisis support availability",
      "Progress tracking and monitoring",
      "Peer support group access",
      "Medication management guidance"
    ],
    features: [
      "Individual therapy sessions",
      "Cognitive Behavioral Therapy (CBT)",
      "Mindfulness-based interventions",
      "Lifestyle modification guidance",
      "Family therapy options",
      "Emergency support protocols"
    ],
    duration: "8-12 weeks",
    format: "Individual & Group Sessions",
    price: "$150-200 per session"
  },
  anxiety: {
    title: "Anxiety Management Program",
    description: "Tools and techniques to help manage anxiety and worry effectively",
    overview: "Our Anxiety Management Program combines proven therapeutic methods with practical coping strategies to help you regain control over anxiety and worry. Learn to identify triggers, develop healthy responses, and build resilience for lasting peace of mind.",
    benefits: [
      "Anxiety trigger identification",
      "Panic attack prevention techniques",
      "Stress reduction strategies",
      "Confidence building exercises",
      "Sleep improvement methods",
      "Social anxiety support"
    ],
    features: [
      "Exposure therapy sessions",
      "Relaxation technique training",
      "Breathing exercise programs",
      "Cognitive restructuring",
      "Progressive muscle relaxation",
      "Anxiety monitoring tools"
    ],
    duration: "6-10 weeks",
    format: "Individual & Workshop Sessions",
    price: "$120-180 per session"
  },
  stress: {
    title: "Stress Management Program",
    description: "Effective strategies to cope with and reduce stress in daily life",
    overview: "Transform your relationship with stress through our comprehensive Stress Management Program. Learn evidence-based techniques to handle pressure, improve work-life balance, and develop resilience for both personal and professional challenges.",
    benefits: [
      "Stress identification and assessment",
      "Time management optimization",
      "Work-life balance strategies",
      "Physical stress relief techniques",
      "Emotional regulation skills",
      "Burnout prevention methods"
    ],
    features: [
      "Stress assessment tools",
      "Mindfulness meditation training",
      "Time management workshops",
      "Physical relaxation techniques",
      "Workplace stress strategies",
      "Lifestyle modification plans"
    ],
    duration: "4-8 weeks",
    format: "Individual & Group Workshops",
    price: "$100-150 per session"
  },
  sleep: {
    title: "Sleep Improvement Program",
    description: "Help with improving sleep quality and addressing insomnia",
    overview: "Our Sleep Improvement Program addresses the root causes of sleep disorders through scientifically-proven methods. Develop healthy sleep habits, overcome insomnia, and achieve the restorative sleep your body and mind need for optimal functioning.",
    benefits: [
      "Sleep pattern analysis",
      "Insomnia treatment protocols",
      "Sleep hygiene education",
      "Relaxation technique training",
      "Sleep environment optimization",
      "Circadian rhythm regulation"
    ],
    features: [
      "Sleep diary tracking",
      "Cognitive Behavioral Therapy for Insomnia (CBT-I)",
      "Progressive muscle relaxation",
      "Sleep restriction therapy",
      "Stimulus control techniques",
      "Sleep medication guidance"
    ],
    duration: "6-8 weeks",
    format: "Individual Sessions",
    price: "$130-170 per session"
  },
  relationships: {
    title: "Relationship Counseling Program",
    description: "Guidance for building healthy and fulfilling relationships",
    overview: "Strengthen your connections with our Relationship Counseling Program. Whether addressing romantic partnerships, family dynamics, or friendships, learn communication skills, conflict resolution, and emotional intelligence for lasting, meaningful relationships.",
    benefits: [
      "Communication skill development",
      "Conflict resolution strategies",
      "Trust building exercises",
      "Emotional intimacy enhancement",
      "Boundary setting techniques",
      "Relationship maintenance tools"
    ],
    features: [
      "Couples therapy sessions",
      "Family counseling options",
      "Communication workshops",
      "Conflict mediation",
      "Individual relationship coaching",
      "Attachment style assessment"
    ],
    duration: "8-16 weeks",
    format: "Individual, Couple & Family Sessions",
    price: "$160-220 per session"
  },
  trauma: {
    title: "Trauma & PTSD Recovery Program",
    description: "Support for healing from trauma and managing PTSD symptoms",
    overview: "Our Trauma & PTSD Recovery Program provides specialized care for those who have experienced traumatic events. Using trauma-informed approaches, we help you process experiences, develop coping mechanisms, and reclaim your sense of safety and empowerment.",
    benefits: [
      "Trauma-informed therapeutic approaches",
      "PTSD symptom management",
      "Safety and grounding techniques",
      "Memory processing support",
      "Emotional regulation training",
      "Post-traumatic growth facilitation"
    ],
    features: [
      "EMDR therapy sessions",
      "Trauma-focused CBT",
      "Somatic experiencing",
      "Grounding technique training",
      "Narrative therapy",
      "Crisis intervention support"
    ],
    duration: "12-20 weeks",
    format: "Individual Therapy Sessions",
    price: "$180-250 per session"
  },
  grief: {
    title: "Grief & Loss Support Program",
    description: "Compassionate support for navigating grief and loss",
    overview: "Navigate the complex journey of grief with our compassionate Grief & Loss Support Program. Find healing, meaning, and hope as you process loss and learn to carry your loved one's memory while moving forward with your life.",
    benefits: [
      "Grief stage understanding",
      "Emotional processing support",
      "Memorial and ritual guidance",
      "Complicated grief treatment",
      "Support group participation",
      "Meaning-making assistance"
    ],
    features: [
      "Individual grief counseling",
      "Bereavement support groups",
      "Memorial service planning",
      "Grief education workshops",
      "Family grief support",
      "Anniversary reaction preparation"
    ],
    duration: "Ongoing support available",
    format: "Individual & Group Sessions",
    price: "$140-190 per session"
  },
  "self-esteem": {
    title: "Self-Esteem Building Program",
    description: "Help with building confidence and improving self-image",
    overview: "Transform your relationship with yourself through our Self-Esteem Building Program. Develop authentic self-confidence, overcome negative self-talk, and build a strong foundation of self-worth that supports all areas of your life.",
    benefits: [
      "Self-awareness development",
      "Negative thought pattern interruption",
      "Confidence building exercises",
      "Self-compassion training",
      "Personal strength identification",
      "Goal setting and achievement"
    ],
    features: [
      "Self-assessment tools",
      "Cognitive restructuring",
      "Assertiveness training",
      "Personal achievement planning",
      "Self-care routine development",
      "Social confidence building"
    ],
    duration: "6-12 weeks",
    format: "Individual & Group Sessions",
    price: "$110-160 per session"
  }
};
