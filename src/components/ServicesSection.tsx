
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FeaturedPrograms from './services/FeaturedPrograms';
import SessionDetailDialog from './services/SessionDetailDialog';
import { Circle, MessageCircle, Brain, HeartPulse, Leaf, Sparkles } from 'lucide-react';

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

  // Reordered featured programs with updated colors to match service detail pages
  const featuredPrograms = [
    {
      id: 1,
      title: "Heart2Heart Listening Sessions",
      description: "A unique space where you can express yourself freely while being deeply heard without judgment",
      icon: <MessageCircle className="h-12 w-12 text-ifind-teal" />, // Teal color
      href: "/services/mindful-listening",
      accentColor: "border-ifind-teal", // Teal color
      iconBgColor: "bg-ifind-teal/10" // Teal color
    },
    {
      id: 2,
      title: "Therapy Sessions",
      description: "Professional sessions to help you navigate life's challenges and enhance personal growth",
      icon: <HeartPulse className="h-12 w-12 text-ifind-purple" />, // Purple color
      href: "/services/therapy-sessions",
      accentColor: "border-ifind-purple", // Purple color
      iconBgColor: "bg-ifind-purple/10" // Purple color
    },
    {
      id: 3,
      title: "Guided Meditations",
      description: "Expertly led sessions to reduce stress, increase mindfulness, and cultivate inner peace",
      icon: <Brain className="h-12 w-12 text-ifind-aqua" />, // Blue (Aqua) color
      href: "/services/guided-meditations",
      accentColor: "border-ifind-aqua", // Blue (Aqua) color
      iconBgColor: "bg-ifind-aqua/10" // Blue (Aqua) color
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
