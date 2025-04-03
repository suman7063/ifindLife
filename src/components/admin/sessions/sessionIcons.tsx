
import React from 'react';
import { Brain, MessageCircle, Heart, Briefcase, Lightbulb, Megaphone } from 'lucide-react';
import { IconOption } from './types';

export const iconOptions: IconOption[] = [
  { name: "Brain", value: "Brain" },
  { name: "MessageCircle", value: "MessageCircle" },
  { name: "Heart", value: "Heart" },
  { name: "Briefcase", value: "Briefcase" },
  { name: "Lightbulb", value: "Lightbulb" },
  { name: "Megaphone", value: "Megaphone" }
];

export const colorOptions: { name: string; value: string }[] = [
  { name: "Blue", value: "bg-blue-100" },
  { name: "Red", value: "bg-red-100" },
  { name: "Yellow", value: "bg-yellow-100" },
  { name: "Green", value: "bg-green-100" },
  { name: "Purple", value: "bg-purple-100" },
  { name: "Orange", value: "bg-orange-100" }
];

export const renderIcon = (iconName: string) => {
  switch(iconName) {
    case 'Brain':
      return <Brain className="h-6 w-6 text-ifind-aqua" />;
    case 'MessageCircle':
      return <MessageCircle className="h-6 w-6 text-ifind-aqua" />;
    case 'Heart':
      return <Heart className="h-6 w-6 text-ifind-aqua" />;
    case 'Briefcase':
      return <Briefcase className="h-6 w-6 text-ifind-aqua" />;
    case 'Lightbulb':
      return <Lightbulb className="h-6 w-6 text-ifind-aqua" />;
    case 'Megaphone':
      return <Megaphone className="h-6 w-6 text-ifind-aqua" />;
    default:
      return <Brain className="h-6 w-6 text-ifind-aqua" />;
  }
};
