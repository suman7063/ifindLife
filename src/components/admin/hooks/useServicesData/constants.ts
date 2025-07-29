
import { ServiceCategory } from './types';

/**
 * Default categories to use when no services are available - filtered to specific admin services
 */
export const DEFAULT_CATEGORIES: ServiceCategory[] = [
  {
    name: 'Core Services',
    id: 'core-services',
    items: [
      {
        id: 'non-judgemental-listening',
        title: 'Non Judgemental Listening',
        description: 'A unique space where you can express yourself freely while being deeply heard without judgment or interruption.',
        href: '/services/mindful-listening',
        icon: 'MessageCircle',
        color: 'teal'
      },
      {
        id: 'listening-with-guidance',
        title: 'Listening with guidance',
        description: 'Supportive listening sessions combined with gentle guidance and insights to help navigate life challenges.',
        href: '/services/mindful-listening',
        icon: 'HeartHandshake',
        color: 'blue'
      },
      {
        id: 'therapy',
        title: 'Therapy',
        description: 'Professional therapy sessions to help you navigate life\'s challenges, manage mental health concerns, and enhance personal growth.',
        href: '/services/therapy-sessions',
        icon: 'HeartPulse',
        color: 'purple'
      },
      {
        id: 'guided-meditation',
        title: 'Guided Meditation',
        description: 'Expertly led meditation sessions to reduce stress, increase mindfulness, and cultivate inner peace and mental clarity.',
        href: '/services/guided-meditations',
        icon: 'Brain',
        color: 'aqua'
      },
      {
        id: 'life-coaching',
        title: 'Life Coaching',
        description: 'Goal-oriented coaching to help you clarify your vision, overcome obstacles, and achieve personal and professional success.',
        href: '/services/life-coaching',
        icon: 'Sparkles',
        color: 'rose'
      },
      {
        id: 'offline-retreat',
        title: 'Offline retreat',
        description: 'Immersive wellness experiences in nature to disconnect from technology and reconnect with yourself and others.',
        href: '/services/offline-retreats',
        icon: 'Leaf',
        color: 'amber'
      }
    ]
  }
];

/**
 * Default service rate for new services
 */
export const DEFAULT_SERVICE_RATE = 30;
