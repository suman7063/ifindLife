
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

  // Updated featured programs to match the screenshot
  const featuredPrograms = [
    {
      id: 1,
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      icon: <Brain className="h-12 w-12 text-ifind-aqua" />,
      href: "/services/quick-ease",
      accentColor: "border-ifind-aqua",
      iconBgColor: "bg-ifind-aqua/10"
    },
    {
      id: 2,
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      icon: <MessageCircle className="h-12 w-12 text-ifind-purple" />,
      href: "/services/emotional-resilience",
      accentColor: "border-ifind-purple",
      iconBgColor: "bg-ifind-purple/10"
    },
    {
      id: 3,
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      icon: <HeartPulse className="h-12 w-12 text-green-500" />,
      href: "/services/super-human",
      accentColor: "border-green-500",
      iconBgColor: "bg-green-500/10"
    }
  ];

  const handleCategoryClick = (category: any) => {
    console.log("Category clicked:", category);
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleProgramClick = (href: string) => {
    navigate(href);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-4">IFL Programs for Individuals</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          IFL provides specialized programs to support your mental health journey
        </p>

        {/* Updated Program Cards to match the screenshot */}
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
