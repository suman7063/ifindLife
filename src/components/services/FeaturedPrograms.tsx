
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryCard from '@/components/CategoryCard';
import { Brain, CircleDot, Star } from 'lucide-react';

interface FeaturedProgramsProps {
  onProgramClick: (href: string) => void;
}

const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ onProgramClick }) => {
  const featuredPrograms = [
    {
      icon: <Brain className="h-8 w-8 text-white" />,
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      href: "/programs-for-wellness-seekers?category=quick-ease",
      color: "bg-gradient-to-r from-ifind-aqua/60 to-ifind-aqua/80",
      textColor: "text-white"
    },
    {
      icon: <CircleDot className="h-8 w-8 text-white" />,
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      href: "/programs-for-wellness-seekers?category=resilience-building",
      color: "bg-gradient-to-r from-ifind-aqua/80 to-ifind-teal",
      textColor: "text-white"
    },
    {
      icon: <Star className="h-8 w-8 text-white" />,
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      href: "/programs-for-wellness-seekers?category=super-human",
      color: "bg-gradient-to-r from-ifind-purple/80 to-ifind-purple",
      textColor: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
      {featuredPrograms.map((program, index) => (
        <div 
          key={`program-${index}`} 
          onClick={() => onProgramClick(program.href)} 
          className="cursor-pointer transform transition-transform duration-300 hover:scale-105"
        >
          <CategoryCard 
            icon={program.icon}
            title={program.title}
            description={program.description}
            href={program.href}
            color={program.color}
            textColor={program.textColor}
            cardStyle="program"
          />
        </div>
      ))}
    </div>
  );
};

export default FeaturedPrograms;
