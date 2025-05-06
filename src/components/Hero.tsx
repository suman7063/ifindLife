
import React from 'react';
import HeroHeader from './hero/HeroHeader';
import DiscoverSection from './hero/DiscoverSection';
import HelpSection from './hero/HelpSection';

const Hero: React.FC = () => {
  return (
    <div className="hero-component">
      <HeroHeader />
      <DiscoverSection />
      <HelpSection />
    </div>
  );
};

export default Hero;
