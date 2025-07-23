export interface ExpertCategory {
  id: string;
  label: string;
  title: string;
  description: string;
  offerings: Array<{
    title: string;
    description: string;
  }>;
}

export const expertCategories: ExpertCategory[] = [
  {
    id: 'listening-volunteer',
    label: 'Listening Volunteers',
    title: 'Listening Volunteers',
    description: 'Our compassionate listening volunteers provide a safe, non-judgmental space for you to share your thoughts and feelings. They are trained to offer emotional support through active listening, helping you process your experiences and find clarity.',
    offerings: [
      {
        title: 'Emotional Support',
        description: 'A caring ear when you need someone to listen without judgment'
      },
      {
        title: 'Safe Space',
        description: 'Confidential conversations in a supportive environment'
      },
      {
        title: 'Active Listening',
        description: 'Trained volunteers who focus entirely on understanding your perspective'
      }
    ]
  },
  {
    id: 'listening-expert',
    label: 'Listening Experts',
    title: 'Listening Experts',
    description: 'Our professional listening experts combine advanced training in therapeutic communication with deep empathy to provide structured emotional support. They offer specialized techniques for processing complex emotions and developing healthy coping strategies.',
    offerings: [
      {
        title: 'Professional Support',
        description: 'Expert-level emotional guidance with advanced training in therapeutic listening'
      },
      {
        title: 'Structured Sessions',
        description: 'Goal-oriented conversations with proven therapeutic techniques'
      },
      {
        title: 'Complex Issue Processing',
        description: 'Specialized support for navigating challenging life situations and emotions'
      }
    ]
  },
  {
    id: 'mindfulness-expert',
    label: 'Mindfulness Experts',
    title: 'Mindfulness Experts',
    description: 'Our mindfulness experts guide you through transformative practices that cultivate present-moment awareness, reduce stress, and enhance emotional well-being. Learn meditation techniques, breathing exercises, and mindful living practices from certified professionals.',
    offerings: [
      {
        title: 'Meditation Guidance',
        description: 'Learn various meditation techniques tailored to your needs and lifestyle'
      },
      {
        title: 'Stress Reduction',
        description: 'Evidence-based practices to manage stress and anxiety effectively'
      },
      {
        title: 'Mindful Living',
        description: 'Integrate mindfulness principles into your daily routine for lasting well-being'
      }
    ]
  },
  {
    id: 'life-coach',
    label: 'Life Coaches',
    title: 'Life Coaches',
    description: 'Our certified life coaches empower you to unlock your potential and achieve your goals. Whether you\'re navigating career transitions, relationship challenges, or personal growth, our coaches provide the tools and support you need to create meaningful change.',
    offerings: [
      {
        title: 'Goal Achievement',
        description: 'Strategic planning and support to reach your personal and professional goals'
      },
      {
        title: 'Personal Development',
        description: 'Unlock your potential and develop new skills for success'
      },
      {
        title: 'Life Balance',
        description: 'Create harmony between work, relationships, and personal fulfillment'
      }
    ]
  },
  {
    id: 'spiritual-mentor',
    label: 'Spiritual Mentors',
    title: 'Spiritual Mentors',
    description: 'Our spiritual mentors support you on your journey of spiritual growth and self-discovery. They offer guidance in exploring your beliefs, finding inner peace, and connecting with your deeper purpose through various spiritual traditions and practices.',
    offerings: [
      {
        title: 'Spiritual Guidance',
        description: 'Personalized support for your unique spiritual journey and beliefs'
      },
      {
        title: 'Inner Peace',
        description: 'Practices and insights to cultivate inner calm and spiritual well-being'
      },
      {
        title: 'Purpose Discovery',
        description: 'Explore your life\'s deeper meaning and spiritual calling'
      }
    ]
  }
];