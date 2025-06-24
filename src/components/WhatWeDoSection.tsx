
import React from 'react';
import { ArrowRight, Users, Heart, Brain, Calendar, MessageCircle, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WhatWeDoSection = () => {
  const programs = [
    {
      icon: <Brain className="h-8 w-8 text-ifind-aqua" />,
      title: "Mental Health Programs",
      description: "Comprehensive programs designed to support various mental health concerns with expert guidance.",
      link: "/programs-for-wellness-seekers#general-wellness"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: "Issue-Based Sessions",
      description: "Targeted sessions for specific concerns like anxiety, depression, stress management, and more.",
      link: "/programs-for-wellness-seekers#issue-based"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Group Therapy",
      description: "Connect with others facing similar challenges in a supportive group environment.",
      link: "/programs-for-wellness-seekers#group-therapy"
    },
    {
      icon: <Calendar className="h-8 w-8 text-purple-500" />,
      title: "Structured Programs",
      description: "Long-term structured programs for sustained mental health improvement and growth.",
      link: "/programs-for-wellness-seekers#structured"
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-blue-500" />,
      title: "One-on-One Counseling",
      description: "Personalized individual sessions with qualified mental health professionals.",
      link: "/programs-for-wellness-seekers#individual"
    },
    {
      icon: <Shield className="h-8 w-8 text-orange-500" />,
      title: "Crisis Support",
      description: "Immediate support and intervention for mental health emergencies and crises.",
      link: "/programs-for-wellness-seekers#crisis"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            IFL Programs for Individuals
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
            IFL provides specialized programs to support your mental health journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4">
                {program.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <Link to={program.link} className="text-ifind-aqua hover:text-ifind-teal font-medium inline-flex items-center">
                Learn More <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/programs-for-wellness-seekers">
            <Button className="bg-ifind-aqua hover:bg-ifind-teal text-white px-8 py-3">
              View All Programs <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
