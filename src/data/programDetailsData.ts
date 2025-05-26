
import { ProgramDetail } from '@/types/programDetail';

const programDetailsData: Record<string, ProgramDetail> = {
  depression: {
    id: 'depression',
    title: 'Depression Management Program',
    description: 'Comprehensive support for managing depression symptoms and improving mood through evidence-based techniques.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 12,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
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
        },
        {
          week: 3,
          title: 'Mindfulness and Acceptance',
          description: 'Developing mindfulness skills to manage depressive episodes.',
          topics: ['Mindfulness meditation', 'Present moment awareness', 'Acceptance techniques', 'Body scan exercises']
        },
        {
          week: 4,
          title: 'Lifestyle Modifications',
          description: 'Building healthy habits that support mental wellness.',
          topics: ['Sleep hygiene', 'Exercise routine', 'Nutrition impact', 'Social connections']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Understanding Depression and Its Causes',
        'Cognitive Behavioral Therapy Techniques',
        'Mindfulness and Meditation Practices',
        'Lifestyle Changes for Mental Health',
        'Building Support Systems',
        'Relapse Prevention Strategies'
      ],
      techniques: [
        'Cognitive Restructuring',
        'Behavioral Activation',
        'Mindfulness Meditation',
        'Thought Record Keeping',
        'Pleasant Activity Scheduling',
        'Problem-Solving Skills'
      ],
      tools: [
        'Mood Tracking Apps',
        'Meditation Guides',
        'Thought Record Sheets',
        'Activity Scheduling Templates',
        'Sleep Hygiene Checklists',
        'Emergency Contact Lists'
      ],
      skills: [
        'Emotional Regulation',
        'Stress Management',
        'Communication Skills',
        'Self-Advocacy',
        'Boundary Setting',
        'Self-Care Planning'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Improved understanding of depression',
        'Basic coping strategies learned',
        'Better sleep patterns',
        'Increased self-awareness'
      ],
      mediumTerm: [
        'Reduced depressive symptoms',
        'More positive thought patterns',
        'Improved daily functioning',
        'Better social connections'
      ],
      longTerm: [
        'Sustained mood improvement',
        'Strong relapse prevention skills',
        'Enhanced quality of life',
        'Improved relationships'
      ],
      successMetrics: [
        '70% reduction in depressive symptoms',
        'Improved PHQ-9 scores',
        'Better sleep quality ratings',
        'Increased social activity participation'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2500,
        packagePrice: 25000,
        discount: {
          percentage: 15,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '3 months',
      timeCommitment: '2-3 hours per week',
      flexibility: 'Scheduled sessions with homework'
    },
    
    reviews: {
      averageRating: 4.8,
      totalReviews: 127,
      featured: [
        {
          id: '1',
          userName: 'Sarah M.',
          rating: 5,
          comment: 'This program completely changed my life. The techniques I learned helped me overcome depression.',
          date: '2024-01-15',
          verified: true
        },
        {
          id: '2',
          userName: 'Raj K.',
          rating: 4,
          comment: 'Very structured approach. The therapist was understanding and professional.',
          date: '2024-01-10',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Priya Sharma',
      credentials: ['PhD Clinical Psychology', 'CBT Certified'],
      experience: '8 years',
      specialization: ['Depression', 'Anxiety', 'CBT'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },

  anxiety: {
    id: 'anxiety',
    title: 'Anxiety Relief Program',
    description: 'Learn effective tools and techniques to help manage anxiety and worry through breathing exercises and cognitive restructuring.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 10,
      sessionDuration: '50 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
        {
          week: 1,
          title: 'Understanding Anxiety',
          description: 'Learn about anxiety disorders and their manifestations.',
          topics: ['Types of anxiety', 'Physical symptoms', 'Triggers identification', 'Anxiety cycle']
        },
        {
          week: 2,
          title: 'Breathing and Relaxation',
          description: 'Master breathing techniques and progressive muscle relaxation.',
          topics: ['Diaphragmatic breathing', 'Box breathing', 'Progressive relaxation', 'Quick calm techniques']
        },
        {
          week: 3,
          title: 'Cognitive Restructuring',
          description: 'Challenge and change anxious thought patterns.',
          topics: ['Thought challenging', 'Evidence examination', 'Balanced thinking', 'Worry time technique']
        },
        {
          week: 4,
          title: 'Exposure Therapy Basics',
          description: 'Gradual exposure to anxiety-provoking situations.',
          topics: ['Fear hierarchy', 'Systematic desensitization', 'In-vivo exposure', 'Imaginal exposure']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Understanding Anxiety Disorders',
        'Breathing and Relaxation Techniques',
        'Cognitive Restructuring Methods',
        'Exposure Therapy Principles',
        'Mindfulness for Anxiety',
        'Lifestyle Factors and Anxiety'
      ],
      techniques: [
        'Deep Breathing Exercises',
        'Progressive Muscle Relaxation',
        'Thought Challenging',
        'Grounding Techniques',
        'Exposure Exercises',
        'Mindfulness Meditation'
      ],
      tools: [
        'Anxiety Tracking Apps',
        'Breathing Exercise Guides',
        'Relaxation Audio Files',
        'Thought Record Forms',
        'Fear Hierarchy Worksheets',
        'Emergency Coping Cards'
      ],
      skills: [
        'Anxiety Management',
        'Stress Reduction',
        'Panic Attack Prevention',
        'Assertiveness Training',
        'Problem-Solving',
        'Self-Soothing Techniques'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Improved breathing control',
        'Basic relaxation skills',
        'Better anxiety awareness',
        'Reduced physical symptoms'
      ],
      mediumTerm: [
        'Significant anxiety reduction',
        'Improved coping strategies',
        'Better stress management',
        'Increased confidence'
      ],
      longTerm: [
        'Long-term anxiety control',
        'Enhanced quality of life',
        'Improved relationships',
        'Greater life satisfaction'
      ],
      successMetrics: [
        '60% reduction in anxiety symptoms',
        'Improved GAD-7 scores',
        'Reduced panic attack frequency',
        'Better daily functioning'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2200,
        packagePrice: 20000,
        discount: {
          percentage: 10,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '10 weeks',
      timeCommitment: '2 hours per week',
      flexibility: 'Scheduled with practice assignments'
    },
    
    reviews: {
      averageRating: 4.7,
      totalReviews: 89,
      featured: [
        {
          id: '3',
          userName: 'Michael R.',
          rating: 5,
          comment: 'The breathing techniques alone made a huge difference in my panic attacks.',
          date: '2024-01-20',
          verified: true
        },
        {
          id: '4',
          userName: 'Anita P.',
          rating: 4,
          comment: 'Systematic approach that really works. Highly recommend this program.',
          date: '2024-01-18',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Amit Gupta',
      credentials: ['MD Psychiatry', 'Anxiety Disorders Specialist'],
      experience: '12 years',
      specialization: ['Anxiety Disorders', 'Panic Disorder', 'CBT'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },

  stress: {
    id: 'stress',
    title: 'Stress Management Mastery',
    description: 'Develop effective strategies to cope with and reduce stress in your daily life using proven stress management techniques.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '45 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
        {
          week: 1,
          title: 'Stress Assessment',
          description: 'Identify your stress triggers and current coping mechanisms.',
          topics: ['Stress identification', 'Trigger mapping', 'Stress impact assessment', 'Current coping review']
        },
        {
          week: 2,
          title: 'Time Management',
          description: 'Learn effective time management and prioritization skills.',
          topics: ['Priority setting', 'Time blocking', 'Delegation skills', 'Boundary setting']
        },
        {
          week: 3,
          title: 'Relaxation Techniques',
          description: 'Master various relaxation and stress-relief methods.',
          topics: ['Deep relaxation', 'Visualization', 'Body scan', 'Quick stress relief']
        },
        {
          week: 4,
          title: 'Lifestyle Optimization',
          description: 'Build stress-resistant lifestyle habits.',
          topics: ['Exercise for stress', 'Nutrition impact', 'Sleep optimization', 'Social support']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Stress Identification and Assessment',
        'Time Management and Organization',
        'Relaxation and Mindfulness Techniques',
        'Lifestyle Factors and Stress',
        'Work-Life Balance Strategies',
        'Building Stress Resilience'
      ],
      techniques: [
        'Stress Mapping',
        'Time Blocking',
        'Progressive Relaxation',
        'Mindfulness Meditation',
        'Cognitive Reframing',
        'Energy Management'
      ],
      tools: [
        'Stress Tracking Journals',
        'Time Management Apps',
        'Relaxation Audio Guides',
        'Priority Matrix Templates',
        'Stress Thermometer',
        'Daily Routine Planners'
      ],
      skills: [
        'Stress Recognition',
        'Time Management',
        'Relaxation Skills',
        'Boundary Setting',
        'Communication Skills',
        'Self-Care Planning'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Better stress awareness',
        'Improved time management',
        'Basic relaxation skills',
        'Reduced stress symptoms'
      ],
      mediumTerm: [
        'Effective stress management',
        'Better work-life balance',
        'Improved productivity',
        'Enhanced well-being'
      ],
      longTerm: [
        'Stress resilience building',
        'Sustained stress reduction',
        'Improved life satisfaction',
        'Better health outcomes'
      ],
      successMetrics: [
        '50% reduction in stress levels',
        'Improved PSS scores',
        'Better sleep quality',
        'Increased productivity measures'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2000,
        packagePrice: 15000,
        discount: {
          percentage: 12,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '8 weeks',
      timeCommitment: '1.5 hours per week',
      flexibility: 'Flexible scheduling available'
    },
    
    reviews: {
      averageRating: 4.6,
      totalReviews: 156,
      featured: [
        {
          id: '5',
          userName: 'David L.',
          rating: 5,
          comment: 'Learned practical techniques that I use daily. Work stress is much more manageable now.',
          date: '2024-01-25',
          verified: true
        },
        {
          id: '6',
          userName: 'Kavya S.',
          rating: 4,
          comment: 'Great program for busy professionals. The time management section was particularly helpful.',
          date: '2024-01-22',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Neha Agarwal',
      credentials: ['PhD Psychology', 'Stress Management Certified'],
      experience: '10 years',
      specialization: ['Stress Management', 'Workplace Psychology', 'CBT'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },

  sleep: {
    id: 'sleep',
    title: 'Sleep Quality Improvement',
    description: 'Comprehensive program to help improve sleep quality and address insomnia through sleep hygiene education and behavioral modifications.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 6,
      sessionDuration: '45 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
        {
          week: 1,
          title: 'Sleep Assessment',
          description: 'Comprehensive evaluation of current sleep patterns and issues.',
          topics: ['Sleep diary analysis', 'Sleep disorder screening', 'Lifestyle factor review', 'Goal setting']
        },
        {
          week: 2,
          title: 'Sleep Hygiene',
          description: 'Learn essential sleep hygiene principles and practices.',
          topics: ['Bedroom environment', 'Pre-sleep routine', 'Sleep schedule', 'Stimulant management']
        },
        {
          week: 3,
          title: 'Cognitive Techniques',
          description: 'Address racing thoughts and sleep anxiety.',
          topics: ['Worry time technique', 'Thought stopping', 'Sleep-focused meditation', 'Cognitive restructuring']
        },
        {
          week: 4,
          title: 'Behavioral Interventions',
          description: 'Implement behavioral changes for better sleep.',
          topics: ['Sleep restriction', 'Stimulus control', 'Relaxation training', 'Sleep consolidation']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Sleep Science and Sleep Disorders',
        'Sleep Hygiene Best Practices',
        'Cognitive Behavioral Therapy for Insomnia',
        'Relaxation and Wind-Down Techniques',
        'Lifestyle Factors Affecting Sleep',
        'Sleep Environment Optimization'
      ],
      techniques: [
        'Sleep Restriction Therapy',
        'Stimulus Control Therapy',
        'Progressive Muscle Relaxation',
        'Sleep-Focused Mindfulness',
        'Cognitive Restructuring',
        'Sleep Scheduling'
      ],
      tools: [
        'Sleep Diary Apps',
        'White Noise Generators',
        'Sleep Meditation Guides',
        'Blue Light Filters',
        'Sleep Environment Checklists',
        'Relaxation Audio Programs'
      ],
      skills: [
        'Sleep Hygiene Management',
        'Relaxation Skills',
        'Sleep Schedule Regulation',
        'Stress Management for Sleep',
        'Environmental Control',
        'Sleep Maintenance Strategies'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Improved sleep hygiene habits',
        'Better bedtime routine',
        'Reduced sleep anxiety',
        'Faster sleep onset'
      ],
      mediumTerm: [
        'More consistent sleep schedule',
        'Improved sleep quality',
        'Reduced night wakings',
        'Better daytime energy'
      ],
      longTerm: [
        'Sustained sleep improvements',
        'Better overall health',
        'Improved mood and cognition',
        'Enhanced quality of life'
      ],
      successMetrics: [
        'Improved ISI scores',
        'Reduced sleep onset time',
        'Increased sleep efficiency',
        'Better subjective sleep quality'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 1800,
        packagePrice: 10000,
        discount: {
          percentage: 8,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '6 weeks',
      timeCommitment: '1 hour per week',
      flexibility: 'Evening sessions available'
    },
    
    reviews: {
      averageRating: 4.8,
      totalReviews: 73,
      featured: [
        {
          id: '7',
          userName: 'Jennifer W.',
          rating: 5,
          comment: 'Finally sleeping through the night! The sleep restriction technique was life-changing.',
          date: '2024-01-28',
          verified: true
        },
        {
          id: '8',
          userName: 'Rohit M.',
          rating: 5,
          comment: 'Excellent program. My insomnia is completely manageable now.',
          date: '2024-01-26',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Sunita Kapoor',
      credentials: ['MD Sleep Medicine', 'CBT-I Certified'],
      experience: '15 years',
      specialization: ['Sleep Disorders', 'Insomnia Treatment', 'CBT-I'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },

  relationships: {
    id: 'relationships',
    title: 'Relationship Enhancement Program',
    description: 'Expert guidance for building healthy and fulfilling relationships through communication skills and emotional intelligence development.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 10,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
        {
          week: 1,
          title: 'Relationship Assessment',
          description: 'Evaluate current relationship patterns and dynamics.',
          topics: ['Relationship mapping', 'Communication styles', 'Conflict patterns', 'Attachment styles']
        },
        {
          week: 2,
          title: 'Communication Skills',
          description: 'Learn effective communication techniques.',
          topics: ['Active listening', 'Assertive communication', 'Non-verbal communication', 'Empathy building']
        },
        {
          week: 3,
          title: 'Conflict Resolution',
          description: 'Master healthy conflict resolution strategies.',
          topics: ['Conflict de-escalation', 'Problem-solving together', 'Compromise skills', 'Forgiveness process']
        },
        {
          week: 4,
          title: 'Emotional Intelligence',
          description: 'Develop emotional awareness and regulation.',
          topics: ['Emotion recognition', 'Emotional regulation', 'Empathy development', 'Emotional expression']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Communication Skills Development',
        'Conflict Resolution Strategies',
        'Emotional Intelligence Building',
        'Trust and Intimacy Enhancement',
        'Boundary Setting and Respect',
        'Relationship Maintenance Skills'
      ],
      techniques: [
        'Active Listening',
        'I-Statement Communication',
        'Conflict De-escalation',
        'Emotional Validation',
        'Compromise Negotiation',
        'Relationship Rituals'
      ],
      tools: [
        'Communication Templates',
        'Conflict Resolution Guides',
        'Emotion Regulation Worksheets',
        'Relationship Assessment Tools',
        'Daily Check-in Formats',
        'Boundary Setting Exercises'
      ],
      skills: [
        'Effective Communication',
        'Conflict Management',
        'Emotional Regulation',
        'Empathy and Understanding',
        'Trust Building',
        'Intimacy Enhancement'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Improved communication skills',
        'Better conflict handling',
        'Increased relationship awareness',
        'Enhanced emotional expression'
      ],
      mediumTerm: [
        'Stronger relationship bonds',
        'Reduced relationship conflicts',
        'Better emotional connection',
        'Improved relationship satisfaction'
      ],
      longTerm: [
        'Lasting relationship improvements',
        'Enhanced relationship resilience',
        'Better relationship patterns',
        'Deeper emotional intimacy'
      ],
      successMetrics: [
        'Improved DAS scores',
        'Reduced conflict frequency',
        'Better communication ratings',
        'Increased relationship satisfaction'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2800,
        packagePrice: 25000,
        discount: {
          percentage: 15,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '10 weeks',
      timeCommitment: '2.5 hours per week',
      flexibility: 'Couples sessions available'
    },
    
    reviews: {
      averageRating: 4.9,
      totalReviews: 94,
      featured: [
        {
          id: '9',
          userName: 'Sarah & Mark',
          rating: 5,
          comment: 'This program saved our marriage. We learned to communicate effectively for the first time.',
          date: '2024-01-30',
          verified: true
        },
        {
          id: '10',
          userName: 'Priya K.',
          rating: 5,
          comment: 'Excellent for anyone wanting to improve their relationships. Highly practical.',
          date: '2024-01-28',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Ravi Mehta',
      credentials: ['PhD Clinical Psychology', 'Couples Therapy Certified'],
      experience: '18 years',
      specialization: ['Couples Therapy', 'Communication Skills', 'Relationship Counseling'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },

  trauma: {
    id: 'trauma',
    title: 'Trauma Recovery Program',
    description: 'Specialized support for healing from trauma and managing PTSD symptoms using trauma-informed therapeutic approaches.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 16,
      sessionDuration: '60 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
        {
          week: 1,
          title: 'Trauma Education',
          description: 'Understanding trauma and its effects on mind and body.',
          topics: ['Trauma types', 'Trauma responses', 'Nervous system impact', 'Recovery principles']
        },
        {
          week: 2,
          title: 'Safety and Stabilization',
          description: 'Building safety and emotional regulation skills.',
          topics: ['Grounding techniques', 'Safety planning', 'Emotional regulation', 'Self-soothing skills']
        },
        {
          week: 3,
          title: 'Trauma Processing',
          description: 'Safely processing traumatic memories and experiences.',
          topics: ['Memory processing', 'EMDR basics', 'Narrative therapy', 'Meaning making']
        },
        {
          week: 4,
          title: 'Integration and Growth',
          description: 'Integrating healing and building post-traumatic growth.',
          topics: ['Integration work', 'Strength building', 'Future planning', 'Relapse prevention']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Trauma-Informed Understanding',
        'PTSD Symptom Management',
        'Safety and Stabilization Techniques',
        'Trauma Processing Methods',
        'Emotional Regulation Skills',
        'Post-Traumatic Growth'
      ],
      techniques: [
        'EMDR (Eye Movement Desensitization)',
        'Grounding and Anchoring',
        'Somatic Experiencing',
        'Narrative Therapy',
        'Cognitive Processing Therapy',
        'Mindfulness-Based Interventions'
      ],
      tools: [
        'Grounding Technique Cards',
        'Safety Planning Templates',
        'Emotion Regulation Workbooks',
        'Trauma Recovery Journals',
        'Mindfulness Apps',
        'Support Network Maps'
      ],
      skills: [
        'Emotional Regulation',
        'Distress Tolerance',
        'Self-Soothing',
        'Boundary Setting',
        'Communication Skills',
        'Resilience Building'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Improved emotional regulation',
        'Better safety and grounding',
        'Reduced trauma symptoms',
        'Increased self-awareness'
      ],
      mediumTerm: [
        'Significant PTSD symptom reduction',
        'Better trauma integration',
        'Improved relationships',
        'Enhanced daily functioning'
      ],
      longTerm: [
        'Post-traumatic growth',
        'Sustained trauma recovery',
        'Resilience and strength',
        'Meaningful life engagement'
      ],
      successMetrics: [
        '60% reduction in PTSD symptoms',
        'Improved PCL-5 scores',
        'Better quality of life measures',
        'Increased trauma integration'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 3500,
        packagePrice: 50000,
        discount: {
          percentage: 20,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '16 weeks',
      timeCommitment: '3 hours per week',
      flexibility: 'Trauma-informed pacing'
    },
    
    reviews: {
      averageRating: 4.9,
      totalReviews: 67,
      featured: [
        {
          id: '11',
          userName: 'Anonymous',
          rating: 5,
          comment: 'This program gave me my life back. I never thought I could heal from my trauma.',
          date: '2024-02-01',
          verified: true
        },
        {
          id: '12',
          userName: 'Maya S.',
          rating: 5,
          comment: 'Professional, compassionate, and effective. Highly recommend for trauma survivors.',
          date: '2024-01-29',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Arjun Singh',
      credentials: ['PhD Clinical Psychology', 'EMDR Certified', 'Trauma Specialist'],
      experience: '20 years',
      specialization: ['PTSD Treatment', 'EMDR', 'Trauma Recovery'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },

  grief: {
    id: 'grief',
    title: 'Grief & Loss Support',
    description: 'Compassionate support for navigating grief and loss with therapeutic guidance and healthy coping mechanisms.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '50 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
        {
          week: 1,
          title: 'Understanding Grief',
          description: 'Learn about the grief process and its normal manifestations.',
          topics: ['Grief stages', 'Types of loss', 'Normal vs complicated grief', 'Cultural considerations']
        },
        {
          week: 2,
          title: 'Emotional Processing',
          description: 'Learn to process and express grief emotions healthily.',
          topics: ['Emotion identification', 'Healthy expression', 'Emotional waves', 'Self-compassion']
        },
        {
          week: 3,
          title: 'Coping Strategies',
          description: 'Develop healthy coping mechanisms for grief.',
          topics: ['Healthy coping', 'Meaning making', 'Memorial practices', 'Support systems']
        },
        {
          week: 4,
          title: 'Moving Forward',
          description: 'Learn to honor loss while rebuilding life.',
          topics: ['Continuing bonds', 'Life reconstruction', 'New identity', 'Hope building']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Understanding the Grief Process',
        'Types of Loss and Grief',
        'Emotional Processing Techniques',
        'Healthy Coping Strategies',
        'Support System Building',
        'Meaning Making and Growth'
      ],
      techniques: [
        'Grief Processing',
        'Emotional Expression',
        'Memorial Practices',
        'Journaling Therapy',
        'Mindfulness for Grief',
        'Continuing Bonds'
      ],
      tools: [
        'Grief Journals',
        'Memorial Creation Guides',
        'Support Group Resources',
        'Coping Skills Cards',
        'Meditation for Grief',
        'Memory Preservation Tools'
      ],
      skills: [
        'Emotional Processing',
        'Grief Expression',
        'Self-Care Planning',
        'Support Seeking',
        'Meaning Making',
        'Resilience Building'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Better grief understanding',
        'Improved emotional expression',
        'Reduced isolation',
        'Basic coping skills'
      ],
      mediumTerm: [
        'Healthy grief processing',
        'Stronger support connections',
        'Improved daily functioning',
        'Reduced grief intensity'
      ],
      longTerm: [
        'Grief integration',
        'Renewed sense of purpose',
        'Post-loss growth',
        'Meaningful life engagement'
      ],
      successMetrics: [
        'Improved grief symptom scores',
        'Better emotional regulation',
        'Increased social connection',
        'Enhanced life meaning'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2300,
        packagePrice: 17000,
        discount: {
          percentage: 12,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '8 weeks',
      timeCommitment: '2 hours per week',
      flexibility: 'Grief-sensitive scheduling'
    },
    
    reviews: {
      averageRating: 4.8,
      totalReviews: 82,
      featured: [
        {
          id: '13',
          userName: 'Robert M.',
          rating: 5,
          comment: 'Helped me navigate the hardest time of my life with compassion and understanding.',
          date: '2024-02-02',
          verified: true
        },
        {
          id: '14',
          userName: 'Deepika R.',
          rating: 5,
          comment: 'The therapist understood my cultural needs and helped me honor my loss appropriately.',
          date: '2024-01-31',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Kavita Joshi',
      credentials: ['PhD Counseling Psychology', 'Grief Counseling Certified'],
      experience: '14 years',
      specialization: ['Grief Counseling', 'Loss and Bereavement', 'Family Therapy'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },

  'self-esteem': {
    id: 'self-esteem',
    title: 'Self-Esteem Building Program',
    description: 'Comprehensive program to help build confidence and improve self-image through self-awareness exercises and empowerment strategies.',
    category: 'issue-based',
    
    courseStructure: {
      totalSessions: 8,
      sessionDuration: '45 minutes',
      frequency: 'Weekly',
      format: 'individual',
      modules: [
        {
          week: 1,
          title: 'Self-Awareness Building',
          description: 'Develop deeper understanding of self and current self-perception.',
          topics: ['Self-assessment', 'Strengths identification', 'Value clarification', 'Self-talk analysis']
        },
        {
          week: 2,
          title: 'Challenging Negative Beliefs',
          description: 'Identify and challenge limiting beliefs about self.',
          topics: ['Belief identification', 'Cognitive restructuring', 'Evidence examination', 'Balanced thinking']
        },
        {
          week: 3,
          title: 'Building Self-Compassion',
          description: 'Learn to treat yourself with kindness and understanding.',
          topics: ['Self-compassion practices', 'Inner critic work', 'Self-forgiveness', 'Mindful self-care']
        },
        {
          week: 4,
          title: 'Confidence Building',
          description: 'Develop practical confidence and assertion skills.',
          topics: ['Confidence techniques', 'Assertiveness training', 'Success visualization', 'Action planning']
        }
      ]
    },
    
    coverage: {
      mainTopics: [
        'Self-Awareness and Self-Discovery',
        'Cognitive Restructuring for Self-Esteem',
        'Self-Compassion Development',
        'Confidence Building Techniques',
        'Assertiveness Training',
        'Personal Empowerment Strategies'
      ],
      techniques: [
        'Strength-Based Assessment',
        'Cognitive Reframing',
        'Self-Compassion Practices',
        'Visualization Exercises',
        'Assertiveness Skills',
        'Goal Setting and Achievement'
      ],
      tools: [
        'Self-Esteem Workbooks',
        'Strength Assessment Tools',
        'Daily Affirmation Guides',
        'Confidence Building Exercises',
        'Self-Care Planning Templates',
        'Achievement Tracking Journals'
      ],
      skills: [
        'Self-Awareness',
        'Positive Self-Talk',
        'Self-Compassion',
        'Assertiveness',
        'Confidence Building',
        'Personal Boundary Setting'
      ]
    },
    
    expectedOutcomes: {
      shortTerm: [
        'Increased self-awareness',
        'Improved self-talk',
        'Better self-compassion',
        'Reduced self-criticism'
      ],
      mediumTerm: [
        'Higher self-esteem levels',
        'Increased confidence',
        'Better assertiveness',
        'Improved self-image'
      ],
      longTerm: [
        'Sustained self-esteem',
        'Strong self-confidence',
        'Empowered self-advocacy',
        'Enhanced life satisfaction'
      ],
      successMetrics: [
        'Improved RSES scores',
        'Better self-confidence ratings',
        'Increased assertiveness measures',
        'Enhanced self-efficacy'
      ]
    },
    
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2100,
        packagePrice: 15500,
        discount: {
          percentage: 10,
          conditions: 'Full program booking'
        }
      }
    },
    
    duration: {
      programLength: '8 weeks',
      timeCommitment: '1.5 hours per week',
      flexibility: 'Self-paced options available'
    },
    
    reviews: {
      averageRating: 4.7,
      totalReviews: 118,
      featured: [
        {
          id: '15',
          userName: 'Lisa T.',
          rating: 5,
          comment: 'This program completely transformed how I see myself. My confidence has skyrocketed.',
          date: '2024-02-03',
          verified: true
        },
        {
          id: '16',
          userName: 'Vikram P.',
          rating: 4,
          comment: 'Practical techniques that really work. I finally learned to appreciate myself.',
          date: '2024-02-01',
          verified: true
        }
      ]
    },
    
    expert: {
      name: 'Dr. Meera Patel',
      credentials: ['PhD Psychology', 'Self-Esteem Specialist'],
      experience: '11 years',
      specialization: ['Self-Esteem', 'Confidence Building', 'Personal Development'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  }
};

export const getProgramDetail = (programId: string): ProgramDetail | null => {
  return programDetailsData[programId] || null;
};
