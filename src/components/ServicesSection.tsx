
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import FeaturedPrograms from './services/FeaturedPrograms';
import SessionDetailDialog from './services/SessionDetailDialog';
import { MessageCircle, HeartPulse, Brain, Leaf, Sparkles, Globe } from 'lucide-react';

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

  // Updated featured programs with correct text and links
  const featuredPrograms = [
    {
      id: 1,
      title: "Heart2Heart Listening Sessions",
      description: "A unique space where you can express yourself freely while being deeply heard without judgment",
      icon: <MessageCircle className="h-12 w-12 text-ifind-teal" />,
      href: "/services/mindful-listening",
      accentColor: "border-ifind-teal",
      iconBgColor: "bg-ifind-teal/10"
    },
    {
      id: 2,
      title: "Therapy Sessions",
      description: "Professional sessions to help you navigate life's challenges and enhance personal growth",
      icon: <HeartPulse className="h-12 w-12 text-ifind-purple" />,
      href: "/services/therapy-sessions",
      accentColor: "border-ifind-purple",
      iconBgColor: "bg-ifind-purple/10"
    },
    {
      id: 3,
      title: "Guided Meditations",
      description: "Expertly led sessions to reduce stress, increase mindfulness, and cultivate inner peace",
      icon: <Brain className="h-12 w-12 text-ifind-aqua" />,
      href: "/services/guided-meditations",
      accentColor: "border-ifind-aqua",
      iconBgColor: "bg-ifind-aqua/10"
    },
    {
      id: 4,
      title: "Offline Retreats",
      description: "Immersive retreat experiences to disconnect from daily stress and reconnect with yourself",
      icon: <Leaf className="h-12 w-12 text-green-600" />,
      href: "/services/offline-retreats",
      accentColor: "border-green-600",
      iconBgColor: "bg-green-600/10"
    },
    {
      id: 5,
      title: "Life Coaching",
      description: "Goal-oriented guidance to help you achieve personal and professional success",
      icon: <Sparkles className="h-12 w-12 text-amber-500" />,
      href: "/services/life-coaching",
      accentColor: "border-amber-500",
      iconBgColor: "bg-amber-500/10"
    },
    {
      id: 6,
      title: "Global Healing Traditions",
      description: "Ancient wisdom and practices from around the world to promote holistic well-being",
      icon: <Globe className="h-12 w-12 text-blue-600" />,
      href: "/services/global-healing",
      accentColor: "border-blue-600",
      iconBgColor: "bg-blue-600/10"
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

        {/* Redesigned Program Cards with all six services */}
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
