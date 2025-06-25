
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Circle, Heart, FileText } from 'lucide-react';

const WhatWeDoSection = () => {
  const programs = [
    {
      id: 1,
      icon: <Circle className="h-8 w-8 text-blue-500" />,
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      color: "border-blue-200 bg-blue-50",
      iconBg: "bg-blue-100",
      href: "/programs-for-wellness-seekers"
    },
    {
      id: 2,
      icon: <Heart className="h-8 w-8 text-purple-500" />,
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      color: "border-purple-200 bg-purple-50",
      iconBg: "bg-purple-100",
      href: "/programs-for-wellness-seekers"
    },
    {
      id: 3,
      icon: <FileText className="h-8 w-8 text-teal-500" />,
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      color: "border-teal-200 bg-teal-50",
      iconBg: "bg-teal-100",
      href: "/programs-for-wellness-seekers"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            IFL Programs for Individuals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            IFL provides specialized programs to support your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className={`border-l-4 ${program.color} rounded-lg p-6 hover:shadow-lg transition-all duration-300`}
            >
              <div className={`flex items-center justify-center w-16 h-16 ${program.iconBg} rounded-full mb-4`}>
                {program.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {program.title}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {program.description}
              </p>
              
              <Link to={program.href} className="block">
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/programs-for-wellness-seekers">
            <Button className="bg-ifind-teal hover:bg-ifind-teal/90 text-white px-8 py-3">
              View All Programs
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default WhatWeDoSection;
