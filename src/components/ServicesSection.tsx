import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FeaturedPrograms from './services/FeaturedPrograms';
import SessionDetailDialog from './services/SessionDetailDialog';
import { Circle, MessageCircle, Headphones, BookOpen } from 'lucide-react';

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

  // Featured programs with circular icons and descriptions
  const featuredPrograms = [
    {
      id: 1,
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      icon: <Circle className="h-12 w-12 text-ifind-aqua" />,
      href: "/programs-for-wellness-seekers?category=quick-ease",
      accentColor: "border-ifind-aqua",
      iconBgColor: "bg-ifind-aqua/10"
    },
    {
      id: 2,
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      icon: <MessageCircle className="h-12 w-12 text-ifind-purple" />,
      href: "/programs-for-wellness-seekers?category=resilience-building",
      accentColor: "border-ifind-purple",
      iconBgColor: "bg-ifind-purple/10"
    },
    {
      id: 3,
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      icon: <BookOpen className="h-12 w-12 text-ifind-teal" />,
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
  };

  return (
    <section className="py-16 bg-ifind-purple/5">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-3xl font-bold mb-4">IFL Programs for Individuals</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          IFL provides specialized programs to support your mental health journey
        </p>

        {/* Redesigned Program Cards with Circular Icons */}
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

        {/* Keep the existing "Issue-based Sessions" content from IssueSessions component */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6">Issue Based Sessions</h3>
          <FeaturedPrograms onProgramClick={handleProgramClick} />
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
