
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SessionDetailDialog from './services/SessionDetailDialog';
import { MessageCircle, HeartPulse, Brain } from 'lucide-react';

const ServicesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState<{
    title: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    color?: string;
  } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Updated featured programs with new descriptions and renamed "Emotional Resilience" to "Resilience Building"
  const featuredPrograms = [
    {
      id: 1,
      title: "QuickEase Programs",
      description: "Quick solutions for Immediate stress and anxiety relief",
      icon: <Brain className="h-12 w-12 text-ifind-aqua" />,
      href: "/programs-for-wellness-seekers?category=quick-ease",
      accentColor: "border-ifind-aqua",
      iconBgColor: "bg-ifind-aqua/10"
    },
    {
      id: 2,
      title: "Resilience Building",
      description: "Build Mental & Emotional strength to handle life's challenges",
      icon: <MessageCircle className="h-12 w-12 text-ifind-purple" />,
      href: "/programs-for-wellness-seekers?category=resilience-building",
      accentColor: "border-ifind-purple",
      iconBgColor: "bg-ifind-purple/10"
    },
    {
      id: 3,
      title: "Super Human Life",
      description: "Unleash your true potential to live a life beyond traps and matrix",
      icon: <HeartPulse className="h-12 w-12 text-ifind-teal" />,
      href: "/programs-for-wellness-seekers?category=super-human",
      accentColor: "border-ifind-teal",
      iconBgColor: "bg-ifind-teal/10"
    }
  ];

  const handleCategoryClick = (category: any) => {
    console.log("Category clicked:", category);
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleProgramClick = (href: string) => {
    navigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-4">IFL Programs for Individuals</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          IFL provides specialized programs to support your mental health journey
        </p>

        {/* Updated Program Cards with new descriptions and colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {featuredPrograms.map((program) => (
            <div
              key={program.id}
              onClick={() => handleProgramClick(program.href)}
              className={`cursor-pointer bg-gray-100 rounded-lg p-6 border-l-4 ${program.accentColor} shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105`}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`${program.iconBgColor} rounded-full p-4 mb-4`}>
                  {program.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SessionDetailDialog 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        selectedCategory={selectedCategory}
      />
    </section>
  );
};

export default ServicesSection;
