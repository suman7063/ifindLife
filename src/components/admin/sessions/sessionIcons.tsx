
import React from 'react';
import { Brain, Heart, MessageCircle, Lightbulb, Briefcase, Megaphone, Users, Sparkles } from 'lucide-react';
import { Session } from './types';

export const iconComponents: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'brain': Brain,
  'heart': Heart,
  'message-circle': MessageCircle,
  'lightbulb': Lightbulb,
  'briefcase': Briefcase,
  'megaphone': Megaphone,
  'users': Users,
  'sparkles': Sparkles,
};

export const iconOptions = [
  { value: 'brain', label: 'Brain', icon: <Brain className="h-5 w-5" /> },
  { value: 'heart', label: 'Heart', icon: <Heart className="h-5 w-5" /> },
  { value: 'message-circle', label: 'Chat', icon: <MessageCircle className="h-5 w-5" /> },
  { value: 'lightbulb', label: 'Idea', icon: <Lightbulb className="h-5 w-5" /> },
  { value: 'briefcase', label: 'Work', icon: <Briefcase className="h-5 w-5" /> },
  { value: 'megaphone', label: 'Announcement', icon: <Megaphone className="h-5 w-5" /> },
  { value: 'users', label: 'Group', icon: <Users className="h-5 w-5" /> },
  { value: 'sparkles', label: 'Sparkles', icon: <Sparkles className="h-5 w-5" /> },
];

export const colorOptions = [
  { value: 'bg-blue-100', label: 'Blue' },
  { value: 'bg-red-100', label: 'Red' },
  { value: 'bg-green-100', label: 'Green' },
  { value: 'bg-yellow-100', label: 'Yellow' },
  { value: 'bg-purple-100', label: 'Purple' },
  { value: 'bg-orange-100', label: 'Orange' },
  { value: 'bg-pink-100', label: 'Pink' },
  { value: 'bg-indigo-100', label: 'Indigo' },
];

export const renderIcon = (iconName: string) => {
  const IconComponent = iconComponents[iconName];
  return IconComponent ? <IconComponent className="h-6 w-6 text-ifind-purple" /> : null;
};
