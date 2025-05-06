
import React from 'react';
import { HeroHeader } from './hero/HeroHeader';
import { DiscoverSection } from './hero/DiscoverSection';
import { HelpSection } from './hero/HelpSection';

const Hero: React.FC = () => {
  return (
    <div className="hero-component">
      <HeroHeader 
        images={[
          "/lovable-uploads/35d6ff96-c06b-4787-84bc-64318cfa9fb0.png",
          "/lovable-uploads/2ce75196-58b1-4f39-b5cb-9b4a559c53b2.png"
        ]} 
        currentSlide={0} 
      />
      <HelpSection 
        subtitle="Is there a situation, you need immediate help with?"
        description="Connect with our currently online experts through an instant call"
      />
      <DiscoverSection 
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" 
        isVideoLoaded={true}
        title="Start Your"
        description="Our mental health experts are here to guide you through your journey to better mental wellbeing. Take the first step today with our free assessment."
        rating="4.8/5.0"
        reviews="Based on 2.5k+ Reviews"
      />
    </div>
  );
};

export default Hero;
