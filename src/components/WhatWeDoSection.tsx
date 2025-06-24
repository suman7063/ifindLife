
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Heart, Brain, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const WhatWeDoSection = () => {
  const programs = [
    {
      id: 'wellness-seekers',
      title: 'For Wellness Seekers',
      description: 'Personal growth programs designed for individuals seeking mental clarity, emotional balance, and spiritual wellness.',
      icon: Heart,
      color: 'bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200',
      iconColor: 'text-pink-600',
      link: '/programs-for-wellness-seekers'
    },
    {
      id: 'academic-institutes',
      title: 'For Academic Institutes',
      description: 'Comprehensive mental health programs tailored for educational institutions to support student and faculty wellbeing.',
      icon: Brain,
      color: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
      iconColor: 'text-blue-600',
      link: '/programs-for-academic-institutes'
    },
    {
      id: 'business',
      title: 'For Business',
      description: 'Corporate wellness solutions to enhance employee mental health, productivity, and workplace satisfaction.',
      icon: Users,
      color: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
      iconColor: 'text-green-600',
      link: '/programs-for-business'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-ifind-aqua mr-3" />
            <h2 className="text-4xl font-bold text-gray-900">IFL Programs for Individuals</h2>
          </div>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto">
            Discover our comprehensive range of programs designed to support your journey towards mental wellness, 
            personal growth, and emotional balance. Choose the path that resonates with your unique needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => {
            const IconComponent = program.icon;
            return (
              <Card key={program.id} className={`${program.color} hover:shadow-lg transition-all duration-300 group cursor-pointer`}>
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-white shadow-sm mr-4">
                      <IconComponent className={`h-6 w-6 ${program.iconColor}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                  </div>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  
                  <Link to={program.link}>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-white group-hover:text-gray-900 transition-colors"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/programs">
            <Button size="lg" className="bg-ifind-aqua hover:bg-ifind-aqua/90 text-white">
              View All Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
