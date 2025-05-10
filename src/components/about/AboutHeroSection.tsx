
import React from 'react';

interface AboutHeroSectionProps {
  title: string;
  description: string;
}

const AboutHeroSection: React.FC<AboutHeroSectionProps> = ({ title, description }) => {
  return (
    <section className="bg-gradient-to-r from-ifind-teal/20 to-ifind-purple/20 text-ifind-charcoal py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-700 max-w-3xl mx-auto">
          {description}
        </p>
      </div>
    </section>
  );
};

export default AboutHeroSection;
