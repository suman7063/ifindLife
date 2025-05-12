
import { ServiceCategory } from './types';

/**
 * Default categories to use when no services are available
 */
export const DEFAULT_CATEGORIES: ServiceCategory[] = [
  {
    name: 'Therapy & Counseling',
    id: 'therapy-counseling',
    title: 'Therapy & Counseling', // Added missing title
    icon: 'Brain', // Added missing icon
    color: 'blue', // Added missing color
    items: [
      {
        id: 'individual-therapy',
        title: 'Individual Therapy',
        description: 'One-on-one sessions with a qualified therapist',
        href: '/services/individual-therapy',
        icon: 'Brain',
        color: 'blue'
      },
      {
        id: 'cognitive-behavioral',
        title: 'Cognitive Behavioral Therapy',
        description: 'Evidence-based approach to change negative thinking patterns',
        href: '/services/cognitive-behavioral',
        icon: 'Brain',
        color: 'blue'
      }
    ]
  },
  {
    name: 'Wellness Services',
    id: 'wellness-services',
    title: 'Wellness Services', // Added missing title
    icon: 'Flower', // Added missing icon
    color: 'green', // Added missing color
    items: [
      {
        id: 'meditation',
        title: 'Meditation Sessions',
        description: 'Guided meditation for stress reduction and mindfulness',
        href: '/services/meditation',
        icon: 'Flower',
        color: 'green'
      },
      {
        id: 'stress-management',
        title: 'Stress Management',
        description: 'Learn techniques to effectively manage daily stress',
        href: '/services/stress-management',
        icon: 'Flower',
        color: 'green'
      }
    ]
  },
  {
    name: 'Relationship Services',
    id: 'relationship-services',
    title: 'Relationship Services', // Added missing title
    icon: 'Heart', // Added missing icon
    color: 'pink', // Added missing color
    items: [
      {
        id: 'couples-therapy',
        title: 'Couples Therapy',
        description: 'Resolve conflicts and improve communication in relationships',
        href: '/services/couples-therapy',
        icon: 'Heart',
        color: 'pink'
      },
      {
        id: 'family-counseling',
        title: 'Family Counseling',
        description: 'Address family dynamics and improve family relationships',
        href: '/services/family-counseling',
        icon: 'Heart',
        color: 'pink'
      }
    ]
  }
];

/**
 * Default service rate for new services
 */
export const DEFAULT_SERVICE_RATE = 30;
