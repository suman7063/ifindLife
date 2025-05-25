
import React from 'react';
import { Link } from 'react-router-dom';

const WhatWeDoSection = () => {
  const programs = [
    {
      title: "QuickEase Programs",
      description: "Short-term solutions for immediate stress and anxiety relief",
      color: "bg-blue-50",
      borderColor: "border-l-blue-400",
      href: "/programs",
      icon: (
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
          <div className="w-8 h-8 rounded-full border-2 border-blue-400"></div>
        </div>
      )
    },
    {
      title: "Emotional Resilience",
      description: "Build psychological strength to handle life's challenges",
      color: "bg-purple-50",
      borderColor: "border-l-purple-400",
      href: "/programs",
      icon: (
        <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-6">
          <div className="w-8 h-8">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-purple-400">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </div>
        </div>
      )
    },
    {
      title: "Super Human Life",
      description: "Achieve your highest potential through mental optimization",
      color: "bg-teal-50",
      borderColor: "border-l-teal-400",
      href: "/programs",
      icon: (
        <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mb-6">
          <div className="w-8 h-8">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-teal-400">
              <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">IFL Programs for Individuals</h2>
          <p className="text-gray-600 text-lg">IFL provides specialized programs to support your mental health journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {programs.map((program, index) => (
            <Link key={index} to={program.href} className="block">
              <div className={`${program.color} ${program.borderColor} border-l-4 rounded-lg p-8 h-full hover:shadow-lg transition-all duration-300 text-center`}>
                <div className="flex justify-center">
                  {program.icon}
                </div>
                <h3 className="font-semibold text-xl mb-4 text-gray-800">{program.title}</h3>
                <p className="text-gray-600">{program.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
