
import React from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Heart, Brain } from 'lucide-react';

const WhatWeDoSection = () => {
  const programs = [
    {
      id: 1,
      icon: <Brain className="h-8 w-8 text-ifind-teal" />,
      title: "Mental Health Programs",
      description: "Comprehensive therapy sessions and counseling programs designed to support your mental wellness journey.",
      features: ["Individual Therapy", "Group Sessions", "Crisis Support"],
      href: "/programs-for-wellness-seekers"
    },
    {
      id: 2,
      icon: <Heart className="h-8 w-8 text-ifind-purple" />,
      title: "Wellness & Mindfulness",
      description: "Guided meditation programs and mindfulness practices to help you find inner peace and balance.",
      features: ["Guided Meditations", "Mindfulness Training", "Stress Reduction"],
      href: "/programs-for-wellness-seekers"
    },
    {
      id: 3,
      icon: <Users className="h-8 w-8 text-ifind-aqua" />,
      title: "Community Support",
      description: "Connect with like-minded individuals in our supportive community programs and group activities.",
      features: ["Support Groups", "Community Events", "Peer Support"],
      href: "/programs-for-wellness-seekers"
    },
    {
      id: 4,
      icon: <BookOpen className="h-8 w-8 text-ifind-teal" />,
      title: "Educational Resources",
      description: "Access comprehensive educational materials and workshops to enhance your understanding of mental health.",
      features: ["Workshops", "Educational Content", "Self-Help Resources"],
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-ifind-teal/30"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-gray-50 rounded-lg mb-4 mx-auto">
                {program.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">
                {program.title}
              </h3>
              
              <p className="text-gray-600 mb-4 text-center">
                {program.description}
              </p>
              
              <ul className="space-y-2 mb-6">
                {program.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-ifind-teal rounded-full mr-2"></div>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link to={program.href} className="block">
                <Button 
                  variant="outline" 
                  className="w-full border-ifind-teal text-ifind-teal hover:bg-ifind-teal hover:text-white transition-colors"
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
