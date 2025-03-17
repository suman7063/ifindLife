
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Star, Phone } from 'lucide-react';
import FreeAssessmentCTA from './FreeAssessmentCTA';

const Hero = () => {
  const [heroSettings, setHeroSettings] = useState({
    title: "Mental Wellness",
    subtitle: "For a Balanced Life",
    description: "Connect with verified mental health experts for personalized guidance, support, and solutions.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Default video URL
  });

  // Load content from localStorage on component mount
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('ifindlife-content');
      if (savedContent) {
        const parsedContent = JSON.parse(savedContent);
        if (parsedContent.heroSettings) {
          setHeroSettings(parsedContent.heroSettings);
        }
      }
    } catch (error) {
      console.error('Error loading content from localStorage:', error);
    }
  }, []);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white to-ifind-offwhite pt-8 pb-16">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left side content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {heroSettings.title} <br /> 
              <span className="text-gradient">{heroSettings.subtitle}</span>
            </h1>
            
            <p className="text-lg md:text-xl text-ifind-charcoal/80 max-w-lg">
              {heroSettings.description}
            </p>
            
            <div className="flex items-center space-x-1 text-ifind-teal">
              <Star className="h-5 w-5 fill-ifind-teal" />
              <Star className="h-5 w-5 fill-ifind-teal" />
              <Star className="h-5 w-5 fill-ifind-teal" />
              <Star className="h-5 w-5 fill-ifind-teal" />
              <Star className="h-5 w-5 fill-ifind-teal" />
              <span className="ml-1 text-ifind-charcoal/90">Trusted by 2M+ clients worldwide</span>
            </div>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button className="bg-ifind-teal text-white hover:bg-ifind-teal/90 transition-colors px-6 py-6 h-auto">
                <Phone className="h-5 w-5 mr-2" />
                <span className="font-medium">Talk to an Expert</span>
              </Button>
              
              <FreeAssessmentCTA />
            </div>
          </div>
          
          {/* Right side video/image */}
          <div className="relative h-full flex items-center justify-center">
            <div className="relative z-10 rounded-lg overflow-hidden border-8 border-white shadow-xl animate-float w-full">
              {heroSettings.videoUrl ? (
                <iframe
                  src={heroSettings.videoUrl}
                  className="w-full aspect-video"
                  title="Mental Health Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1569437061238-3cf61084f487?q=80&w=2070&auto=format&fit=crop" 
                  alt="Mental Health Expert" 
                  className="w-full h-auto"
                />
              )}
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-1/4 right-10 -z-0 w-40 h-40 bg-ifind-purple/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-10 -z-0 w-32 h-32 bg-ifind-aqua/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
