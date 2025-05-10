
import React from 'react';
import { Circle } from 'lucide-react';

interface FeaturedProgramsProps {
  onProgramClick: (href: string) => void;
}

const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ onProgramClick }) => {
  const programTypes = [
    {
      id: "quickease",
      name: "Quick Ease",
      description: "Short, focused sessions to quickly address specific mental health concerns",
      colorClass: "bg-ifind-purple/10 border-ifind-purple",
      iconColor: "text-ifind-purple",
      href: "/programs/quickease",
      duration: "15-30 min",
      sessions: "1-3 sessions"
    },
    {
      id: "resilience",
      name: "Resilience Builder",
      description: "Develop emotional strength and skills to navigate life's challenges",
      colorClass: "bg-ifind-aqua/10 border-ifind-aqua",
      iconColor: "text-ifind-aqua",
      href: "/programs/resilience",
      duration: "30-45 min",
      sessions: "4-8 sessions"
    },
    {
      id: "superhuman",
      name: "Super Human",
      description: "Transform and elevate your mental capabilities to their full potential",
      colorClass: "bg-ifind-teal/10 border-ifind-teal",
      iconColor: "text-ifind-teal",
      href: "/programs/superhuman",
      duration: "45-60 min",
      sessions: "8-12 sessions"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {programTypes.map((program) => (
        <div 
          key={program.id}
          onClick={() => onProgramClick(program.href)}
          className={`rounded-xl p-6 shadow-md border ${program.colorClass} cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 bg-gray-50`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className={`rounded-full p-3 ${program.iconColor} bg-white/80`}>
              <Circle className="h-6 w-6" />
            </div>
            <h4 className="text-xl font-semibold">{program.name}</h4>
          </div>
          <p className="text-gray-600 mb-4">{program.description}</p>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{program.duration}</span>
            <span>{program.sessions}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedPrograms;
