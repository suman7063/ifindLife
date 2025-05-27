
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHeroSection from '@/components/about/AboutHeroSection';
import MissionSection from '@/components/about/MissionSection';
import TeamSection from '@/components/about/TeamSection';
import ValuesSection from '@/components/about/ValuesSection';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <AboutHeroSection 
          title="About iFindLife" 
          description="Founded by experts in mental wellness and technology, iFindLife is dedicated to making mental health support accessible, effective, and personalized for everyone." 
        />
        
        <MissionSection />
        
        <TeamSection />
        
        <ValuesSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
