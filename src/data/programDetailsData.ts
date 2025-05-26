
import { ProgramDetail } from '@/types/programDetail';

export const programDetailsData: Record<string, ProgramDetail> = {
  'depression': {
    id: 'depression',
    title: 'Depression Management Program',
    description: 'Comprehensive support for managing depression symptoms and improving mood through evidence-based techniques including cognitive behavioral therapy, mindfulness practices, and lifestyle modifications.',
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
          description: 'Learn about depression, its symptoms, and how it affects daily life',
          topics: ['Depression basics', 'Symptom identification', 'Impact assessment']
        },
        {
          week: 2,
          title: 'Cognitive Patterns',
          description: 'Identify negative thought patterns and cognitive distortions',
          topics: ['Thought monitoring', 'Cognitive distortions', 'Pattern recognition']
        },
        {
          week: 3,
          title: 'Behavioral Activation',
          description: 'Develop strategies to increase positive activities and engagement',
          topics: ['Activity scheduling', 'Behavioral experiments', 'Goal setting']
        },
        {
          week: 4,
          title: 'Mindfulness & Relaxation',
          description: 'Learn mindfulness techniques and relaxation strategies',
          topics: ['Mindfulness meditation', 'Progressive muscle relaxation', 'Breathing exercises']
        }
      ]
    },
    coverage: {
      mainTopics: ['Cognitive Behavioral Therapy', 'Mindfulness-Based Interventions', 'Behavioral Activation', 'Lifestyle Modifications'],
      techniques: ['Thought challenging', 'Activity monitoring', 'Mindfulness meditation', 'Relaxation training'],
      tools: ['Mood tracking apps', 'Thought record sheets', 'Activity planners', 'Meditation guides'],
      skills: ['Emotional regulation', 'Stress management', 'Problem-solving', 'Self-compassion']
    },
    expectedOutcomes: {
      shortTerm: ['Improved mood awareness', 'Basic coping strategies', 'Reduced symptom intensity'],
      mediumTerm: ['Better emotional regulation', 'Increased daily activities', 'Improved sleep patterns'],
      longTerm: ['Sustained mood improvement', 'Enhanced quality of life', 'Relapse prevention skills'],
      successMetrics: ['50% reduction in depression scores', 'Increased activity levels', 'Better sleep quality']
    },
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2500,
        packagePrice: 25000,
        discount: {
          percentage: 15,
          conditions: 'Book full 12-session package'
        }
      }
    },
    duration: {
      programLength: '3 months',
      timeCommitment: '2-3 hours per week',
      flexibility: 'Scheduled sessions with flexible timing'
    },
    reviews: {
      averageRating: 4.8,
      totalReviews: 89,
      featured: [
        {
          id: '1',
          userName: 'Sarah M.',
          rating: 5,
          comment: 'This program completely changed my life. The techniques I learned helped me manage my depression effectively.',
          date: '2024-01-15',
          verified: true
        },
        {
          id: '2',
          userName: 'Raj K.',
          rating: 4,
          comment: 'Very helpful program with practical tools. The therapist was supportive throughout.',
          date: '2024-01-10',
          verified: true
        }
      ]
    },
    expert: {
      name: 'Dr. Priya Sharma',
      credentials: ['PhD in Clinical Psychology', 'Licensed Clinical Psychologist', 'CBT Specialist'],
      experience: '12 years',
      specialization: ['Depression Treatment', 'Cognitive Behavioral Therapy', 'Mindfulness-Based Interventions'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },
  'anxiety': {
    id: 'anxiety',
    title: 'Anxiety Relief Program',
    description: 'Learn effective tools and techniques to help manage anxiety and worry through breathing exercises, progressive muscle relaxation, and cognitive restructuring methods.',
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
          description: 'Learn about anxiety disorders and their physical/emotional symptoms',
          topics: ['Types of anxiety', 'Physical symptoms', 'Trigger identification']
        },
        {
          week: 2,
          title: 'Breathing & Relaxation',
          description: 'Master breathing techniques and progressive muscle relaxation',
          topics: ['Diaphragmatic breathing', 'Progressive muscle relaxation', 'Quick calming techniques']
        },
        {
          week: 3,
          title: 'Cognitive Restructuring',
          description: 'Challenge anxious thoughts and develop balanced thinking',
          topics: ['Thought challenging', 'Evidence examination', 'Alternative perspectives']
        }
      ]
    },
    coverage: {
      mainTopics: ['Anxiety Management', 'Relaxation Techniques', 'Cognitive Restructuring', 'Exposure Therapy'],
      techniques: ['Deep breathing', 'Progressive muscle relaxation', 'Grounding exercises', 'Mindfulness'],
      tools: ['Anxiety tracking apps', 'Relaxation audio guides', 'Thought record sheets'],
      skills: ['Anxiety recognition', 'Relaxation skills', 'Cognitive flexibility', 'Stress tolerance']
    },
    expectedOutcomes: {
      shortTerm: ['Reduced anxiety symptoms', 'Improved relaxation response', 'Better awareness'],
      mediumTerm: ['Enhanced coping skills', 'Decreased worry patterns', 'Improved confidence'],
      longTerm: ['Long-term anxiety management', 'Prevention strategies', 'Enhanced quality of life'],
      successMetrics: ['40% reduction in anxiety levels', 'Improved daily functioning', 'Better sleep']
    },
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2200,
        packagePrice: 18000,
        discount: {
          percentage: 18,
          conditions: 'Book full 10-session package'
        }
      }
    },
    duration: {
      programLength: '10 weeks',
      timeCommitment: '2 hours per week',
      flexibility: 'Flexible scheduling available'
    },
    reviews: {
      averageRating: 4.7,
      totalReviews: 156,
      featured: [
        {
          id: '1',
          userName: 'Amit P.',
          rating: 5,
          comment: 'The breathing techniques alone made a huge difference in my daily anxiety levels.',
          date: '2024-01-20',
          verified: true
        }
      ]
    },
    expert: {
      name: 'Dr. Kavya Menon',
      credentials: ['MA in Clinical Psychology', 'Anxiety Disorders Specialist', 'Mindfulness Instructor'],
      experience: '8 years',
      specialization: ['Anxiety Disorders', 'Panic Disorder', 'Social Anxiety'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  },
  'stress': {
    id: 'stress',
    title: 'Stress Management Mastery',
    description: 'Develop effective strategies to cope with and reduce stress in your daily life using proven stress management techniques and resilience building practices.',
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
          description: 'Identify your stress triggers and current coping patterns',
          topics: ['Stress sources', 'Physical stress responses', 'Current coping assessment']
        },
        {
          week: 2,
          title: 'Time Management',
          description: 'Learn effective time management and prioritization skills',
          topics: ['Priority setting', 'Time blocking', 'Delegation strategies']
        }
      ]
    },
    coverage: {
      mainTopics: ['Stress Identification', 'Time Management', 'Relaxation Techniques', 'Lifestyle Changes'],
      techniques: ['Stress monitoring', 'Time management', 'Relaxation training', 'Boundary setting'],
      tools: ['Stress diaries', 'Time management apps', 'Relaxation recordings'],
      skills: ['Stress awareness', 'Time management', 'Relaxation', 'Problem-solving']
    },
    expectedOutcomes: {
      shortTerm: ['Better stress awareness', 'Improved time management', 'Basic relaxation skills'],
      mediumTerm: ['Reduced stress levels', 'Better work-life balance', 'Enhanced productivity'],
      longTerm: ['Sustainable stress management', 'Improved overall wellbeing', 'Resilience building'],
      successMetrics: ['30% reduction in stress levels', 'Improved productivity', 'Better sleep quality']
    },
    pricing: {
      currency: 'INR',
      individual: {
        perSession: 2000,
        packagePrice: 14000,
        discount: {
          percentage: 12,
          conditions: 'Book full 8-session package'
        }
      }
    },
    duration: {
      programLength: '8 weeks',
      timeCommitment: '1.5-2 hours per week',
      flexibility: 'Self-paced with guided sessions'
    },
    reviews: {
      averageRating: 4.6,
      totalReviews: 203,
      featured: [
        {
          id: '1',
          userName: 'Neha S.',
          rating: 5,
          comment: 'Perfect program for busy professionals. Learned practical techniques I use daily.',
          date: '2024-01-18',
          verified: true
        }
      ]
    },
    expert: {
      name: 'Dr. Arjun Reddy',
      credentials: ['PhD in Occupational Psychology', 'Stress Management Specialist'],
      experience: '10 years',
      specialization: ['Workplace Stress', 'Burnout Prevention', 'Time Management'],
      photo: '/lovable-uploads/b063443e-03be-440d-93b9-3742e49290b7.png'
    }
  }
};

export const getProgramDetail = (programId: string): ProgramDetail | null => {
  return programDetailsData[programId] || null;
};
