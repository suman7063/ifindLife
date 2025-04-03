
import { Session } from './types';

export const defaultSessions: Session[] = [
  {
    id: "1",
    title: "Anxiety & Depression",
    description: "Get help managing anxiety, depression, and stress from licensed therapists.",
    icon: "brain",
    color: "bg-blue-100",
    href: "/anxiety-depression"
  },
  {
    id: "2",
    title: "Relationship Counseling",
    description: "Improve communication and resolve conflicts in all types of relationships.",
    icon: "heart",
    color: "bg-red-100",
    href: "/relationship-counseling"
  },
  {
    id: "3",
    title: "Career Guidance",
    description: "Navigate work stress, career transitions, and professional development.",
    icon: "briefcase",
    color: "bg-yellow-100",
    href: "/career-guidance"
  },
  {
    id: "4",
    title: "Family Therapy",
    description: "Address family dynamics, parenting challenges, and intergenerational issues.",
    icon: "users",
    color: "bg-green-100",
    href: "/family-therapy"
  },
  {
    id: "5",
    title: "Trauma Recovery",
    description: "Process and heal from past trauma with specialized therapeutic approaches.",
    icon: "sparkles",
    color: "bg-purple-100",
    href: "/trauma-recovery"
  },
  {
    id: "6",
    title: "Teen Counseling",
    description: "Support for adolescents facing academic pressure, identity, and social challenges.",
    icon: "message-circle",
    color: "bg-orange-100",
    href: "/teen-counseling"
  }
];

// Create a function to get the default sessions (which was missing)
export const getDefaultSessions = () => {
  return [...defaultSessions];
};
