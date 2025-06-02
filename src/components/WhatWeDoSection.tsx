
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Brain, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatWeDoSection = () => {
  const programs = [
    {
      icon: <Heart className="h-12 w-12 text-ifind-teal" />,
      title: "Quick-Ease Programs",
      description: "Immediate relief and support for everyday stress and anxiety. Quick, effective solutions when you need them most.",
      bgColor: "bg-ifind-teal/10",
      borderColor: "border-ifind-teal/20",
      buttonColor: "bg-ifind-teal hover:bg-ifind-teal/90",
      href: "/programs-for-wellness-seekers"
    },
    {
      icon: <Brain className="h-12 w-12 text-ifind-aqua" />,
      title: "Resilience Building Programs", 
      description: "Develop long-term mental strength and emotional intelligence to handle life's challenges with confidence.",
      bgColor: "bg-ifind-aqua/10",
      borderColor: "border-ifind-aqua/20",
      buttonColor: "bg-ifind-aqua hover:bg-ifind-aqua/90",
      href: "/programs-for-wellness-seekers"
    },
    {
      icon: <Users className="h-12 w-12 text-ifind-purple" />,
      title: "Super Human Programs",
      description: "Advanced personal development to unlock your full potential and achieve extraordinary results in all areas of life.",
      bgColor: "bg-ifind-purple/10",
      borderColor: "border-ifind-purple/20", 
      buttonColor: "bg-ifind-purple hover:bg-ifind-purple/90",
      href: "/programs-for-wellness-seekers"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">IFL Programs for Individuals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-center">
            Discover our comprehensive range of mental health programs designed to support your unique journey towards wellness and personal growth.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className={`${program.bgColor} ${program.borderColor} border rounded-lg p-6 text-center hover:shadow-lg transition-shadow`}
            >
              <div className="flex justify-center mb-4">
                {program.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{program.title}</h3>
              <p className="text-gray-600 mb-6 text-center">
                {program.description}
              </p>
              <Button asChild className={`w-full ${program.buttonColor} text-white`}>
                <Link 
                  to={program.href}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  Explore Programs
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
