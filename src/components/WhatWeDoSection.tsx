
import React from 'react';
import { Link } from 'react-router-dom';

const WhatWeDoSection = () => {
  const services = [
    {
      title: "Heart2Heart Listening Sessions",
      description: "A unique space where you can express yourself freely while being deeply heard without judgment",
      color: "bg-ifind-teal/10",
      href: "/services/mindful-listening",
      icon: "🫶"
    },
    {
      title: "Therapy Sessions",
      description: "Professional sessions to help you navigate life's challenges and enhance personal growth",
      color: "bg-ifind-purple/10",
      href: "/services/therapy-sessions",
      icon: "💜"
    },
    {
      title: "Guided Meditations",
      description: "Expertly led sessions to reduce stress, increase mindfulness, and cultivate inner peace",
      color: "bg-ifind-aqua/10",
      href: "/services/guided-meditations",
      icon: "💎"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6 sm:px-12">
        <h2 className="text-2xl font-bold mb-8 text-center">IFL Programs for Individuals</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <Link key={index} to={service.href} className="block">
              <div className={`${service.color} rounded-lg p-6 h-full shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center`}>
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-semibold text-xl mb-2 text-gray-800">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
