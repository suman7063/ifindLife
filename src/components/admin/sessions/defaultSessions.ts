
import { Session } from './types';

export const getDefaultSessions = (): Session[] => [
  {
    id: 1,
    title: "Anxiety & Depression",
    description: "Get help managing anxiety, depression, and stress from licensed therapists.",
    href: "/anxiety-depression",
    color: "bg-blue-100",
    icon: "Brain"
  },
  {
    id: 2,
    title: "Relationship Counseling",
    description: "Improve communication and resolve conflicts in all types of relationships.",
    href: "/relationship-counseling",
    color: "bg-red-100",
    icon: "Heart"
  },
  {
    id: 3,
    title: "Career Guidance",
    description: "Navigate work stress, career transitions, and professional development.",
    href: "/career-guidance",
    color: "bg-yellow-100",
    icon: "Briefcase"
  },
  {
    id: 4,
    title: "Mindfulness Practice",
    description: "Learn techniques to stay present, reduce stress, and improve mental clarity.",
    href: "/mindfulness-practice",
    color: "bg-green-100",
    icon: "Brain"
  },
  {
    id: 5,
    title: "Personal Development",
    description: "Develop skills for self-improvement, goal setting, and personal growth.",
    href: "/personal-development",
    color: "bg-purple-100",
    icon: "Lightbulb"
  },
  {
    id: 6,
    title: "Communication Skills",
    description: "Enhance your ability to express yourself clearly and listen effectively.",
    href: "/communication-skills",
    color: "bg-orange-100",
    icon: "MessageCircle"
  }
];
