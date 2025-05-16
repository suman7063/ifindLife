
import React from 'react';
import { Link } from 'react-router-dom';

const WhatWeDoSection = () => {
  const services = [
    {
      title: "For Wellness Seekers",
      items: [
        "Free personalized mental health assessment",
        "One-on-one therapy sessions with licensed professionals",
        "Relationship counseling",
        "Stress management techniques",
        "Personalized wellness plans"
      ],
      color: "bg-ifind-aqua/10", // Aqua color consistent with Guided Meditation
      href: "/programs-for-wellness-seekers" // Updated to use the correct path
    },
    {
      title: "For Academic Institutes",
      items: [
        "Student counseling programs",
        "Teacher mental health support",
        "Crisis intervention resources",
        "Bullying prevention strategies",
        "Wellness workshops for campus life"
      ],
      color: "bg-ifind-purple/10", // Purple color consistent with Therapy Sessions
      href: "/programs-for-academic-institutes"
    },
    {
      title: "For Business",
      items: [
        "Employee wellness programs",
        "Leadership mental fitness training",
        "Workplace stress management",
        "Team building for psychological safety",
        "Burnout prevention strategies"
      ],
      color: "bg-ifind-teal/10", // Teal color consistent with Heart2Heart
      href: "/programs-for-business"
    }
  ];

  return (
    <section className="py-16 bg-calm-gradient">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-8 text-left">What We do</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link key={index} to={service.href} className="block">
              <div className={`${service.color} rounded-lg p-6 h-full shadow-md hover:shadow-lg transition-all duration-300`}>
                <h3 className="font-semibold text-xl mb-4 text-gray-800 text-left">{service.title}</h3>
                <ul className="space-y-2 text-gray-700 text-left">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
